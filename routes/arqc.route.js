const express = require('express');
const arqc_route = express.Router();
const arqc_controller = require('../controller/arqc.controller');

// Ruta de ejemplo
arqc_route.post('/get_arqc', arqc_controller.get_arqc);

module.exports = arqc_route;