const prisma = require('../../config/prisma');

const ESTADOS_PLAN_LECTOR = ['LEYENDO', 'FINALIZADO', 'ABANDONADO'];

const incluirLibro = {
  estudiante: {
    include: {
      grupo: true,
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
};

const obtenerEstudiantePorUsuario = async (usuarioId) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });

  if (!estudiante) {
    throw new Error('El usuario autenticado no tiene perfil de estudiante');
  }

  return estudiante;
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

const docentePuedeGestionarEstudiante = async (usuarioId, estudianteId) => {
  const docente = await obtenerDocentePorUsuario(usuarioId);

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  if (!estudiante.grupoId) {
    throw new Error('El estudiante no tiene grupo asignado');
  }

  const grupoDirigido = await prisma.grupo.findFirst({
    where: {
      id: Number(estudiante.grupoId),
      directorDocenteId: docente.id,
    },
  });

  if (grupoDirigido) {
    return estudiante;
  }

  const asignacion = await prisma.asignacionAcademica.findFirst({
    where: {
      docenteId: docente.id,
      grupoId: Number(estudiante.grupoId),
      activo: true,
    },
  });

  if (!asignacion) {
    throw new Error('No tienes permisos sobre este estudiante');
  }

  return estudiante;
};

const validarProgreso = (progreso) => {
  if (progreso === undefined || progreso === null) {
    return 0;
  }

  const numero = Number(progreso);

  if (Number.isNaN(numero) || numero < 0 || numero > 100) {
    throw new Error('El progreso debe estar entre 0 y 100');
  }

  return numero;
};

const validarEstado = (estado) => {
  if (!estado) {
    return 'LEYENDO';
  }

  if (!ESTADOS_PLAN_LECTOR.includes(estado)) {
    throw new Error('El estado no es válido');
  }

  return estado;
};

const crearLibro = async (datos, usuario) => {
  const nombre = datos.nombre?.trim();

  if (!nombre) {
    throw new Error('El nombre del libro es obligatorio');
  }

  let estudianteId;

  if (usuario.rol === 'ESTUDIANTE') {
    const estudiante = await obtenerEstudiantePorUsuario(usuario.id);
    estudianteId = estudiante.id;
  } else if (usuario.rol === 'DOCENTE') {
    if (!datos.estudianteId) {
      throw new Error('estudianteId es obligatorio');
    }

    const estudiante = await docentePuedeGestionarEstudiante(
      usuario.id,
      datos.estudianteId
    );

    estudianteId = estudiante.id;
  } else {
    throw new Error('No tienes permisos para crear libros');
  }

  const progreso = validarProgreso(datos.progreso);
  const estado = validarEstado(datos.estado);

  const libro = await prisma.planLectorLibro.create({
    data: {
      estudianteId,
      creadoPorUsuarioId: Number(usuario.id),
      nombre,
      autor: datos.autor?.trim() || null,
      progreso: estado === 'FINALIZADO' ? 100 : progreso,
      estado,
      fechaFinalizacion: estado === 'FINALIZADO' ? new Date() : null,
      resena: datos.resena?.trim() || null,
    },
    include: incluirLibro,
  });

  return libro;
};

const listarMisLibros = async (usuario) => {
  if (usuario.rol !== 'ESTUDIANTE') {
    throw new Error('Solo ESTUDIANTE puede consultar mis libros');
  }

  const estudiante = await obtenerEstudiantePorUsuario(usuario.id);

  const libros = await prisma.planLectorLibro.findMany({
    where: {
      estudianteId: estudiante.id,
    },
    orderBy: {
      fechaCreacion: 'desc',
    },
    include: incluirLibro,
  });

  return libros;
};

const obtenerLibroPorId = async (id, usuario) => {
  const libro = await prisma.planLectorLibro.findUnique({
    where: {
      id: Number(id),
    },
    include: incluirLibro,
  });

  if (!libro) {
    throw new Error('Libro no encontrado');
  }

  if (usuario.rol === 'ESTUDIANTE') {
    const estudiante = await obtenerEstudiantePorUsuario(usuario.id);

    if (Number(libro.estudianteId) !== Number(estudiante.id)) {
      throw new Error('No tienes permisos para consultar este libro');
    }

    return libro;
  }

  if (usuario.rol === 'DOCENTE') {
    await docentePuedeGestionarEstudiante(usuario.id, libro.estudianteId);
    return libro;
  }

  if (['COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'].includes(usuario.rol)) {
    return libro;
  }

  throw new Error('No tienes permisos para consultar este libro');
};

const actualizarLibro = async (id, datos, usuario) => {
  const libroActual = await obtenerLibroPorId(id, usuario);

  if (!['ESTUDIANTE', 'DOCENTE'].includes(usuario.rol)) {
    throw new Error('No tienes permisos para actualizar libros');
  }

  const data = {};

  if (datos.nombre !== undefined) {
    const nombre = datos.nombre?.trim();

    if (!nombre) {
      throw new Error('El nombre del libro no puede estar vacío');
    }

    data.nombre = nombre;
  }

  if (datos.autor !== undefined) {
    data.autor = datos.autor?.trim() || null;
  }

  if (datos.progreso !== undefined) {
    data.progreso = validarProgreso(datos.progreso);
  }

  if (datos.estado !== undefined) {
    const estado = validarEstado(datos.estado);
    data.estado = estado;

    if (estado === 'FINALIZADO') {
      data.progreso = 100;
      data.fechaFinalizacion = libroActual.fechaFinalizacion || new Date();
    }

    if (estado !== 'FINALIZADO') {
      data.fechaFinalizacion = null;
    }
  }

  if (datos.resena !== undefined) {
    data.resena = datos.resena?.trim() || null;
  }

  const libro = await prisma.planLectorLibro.update({
    where: {
      id: Number(id),
    },
    data,
    include: incluirLibro,
  });

  return libro;
};

const finalizarLibro = async (id, datos, usuario) => {
  const libroActual = await obtenerLibroPorId(id, usuario);

  if (!['ESTUDIANTE', 'DOCENTE'].includes(usuario.rol)) {
    throw new Error('No tienes permisos para finalizar libros');
  }

  const libro = await prisma.planLectorLibro.update({
    where: {
      id: Number(libroActual.id),
    },
    data: {
      progreso: 100,
      estado: 'FINALIZADO',
      fechaFinalizacion: new Date(),
      resena: datos.resena?.trim() || libroActual.resena || null,
    },
    include: incluirLibro,
  });

  return libro;
};

const listarLibrosPorEstudiante = async (estudianteId, usuario) => {
  if (usuario.rol === 'DOCENTE') {
    await docentePuedeGestionarEstudiante(usuario.id, estudianteId);
  } else if (!['COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'].includes(usuario.rol)) {
    throw new Error('No tienes permisos para consultar libros de este estudiante');
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  const libros = await prisma.planLectorLibro.findMany({
    where: {
      estudianteId: Number(estudianteId),
    },
    orderBy: {
      fechaCreacion: 'desc',
    },
    include: incluirLibro,
  });

  return libros;
};

const listarLibrosPorGrupo = async (grupoId, usuario) => {
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
        include: {
          planLectorLibros: {
            orderBy: {
              fechaCreacion: 'desc',
            },
          },
        },
      },
    },
  });

  if (!grupo) {
    throw new Error('Grupo no encontrado');
  }

  if (usuario.rol === 'DOCENTE') {
    const docente = await obtenerDocentePorUsuario(usuario.id);

    const grupoDirigido = Number(grupo.directorDocenteId) === Number(docente.id);

    const asignacion = await prisma.asignacionAcademica.findFirst({
      where: {
        docenteId: docente.id,
        grupoId: Number(grupoId),
        activo: true,
      },
    });

    if (!grupoDirigido && !asignacion) {
      throw new Error('No tienes permisos sobre este grupo');
    }
  } else if (!['COORDINADOR', 'DIRECTIVO', 'ADMINISTRATIVO'].includes(usuario.rol)) {
    throw new Error('No tienes permisos para consultar este grupo');
  }

  const estudiantes = grupo.estudiantes.map((estudiante) => {
    const libroActual =
      estudiante.planLectorLibros.find((libro) => libro.estado === 'LEYENDO') || null;

    return {
      id: estudiante.id,
      nombre: estudiante.nombre,
      documento: estudiante.documento,
      libroActual,
      libros: estudiante.planLectorLibros,
    };
  });

  return {
    grupo: {
      id: grupo.id,
      nombre: grupo.nombre,
      grado: grupo.grado,
    },
    estudiantes,
  };
};

const crearLibrosMasivosPorGrupo = async (grupoId, datos, usuario) => {
  if (usuario.rol !== 'DOCENTE') {
    throw new Error('Solo DOCENTE puede crear libros de forma masiva');
  }

  const docente = await obtenerDocentePorUsuario(usuario.id);

  const grupo = await prisma.grupo.findUnique({
    where: {
      id: Number(grupoId),
    },
  });

  if (!grupo) {
    throw new Error('Grupo no encontrado');
  }

  const grupoDirigido = Number(grupo.directorDocenteId) === Number(docente.id);

  const asignacion = await prisma.asignacionAcademica.findFirst({
    where: {
      docenteId: docente.id,
      grupoId: Number(grupoId),
      activo: true,
    },
  });

  if (!grupoDirigido && !asignacion) {
    throw new Error('No tienes permisos sobre este grupo');
  }

  if (!Array.isArray(datos.libros) || datos.libros.length === 0) {
    throw new Error('libros debe ser un arreglo no vacío');
  }

  const errores = [];

  for (const [index, libro] of datos.libros.entries()) {
    const posicion = index + 1;

    if (!libro.estudianteId) {
      errores.push({
        posicion,
        campo: 'estudianteId',
        error: 'estudianteId es obligatorio',
      });
    }

    if (!libro.nombre?.trim()) {
      errores.push({
        posicion,
        campo: 'nombre',
        error: 'El nombre del libro es obligatorio',
      });
    }

    if (
      libro.progreso !== undefined &&
      libro.progreso !== null &&
      (Number(libro.progreso) < 0 || Number(libro.progreso) > 100)
    ) {
      errores.push({
        posicion,
        campo: 'progreso',
        error: 'El progreso debe estar entre 0 y 100',
      });
    }

    if (libro.estado && !ESTADOS_PLAN_LECTOR.includes(libro.estado)) {
      errores.push({
        posicion,
        campo: 'estado',
        error: 'El estado no es válido',
      });
    }
  }

  const estudianteIds = [
    ...new Set(
      datos.libros
        .map((libro) => Number(libro.estudianteId))
        .filter(Boolean)
    ),
  ];

  const estudiantes = await prisma.estudiante.findMany({
    where: {
      id: {
        in: estudianteIds,
      },
      grupoId: Number(grupoId),
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
      documento: true,
    },
  });

  const estudiantesPorId = new Map(
    estudiantes.map((estudiante) => [estudiante.id, estudiante])
  );

  for (const [index, libro] of datos.libros.entries()) {
    const estudianteId = Number(libro.estudianteId);

    if (estudianteId && !estudiantesPorId.has(estudianteId)) {
      errores.push({
        posicion: index + 1,
        campo: 'estudianteId',
        error: 'El estudiante no existe o no pertenece al grupo',
      });
    }
  }

  if (errores.length > 0) {
    return {
      ok: false,
      total: datos.libros.length,
      creados: 0,
      errores,
    };
  }

  const creados = await prisma.$transaction(async (tx) => {
    const registros = [];

    for (const item of datos.libros) {
      const estado = item.estado || 'LEYENDO';

      const progreso =
        estado === 'FINALIZADO'
          ? 100
          : item.progreso !== undefined && item.progreso !== null
            ? Number(item.progreso)
            : 0;

      const libro = await tx.planLectorLibro.create({
        data: {
          estudianteId: Number(item.estudianteId),
          creadoPorUsuarioId: Number(usuario.id),
          nombre: item.nombre.trim(),
          autor: item.autor?.trim() || null,
          progreso,
          estado,
          fechaFinalizacion: estado === 'FINALIZADO' ? new Date() : null,
          resena: item.resena?.trim() || null,
        },
      });

      registros.push({
        estudiante: estudiantesPorId.get(Number(item.estudianteId)),
        libro,
      });
    }

    return registros;
  });

  return {
    ok: true,
    total: datos.libros.length,
    creados: creados.length,
    libros: creados,
    errores: [],
  };
};

module.exports = {
  crearLibro,
  listarMisLibros,
  obtenerLibroPorId,
  actualizarLibro,
  finalizarLibro,
  listarLibrosPorEstudiante,
  listarLibrosPorGrupo,
  crearLibrosMasivosPorGrupo,
};