import { createTransport } from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  bodyHtml: string;
}

const sendMail = async ({ email, subject, bodyHtml }: EmailOptions) => {
  const transport = createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    html: bodyHtml,
  });
}

export default sendMail;