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
  verificarRol('ADMINISTRATIVO', 'DIRECTIVO', 'DOCENTE'),
  gruposController.listarGrupos
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DIRECTIVO', 'DOCENTE'),
  gruposController.obtenerGrupoPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO','DIRECTIVO'),
  gruposController.actualizarGrupo
);

router.patch(
  '/:id/desactivar',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DIRECTIVO'),
  gruposController.desactivarGrupo
);

router.patch(
  '/:id/activar',
  verificarToken,
  verificarRol('ADMINISTRATIVO', 'DIRECTIVO'),
  gruposController.activarGrupo
);
module.exports = router;