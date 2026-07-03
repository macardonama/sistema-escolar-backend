const express = require('express');
const upasController = require('./upas.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('DOCENTE'),
  upasController.crearUpa
);

router.get(
  '/',
  verificarToken,
  verificarRol('DOCENTE', 'COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.listarUpas
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('DOCENTE', 'COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.obtenerUpaPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('DOCENTE'),
  upasController.actualizarUpa
);

router.patch(
  '/:id/enviar',
  verificarToken,
  verificarRol('DOCENTE'),
  upasController.enviarUpa
);

router.patch(
  '/:id/aprobar',
  verificarToken,
  verificarRol('COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.aprobarUpa
);

router.patch(
  '/:id/requerir-ajustes',
  verificarToken,
  verificarRol('COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.requerirAjustesUpa
);

router.post(
  '/:id/retroalimentaciones',
  verificarToken,
  verificarRol('COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.crearRetroalimentacion
);

router.get(
  '/:id/retroalimentaciones',
  verificarToken,
  verificarRol('DOCENTE', 'COORDINADOR', 'ADMINISTRATIVO', 'DIRECTIVO'),
  upasController.listarRetroalimentaciones
);

module.exports = router;