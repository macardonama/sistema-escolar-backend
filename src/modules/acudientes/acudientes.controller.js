const acudientesService = require('./acudientes.service');

const crearAcudiente = async (req, res) => {
  try {
    const acudiente = await acudientesService.crearAcudiente(req.body);

    res.status(201).json({
      mensaje: 'Acudiente creado correctamente',
      acudiente,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarAcudientes = async (req, res) => {
  try {
    const acudientes = await acudientesService.listarAcudientes();

    res.json({
      mensaje: 'Acudientes obtenidos correctamente',
      acudientes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener acudientes',
      error: error.message,
    });
  }
};

const obtenerAcudientePorId = async (req, res) => {
  try {
    const acudiente = await acudientesService.obtenerAcudientePorId(req.params.id);

    res.json({
      mensaje: 'Acudiente obtenido correctamente',
      acudiente,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarAcudiente = async (req, res) => {
  try {
    const acudiente = await acudientesService.actualizarAcudiente(req.params.id, req.body);

    res.json({
      mensaje: 'Acudiente actualizado correctamente',
      acudiente,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const asociarEstudiante = async (req, res) => {
  try {
    const relacion = await acudientesService.asociarEstudiante(req.body);

    res.status(201).json({
      mensaje: 'Estudiante asociado al acudiente correctamente',
      relacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearAcudiente,
  listarAcudientes,
  obtenerAcudientePorId,
  actualizarAcudiente,
  asociarEstudiante,
};