const express = require('express');
const authController = require('./auth.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.get('/perfil', verificarToken, authController.obtenerPerfil);

module.exports = router;