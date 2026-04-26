import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    user,
    pass,
    from,
    port: Number(process.env.SMTP_PORT) || 587,
  };
}

function createTransporter() {
  const smtp = getSmtpConfig();
  if (!smtp) return null;

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });
}

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
  const transporter = createTransporter();
  const smtp = getSmtpConfig();
  if (!transporter || !smtp) {
    throw new Error("SMTP is not configured");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await transporter.sendMail({
    from: smtp.from,
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
    from: smtp.from,
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

export async function sendTestEmail(to: string) {
  const transporter = createTransporter();
  const smtp = getSmtpConfig();
  if (!transporter || !smtp) {
    throw new Error("SMTP is not configured");
  }

  await transporter.sendMail({
    from: smtp.from,
    to,
    subject: "IT ShowCase: SMTP test",
    html: `
      <h2>SMTP работает</h2>
      <p>Тестовое письмо отправлено успешно.</p>
      <p>Время: ${new Date().toISOString()}</p>
    `,
  });
}
