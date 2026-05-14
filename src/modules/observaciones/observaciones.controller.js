const observacionesService = require('./observaciones.service');

const crearObservacion = async (req, res) => {
  try {
    const observacion = await observacionesService.crearObservacion(req.body);

    res.status(201).json({
      mensaje: 'Observación registrada correctamente',
      observacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarObservaciones = async (req, res) => {
  try {
    const observaciones = await observacionesService.listarObservaciones(req.query);

    res.json({
      mensaje: 'Observaciones obtenidas correctamente',
      observaciones,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener observaciones',
      error: error.message,
    });
  }
};

const obtenerObservacionPorId = async (req, res) => {
  try {
    const observacion = await observacionesService.obtenerObservacionPorId(req.params.id);

    res.json({
      mensaje: 'Observación obtenida correctamente',
      observacion,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarObservacion = async (req, res) => {
  try {
    const observacion = await observacionesService.actualizarObservacion(req.params.id, req.body);

    res.json({
      mensaje: 'Observación actualizada correctamente',
      observacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearObservacion,
  listarObservaciones,
  obtenerObservacionPorId,
  actualizarObservacion,
};