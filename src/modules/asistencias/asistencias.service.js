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
      asignacionAcademica: {
      include: {
        docente: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                correo: true,
                rol: true,
                activo: true,
          },
        },
      },
    },
    grupo: true,
    area: true,
  },
},
                
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

const registrarAsistenciasMasivas = async (datos) => {
  const { asignacionAcademicaId, fecha, asistencias } = datos;

  if (!asignacionAcademicaId) {
    throw new Error('La asignación académica es obligatoria');
  }

  if (!fecha) {
    throw new Error('La fecha es obligatoria');
  }

  if (!Array.isArray(asistencias) || asistencias.length === 0) {
    throw new Error('Debe enviar al menos una asistencia');
  }

  const asignacionAcademica = await prisma.asignacionAcademica.findUnique({
    where: {
      id: Number(asignacionAcademicaId),
    },
    include: {
      docente: true,
      grupo: true,
      area: true,
    },
  });

  if (!asignacionAcademica) {
    throw new Error('Asignación académica no encontrada');
  }

  if (!asignacionAcademica.activo) {
    throw new Error('La asignación académica no está activa');
  }

  const estadosValidos = [
    'PRESENTE',
    'AUSENTE',
    'TARDE',
    'CITA',
    'HOSPITALIZADO',
    'EN_CUARTO',
  ];

  const fechaAsistencia = new Date(fecha);

  const estudiantesIds = asistencias.map((item) => Number(item.estudianteId));

  const estudiantesEncontrados = await prisma.estudiante.findMany({
    where: {
      id: {
        in: estudiantesIds,
      },
    },
    select: {
      id: true,
    },
  });

  const idsEncontrados = estudiantesEncontrados.map((estudiante) => estudiante.id);

  const idsNoEncontrados = estudiantesIds.filter(
    (id) => !idsEncontrados.includes(id)
  );

  if (idsNoEncontrados.length > 0) {
    throw new Error(
      `Los siguientes estudiantes no existen: ${idsNoEncontrados.join(', ')}`
    );
  }

  const asistenciasExistentes = await prisma.asistencia.findMany({
    where: {
      asignacionAcademicaId: Number(asignacionAcademicaId),
      fecha: fechaAsistencia,
      estudianteId: {
        in: estudiantesIds,
      },
    },
    select: {
      estudianteId: true,
    },
  });

  const idsExistentes = asistenciasExistentes.map(
    (asistencia) => asistencia.estudianteId
  );

  let creadas = 0;
  let actualizadas = 0;

  const operaciones = asistencias.map((item) => {
    const { estudianteId, estado, emocion, observacion } = item;

    if (!estudianteId) {
      throw new Error('Cada asistencia debe tener estudianteId');
    }

    if (!estado) {
      throw new Error('Cada asistencia debe tener estado');
    }

    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de asistencia no válido: ${estado}`);
    }

    const estudianteIdNumero = Number(estudianteId);

    if (idsExistentes.includes(estudianteIdNumero)) {
      actualizadas += 1;
    } else {
      creadas += 1;
    }

    return prisma.asistencia.upsert({
      where: {
        estudianteId_asignacionAcademicaId_fecha: {
          estudianteId: estudianteIdNumero,
          asignacionAcademicaId: Number(asignacionAcademicaId),
          fecha: fechaAsistencia,
        },
      },
      update: {
        estado,
        emocion: estado === 'PRESENTE' ? emocion || null : null,
        observacion: observacion?.trim() || null,
        docenteId: asignacionAcademica.docenteId,
        grupoId: asignacionAcademica.grupoId,
      },
      create: {
        estudianteId: estudianteIdNumero,
        docenteId: asignacionAcademica.docenteId,
        grupoId: asignacionAcademica.grupoId,
        asignacionAcademicaId: Number(asignacionAcademicaId),
        fecha: fechaAsistencia,
        estado,
        emocion: estado === 'PRESENTE' ? emocion || null : null,
        observacion: observacion?.trim() || null,
      },
    });
  });

  const asistenciasProcesadas = await prisma.$transaction(operaciones);

  return {
    total: asistencias.length,
    creadas,
    actualizadas,
    asignacionAcademica,
    asistencias: asistenciasProcesadas,
  };
};

module.exports = {
  registrarAsistencia,
  listarAsistencias,
  obtenerAsistenciaPorId,
  registrarAsistenciasMasivas,
  actualizarAsistencia,
};