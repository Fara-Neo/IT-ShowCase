import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { RequestStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestSchema } from "@/lib/validations";
import { sendRequestEmails } from "@/lib/mailer";

const REQUEST_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_EMAIL_IN_WINDOW = 3;
const MAX_REQUESTS_PER_IP_IN_WINDOW = 10;

type IpWindow = {
  count: number;
  resetAt: number;
};

const ipRateLimitStore = new Map<string, IpWindow>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function checkAndConsumeIpRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const current = ipRateLimitStore.get(clientIp);

  if (!current || now >= current.resetAt) {
    ipRateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + REQUEST_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= MAX_REQUESTS_PER_IP_IN_WINDOW) {
    return false;
  }

  current.count += 1;
  ipRateLimitStore.set(clientIp, current);
  return true;
}

const requestStatuses = [
  RequestStatus.new,
  RequestStatus.in_review,
  RequestStatus.completed,
  RequestStatus.rejected,
] as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Неавторизованный доступ" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const status: RequestStatus | null =
      statusParam && requestStatuses.includes(statusParam as RequestStatus)
        ? (statusParam as RequestStatus)
        : null;

    const requests = await prisma.request.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(session.user.role === "seller"
          ? {
              project: {
                authorId: session.user.id,
              },
            }
          : {}),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            authorId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const validated = parsed.data;
    const normalizedEmail = validated.clientEmail.trim().toLowerCase();

    const clientIp = getClientIp(request);
    const isIpAllowed = checkAndConsumeIpRateLimit(clientIp);
    if (!isIpAllowed) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 }
      );
    }

    const windowStart = new Date(Date.now() - REQUEST_WINDOW_MS);
    const recentRequestsByEmail = await prisma.request.count({
      where: {
        clientEmail: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
        createdAt: {
          gte: windowStart,
        },
      },
    });

    if (recentRequestsByEmail >= MAX_REQUESTS_PER_EMAIL_IN_WINDOW) {
      return NextResponse.json(
        {
          error: "С этого email уже отправлено слишком много заявок. Попробуйте позже.",
        },
        { status: 429 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: validated.projectId },
      include: { author: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    const req = await prisma.request.create({
      data: {
        ...validated,
        clientEmail: normalizedEmail,
      },
    });

    let emailWarning: string | null = null;
    try {
      await sendRequestEmails({
        request: req,
        project,
        sellerEmail: project.author.email,
      });
    } catch {
      emailWarning = "request_saved_but_email_failed";
    }

    return NextResponse.json(
      emailWarning ? { ...req, warning: emailWarning } : req,
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Некорректный JSON в теле запроса" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
