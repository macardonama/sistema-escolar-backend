const express = require('express');
const dashboardController = require('./dashboard.controller');
const { verificarToken } = require('../../middlewares/authMiddleware');
const { verificarRol } = require('../../middlewares/roleMiddleware');

const router = express.Router();

const ROLES_LECTURA_DASHBOARD = [
  'ADMINISTRATIVO',
  'DIRECTIVO',
  'DOCENTE',
  'ESTUDIANTE',
  'ACUDIENTE',
  'PSICORIENTADOR',
];

const ROLES_GESTION_DASHBOARD = ['ADMINISTRATIVO', 'DIRECTIVO'];

router.get(
  '/',
  verificarToken,
  verificarRol(...ROLES_LECTURA_DASHBOARD),
  dashboardController.obtenerDashboard
);

router.post(
  '/noticias',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.crearNoticia
);

router.put(
  '/noticias/:id',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.actualizarNoticia
);

router.patch(
  '/noticias/:id/activar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.activarNoticia
);

router.patch(
  '/noticias/:id/desactivar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.desactivarNoticia
);

router.post(
  '/eventos',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.crearEvento
);

router.put(
  '/eventos/:id',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.actualizarEvento
);

router.patch(
  '/eventos/:id/activar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.activarEvento
);

router.patch(
  '/eventos/:id/desactivar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.desactivarEvento
);

router.post(
  '/galeria',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.crearGaleria
);

router.put(
  '/galeria/:id',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.actualizarGaleria
);

router.patch(
  '/galeria/:id/activar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.activarGaleria
);

router.patch(
  '/galeria/:id/desactivar',
  verificarToken,
  verificarRol(...ROLES_GESTION_DASHBOARD),
  dashboardController.desactivarGaleria
);

module.exports = router;