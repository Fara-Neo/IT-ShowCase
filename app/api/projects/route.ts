import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(category && { categoryId: category }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: parseFloat(minPrice) }),
                ...(maxPrice && { lte: parseFloat(maxPrice) }),
              },
            }
          : {}),
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = projectSchema.parse(body);
    const slug = validated.slug?.trim() ? validated.slug.trim() : slugify(validated.title);
    const categoryId = validated.categoryId?.trim() ? validated.categoryId.trim() : null;
    const imageUrl = validated.imageUrl?.trim() ? validated.imageUrl.trim() : null;
    const demoUrl = validated.demoUrl?.trim() ? validated.demoUrl.trim() : null;

    const project = await prisma.project.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        price: validated.price,
        imageUrl,
        demoUrl,
        techStack: validated.techStack ?? [],
        categoryId,
        published: validated.published ?? false,
        featured: validated.featured ?? false,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return NextResponse.json(project, { status: 201 });
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

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Выбрана некорректная категория проекта" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
