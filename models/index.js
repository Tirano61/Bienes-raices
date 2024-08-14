
import Categoria from "./Categoria.js";
import Usuario   from "./Usuario.js";
import Precio    from "./Precio.js";
import Propiedad from "./Propiedad.js";

Propiedad.belongsTo(Precio);
Propiedad.belongsTo(Categoria, { foreingKey: 'categoriaId'});
Propiedad.belongsTo(Usuario, { foreingKey: 'usuarioId'});

export {
    Usuario,
    Categoria,
    Precio,
    Propiedad
}