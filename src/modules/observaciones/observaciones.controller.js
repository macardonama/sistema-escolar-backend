const observacionesService = require('./observaciones.service');
const {
  puedeVerEstudiante,
  obtenerIdsEstudiantesPermitidos,
} = require('../../utils/permisos');

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
    const { estudianteId } = req.query;

    const filtros = { ...req.query };

    const idsPermitidos = await obtenerIdsEstudiantesPermitidos(req.usuario);

    // ADMINISTRATIVO retorna null, porque puede ver todo
    if (idsPermitidos !== null) {
      if (idsPermitidos.length === 0) {
        return res.json({
          mensaje: 'Observaciones obtenidas correctamente',
          observaciones: [],
        });
      }

      if (estudianteId) {
        const estudiantePermitido = idsPermitidos.includes(Number(estudianteId));

        if (!estudiantePermitido) {
          return res.status(403).json({
            mensaje: 'No tienes permiso para consultar las observaciones de este estudiante',
          });
        }

        filtros.estudianteId = Number(estudianteId);
      } else {
        filtros.estudianteIds = idsPermitidos;
      }

      // Para ESTUDIANTE, ACUDIENTE y DOCENTE no se devuelven observaciones generales
      // porque estudianteId null puede exponer información general del grupo.
      filtros.soloIndividuales = true;
    }

    const observaciones = await observacionesService.listarObservaciones(filtros);

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

    if (!observacion.estudianteId && req.usuario.rol !== 'ADMINISTRATIVO') {
      return res.status(403).json({
        mensaje: 'No tienes permiso para consultar esta observación general',
      });
    }

    const tienePermiso = await puedeVerEstudiante(
      req.usuario,
      observacion.estudianteId
    );

    if (!tienePermiso) {
      return res.status(403).json({
        mensaje: 'No tienes permiso para consultar esta observación',
      });
    }

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