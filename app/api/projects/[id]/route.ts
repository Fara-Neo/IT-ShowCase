import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

interface RouteParams {
  params: { id: string };
}

type PrismaLikeError = {
  code?: string;
  message?: string;
};

function getProjectId(request: NextRequest, params: RouteParams["params"]): string | null {
  if (params?.id) return params.id;
  const fromPath = request.nextUrl.pathname.split("/").filter(Boolean).pop();
  return fromPath || null;
}

function getErrorCode(error: unknown): string | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }
  return (error as PrismaLikeError)?.code;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const projectId = getProjectId(request, params);
    if (!projectId) {
      return NextResponse.json({ error: "Некорректный ID проекта" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = getProjectId(request, params);
    if (!projectId) {
      return NextResponse.json({ error: "Некорректный ID проекта" }, { status: 400 });
    }

    const body = await request.json();
    const validated = projectSchema.partial().parse(body);
    const updateData: Record<string, unknown> = { ...validated };

    if (typeof validated.slug === "string") {
      const trimmedSlug = validated.slug.trim();
      if (trimmedSlug) {
        updateData.slug = trimmedSlug;
      } else if (typeof validated.title === "string" && validated.title.trim()) {
        updateData.slug = slugify(validated.title);
      } else {
        delete updateData.slug;
      }
    }

    if (typeof validated.categoryId === "string") {
      const trimmedCategoryId = validated.categoryId.trim();
      updateData.categoryId = trimmedCategoryId ? trimmedCategoryId : null;
    }

    if (typeof validated.imageUrl === "string") {
      const trimmedImageUrl = validated.imageUrl.trim();
      updateData.imageUrl = trimmedImageUrl ? trimmedImageUrl : null;
    }

    if (typeof validated.demoUrl === "string") {
      const trimmedDemoUrl = validated.demoUrl.trim();
      updateData.demoUrl = trimmedDemoUrl ? trimmedDemoUrl : null;
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: error.flatten() },
        { status: 400 }
      );
    }

    const errorCode = getErrorCode(error);

    if (errorCode === "P2002") {
      return NextResponse.json(
        { error: "Проект с таким slug уже существует" },
        { status: 409 }
      );
    }

    if (errorCode === "P2003") {
      return NextResponse.json(
        { error: "Выбрана некорректная категория проекта" },
        { status: 400 }
      );
    }

    if (errorCode === "P2025") {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    console.error("PATCH /api/projects/[id] failed", {
      errorCode,
      message: (error as PrismaLikeError)?.message ?? "unknown",
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = getProjectId(request, params);
    if (!projectId) {
      return NextResponse.json({ error: "Некорректный ID проекта" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { authorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.user.role !== "admin" && project.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id: projectId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
