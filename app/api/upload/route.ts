import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Неавторизованный доступ" }, { status: 401 });
    }

    const body = await request.json();
    const fileName = typeof body?.fileName === "string" ? body.fileName : "image";

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary не настроен в переменных окружения" },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "it-showcase/projects";
    const publicId = `${Date.now()}-${fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 40)}`;
    const transformation = "c_fill,w_1200,h_800,q_auto";

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        public_id: publicId,
        timestamp,
        transformation,
      },
      apiSecret
    );

    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      params: {
        api_key: apiKey,
        timestamp,
        folder,
        public_id: publicId,
        transformation,
        signature,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Некорректный JSON в теле запроса" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Не удалось подготовить signed upload" },
      { status: 500 }
    );
  }
}
