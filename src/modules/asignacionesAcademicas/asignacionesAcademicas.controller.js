const asignacionesAcademicasService = require('./asignacionesAcademicas.service');

const crearAsignacionAcademica = async (req, res) => {
  try {
    const asignacion = await asignacionesAcademicasService.crearAsignacionAcademica(req.body);

    res.status(201).json({
      mensaje: 'Asignación académica creada correctamente',
      asignacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarAsignacionesAcademicas = async (req, res) => {
  try {
    const asignaciones = await asignacionesAcademicasService.listarAsignacionesAcademicas(req.query);

    res.json({
      mensaje: 'Asignaciones académicas obtenidas correctamente',
      asignaciones,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const obtenerAsignacionAcademicaPorId = async (req, res) => {
  try {
    const asignacion = await asignacionesAcademicasService.obtenerAsignacionAcademicaPorId(req.params.id);

    res.json({
      mensaje: 'Asignación académica obtenida correctamente',
      asignacion,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const listarAsignacionesPorDocente = async (req, res) => {
  try {
    const asignaciones = await asignacionesAcademicasService.listarAsignacionesPorDocente(req.params.docenteId);

    res.json({
      mensaje: 'Asignaciones académicas del docente obtenidas correctamente',
      asignaciones,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const actualizarAsignacionAcademica = async (req, res) => {
  try {
    const asignacion = await asignacionesAcademicasService.actualizarAsignacionAcademica(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: 'Asignación académica actualizada correctamente',
      asignacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearAsignacionAcademica,
  listarAsignacionesAcademicas,
  obtenerAsignacionAcademicaPorId,
  listarAsignacionesPorDocente,
  actualizarAsignacionAcademica,
};