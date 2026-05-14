const prisma = require('../../config/prisma');

const reporteAsistenciaPorGrupo = async (grupoId, filtros) => {
  const { fechaInicio, fechaFin } = filtros;

  const where = {
    grupoId: Number(grupoId),
  };

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
    orderBy: [
      { fecha: 'desc' },
      { estudiante: { nombre: 'asc' } },
    ],
    include: {
      estudiante: {
        select: {
          id: true,
          nombre: true,
          documento: true,
        },
      },
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  const resumen = asistencias.reduce((acc, asistencia) => {
    acc.total += 1;
    acc[asistencia.estado] = (acc[asistencia.estado] || 0) + 1;
    return acc;
  }, { total: 0 });

  return {
    grupoId: Number(grupoId),
    resumen,
    asistencias,
  };
};

const reporteAsistenciaPorEstudiante = async (estudianteId, filtros) => {
  const { fechaInicio, fechaFin } = filtros;

  const where = {
    estudianteId: Number(estudianteId),
  };

  if (fechaInicio || fechaFin) {
    where.fecha = {};

    if (fechaInicio) {
      where.fecha.gte = new Date(fechaInicio);
    }

    if (fechaFin) {
      where.fecha.lte = new Date(fechaFin);
    }
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
    include: {
      grupo: true,
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  const asistencias = await prisma.asistencia.findMany({
    where,
    orderBy: {
      fecha: 'desc',
    },
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  const resumen = asistencias.reduce((acc, asistencia) => {
    acc.total += 1;
    acc[asistencia.estado] = (acc[asistencia.estado] || 0) + 1;
    return acc;
  }, { total: 0 });

  const porcentajePresencia =
    resumen.total > 0
      ? Number((((resumen.PRESENTE || 0) / resumen.total) * 100).toFixed(2))
      : 0;

  return {
    estudiante,
    resumen: {
      ...resumen,
      porcentajePresencia,
    },
    asistencias,
  };
};

const reporteObservacionesPorEstudiante = async (estudianteId, filtros) => {
  const { fechaInicio, fechaFin, tipo } = filtros;

  const where = {
    estudianteId: Number(estudianteId),
  };

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

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
    include: {
      grupo: true,
      acudientes: {
        include: {
          acudiente: true,
        },
      },
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  const observaciones = await prisma.observacion.findMany({
    where,
    orderBy: {
      fecha: 'desc',
    },
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
            },
          },
        },
      },
      grupo: true,
    },
  });

  return {
    estudiante,
    totalObservaciones: observaciones.length,
    observaciones,
  };
};

const resumenGrupo = async (grupoId, filtros) => {
  const { fechaInicio, fechaFin } = filtros;

  const grupo = await prisma.grupo.findUnique({
    where: {
      id: Number(grupoId),
    },
    include: {
      estudiantes: {
        where: {
          activo: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      },
    },
  });

  if (!grupo) {
    throw new Error('Grupo no encontrado');
  }

  const whereBase = {
    grupoId: Number(grupoId),
  };

  if (fechaInicio || fechaFin) {
    whereBase.fecha = {};

    if (fechaInicio) {
      whereBase.fecha.gte = new Date(fechaInicio);
    }

    if (fechaFin) {
      whereBase.fecha.lte = new Date(fechaFin);
    }
  }

  const asistencias = await prisma.asistencia.findMany({
    where: whereBase,
  });

  const observaciones = await prisma.observacion.findMany({
    where: whereBase,
  });

  const resumenAsistencia = asistencias.reduce((acc, asistencia) => {
    acc.total += 1;
    acc[asistencia.estado] = (acc[asistencia.estado] || 0) + 1;
    return acc;
  }, { total: 0 });

  const porcentajePresencia =
    resumenAsistencia.total > 0
      ? Number((((resumenAsistencia.PRESENTE || 0) / resumenAsistencia.total) * 100).toFixed(2))
      : 0;

  return {
    grupo: {
      id: grupo.id,
      nombre: grupo.nombre,
      grado: grupo.grado,
      activo: grupo.activo,
    },
    totalEstudiantes: grupo.estudiantes.length,
    resumenAsistencia: {
      ...resumenAsistencia,
      porcentajePresencia,
    },
    totalObservaciones: observaciones.length,
  };
};

module.exports = {
  reporteAsistenciaPorGrupo,
  reporteAsistenciaPorEstudiante,
  reporteObservacionesPorEstudiante,
  resumenGrupo,
};