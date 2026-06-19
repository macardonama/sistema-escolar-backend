const express = require('express');
const usuariosController = require('./usuarios.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const router = express.Router();

router.post(
  '/carga-masiva/archivo',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  upload.single('archivo'),
  usuariosController.cargarUsuariosDesdeArchivo
);

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

router.patch(
  '/:id/password',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.actualizarPasswordUsuario
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

router.patch(
  '/:id/activar',
  verificarToken,
  verificarRol('ADMINISTRATIVO'),
  usuariosController.activarUsuario
);

module.exports = router;