import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendRequestEmailsParams {
  request: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string | null;
    message?: string | null;
  };
  project: {
    title: string;
    slug: string;
  };
  sellerEmail: string;
}

export async function sendRequestEmails({
  request,
  project,
  sellerEmail,
}: SendRequestEmailsParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: sellerEmail,
    subject: `Новая заявка на проект «${project.title}»`,
    html: `
      <h2>Новая заявка</h2>
      <p><strong>Проект:</strong> ${project.title}</p>
      <p><strong>От:</strong> ${request.clientName} (${request.clientEmail})</p>
      ${request.clientPhone ? `<p><strong>Телефон:</strong> ${request.clientPhone}</p>` : ""}
      ${request.message ? `<p><strong>Сообщение:</strong> ${request.message}</p>` : ""}
      <p><a href="${appUrl}/admin/requests">Открыть в панели</a></p>
    `,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: request.clientEmail,
    subject: `Ваша заявка на «${project.title}» принята`,
    html: `
      <h2>Заявка принята</h2>
      <p>Здравствуйте, ${request.clientName}!</p>
      <p>Ваша заявка на проект <strong>${project.title}</strong> успешно отправлена.</p>
      <p>Продавец свяжется с вами в ближайшее время.</p>
      <p><a href="${appUrl}/projects/${project.slug}">Страница проекта</a></p>
    `,
  });
}
