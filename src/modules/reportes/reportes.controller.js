const reportesService = require('./reportes.service');

const reporteAsistenciaPorGrupo = async (req, res) => {
  try {
    const reporte = await reportesService.reporteAsistenciaPorGrupo(
      req.params.grupoId,
      req.query
    );

    res.json({
      mensaje: 'Reporte de asistencia por grupo generado correctamente',
      reporte,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const reporteAsistenciaPorEstudiante = async (req, res) => {
  try {
    const reporte = await reportesService.reporteAsistenciaPorEstudiante(
      req.params.estudianteId,
      req.query
    );

    res.json({
      mensaje: 'Reporte de asistencia por estudiante generado correctamente',
      reporte,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const reporteObservacionesPorEstudiante = async (req, res) => {
  try {
    const reporte = await reportesService.reporteObservacionesPorEstudiante(
      req.params.estudianteId,
      req.query
    );

    res.json({
      mensaje: 'Reporte de observaciones por estudiante generado correctamente',
      reporte,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const resumenGrupo = async (req, res) => {
  try {
    const reporte = await reportesService.resumenGrupo(
      req.params.grupoId,
      req.query
    );

    res.json({
      mensaje: 'Resumen del grupo generado correctamente',
      reporte,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  reporteAsistenciaPorGrupo,
  reporteAsistenciaPorEstudiante,
  reporteObservacionesPorEstudiante,
  resumenGrupo,
};