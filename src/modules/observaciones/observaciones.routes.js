const express = require('express');
const observacionesController = require('./observaciones.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  observacionesController.crearObservacion
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'),
  observacionesController.listarObservaciones
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ACUDIENTE', 'ESTUDIANTE'),
  observacionesController.obtenerObservacionPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  observacionesController.actualizarObservacion
);

module.exports = router;