
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import { Categoria, Precio, Propiedad, Usuario } from "../models/index.js";

import db from "../config/db.js";

const importarDatos = async () => {
    try {
        //! Autenticarme en la base de datos
        await db.authenticate();
        
        //! Generar las columnas
        await db.sync();
        
        //! Insertar los datos
        await Categoria.bulkCreate(categorias);
        await Precio.bulkCreate(precios);
        await Usuario.bulkCreate(usuarios);

        console.log('Datos insertados correctamente');
        process.exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await Categoria.drop({where:{}, truncate: true }),
        await Precio.destroy({where:{}, truncate: true }),
        await Usuario.destroy({where: {}, truncate: true}),
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        await Propiedad.destroy({where: {}, truncate: true}),
 
 
        console.log('Datos eliminados correctamente');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2] === "-i"){
    importarDatos();
}
if(process.argv[2] === "-e"){
    eliminarDatos();
}




