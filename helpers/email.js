import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const { nombre, email, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: 'Bienes Raices',
    to: email,
    subject: 'Restablece tu password en BienesRaices.com',
    text: 'Restablece tu password en BienesRaices.com',
    html: `
      <p>Hola ${nombre}, has solicitado restablecer tu password en BienesRaices.com</p>

      <p>Sigue el siguiente enlace para generar un password nuevo: 
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password</a></p>

      <p>Si tu no solicitaste el cambio de password, puedes ignoirar este mensaje.</p>

    `
  });
}

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const { nombre, email, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: 'Bienes Raices',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    html: `
      <p>Hola ${nombre}, confirma tu cuenta en BienesRaices.com</p>

      <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

      <p>Si tu no creaste esta cuenta, puedes ignoirar este mensaje.</p>

    `
  });
}

export {
  emailRegistro,
  emailOlvidePassword
}