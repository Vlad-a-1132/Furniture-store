import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Сброс пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Сброс пароля</h2>
        <p>Вы получили это письмо, потому что запросили сброс пароля для вашей учетной записи.</p>
        <p>Для сброса пароля перейдите по ссылке ниже:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4a5568; color: white; text-decoration: none; border-radius: 5px;">
            Сбросить пароль
          </a>
        </p>
        <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
        <p>Ссылка действительна в течение 1 часа.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
} 