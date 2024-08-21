
import { unlink } from "node:fs/promises";
import {Precio, Categoria, Propiedad} from "../models/index.js";
import { validationResult } from "express-validator";

const admin = async (req, res) => {

  //! Leer el queryString
  const { pagina: paginaActual } = req.query; 
  const expresion = /^[0-9]$/; //! ^ indica que siempre debe iniciar con digitos - $ indica que siempre tiene que finalizar con digitos
  if(!expresion.test(paginaActual)){
    return res.redirect('/mis-propiedades?pagina=1');
  }

  try {
    const { id } = req.usuario;

    //! Limites y offset para el paginador
    const limit = 5;
    const offset = ((paginaActual * limit) - limit);

    const [ propiedades, total ] = await Promise.all([
      Propiedad.findAll({
        limit: limit,
        offset: offset,
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
      }),
      Propiedad.count({
        where:{
          usuarioId: id,
        }
      }),
    ])

  
    res.render('propiedades/admin', {
      pagina: 'Mis propiedades',
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit

    });
  } catch (error) {
    console.log(error);
  }


 
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
    console.log('Salio ! Validar que la propiedad exista');
    return res.redirect('/mis-propiedades');
  }

  //! Validar si la propiedad no este publicada
  if(!propiedad.publicado){
    console.log('! Validar que la propiedad no este publicada');
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad pertenece a quien visita esta página
  if(propiedad.usuarioId !== req.usuario.id){
    console.log('! Validar que la propiedad pertenece a quien visita esta página');
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

const eliminar = async (req,res)=>{

  const { id } = req.params;
  //! Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    console.log('Salio ! Validar que la propiedad exista');
    return res.redirect('/mis-propiedades');
  }

  //! Validar si la propiedad no este publicada
  if(!propiedad.publicado){
    console.log('! Validar que la propiedad no este publicada');
    return res.redirect('/mis-propiedades');
  }

  //! Validar que la propiedad pertenece a quien visita esta página
  if(propiedad.usuarioId !== req.usuario.id){
    console.log('! Validar que la propiedad pertenece a quien visita esta página');
    return res.redirect('/mis-propiedades');
  }

  //! Eliminar la imagen asosiada
  if(propiedad.imagen){
    await unlink(`public/uploads/${propiedad.imagen}`);
    console.log(`Se elimino la imagen ${propiedad.imagen}`);
  }

  //! Eliminar la propiedad
  await propiedad.destroy();
  res.redirect('/mis-propiedades');

}

//! Area publica
const mostrarPropiedad = async (req,res) =>{

  const { id } = req.params;


  //! comprobar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id,{
    include:[
      {
        model: Categoria, as: 'categoria',
      },
      {
        model: Precio, as: 'precio'
      }
    ]
  })
 
  if(!propiedad){
    return res.redirect('/404');
  }
  res.render('propiedades/mostrar',{
    propiedad,
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario
  });
}

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  alamcenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad
}