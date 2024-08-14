
import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'


const admin = (req, res) => {
  res.render('propiedades/admin', {
    pagina: 'Mis propiedades',
    barra: true
  });
}
//! Formulario para crear una nueva propiedad
const crear = async (req,res) =>{
  //! Consultar Modelo de Precios y Categorias
  const [categorias, precios ] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ]);

  res.render('propiedades/crear', {
    pagina: 'Crear Propiedad',
    barra: true,
    categorias: categorias,
    precios: precios
  });
}


export {
  admin,
  crear
}