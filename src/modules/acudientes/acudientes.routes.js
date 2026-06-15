const express = require('express');
const acudientesController = require('./acudientes.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  acudientesController.crearAcudiente
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  acudientesController.listarAcudientes
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE', 'ACUDIENTE'),
  acudientesController.obtenerAcudientePorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  acudientesController.actualizarAcudiente
);

router.post(
  '/asociar-estudiante',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  acudientesController.asociarEstudiante
);

router.delete(
  '/desasociar-estudiante',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DIRECTIVO'),
  acudientesController.desasociarEstudiante
);
module.exports = router;