
import {Precio, Categoria, Propiedad} from "../models/index.js";
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
  //! Crear un registro
  const { titulo, descripcion, habitaciones, 
    estacionamiento, wc, calle, lat, lng, 
    precio:precioId, categoria:categoriaId} = req.body;

    const { id:usuarioId } = req.usuario;
  
    try {
      //! propiedadGuardado es el id con la que se guardo en la db
    const propiedadGuardado = await Propiedad.create({
      titulo, 
      descripcion, 
      habitaciones, 
      estacionamiento, 
      wc,
      calle, 
      lat, 
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: ''
    })
    const { id } = propiedadGuardado;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }

}


export {
  admin,
  crear,
  guardar
}