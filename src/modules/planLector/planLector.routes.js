const express = require('express');
const planLectorController = require('./planLector.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post(
  '/libros',
  verificarToken,
  verificarRol('ESTUDIANTE', 'DOCENTE'),
  planLectorController.crearLibro
);

router.get(
  '/mis-libros',
  verificarToken,
  verificarRol('ESTUDIANTE'),
  planLectorController.listarMisLibros
);

router.get(
  '/libros/:id',
  verificarToken,
  verificarRol('ESTUDIANTE', 'DOCENTE', 'COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'),
  planLectorController.obtenerLibroPorId
);

router.put(
  '/libros/:id',
  verificarToken,
  verificarRol('ESTUDIANTE', 'DOCENTE'),
  planLectorController.actualizarLibro
);

router.patch(
  '/libros/:id/finalizar',
  verificarToken,
  verificarRol('ESTUDIANTE', 'DOCENTE'),
  planLectorController.finalizarLibro
);

router.get(
  '/estudiantes/:estudianteId/libros',
  verificarToken,
  verificarRol('DOCENTE', 'COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'),
  planLectorController.listarLibrosPorEstudiante
);

router.get(
  '/grupos/:grupoId/libros',
  verificarToken,
  verificarRol('DOCENTE', 'COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'),
  planLectorController.listarLibrosPorGrupo
);

router.post(
  '/grupos/:grupoId/libros/masivo',
  verificarToken,
  verificarRol('DOCENTE'),
  planLectorController.crearLibrosMasivosPorGrupo
);

module.exports = router;