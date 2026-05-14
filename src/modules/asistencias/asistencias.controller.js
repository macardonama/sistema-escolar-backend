const asistenciasService = require('./asistencias.service');

const registrarAsistencia = async (req, res) => {
  try {
    const asistencia = await asistenciasService.registrarAsistencia(req.body);

    res.status(201).json({
      mensaje: 'Asistencia registrada correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarAsistencias = async (req, res) => {
  try {
    const asistencias = await asistenciasService.listarAsistencias(req.query);

    res.json({
      mensaje: 'Asistencias obtenidas correctamente',
      asistencias,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener asistencias',
      error: error.message,
    });
  }
};

const obtenerAsistenciaPorId = async (req, res) => {
  try {
    const asistencia = await asistenciasService.obtenerAsistenciaPorId(req.params.id);

    res.json({
      mensaje: 'Asistencia obtenida correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarAsistencia = async (req, res) => {
  try {
    const asistencia = await asistenciasService.actualizarAsistencia(req.params.id, req.body);

    res.json({
      mensaje: 'Asistencia actualizada correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  registrarAsistencia,
  listarAsistencias,
  obtenerAsistenciaPorId,
  actualizarAsistencia,
};