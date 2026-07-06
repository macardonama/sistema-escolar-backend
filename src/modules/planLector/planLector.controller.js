const planLectorService = require('./planLector.service');

const crearLibro = async (req, res) => {
  try {
    const libro = await planLectorService.crearLibro(req.body, req.usuario);

    res.status(201).json({
      mensaje: 'Libro creado correctamente',
      libro,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarMisLibros = async (req, res) => {
  try {
    const libros = await planLectorService.listarMisLibros(req.usuario);

    res.json({
      libros,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const obtenerLibroPorId = async (req, res) => {
  try {
    const libro = await planLectorService.obtenerLibroPorId(req.params.id, req.usuario);

    res.json({
      libro,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarLibro = async (req, res) => {
  try {
    const libro = await planLectorService.actualizarLibro(
      req.params.id,
      req.body,
      req.usuario
    );

    res.json({
      mensaje: 'Libro actualizado correctamente',
      libro,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const finalizarLibro = async (req, res) => {
  try {
    const libro = await planLectorService.finalizarLibro(
      req.params.id,
      req.body,
      req.usuario
    );

    res.json({
      mensaje: 'Libro finalizado correctamente',
      libro,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarLibrosPorEstudiante = async (req, res) => {
  try {
    const libros = await planLectorService.listarLibrosPorEstudiante(
      req.params.estudianteId,
      req.usuario
    );

    res.json({
      libros,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarLibrosPorGrupo = async (req, res) => {
  try {
    const resultado = await planLectorService.listarLibrosPorGrupo(
      req.params.grupoId,
      req.usuario
    );

    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const crearLibrosMasivosPorGrupo = async (req, res) => {
  try {
    const resultado = await planLectorService.crearLibrosMasivosPorGrupo(
      req.params.grupoId,
      req.body,
      req.usuario
    );

    res.status(201).json({
      mensaje: 'Libros creados correctamente',
      resultado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearLibro,
  listarMisLibros,
  obtenerLibroPorId,
  actualizarLibro,
  finalizarLibro,
  listarLibrosPorEstudiante,
  listarLibrosPorGrupo,
  crearLibrosMasivosPorGrupo,
};