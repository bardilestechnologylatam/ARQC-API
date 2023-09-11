const express = require('express');
const router = express.Router();
const testController = require('../controller/test.controller');

// Ruta de ejemplo
router.get('/saludo', testController.saludo);

module.exports = router;