const authService = require('./auth.service');

const login = async (req, res) => {
  try {
    const resultado = await authService.login(req.body);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token: resultado.token,
      usuario: resultado.usuario,
    });
  } catch (error) {
    res.status(401).json({
      mensaje: error.message,
    });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);

    res.json({
      mensaje: 'Perfil obtenido correctamente',
      usuario,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  login,
  obtenerPerfil,
};