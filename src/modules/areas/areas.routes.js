const express = require('express');
const areasController = require('./areas.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  areasController.crearArea
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  areasController.listarAreas
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  areasController.obtenerAreaPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  areasController.actualizarArea
);

module.exports = router;