const express = require('express');
const bodyParser = require('body-parser');
const { Connection, CommandCall } = require('itoolkit');

const app = express();


const connection = new Connection({
  transport: 'ssh',
  transportOptions: { host: '10.140.0.215', username: 'CLSACE', password: 'CLS4C384' },
});

const command = new CommandCall({ type: 'cl', command: 'RTVJOBA USRLIBL(?) SYSLIBL(?)' });

connection.add(command);

connection.run((error, xmlOutput) => {
  if (error) {
    throw error;
  }

  const Parser = new XMLParser();
  const result = Parser.parse(xmlOutput);

  console.log(JSON.stringify(result));
}); 

// Middleware para analizar datos JSON en las solicitudes POST
app.use(bodyParser.json());

// Ruta para manejar las solicitudes POST
app.post('/arqc-calculator', (req, res) => {
  // Obtenemos los datos JSON de la solicitud
  const data = req.body;

  // Realizamos alguna operación con los datos (aquí simplemente los enviamos de vuelta)
  res.json({ message: 'Datos recibidos correctamente', data });
});

// Puerto en el que se ejecutará la API
const port = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API en ejecución en el puerto ${port}`);
});
