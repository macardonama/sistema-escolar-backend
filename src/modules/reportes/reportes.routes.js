const express = require('express');
const reportesController = require('./reportes.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.get(
  '/asistencia/grupo/:grupoId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  reportesController.reporteAsistenciaPorGrupo
);

router.get(
  '/asistencia/estudiante/:estudianteId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'),
  reportesController.reporteAsistenciaPorEstudiante
);

router.get(
  '/observaciones/estudiante/:estudianteId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'),
  reportesController.reporteObservacionesPorEstudiante
);

router.get(
  '/resumen/grupo/:grupoId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  reportesController.resumenGrupo
);

module.exports = router;