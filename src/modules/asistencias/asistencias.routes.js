const express = require('express');
const asistenciasController = require('./asistencias.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asistenciasController.registrarAsistencia
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asistenciasController.listarAsistencias
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asistenciasController.obtenerAsistenciaPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asistenciasController.actualizarAsistencia
);

module.exports = router;