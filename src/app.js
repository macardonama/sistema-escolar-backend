const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const gruposRoutes = require('./modules/grupos/grupos.routes');
const docentesRoutes = require('./modules/docentes/docentes.routes');
const authRoutes = require('./modules/auth/auth.routes');
const estudiantesRoutes = require('./modules/estudiantes/estudiantes.routes');
const acudientesRoutes = require('./modules/acudientes/acudientes.routes');
const asistenciasRoutes = require('./modules/asistencias/asistencias.routes');
const observacionesRoutes = require('./modules/observaciones/observaciones.routes');
const reportesRoutes = require('./modules/reportes/reportes.routes');
const areasRoutes = require('./modules/areas/areas.routes');
const asignacionesAcademicasRoutes = require('./modules/asignacionesAcademicas/asignacionesAcademicas.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const upasRoutes = require('./modules/upas/upas.routes');
const planLectorRoutes = require('./modules/planLector/planLector.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend del sistema escolar funcionando correctamente',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/docentes', docentesRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/acudientes', acudientesRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/asignaciones-academicas', asignacionesAcademicasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upas', upasRoutes);
app.use('/api/plan-lector', planLectorRoutes);


module.exports = app;