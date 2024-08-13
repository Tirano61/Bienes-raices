
# Variables de entorno

-Puerto del servidor
    
    PORT=
  
-Base de datos

    DB_NOMBRE=
    DB_USER=
    DB_PASSWORD=
  
-Variables para configurar el email, para confirmar cuenta y cambiar contraseña
  
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USER=
    EMAIL_PASS=
  
-Direccion para confirmar cuenta, al crear una nueva cuenta
   
    BACKEND_URL=

-Palabra clave para generar el JsonWebToken

    JWT_SECRET=
## webpack
Para compilar los js de los mapas.

    npm i -D webpack-cli

Se debe
crear el archivo *webpack.config.js*
```js
import path from "path";

export default {
  mode: 'development',
  entry: {
    mapa: './src/js/mapa.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('public/js'),
  }
}

```


## Agregando concurrently
Para correr multiples scripts a la vez

    npm i -D concurrently

```json
 "scripts": {
    ...
    "dev": "concurrently \"npm run css\" \"npm run js\""
  },    
```