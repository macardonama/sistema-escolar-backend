const docentesService = require('./docentes.service');

const crearDocente = async (req, res) => {
  try {
    const docente = await docentesService.crearDocente(req.body);

    res.status(201).json({
      mensaje: 'Docente creado correctamente',
      docente,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarDocentes = async (req, res) => {
  try {
    const docentes = await docentesService.listarDocentes();

    res.json({
      mensaje: 'Docentes obtenidos correctamente',
      docentes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener docentes',
      error: error.message,
    });
  }
};

const obtenerDocentePorId = async (req, res) => {
  try {
    const docente = await docentesService.obtenerDocentePorId(req.params.id);

    res.json({
      mensaje: 'Docente obtenido correctamente',
      docente,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarDocente = async (req, res) => {
  try {
    const docente = await docentesService.actualizarDocente(req.params.id, req.body);

    res.json({
      mensaje: 'Docente actualizado correctamente',
      docente,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearDocente,
  listarDocentes,
  obtenerDocentePorId,
  actualizarDocente,
};