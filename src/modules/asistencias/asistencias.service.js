const prisma = require('../../config/prisma');

const registrarAsistencia = async (datos) => {
  const { estudianteId, docenteId, grupoId, fecha, estado, emocion, observacion } = datos;

  if (!estudianteId || !docenteId || !grupoId || !estado) {
    throw new Error('estudianteId, docenteId, grupoId y estado son obligatorios');
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { id: Number(estudianteId) },
  });

  if (!estudiante) {
    throw new Error('El estudiante no existe');
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

  if (estado !== 'PRESENTE' && emocion) {
    throw new Error('La emoción solo puede registrarse cuando el estado es PRESENTE');
  }

  const asistencia = await prisma.asistencia.create({
    data: {
      estudianteId: Number(estudianteId),
      docenteId: Number(docenteId),
      grupoId: Number(grupoId),
      fecha: fecha ? new Date(fecha) : new Date(),
      estado,
      emocion: estado === 'PRESENTE' ? emocion : null,
      observacion,
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

  return asistencia;
};

const listarAsistencias = async (filtros) => {
  const {
    estudianteId,
    estudianteIds,
    docenteId,
    grupoId,
    fechaInicio,
    fechaFin,
  } = filtros;

  const where = {};

  if (estudianteIds && estudianteIds.length > 0) {
    where.estudianteId = {
      in: estudianteIds.map((id) => Number(id)),
    };
  } else if (estudianteId) {
    where.estudianteId = Number(estudianteId);
  }

  if (docenteId) {
    where.docenteId = Number(docenteId);
  }

  if (grupoId) {
    where.grupoId = Number(grupoId);
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

  const asistencias = await prisma.asistencia.findMany({
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

  return asistencias;
};

const obtenerAsistenciaPorId = async (id) => {
  const asistencia = await prisma.asistencia.findUnique({
    where: {
      id: Number(id),
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

  if (!asistencia) {
    throw new Error('Asistencia no encontrada');
  }

  return asistencia;
};

const actualizarAsistencia = async (id, datos) => {
  const { estado, emocion, observacion, fecha } = datos;

  if (estado && estado !== 'PRESENTE' && emocion) {
    throw new Error('La emoción solo puede registrarse cuando el estado es PRESENTE');
  }

  const asistencia = await prisma.asistencia.update({
    where: {
      id: Number(id),
    },
    data: {
      estado,
      emocion: estado === 'PRESENTE' ? emocion : estado ? null : emocion,
      observacion,
      fecha: fecha ? new Date(fecha) : undefined,
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

  return asistencia;
};

module.exports = {
  registrarAsistencia,
  listarAsistencias,
  obtenerAsistenciaPorId,
  actualizarAsistencia,
};