const express = require('express');
const asignacionesAcademicasController = require('./asignacionesAcademicas.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO','DIRECTIVO'),
  asignacionesAcademicasController.crearAsignacionAcademica
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'DIRECTIVO'),
  asignacionesAcademicasController.listarAsignacionesAcademicas
);

router.get(
  '/docente/:docenteId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'DIRECTIVO'),
  asignacionesAcademicasController.listarAsignacionesPorDocente
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'DIRECTIVO'),
  asignacionesAcademicasController.obtenerAsignacionAcademicaPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO','DIRECTIVO'),
  asignacionesAcademicasController.actualizarAsignacionAcademica
);

module.exports = router;