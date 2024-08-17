
import { where } from "sequelize";
import {Precio, Categoria, Propiedad} from "../models/index.js";
import { validationResult } from "express-validator";

const admin = async (req, res) => {

  const { id } = req.usuario;

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id,
    },
    include:[
      {
        model: Categoria, as: 'categoria',
      },
      {
        model: Precio, as: 'precio'
      }
    ]
  })

  res.render('propiedades/admin', {
    pagina: 'Mis propiedades',
    propiedades,
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

const agregarImagen = async (req,res) =>{

  const { id } = req.params;
  //! Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('mis-propiedades');
  }

  //! Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('mis-propiedades');
  }

  //! Validar que la propiedad pertenece a quien visita esta página
  if(propiedad.usuarioId !== req.usuario.id){
    return res.redirect('/mis-propiedades');
  }
  
  
  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad

  })
}

const alamcenarImagen = async ( req, res, next ) =>{
  const { id } = req.params;
  //! Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad pertenece a quien visita esta página
  if(propiedad.usuarioId !== req.usuario.id){
    return res.redirect('/mis-propiedades');
  }

  try {
    //! Almacenar la imagen y publicar propiedad
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;
    await propiedad.save();

    next();

  } catch (error) {
    console.log(error);
  }
}

const editar = async (req, res) => {
  const { id } = req.params;
  //! Validar que la propiedad exista
  console.log(id);
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('/mis-propiedades');
  }
  //! Quien visita la url es quien la creo
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades');
  }
  //! Consultar modelo de Precios y Categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ]); 
  res.render('propiedades/editar', {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    categorias: categorias,
    csrfToken: req.csrfToken(),
    precios: precios,
    //errores: result.array(),
    datos: propiedad
  });
}

const guardarCambios = async (req, res) =>{

  //! Validacion con express-validtor
  let result = validationResult(req);
  
  if(!result.isEmpty()){
    //! Consultar modelo de Precios y Categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ]); 
    res.render('propiedades/editar', {
      pagina: 'Editar Propiedad',
      categorias: categorias,
      csrfToken: req.csrfToken(),
      precios: precios,
      errores: result.array(),
      datos: req.body
    });
  }

  const { id } = req.params;
  //! Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad pertenece a quien visita esta página
  if(propiedad.usuarioId !== req.usuario.id){
    return res.redirect('/mis-propiedades');
  }

  //! Reescribir el objeto y  actualizarlo
  try {
    const { titulo, descripcion, habitaciones, 
      estacionamiento, wc, calle, lat, lng, 
      precio:precioId, categoria:categoriaId} = req.body;
      
      propiedad.set({
        titulo,
        descripcion,
        habitaciones,
        estacionamiento,
        wc,
        calle,
        lat,
        lng,
        precioId,
        categoriaId
      });

    await propiedad.save();

    res.redirect('/mis-propiedades');

  } catch (error) {
    console.log(error);
  }
}

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  alamcenarImagen,
  editar,
  guardarCambios
}