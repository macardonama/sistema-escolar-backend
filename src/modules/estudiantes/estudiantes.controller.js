const estudiantesService = require('./estudiantes.service');
const { puedeVerEstudiante } = require('../../utils/permisos');

const crearEstudiante = async (req, res) => {
  try {
    const estudiante = await estudiantesService.crearEstudiante(req.body);

    res.status(201).json({
      mensaje: 'Estudiante creado correctamente',
      estudiante,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await estudiantesService.listarEstudiantes();

    res.json({
      mensaje: 'Estudiantes obtenidos correctamente',
      estudiantes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener estudiantes',
      error: error.message,
    });
  }
};

const obtenerEstudiantePorId = async (req, res) => {
  try {
    const tienePermiso = await puedeVerEstudiante(req.usuario, req.params.id);

    if (!tienePermiso) {
      return res.status(403).json({
        mensaje: 'No tienes permiso para consultar este estudiante',
      });
    }

    const estudiante = await estudiantesService.obtenerEstudiantePorId(req.params.id);

    res.json({
      mensaje: 'Estudiante obtenido correctamente',
      estudiante,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};
const actualizarEstudiante = async (req, res) => {
  try {
    const estudiante = await estudiantesService.actualizarEstudiante(req.params.id, req.body);

    res.json({
      mensaje: 'Estudiante actualizado correctamente',
      estudiante,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarEstudiante = async (req, res) => {
  try {
    const estudiante = await estudiantesService.desactivarEstudiante(req.params.id);

    res.json({
      mensaje: 'Estudiante desactivado correctamente',
      estudiante,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearEstudiante,
  listarEstudiantes,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  desactivarEstudiante,
};