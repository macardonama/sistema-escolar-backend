const express = require('express');
const docentesController = require('./docentes.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  docentesController.crearDocente
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  docentesController.listarDocentes
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  docentesController.obtenerDocentePorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  docentesController.actualizarDocente
);

module.exports = router;