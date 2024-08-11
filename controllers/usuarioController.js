
import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/email.js";

 
const formularioLogin = (req, res) =>{
  res.render('auth/login', {
    pagina: 'Iniciar Sesión'
  });
}

const formularioRegistro = (req, res) =>{
  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
    csrfToken: req.csrfToken()
  });
}
const registrar = async(req,res) => {
  // Validación
  await check('nombre').notEmpty().withMessage('El nombre no puede estar vacio.').run(req);
  await check('email').isEmail().withMessage('El email debe ser válido.').run(req);
  await check('password').isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres.').run(req);
  await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales.').run(req);
  
  let result = validationResult(req);

  // Validar que el resultado este vacio
  if(!result.isEmpty()){
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
  const existeUsuario = await Usuario.findOne({where: { email }});
  if(existeUsuario){
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El usuario ya esta registrado.'}],
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
  })  
}

//Función que comprueba una cuenta
const confirmar = async( req, res )=>{
  const { token } =  req.params;

  // Verificar si el token es válido
  const usuario = await Usuario.findOne({where: {token} });
  if( !usuario ){
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

const formularioOlvidePassword = (req, res) =>{
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso'
  });
}

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword
}