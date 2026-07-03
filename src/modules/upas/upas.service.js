const prisma = require('../../config/prisma');

const ESTADOS_UPA = [
  'BORRADOR',
  'ENVIADA',
  'EN_REVISION',
  'REQUIERE_AJUSTES',
  'APROBADA',
];

const incluirRelaciones = {
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
  asignacionAcademica: {
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
      area: true,
    },
  },
  semanas: {
    orderBy: {
      numeroSemana: 'asc',
    },
  },
  retroalimentaciones: {
    orderBy: {
      creadoEn: 'desc',
    },
    include: {
      coordinadorUsuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
        },
      },
    },
  },
};

const obtenerDocentePorUsuario = async (usuarioId) => {
  const docente = await prisma.docente.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });

  if (!docente) {
    throw new Error('El usuario autenticado no tiene perfil de docente');
  }

  return docente;
};

const validarSemanas = (semanas) => {
  if (!Array.isArray(semanas) || semanas.length === 0) {
    throw new Error('semanas debe ser un arreglo no vacío');
  }

  const numeros = new Set();

  for (const semana of semanas) {
    const numeroSemana = Number(semana.numeroSemana);
    const detalle = semana.detalle?.trim();

    if (!numeroSemana) {
      throw new Error('Cada semana debe tener numeroSemana');
    }

    if (!detalle) {
      throw new Error('Cada semana debe tener detalle');
    }

    if (numeros.has(numeroSemana)) {
      throw new Error('No debe haber numeroSemana repetido dentro de la misma UPA');
    }

    numeros.add(numeroSemana);
  }
};

const validarRelaciones = async ({ docenteId, grupoId, areaId, asignacionAcademicaId }) => {
  if (!docenteId) {
    throw new Error('docenteId es obligatorio');
  }

  const docente = await prisma.docente.findUnique({
    where: {
      id: Number(docenteId),
    },
  });

  if (!docente) {
    throw new Error('El docente no existe');
  }

  if (grupoId) {
    const grupo = await prisma.grupo.findUnique({
      where: {
        id: Number(grupoId),
      },
    });

    if (!grupo) {
      throw new Error('El grupo no existe');
    }
  }

  if (areaId) {
    const area = await prisma.area.findUnique({
      where: {
        id: Number(areaId),
      },
    });

    if (!area) {
      throw new Error('El área no existe');
    }
  }

  if (asignacionAcademicaId) {
    const asignacion = await prisma.asignacionAcademica.findUnique({
      where: {
        id: Number(asignacionAcademicaId),
      },
    });

    if (!asignacion) {
      throw new Error('La asignación académica no existe');
    }

    if (Number(asignacion.docenteId) !== Number(docenteId)) {
      throw new Error('La asignación académica no pertenece al docente indicado');
    }

    if (grupoId && Number(asignacion.grupoId) !== Number(grupoId)) {
      throw new Error('La asignación académica no pertenece al grupo indicado');
    }

    if (areaId && Number(asignacion.areaId) !== Number(areaId)) {
      throw new Error('La asignación académica no pertenece al área indicada');
    }
  }
};

const verificarAccesoUpa = async (upa, usuario) => {
  if (['ADMINISTRATIVO', 'DIRECTIVO', 'COORDINADOR'].includes(usuario.rol)) {
    return;
  }

  if (usuario.rol === 'DOCENTE') {
    const docente = await obtenerDocentePorUsuario(usuario.id);

    if (Number(upa.docenteId) !== Number(docente.id)) {
      throw new Error('No tienes permisos para consultar esta UPA');
    }

    return;
  }

  throw new Error('No tienes permisos para consultar esta UPA');
};

const crearUpa = async (datos, usuario) => {
  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede crear UPA');
  }

  const nombre = datos.nombre?.trim();
  const mision = datos.mision?.trim();

  if (!nombre) {
    throw new Error('El nombre es obligatorio');
  }

  if (!mision) {
    throw new Error('La misión es obligatoria');
  }

  validarSemanas(datos.semanas);

  const docenteAutenticado = await obtenerDocentePorUsuario(usuario.id);
  const docenteId = Number(datos.docenteId);

  if (!docenteId) {
    throw new Error('docenteId es obligatorio');
  }

  if (docenteId !== Number(docenteAutenticado.id)) {
    throw new Error('No puedes crear UPA para otro docente');
  }

  await validarRelaciones({
    docenteId,
    grupoId: datos.grupoId,
    areaId: datos.areaId,
    asignacionAcademicaId: datos.asignacionAcademicaId,
  });

  const upa = await prisma.upa.create({
    data: {
      nombre,
      mision,
      salidaPedagogicaTexto: datos.salidaPedagogicaTexto?.trim() || null,
      semanasNumero: datos.semanas.length,
      docenteId,
      grupoId: datos.grupoId ? Number(datos.grupoId) : null,
      areaId: datos.areaId ? Number(datos.areaId) : null,
      asignacionAcademicaId: datos.asignacionAcademicaId
        ? Number(datos.asignacionAcademicaId)
        : null,
      semanas: {
        create: datos.semanas.map((semana) => ({
          numeroSemana: Number(semana.numeroSemana),
          detalle: semana.detalle.trim(),
        })),
      },
    },
    include: incluirRelaciones,
  });

  return upa;
};

const listarUpas = async (usuario, filtros = {}) => {
  const where = {};

  if (filtros.estado && ESTADOS_UPA.includes(filtros.estado)) {
    where.estado = filtros.estado;
  }

  if (usuario.rol === 'DOCENTE') {
    const docente = await obtenerDocentePorUsuario(usuario.id);
    where.docenteId = docente.id;
  }

  if (usuario.rol === 'COORDINADOR' && !filtros.estado) {
    where.estado = {
      in: ['ENVIADA', 'EN_REVISION'],
    };
  }

  const upas = await prisma.upa.findMany({
    where,
    orderBy: {
      actualizadoEn: 'desc',
    },
    include: incluirRelaciones,
  });

  return upas;
};

const obtenerUpaPorId = async (id, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
    include: incluirRelaciones,
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await verificarAccesoUpa(upa, usuario);

  if (usuario.rol === 'COORDINADOR' && upa.estado === 'ENVIADA') {
    return prisma.upa.update({
      where: {
        id: Number(id),
      },
      data: {
        estado: 'EN_REVISION',
      },
      include: incluirRelaciones,
    });
  }

  return upa;
};

const actualizarUpa = async (id, datos, usuario) => {
  const upaActual = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upaActual) {
    throw new Error('UPA no encontrada');
  }

  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede editar UPA');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  if (Number(upaActual.docenteId) !== Number(docente.id)) {
    throw new Error('No puedes editar una UPA de otro docente');
  }

  if (!['BORRADOR', 'REQUIERE_AJUSTES'].includes(upaActual.estado)) {
    throw new Error('Solo se pueden editar UPAS en estado BORRADOR o REQUIERE_AJUSTES');
  }

  if (upaActual.estado === 'APROBADA') {
    throw new Error('Una UPA aprobada no puede editarse');
  }

  const nombre = datos.nombre?.trim();
  const mision = datos.mision?.trim();

  if (!nombre) {
    throw new Error('El nombre es obligatorio');
  }

  if (!mision) {
    throw new Error('La misión es obligatoria');
  }

  validarSemanas(datos.semanas);

  await validarRelaciones({
    docenteId: upaActual.docenteId,
    grupoId: datos.grupoId,
    areaId: datos.areaId,
    asignacionAcademicaId: datos.asignacionAcademicaId,
  });

  const upa = await prisma.$transaction(async (tx) => {
    await tx.upaSemana.deleteMany({
      where: {
        upaId: Number(id),
      },
    });

    return tx.upa.update({
      where: {
        id: Number(id),
      },
      data: {
        nombre,
        mision,
        salidaPedagogicaTexto: datos.salidaPedagogicaTexto?.trim() || null,
        semanasNumero: datos.semanas.length,
        grupoId: datos.grupoId ? Number(datos.grupoId) : null,
        areaId: datos.areaId ? Number(datos.areaId) : null,
        asignacionAcademicaId: datos.asignacionAcademicaId
          ? Number(datos.asignacionAcademicaId)
          : null,
        semanas: {
          create: datos.semanas.map((semana) => ({
            numeroSemana: Number(semana.numeroSemana),
            detalle: semana.detalle.trim(),
          })),
        },
      },
      include: incluirRelaciones,
    });
  });

  return upa;
};

const enviarUpa = async (id, usuario) => {
  const upaActual = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upaActual) {
    throw new Error('UPA no encontrada');
  }

  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede enviar UPA para revisión');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  if (Number(upaActual.docenteId) !== Number(docente.id)) {
    throw new Error('No puedes enviar una UPA de otro docente');
  }

  if (!['BORRADOR', 'REQUIERE_AJUSTES'].includes(upaActual.estado)) {
    throw new Error('Solo se pueden enviar UPAS en estado BORRADOR o REQUIERE_AJUSTES');
  }

  const upa = await prisma.upa.update({
    where: {
      id: Number(id),
    },
    data: {
      estado: 'ENVIADA',
    },
    include: incluirRelaciones,
  });

  return upa;
};

const aprobarUpa = async (id) => {
  const upaActual = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upaActual) {
    throw new Error('UPA no encontrada');
  }

  if (upaActual.estado === 'APROBADA') {
    throw new Error('La UPA ya está aprobada');
  }

  const upa = await prisma.upa.update({
    where: {
      id: Number(id),
    },
    data: {
      estado: 'APROBADA',
    },
    include: incluirRelaciones,
  });

  return upa;
};

const requerirAjustesUpa = async (id) => {
  const upaActual = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upaActual) {
    throw new Error('UPA no encontrada');
  }

  if (upaActual.estado === 'APROBADA') {
    throw new Error('Una UPA aprobada no puede pasar a requiere ajustes');
  }

  const upa = await prisma.upa.update({
    where: {
      id: Number(id),
    },
    data: {
      estado: 'REQUIERE_AJUSTES',
    },
    include: incluirRelaciones,
  });

  return upa;
};

const crearRetroalimentacion = async (id, datos, usuario) => {
  const comentario = datos.comentario?.trim();

  if (!comentario) {
    throw new Error('El comentario es obligatorio');
  }

  if (datos.estadoSugerido && !ESTADOS_UPA.includes(datos.estadoSugerido)) {
    throw new Error('El estado sugerido no es válido');
  }

  const upa = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  const retroalimentacion = await prisma.upaRetroalimentacion.create({
    data: {
      upaId: Number(id),
      coordinadorUsuarioId: Number(usuario.id),
      comentario,
      estadoSugerido: datos.estadoSugerido || null,
    },
    include: {
      coordinadorUsuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
        },
      },
    },
  });

  return retroalimentacion;
};

const listarRetroalimentaciones = async (id, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await verificarAccesoUpa(upa, usuario);

  const retroalimentaciones = await prisma.upaRetroalimentacion.findMany({
    where: {
      upaId: Number(id),
    },
    orderBy: {
      creadoEn: 'desc',
    },
    include: {
      coordinadorUsuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
        },
      },
    },
  });

  return retroalimentaciones;
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