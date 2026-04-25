import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestSchema } from "@/lib/validations";
import { sendRequestEmails } from "@/lib/mailer";

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

    await sendRequestEmails({
      request: req,
      project,
      sellerEmail: project.author.email,
    });

    return NextResponse.json(req, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
