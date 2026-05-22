const prisma = require('../../config/prisma');

const crearEstudiante = async (datos) => {
  const { nombre, documento, grupoId, usuarioId } = datos;

  let nombreFinal = nombre?.trim();

  if (grupoId) {
    const grupo = await prisma.grupo.findUnique({
      where: { id: Number(grupoId) },
    });

    if (!grupo) {
      throw new Error('El grupo no existe');
    }
  }

  if (usuarioId) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
    });

    if (!usuario) {
      throw new Error('El usuario no existe');
    }

    if (usuario.rol !== 'ESTUDIANTE') {
      throw new Error('El usuario debe tener rol ESTUDIANTE');
    }

    if (!usuario.activo) {
      throw new Error('El usuario está desactivado');
    }

    if (!nombreFinal) {
      nombreFinal = usuario.nombre;
    }
  }

  if (!nombreFinal) {
    throw new Error('El nombre del estudiante es obligatorio si no se envía usuarioId');
  }

  const estudiante = await prisma.estudiante.create({
    data: {
      nombre: nombreFinal,
      documento,
      grupoId: grupoId ? Number(grupoId) : null,
      usuarioId: usuarioId ? Number(usuarioId) : null,
    },
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
  });

  return estudiante;
};
const listarEstudiantes = async () => {
  const estudiantes = await prisma.estudiante.findMany({
    orderBy: {
      nombre: 'asc',
    },
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
  });

  return estudiantes;
};

const obtenerEstudiantePorId = async (id) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(id),
    },
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
      acudientes: {
        include: {
          acudiente: true,
        },
      },
      asistencias: true,
      observaciones: true,
    },
  });

  if (!estudiante) {
    throw new Error('Estudiante no encontrado');
  }

  return estudiante;
};

const actualizarEstudiante = async (id, datos) => {
  const { nombre, documento, grupoId, activo } = datos;

  if (grupoId) {
    const grupo = await prisma.grupo.findUnique({
      where: { id: Number(grupoId) },
    });

    if (!grupo) {
      throw new Error('El grupo no existe');
    }
  }

  const estudiante = await prisma.estudiante.update({
    where: {
      id: Number(id),
    },
    data: {
      nombre,
      documento,
      grupoId: grupoId ? Number(grupoId) : undefined,
      activo,
    },
    include: {
      grupo: true,
    },
  });

  return estudiante;
};

const desactivarEstudiante = async (id) => {
  const estudiante = await prisma.estudiante.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: false,
    },
  });

  return estudiante;
};

module.exports = {
  crearEstudiante,
  listarEstudiantes,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  desactivarEstudiante,
};