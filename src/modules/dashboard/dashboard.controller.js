const dashboardService = require('./dashboard.service');

const obtenerDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.obtenerDashboard();

    res.json({
      mensaje: 'Dashboard obtenido correctamente',
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener dashboard',
      error: error.message,
    });
  }
};

const crearNoticia = async (req, res) => {
  try {
    const noticia = await dashboardService.crearNoticia(req.body, req.usuario.id);

    res.status(201).json({
      mensaje: 'Noticia creada correctamente',
      noticia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const actualizarNoticia = async (req, res) => {
  try {
    const noticia = await dashboardService.actualizarNoticia(
      req.params.id,
      req.body,
      req.usuario.id
    );

    res.json({
      mensaje: 'Noticia actualizada correctamente',
      noticia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const activarNoticia = async (req, res) => {
  try {
    const noticia = await dashboardService.cambiarEstadoNoticia(
      req.params.id,
      true,
      req.usuario.id
    );

    res.json({
      mensaje: 'Noticia activada correctamente',
      noticia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarNoticia = async (req, res) => {
  try {
    const noticia = await dashboardService.cambiarEstadoNoticia(
      req.params.id,
      false,
      req.usuario.id
    );

    res.json({
      mensaje: 'Noticia desactivada correctamente',
      noticia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const crearEvento = async (req, res) => {
  try {
    const evento = await dashboardService.crearEvento(req.body, req.usuario.id);

    res.status(201).json({
      mensaje: 'Evento creado correctamente',
      evento,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const actualizarEvento = async (req, res) => {
  try {
    const evento = await dashboardService.actualizarEvento(
      req.params.id,
      req.body,
      req.usuario.id
    );

    res.json({
      mensaje: 'Evento actualizado correctamente',
      evento,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const activarEvento = async (req, res) => {
  try {
    const evento = await dashboardService.cambiarEstadoEvento(
      req.params.id,
      true,
      req.usuario.id
    );

    res.json({
      mensaje: 'Evento activado correctamente',
      evento,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarEvento = async (req, res) => {
  try {
    const evento = await dashboardService.cambiarEstadoEvento(
      req.params.id,
      false,
      req.usuario.id
    );

    res.json({
      mensaje: 'Evento desactivado correctamente',
      evento,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const crearGaleria = async (req, res) => {
  try {
    const itemGaleria = await dashboardService.crearGaleria(req.body, req.usuario.id);

    res.status(201).json({
      mensaje: 'Elemento de galería creado correctamente',
      itemGaleria,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const actualizarGaleria = async (req, res) => {
  try {
    const itemGaleria = await dashboardService.actualizarGaleria(
      req.params.id,
      req.body,
      req.usuario.id
    );

    res.json({
      mensaje: 'Elemento de galería actualizado correctamente',
      itemGaleria,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const activarGaleria = async (req, res) => {
  try {
    const itemGaleria = await dashboardService.cambiarEstadoGaleria(
      req.params.id,
      true,
      req.usuario.id
    );

    res.json({
      mensaje: 'Elemento de galería activado correctamente',
      itemGaleria,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarGaleria = async (req, res) => {
  try {
    const itemGaleria = await dashboardService.cambiarEstadoGaleria(
      req.params.id,
      false,
      req.usuario.id
    );

    res.json({
      mensaje: 'Elemento de galería desactivado correctamente',
      itemGaleria,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  obtenerDashboard,
  crearNoticia,
  actualizarNoticia,
  activarNoticia,
  desactivarNoticia,
  crearEvento,
  actualizarEvento,
  activarEvento,
  desactivarEvento,
  crearGaleria,
  actualizarGaleria,
  activarGaleria,
  desactivarGaleria,
};