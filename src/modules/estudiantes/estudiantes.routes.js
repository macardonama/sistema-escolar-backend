const express = require('express');
const estudiantesController = require('./estudiantes.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  estudiantesController.crearEstudiante
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  estudiantesController.listarEstudiantes
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'),
  estudiantesController.obtenerEstudiantePorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  estudiantesController.actualizarEstudiante
);

router.patch(
  '/:id/desactivar',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  estudiantesController.desactivarEstudiante
);

module.exports = router;