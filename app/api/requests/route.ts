import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestSchema } from "@/lib/validations";
import { sendRequestEmails } from "@/lib/mailer";

const requestStatuses = ["new", "in_review", "completed", "rejected"] as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const status =
      statusParam && requestStatuses.includes(statusParam as (typeof requestStatuses)[number])
        ? statusParam
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
    const validated = requestSchema.parse(body);

    const project = await prisma.project.findUnique({
      where: { id: validated.projectId },
      include: { author: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const req = await prisma.request.create({
      data: validated,
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
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
