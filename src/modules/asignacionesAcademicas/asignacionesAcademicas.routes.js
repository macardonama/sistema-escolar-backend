const express = require('express');
const asignacionesAcademicasController = require('./asignacionesAcademicas.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  asignacionesAcademicasController.crearAsignacionAcademica
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asignacionesAcademicasController.listarAsignacionesAcademicas
);

router.get(
  '/docente/:docenteId',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asignacionesAcademicasController.listarAsignacionesPorDocente
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  asignacionesAcademicasController.obtenerAsignacionAcademicaPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  asignacionesAcademicasController.actualizarAsignacionAcademica
);

module.exports = router;