const asistenciasService = require('./asistencias.service');
const {
  puedeVerEstudiante,
  obtenerIdsEstudiantesPermitidos,
} = require('../../utils/permisos');
const registrarAsistencia = async (req, res) => {
  try {
    const asistencia = await asistenciasService.registrarAsistencia(req.body);

    res.status(201).json({
      mensaje: 'Asistencia registrada correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const listarAsistencias = async (req, res) => {
  try {
    const { estudianteId } = req.query;

    const filtros = { ...req.query };

    const idsPermitidos = await obtenerIdsEstudiantesPermitidos(req.usuario);

    // ADMINISTRATIVO retorna null, porque puede ver todo
    if (idsPermitidos !== null) {
      if (idsPermitidos.length === 0) {
        return res.json({
          mensaje: 'Asistencias obtenidas correctamente',
          asistencias: [],
        });
      }

      if (estudianteId) {
        const estudiantePermitido = idsPermitidos.includes(Number(estudianteId));

        if (!estudiantePermitido) {
          return res.status(403).json({
            mensaje: 'No tienes permiso para consultar las asistencias de este estudiante',
          });
        }

        filtros.estudianteId = Number(estudianteId);
      } else {
        filtros.estudianteIds = idsPermitidos;
      }
    }

    const asistencias = await asistenciasService.listarAsistencias(filtros);

    res.json({
      mensaje: 'Asistencias obtenidas correctamente',
      asistencias,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener asistencias',
      error: error.message,
    });
  }
};;
const obtenerAsistenciaPorId = async (req, res) => {
  try {
    const asistencia = await asistenciasService.obtenerAsistenciaPorId(req.params.id);

    const tienePermiso = await puedeVerEstudiante(
      req.usuario,
      asistencia.estudianteId
    );

    if (!tienePermiso) {
      return res.status(403).json({
        mensaje: 'No tienes permiso para consultar esta asistencia',
      });
    }

    res.json({
      mensaje: 'Asistencia obtenida correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(404).json({
      mensaje: error.message,
    });
  }
};
const actualizarAsistencia = async (req, res) => {
  try {
    const asistencia = await asistenciasService.actualizarAsistencia(req.params.id, req.body);

    res.json({
      mensaje: 'Asistencia actualizada correctamente',
      asistencia,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const registrarAsistenciasMasivas = async (req, res) => {
  try {
    const resultado = await asistenciasService.registrarAsistenciasMasivas(req.body);

    res.status(201).json({
      mensaje: 'Asistencias masivas registradas correctamente',
      resultado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  registrarAsistencia,
  listarAsistencias,
  obtenerAsistenciaPorId,
  actualizarAsistencia,
  registrarAsistenciasMasivas,
};