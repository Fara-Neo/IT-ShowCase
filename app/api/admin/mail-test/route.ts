import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { sendTestEmail } from "@/lib/mailer";

const schema = z.object({
  to: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Некорректный email для тестовой отправки" },
        { status: 400 }
      );
    }

    const { to } = parsed.data;

    await sendTestEmail(to);

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Keep detailed diagnostics in server logs to simplify SMTP debugging.
    console.error("POST /api/admin/mail-test failed:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Некорректный JSON в теле запроса" },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes("econnrefused") || message.includes("ehostunreach")) {
        return NextResponse.json(
          { error: "Не удается подключиться к SMTP-серверу" },
          { status: 502 }
        );
      }

      if (message.includes("invalid login") || message.includes("535")) {
        return NextResponse.json(
          { error: "Неверные SMTP-учетные данные" },
          { status: 502 }
        );
      }

      if (
        message.includes("sender address rejected") ||
        message.includes("from address")
      ) {
        return NextResponse.json(
          { error: "Адрес отправителя не разрешен SMTP-провайдером" },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message === "SMTP is not configured"
            ? "SMTP не настроен"
            : "Не удалось отправить тестовое письмо",
      },
      { status: 500 }
    );
  }
}
