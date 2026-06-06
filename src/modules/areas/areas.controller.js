const areasService = require('./areas.service');

const crearArea = async (req, res) => {
  try {
    const area = await areasService.crearArea(req.body);

    res.status(201).json({
      mensaje: 'Área creada correctamente',
      area,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarAreas = async (req, res) => {
  try {
    const areas = await areasService.listarAreas(req.query);

    res.json({
      mensaje: 'Áreas obtenidas correctamente',
      areas,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const obtenerAreaPorId = async (req, res) => {
  try {
    const area = await areasService.obtenerAreaPorId(req.params.id);

    res.json({
      mensaje: 'Área obtenida correctamente',
      area,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarArea = async (req, res) => {
  try {
    const area = await areasService.actualizarArea(req.params.id, req.body);

    res.json({
      mensaje: 'Área actualizada correctamente',
      area,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearArea,
  listarAreas,
  obtenerAreaPorId,
  actualizarArea,
};