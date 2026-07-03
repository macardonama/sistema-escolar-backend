const upasService = require('./upas.service');

const crearUpa = async (req, res) => {
  try {
    const upa = await upasService.crearUpa(req.body, req.usuario);

    res.status(201).json({
      mensaje: 'UPA creada correctamente',
      upa,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarUpas = async (req, res) => {
  try {
    const upas = await upasService.listarUpas(req.usuario, req.query);

    res.json({
      upas,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const obtenerUpaPorId = async (req, res) => {
  try {
    const upa = await upasService.obtenerUpaPorId(req.params.id, req.usuario);

    res.json({
      upa,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};

const actualizarUpa = async (req, res) => {
  try {
    const upa = await upasService.actualizarUpa(req.params.id, req.body, req.usuario);

    res.json({
      mensaje: 'UPA actualizada correctamente',
      upa,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const enviarUpa = async (req, res) => {
  try {
    const upa = await upasService.enviarUpa(req.params.id, req.usuario);

    res.json({
      mensaje: 'UPA enviada para revisión correctamente',
      upa,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const aprobarUpa = async (req, res) => {
  try {
    const upa = await upasService.aprobarUpa(req.params.id);

    res.json({
      mensaje: 'UPA aprobada correctamente',
      upa,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const requerirAjustesUpa = async (req, res) => {
  try {
    const upa = await upasService.requerirAjustesUpa(req.params.id);

    res.json({
      mensaje: 'Se solicitaron ajustes para la UPA correctamente',
      upa,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const crearRetroalimentacion = async (req, res) => {
  try {
    const retroalimentacion = await upasService.crearRetroalimentacion(
      req.params.id,
      req.body,
      req.usuario
    );

    res.status(201).json({
      mensaje: 'Retroalimentación registrada correctamente',
      retroalimentacion,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarRetroalimentaciones = async (req, res) => {
  try {
    const retroalimentaciones = await upasService.listarRetroalimentaciones(
      req.params.id,
      req.usuario
    );

    res.json({
      retroalimentaciones,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  crearUpa,
  listarUpas,
  obtenerUpaPorId,
  actualizarUpa,
  enviarUpa,
  aprobarUpa,
  requerirAjustesUpa,
  crearRetroalimentacion,
  listarRetroalimentaciones,
};