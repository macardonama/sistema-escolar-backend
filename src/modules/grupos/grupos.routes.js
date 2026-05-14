const express = require('express');
const gruposController = require('./grupos.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  gruposController.crearGrupo
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  gruposController.listarGrupos
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DOCENTE'),
  gruposController.obtenerGrupoPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  gruposController.actualizarGrupo
);

router.patch(
  '/:id/desactivar',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  gruposController.desactivarGrupo
);

module.exports = router;