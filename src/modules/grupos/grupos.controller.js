const gruposService = require('./grupos.service');

const crearGrupo = async (req, res) => {
  try {
    const grupo = await gruposService.crearGrupo(req.body);

    res.status(201).json({
      mensaje: 'Grupo creado correctamente',
      grupo,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarGrupos = async (req, res) => {
  try {
    const grupos = await gruposService.listarGrupos();

    res.json({
      mensaje: 'Grupos obtenidos correctamente',
      grupos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener grupos',
      error: error.message,
    });
  }
};

const obtenerGrupoPorId = async (req, res) => {
  try {
    const grupo = await gruposService.obtenerGrupoPorId(req.params.id);

    res.json({
      mensaje: 'Grupo obtenido correctamente',
      grupo,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarGrupo = async (req, res) => {
  try {
    const grupo = await gruposService.actualizarGrupo(req.params.id, req.body);

    res.json({
      mensaje: 'Grupo actualizado correctamente',
      grupo,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarGrupo = async (req, res) => {
  try {
    const grupo = await gruposService.desactivarGrupo(req.params.id);

    res.json({
      mensaje: 'Grupo desactivado correctamente',
      grupo,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  desactivarGrupo,
};