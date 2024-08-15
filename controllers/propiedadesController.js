
import {Precio, Categoria} from "../models/index.js";
import { validationResult } from "express-validator";

const admin = (req, res) => {
  res.render('propiedades/admin', {
    pagina: 'Mis propiedades',
    barra: true
  });
}
//! Formulario para crear una nueva propiedad
const crear = async (req,res) =>{
  //! Consultar modelo de Precios y Categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ]); 
  res.render('propiedades/crear', {
    pagina: 'Crear Propiedad',
    barra: true,
    csrfToken: req.csrfToken(),
    categorias: categorias,
    precios: precios,
    datos: {}
  });
}

const guardar = async (req, res) =>{
  //! Validacion con express-validtor
  let result = validationResult(req);
  
  if(!result.isEmpty()){
    //! Consultar modelo de Precios y Categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ]); 
    res.render('propiedades/crear', {
      pagina: 'Crear Propiedad',
      barra: true,
      categorias: categorias,
      csrfToken: req.csrfToken(),
      precios: precios,
      errores: result.array(),
      datos: req.body
    });
  }

}


export {
  admin,
  crear,
  guardar
}