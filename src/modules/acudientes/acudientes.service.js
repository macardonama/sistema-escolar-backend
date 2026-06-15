const prisma = require('../../config/prisma');

const crearAcudiente = async (datos) => {
  const { usuarioId, telefono } = datos;

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

  if (usuario.rol !== 'ACUDIENTE') {
    throw new Error('El usuario debe tener rol ACUDIENTE');
  }

  if (!usuario.activo) {
    throw new Error('El usuario está desactivado');
  }

  const acudienteExistente = await prisma.acudiente.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });

  if (acudienteExistente) {
    throw new Error('Este usuario ya está registrado como acudiente');
  }

  const acudiente = await prisma.acudiente.create({
    data: {
      usuarioId: Number(usuarioId),
      nombre: usuario.nombre,
      correo: usuario.correo,
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
      estudiantes: {
        include: {
          estudiante: {
            include: {
              grupo: true,
            },
          },
        },
      },
    },
  });

  return acudiente;
};
const listarAcudientes = async () => {
  const acudientes = await prisma.acudiente.findMany({
    orderBy: {
      nombre: 'asc',
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
      estudiantes: {
        include: {
          estudiante: {
            include: {
              grupo: true,
            },
          },
        },
      },
    },
  });

  return acudientes;
};

const obtenerAcudientePorId = async (id) => {
  const acudiente = await prisma.acudiente.findUnique({
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
      estudiantes: {
        include: {
          estudiante: {
            include: {
              grupo: true,
            },
          },
        },
      },
    },
  });

  if (!acudiente) {
    throw new Error('Acudiente no encontrado');
  }

  return acudiente;
};

const actualizarAcudiente = async (id, datos) => {
  const { nombre, telefono, correo } = datos;

  const acudiente = await prisma.acudiente.update({
    where: {
      id: Number(id),
    },
    data: {
      nombre,
      telefono,
      correo,
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

  return acudiente;
};

const asociarEstudiante = async (datos) => {
  const { estudianteId, acudienteId, parentesco } = datos;

  if (!estudianteId || !acudienteId) {
    throw new Error('estudianteId y acudienteId son obligatorios');
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { id: Number(estudianteId) },
  });

  if (!estudiante) {
    throw new Error('El estudiante no existe');
  }

  const acudiente = await prisma.acudiente.findUnique({
    where: { id: Number(acudienteId) },
  });

  if (!acudiente) {
    throw new Error('El acudiente no existe');
  }

  const relacion = await prisma.estudianteAcudiente.create({
    data: {
      estudianteId: Number(estudianteId),
      acudienteId: Number(acudienteId),
      parentesco,
    },
    include: {
      estudiante: {
        include: {
          grupo: true,
        },
      },
      acudiente: true,
    },
  });

  return relacion;
};

const desasociarEstudiante = async (datos) => {
  const { estudianteId, acudienteId } = datos;

  if (!estudianteId || !acudienteId) {
    throw new Error('estudianteId y acudienteId son obligatorios');
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
  });

  if (!estudiante) {
    throw new Error('El estudiante no existe');
  }

  const acudiente = await prisma.acudiente.findUnique({
    where: {
      id: Number(acudienteId),
    },
  });

  if (!acudiente) {
    throw new Error('El acudiente no existe');
  }

  const relacion = await prisma.estudianteAcudiente.findFirst({
    where: {
      estudianteId: Number(estudianteId),
      acudienteId: Number(acudienteId),
    },
  });

  if (!relacion) {
    throw new Error('El estudiante no está asociado a este acudiente');
  }

  await prisma.estudianteAcudiente.delete({
    where: {
      id: relacion.id,
    },
  });

  return relacion;
};

module.exports = {
  crearAcudiente,
  listarAcudientes,
  obtenerAcudientePorId,
  actualizarAcudiente,
  asociarEstudiante,
  desasociarEstudiante,
};