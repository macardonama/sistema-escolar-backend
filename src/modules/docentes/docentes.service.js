const prisma = require('../../config/prisma');

const crearDocente = async (datos) => {
  const { usuarioId, documento, telefono } = datos;

  if (!usuarioId) {
    throw new Error('El usuarioId es obligatorio');
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: Number(usuarioId),
    },
  });

  if (!usuario) {
    throw new Error('El usuario no existe');
  }

  if (usuario.rol !== 'DOCENTE') {
    throw new Error('El usuario debe tener rol DOCENTE');
  }

  const docenteExistente = await prisma.docente.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });

  if (docenteExistente) {
    throw new Error('Este usuario ya está registrado como docente');
  }

  const docente = await prisma.docente.create({
    data: {
      usuarioId: Number(usuarioId),
      documento,
      telefono,
    },
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
  });

  return docente;
};

const listarDocentes = async () => {
  const docentes = await prisma.docente.findMany({
    orderBy: {
      creadoEn: 'desc',
    },
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
  });

  return docentes;
};

const obtenerDocentePorId = async (id) => {
  const docente = await prisma.docente.findUnique({
    where: {
      id: Number(id),
    },
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
      gruposDirigidos: true,
    },
  });

  if (!docente) {
    throw new Error('Docente no encontrado');
  }

  return docente;
};

const actualizarDocente = async (id, datos) => {
  const { documento, telefono } = datos;

  const docente = await prisma.docente.update({
    where: {
      id: Number(id),
    },
    data: {
      documento,
      telefono,
    },
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
  });

  return docente;
};

module.exports = {
  crearDocente,
  listarDocentes,
  obtenerDocentePorId,
  actualizarDocente,
};