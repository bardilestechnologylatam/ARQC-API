const express = require('express');
const testRoute = require('./routes/test.route');

const app = express();

app.use(express.json());

// Rutas
app.use('/api', testRoute);

// Puerto de escucha
const port = 8080;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
