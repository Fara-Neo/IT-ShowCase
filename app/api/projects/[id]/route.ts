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

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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

    const project = await prisma.project.update({
      where: { id: params.id },
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

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Проект с таким slug уже существует" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.user.role !== "admin" && project.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
