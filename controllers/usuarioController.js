
import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generarId, generarLWT } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";


const autenticar = async (req, res) => {
  await check('email').isEmail().withMessage('El email debe ser válido.').run(req);
  await check('password').notEmpty().withMessage('El password es obligatorio').run(req);
  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: result.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
        errores: result.array()
      }
    });
  }
  // Comprobar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no existe' }]
    });
  }
  // Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Tu cuenta no ha sido confirmada' }]
    });
  }
  // Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Tus credenciales no son correctas' }]
    });
  }
  // Autenticar usuario
  const token = generarLWT(usuario.id);
  // Alacenar en un coockie
  return res.cookie('_token', token, {
    httpOnly: true
  }).redirect('/mis-propiedades');

}

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
    csrfToken: req.csrfToken()
  });
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
    csrfToken: req.csrfToken()
  });
}

const registrar = async (req, res) => {
  // Validación
  await check('nombre').notEmpty().withMessage('El nombre no puede estar vacio.').run(req);
  await check('email').isEmail().withMessage('El email debe ser válido.').run(req);
  await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres.').run(req);
  await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales.').run(req);

  let result = validationResult(req);

  // Validar que el resultado este vacio
  if (!result.isEmpty()) {
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      csrfToken: req.csrfToken(),
      errores: result.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }
  const { nombre, email, password } = req.body;
  // verificar que el usuario no esté registrado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario ya esta registrado.' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }

  // Almacenar un usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  });

  // Evia email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  });

  // Mostrar mensaje de confirmación
  res.render('templates/mensaje', {
    pagina: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un mmensaje de confirmación, preciona en el enlace.'
  });
}

//Función que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al confirmar su cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intentalo de nuevo.',
      error: true
    });
  }
  // Confirmar la cuenta 
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  return res.render('auth/confirmar-cuenta', {
    pagina: 'Cuenta Confirmada',
    mensaje: 'La cuenta se confirmo correctamente.',
  });

}

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso',
    csrfToken: req.csrfToken(),
  });
}

const resetPassword = async (req, res) => {
  // Validación

  await check('email').isEmail().withMessage('El email debe ser válido.').run(req);

  let result = validationResult(req);

  // Validar que el resultado no este vacio
  if (!result.isEmpty()) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso',
      csrfToken: req.csrfToken(),
      errores: result.array()
    });
  }
  // Buscar el usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El email no pertenece a un usuario registrado.' }]
    });
  }
  // Generar un token y enviar email
  usuario.token = generarId();
  await usuario.save();
  // Enviar email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token
  });
  // Renderizar un mensaje
  res.render('templates/mensaje', {
    pagina: 'Reestablece tu password',
    mensaje: 'Hemos enviado un email con las instrucciones.'
  });

}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Reestablece tu password',
      mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
      csrfToken: req.csrfToken(),
      error: true
    });
  }
  // Mostrar formulario para modificar el password
  res.render('auth/reset-password', {
    pagina: 'Restablece tu Contraseña',
    csrfToken: req.csrfToken(),
  })
}

const nuevoPassword = async (req, res) => {
  // Validar el nuevo password
  await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
  let result = validationResult(req);

  // Validar que el resultado no este vacio
  if (!result.isEmpty()) {
    return res.render('auth/reset-password', {
      pagina: 'Restablece tu Contraseña',
      csrfToken: req.csrfToken(),
      errores: result.array()
    });
  }
  // Identificar quien hace el cambio
  const { token } = req.params;
  const { password } = req.body;
  const usuario = await Usuario.findOne({ where: { token } });

  // hashaer el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render('auth/confirmar-cuenta', {
    pagina: 'Password Reestablecido',
    mensaje: 'El password se guardo correctamente'
  });


}

export {
  autenticar,
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword
}