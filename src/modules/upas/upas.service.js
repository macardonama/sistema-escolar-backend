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
  retos: {
        orderBy: {
    numero: 'asc',
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
  const validarRetos = (retos = []) => {
  if (!Array.isArray(retos)) {
    throw new Error('retos debe ser un arreglo');
  }

  const numeros = new Set();

  for (const reto of retos) {
    const numero = Number(reto.numero);
    const nombre = reto.nombre?.trim();

    if (!numero) {
      throw new Error('Cada reto debe tener número');
    }

    if (!nombre) {
      throw new Error('Cada reto debe tener nombre');
    }

    if (numeros.has(numero)) {
      throw new Error('No debe haber retos repetidos dentro de la misma UPA');
    }

    numeros.add(numero);
  }
};
validarRetos(datos.retos || []);

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
      retos: {
      create: (datos.retos || []).map((reto) => ({
      numero: Number(reto.numero),
      nombre: reto.nombre.trim(),
      descripcion: reto.descripcion?.trim() || null,
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

const validarUpaEditablePorDocente = async (upa, usuario) => {
  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede modificar esta información');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  if (Number(upa.docenteId) !== Number(docente.id)) {
    throw new Error('No puedes modificar una UPA de otro docente');
  }

  if (!['BORRADOR', 'REQUIERE_AJUSTES'].includes(upa.estado)) {
    throw new Error('Solo se puede modificar una UPA en BORRADOR o REQUIERE_AJUSTES');
  }
};

const validarRetoPerteneceAUpa = async (upaId, retoId) => {
  const reto = await prisma.upaReto.findUnique({
    where: {
      id: Number(retoId),
    },
  });

  if (!reto) {
    throw new Error('Reto no encontrado');
  }

  if (Number(reto.upaId) !== Number(upaId)) {
    throw new Error('El reto no pertenece a esta UPA');
  }

  return reto;
};

const validarEstudiantePerteneceAGrupoUpa = async (upa, estudianteId) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  if (upa.grupoId && Number(estudiante.grupoId) !== Number(upa.grupoId)) {
    throw new Error('El estudiante no pertenece al grupo de la UPA');
  }

  return estudiante;
};


const crearRetoUpa = async (upaId, datos, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await validarUpaEditablePorDocente(upa, usuario);

  const numero = Number(datos.numero);
  const nombre = datos.nombre?.trim();

  if (!numero) {
    throw new Error('El número del reto es obligatorio');
  }

  if (!nombre) {
    throw new Error('El nombre del reto es obligatorio');
  }

  const reto = await prisma.upaReto.create({
    data: {
      upaId: Number(upaId),
      numero,
      nombre,
      descripcion: datos.descripcion?.trim() || null,
    },
  });

  return reto;
};

const listarRetosUpa = async (upaId, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await verificarAccesoUpa(upa, usuario);

  const retos = await prisma.upaReto.findMany({
    where: {
      upaId: Number(upaId),
    },
    orderBy: {
      numero: 'asc',
    },
  });

  return retos;
};

const actualizarRetoUpa = async (upaId, retoId, datos, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await validarUpaEditablePorDocente(upa, usuario);

  await validarRetoPerteneceAUpa(upaId, retoId);

  const numero = Number(datos.numero);
  const nombre = datos.nombre?.trim();

  if (!numero) {
    throw new Error('El número del reto es obligatorio');
  }

  if (!nombre) {
    throw new Error('El nombre del reto es obligatorio');
  }

  const reto = await prisma.upaReto.update({
    where: {
      id: Number(retoId),
    },
    data: {
      numero,
      nombre,
      descripcion: datos.descripcion?.trim() || null,
    },
  });

  return reto;
};

const eliminarRetoUpa = async (upaId, retoId, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await validarUpaEditablePorDocente(upa, usuario);

  await validarRetoPerteneceAUpa(upaId, retoId);

  await prisma.upaRetoCumplimiento.deleteMany({
    where: {
      retoId: Number(retoId),
    },
  });

  const reto = await prisma.upaReto.delete({
    where: {
      id: Number(retoId),
    },
  });

  return reto;
};

const registrarCumplimientoReto = async (upaId, retoId, estudianteId, datos, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede registrar cumplimiento');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  if (Number(upa.docenteId) !== Number(docente.id)) {
    throw new Error('No puedes registrar cumplimiento en una UPA de otro docente');
  }

  if (upa.estado === 'APROBADA') {
    throw new Error('No se puede registrar cumplimiento en una UPA aprobada');
  }

  await validarRetoPerteneceAUpa(upaId, retoId);

  await validarEstudiantePerteneceAGrupoUpa(upa, estudianteId);

  if (typeof datos.cumple !== 'boolean') {
    throw new Error('cumple debe ser true o false');
  }

  const cumplimiento = await prisma.upaRetoCumplimiento.upsert({
    where: {
      retoId_estudianteId: {
        retoId: Number(retoId),
        estudianteId: Number(estudianteId),
      },
    },
    update: {
      cumple: datos.cumple,
      observacion: datos.observacion?.trim() || null,
      registradoPorUsuarioId: Number(usuario.id),
    },
    create: {
      retoId: Number(retoId),
      estudianteId: Number(estudianteId),
      cumple: datos.cumple,
      observacion: datos.observacion?.trim() || null,
      registradoPorUsuarioId: Number(usuario.id),
    },
  });

  return cumplimiento;
};

const registrarCumplimientosMasivos = async (upaId, datos, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: { id: Number(upaId) },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede registrar cumplimientos');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  if (Number(upa.docenteId) !== Number(docente.id)) {
    throw new Error('No puedes registrar cumplimientos en una UPA de otro docente');
  }

  if (upa.estado === 'APROBADA') {
    throw new Error('No se puede registrar cumplimiento en una UPA aprobada');
  }

  if (!Array.isArray(datos.cumplimientos) || datos.cumplimientos.length === 0) {
    throw new Error('cumplimientos debe ser un arreglo no vacío');
  }

  const resultado = await prisma.$transaction(async (tx) => {
    const registros = [];

    for (const item of datos.cumplimientos) {
      if (typeof item.cumple !== 'boolean') {
        throw new Error('cumple debe ser true o false');
      }

      const reto = await tx.upaReto.findUnique({
        where: {
          id: Number(item.retoId),
        },
      });

      if (!reto || Number(reto.upaId) !== Number(upaId)) {
        throw new Error('Uno de los retos no pertenece a esta UPA');
      }

      const estudiante = await tx.estudiante.findUnique({
        where: {
          id: Number(item.estudianteId),
        },
      });

      if (!estudiante) {
        throw new Error('Uno de los estudiantes no existe');
      }

      if (upa.grupoId && Number(estudiante.grupoId) !== Number(upa.grupoId)) {
        throw new Error('Uno de los estudiantes no pertenece al grupo de la UPA');
      }

      const cumplimiento = await tx.upaRetoCumplimiento.upsert({
        where: {
          retoId_estudianteId: {
            retoId: Number(item.retoId),
            estudianteId: Number(item.estudianteId),
          },
        },
        update: {
          cumple: item.cumple,
          observacion: item.observacion?.trim() || null,
          registradoPorUsuarioId: Number(usuario.id),
        },
        create: {
          retoId: Number(item.retoId),
          estudianteId: Number(item.estudianteId),
          cumple: item.cumple,
          observacion: item.observacion?.trim() || null,
          registradoPorUsuarioId: Number(usuario.id),
        },
      });

      registros.push(cumplimiento);
    }

    return registros;
  });

  return resultado;
};

const obtenerAvanceUpa = async (upaId, usuario) => {
  const upa = await prisma.upa.findUnique({
    where: {
      id: Number(upaId),
    },
    include: {
      grupo: {
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
      },
      retos: {
        orderBy: {
          numero: 'asc',
        },
        include: {
          cumplimientos: true,
        },
      },
    },
  });

  if (!upa) {
    throw new Error('UPA no encontrada');
  }

  await verificarAccesoUpa(upa, usuario);

  const estudiantes = upa.grupo?.estudiantes || [];
  const totalRetos = upa.retos.length;

  const estudiantesConAvance = estudiantes.map((estudiante) => {
    const cumplimientos = upa.retos.map((reto) => {
      const cumplimiento = reto.cumplimientos.find(
        (item) => Number(item.estudianteId) === Number(estudiante.id)
      );

      return {
        retoId: reto.id,
        numero: reto.numero,
        nombre: reto.nombre,
        cumple: cumplimiento?.cumple || false,
        observacion: cumplimiento?.observacion || null,
      };
    });

    const retosCumplidos = cumplimientos.filter((item) => item.cumple).length;

    return {
      id: estudiante.id,
      nombre: estudiante.nombre,
      documento: estudiante.documento,
      totalRetos,
      retosCumplidos,
      porcentaje: totalRetos > 0 ? Math.round((retosCumplidos / totalRetos) * 100) : 0,
      cumplimientos,
    };
  });

  return {
    upa: {
      id: upa.id,
      nombre: upa.nombre,
      estado: upa.estado,
      grupo: upa.grupo
        ? {
            id: upa.grupo.id,
            nombre: upa.grupo.nombre,
            grado: upa.grupo.grado,
          }
        : null,
    },
    retos: upa.retos.map((reto) => ({
      id: reto.id,
      numero: reto.numero,
      nombre: reto.nombre,
      descripcion: reto.descripcion,
    })),
    estudiantes: estudiantesConAvance,
  };
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
    crearRetoUpa,
    listarRetosUpa,
    actualizarRetoUpa,
    eliminarRetoUpa,
    registrarCumplimientoReto,
    registrarCumplimientosMasivos,
    obtenerAvanceUpa,
};