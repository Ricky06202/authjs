import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: 'NextAuth js <onboarding@resend.dev>',
      to: email,
      subject: 'Verificacion de correo',
      html: `<p>Click en el siguiente enlace para verificar tu correo electronico</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}">Verificar correo</a>`
    });
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Error sending verification email' }
  }
};
