const prisma = require('../../config/prisma');

const crearAsignacionAcademica = async (datos) => {
  const { docenteId, grupoId, areaId } = datos;

  if (!docenteId) {
    throw new Error('El docente es obligatorio');
  }

  if (!grupoId) {
    throw new Error('El grupo es obligatorio');
  }

  if (!areaId) {
    throw new Error('El área es obligatoria');
  }

  const docente = await prisma.docente.findUnique({
    where: { id: Number(docenteId) },
    include: {
      usuario: true,
    },
  });

  if (!docente) {
    throw new Error('Docente no encontrado');
  }

  if (docente.usuario.rol !== 'DOCENTE') {
    throw new Error('El usuario asociado no tiene rol DOCENTE');
  }

  const grupo = await prisma.grupo.findUnique({
    where: { id: Number(grupoId) },
  });

  if (!grupo) {
    throw new Error('Grupo no encontrado');
  }

  const area = await prisma.area.findUnique({
    where: { id: Number(areaId) },
  });

  if (!area) {
    throw new Error('Área no encontrada');
  }

  const asignacionExistente = await prisma.asignacionAcademica.findUnique({
    where: {
      docenteId_grupoId_areaId: {
        docenteId: Number(docenteId),
        grupoId: Number(grupoId),
        areaId: Number(areaId),
      },
    },
  });

  if (asignacionExistente) {
    throw new Error('Ya existe una asignación académica para este docente, grupo y área');
  }

  const asignacion = await prisma.asignacionAcademica.create({
    data: {
      docenteId: Number(docenteId),
      grupoId: Number(grupoId),
      areaId: Number(areaId),
    },
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
  });

  return asignacion;
};

const listarAsignacionesAcademicas = async (filtros = {}) => {
  const { docenteId, grupoId, areaId, activo } = filtros;

  const where = {};

  if (docenteId) {
    where.docenteId = Number(docenteId);
  }

  if (grupoId) {
    where.grupoId = Number(grupoId);
  }

  if (areaId) {
    where.areaId = Number(areaId);
  }

  if (activo !== undefined) {
    where.activo = activo === 'true';
  }

  const asignaciones = await prisma.asignacionAcademica.findMany({
    where,
    orderBy: {
      creadoEn: 'desc',
    },
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
  });

  return asignaciones;
};

const obtenerAsignacionAcademicaPorId = async (id) => {
  const asignacion = await prisma.asignacionAcademica.findUnique({
    where: {
      id: Number(id),
    },
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
  });

  if (!asignacion) {
    throw new Error('Asignación académica no encontrada');
  }

  return asignacion;
};

const listarAsignacionesPorDocente = async (docenteId) => {
  const asignaciones = await prisma.asignacionAcademica.findMany({
    where: {
      docenteId: Number(docenteId),
      activo: true,
    },
    orderBy: [
      {
        grupo: {
          nombre: 'asc',
        },
      },
      {
        area: {
          nombre: 'asc',
        },
      },
    ],
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
  });

  return asignaciones;
};

const actualizarAsignacionAcademica = async (id, datos) => {
  const { docenteId, grupoId, areaId, activo } = datos;

  const asignacionActual = await prisma.asignacionAcademica.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!asignacionActual) {
    throw new Error('Asignación académica no encontrada');
  }

  const data = {};

  if (docenteId !== undefined) {
    data.docenteId = Number(docenteId);
  }

  if (grupoId !== undefined) {
    data.grupoId = Number(grupoId);
  }

  if (areaId !== undefined) {
    data.areaId = Number(areaId);
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const docenteFinal = data.docenteId || asignacionActual.docenteId;
  const grupoFinal = data.grupoId || asignacionActual.grupoId;
  const areaFinal = data.areaId || asignacionActual.areaId;

  const duplicada = await prisma.asignacionAcademica.findUnique({
    where: {
      docenteId_grupoId_areaId: {
        docenteId: docenteFinal,
        grupoId: grupoFinal,
        areaId: areaFinal,
      },
    },
  });

  if (duplicada && duplicada.id !== Number(id)) {
    throw new Error('Ya existe una asignación académica para este docente, grupo y área');
  }

  const asignacionActualizada = await prisma.asignacionAcademica.update({
    where: {
      id: Number(id),
    },
    data,
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
  });

  return asignacionActualizada;
};

module.exports = {
  crearAsignacionAcademica,
  listarAsignacionesAcademicas,
  obtenerAsignacionAcademicaPorId,
  listarAsignacionesPorDocente,
  actualizarAsignacionAcademica,
};