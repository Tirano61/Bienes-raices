
import { Propiedad, Categoria, Precio } from "../models/index.js";


const inicio = async(req,res) =>{

    const [ categorias, precios ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
    ]);

    res.render('inicio',{
        pagina: 'Inicio',
        categorias,
        precios,
    })
}

const categoria = async (req,res) =>{

}

const noEncontrado = async (req,res) =>{

}

const buscador = async (req,res) =>{

}



export {
    inicio,
    categoria,
    noEncontrado,
    buscador,
}