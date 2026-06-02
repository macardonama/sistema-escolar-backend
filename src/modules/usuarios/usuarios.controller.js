const usuariosService = require('./usuarios.service');

const crearUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.crearUsuario(req.body);

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarUsuarios(req.query);

    res.json({
      mensaje: 'Usuarios obtenidos correctamente',
      usuarios,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuarios',
      error: error.message,
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuariosService.obtenerUsuarioPorId(req.params.id);

    res.json({
      mensaje: 'Usuario obtenido correctamente',
      usuario,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.actualizarUsuario(req.params.id, req.body);

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const desactivarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.desactivarUsuario(req.params.id);

    res.json({
      mensaje: 'Usuario desactivado correctamente',
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const activarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.activarUsuario(req.params.id);

    res.json({
      mensaje: 'Usuario activado correctamente',
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
};