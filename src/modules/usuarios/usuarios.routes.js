const express = require('express');
const usuariosController = require('./usuarios.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.crearUsuario
);

router.get(
  '/',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.listarUsuarios
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.obtenerUsuarioPorId
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.actualizarUsuario
);

router.patch(
  '/:id/desactivar',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.desactivarUsuario
);

module.exports = router;