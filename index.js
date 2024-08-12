import express from 'express';
import csrf from "csurf";
import cookieParser from 'cookie-parser';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";
// Crear la app
const app = express();

// habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie-parse
app.use(cookieParser());
// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexión a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log('Conexión correcta a la base de datos')
} catch (error) {
  console.log(error);
}

// Habilitar PUG
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta publica
app.use(express.static('public'));

// Routing
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server corriendo en puerto ${port}`);
});