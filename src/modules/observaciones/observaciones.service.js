const prisma = require('../../config/prisma');

const crearObservacion = async (datos) => {
  const {
    estudianteId,
    docenteId,
    grupoId,
    fecha,
    tipo,
    descripcion,
    enviarAcudiente,
  } = datos;

  if (!docenteId || !grupoId || !tipo || !descripcion) {
    throw new Error('docenteId, grupoId, tipo y descripcion son obligatorios');
  }

  const docente = await prisma.docente.findUnique({
    where: { id: Number(docenteId) },
  });

  if (!docente) {
    throw new Error('El docente no existe');
  }

  const grupo = await prisma.grupo.findUnique({
    where: { id: Number(grupoId) },
  });

  if (!grupo) {
    throw new Error('El grupo no existe');
  }

  if (estudianteId) {
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: Number(estudianteId) },
    });

    if (!estudiante) {
      throw new Error('El estudiante no existe');
    }
  }

  const observacion = await prisma.observacion.create({
    data: {
      estudianteId: estudianteId ? Number(estudianteId) : null,
      docenteId: Number(docenteId),
      grupoId: Number(grupoId),
      fecha: fecha ? new Date(fecha) : new Date(),
      tipo,
      descripcion,
      enviarAcudiente: Boolean(enviarAcudiente),
    },
    include: {
      estudiante: {
        include: {
          grupo: true,
        },
      },
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  return observacion;
};

const listarObservaciones = async (filtros) => {
  const {
    estudianteId,
    estudianteIds,
    docenteId,
    grupoId,
    fechaInicio,
    fechaFin,
    tipo,
    soloIndividuales,
  } = filtros;

  const where = {};

  if (estudianteIds && estudianteIds.length > 0) {
    where.estudianteId = {
      in: estudianteIds.map((id) => Number(id)),
    };
  } else if (estudianteId) {
    where.estudianteId = Number(estudianteId);
  }

  if (soloIndividuales) {
    where.estudianteId = where.estudianteId || {
      not: null,
    };
  }

  if (docenteId) {
    where.docenteId = Number(docenteId);
  }

  if (grupoId) {
    where.grupoId = Number(grupoId);
  }

  if (tipo) {
    where.tipo = tipo;
  }

  if (fechaInicio || fechaFin) {
    where.fecha = {};

    if (fechaInicio) {
      where.fecha.gte = new Date(fechaInicio);
    }

    if (fechaFin) {
      where.fecha.lte = new Date(fechaFin);
    }
  }

  const observaciones = await prisma.observacion.findMany({
    where,
    orderBy: {
      fecha: 'desc',
    },
    include: {
      estudiante: {
        include: {
          grupo: true,
        },
      },
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  return observaciones;
};
const obtenerObservacionPorId = async (id) => {
  const observacion = await prisma.observacion.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      estudiante: {
        include: {
          grupo: true,
        },
      },
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  if (!observacion) {
    throw new Error('Observación no encontrada');
  }

  return observacion;
};

const actualizarObservacion = async (id, datos) => {
  const { estudianteId, fecha, tipo, descripcion, enviarAcudiente } = datos;

  const observacion = await prisma.observacion.update({
    where: {
      id: Number(id),
    },
    data: {
      estudianteId: estudianteId ? Number(estudianteId) : undefined,
      fecha: fecha ? new Date(fecha) : undefined,
      tipo,
      descripcion,
      enviarAcudiente,
    },
    include: {
      estudiante: true,
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  return observacion;
};

module.exports = {
  crearObservacion,
  listarObservaciones,
  obtenerObservacionPorId,
  actualizarObservacion,
};