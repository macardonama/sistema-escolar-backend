const prisma = require('../../config/prisma');

const crearGrupo = async (datos) => {
  const { nombre, grado, directorDocenteId } = datos;

  if (!nombre) {
    throw new Error('El nombre del grupo es obligatorio');
  }

  const grupoExistente = await prisma.grupo.findFirst({
    where: {
      nombre,
    },
  });

  if (grupoExistente) {
    throw new Error('Ya existe un grupo con este nombre');
  }

  const nuevoGrupo = await prisma.grupo.create({
    data: {
      nombre,
      grado,
      directorDocenteId: directorDocenteId ? Number(directorDocenteId) : null,
    },
  });

  return nuevoGrupo;
};

const listarGrupos = async () => {
  const grupos = await prisma.grupo.findMany({
    orderBy: {
      nombre: 'asc',
    },
    include: {
      directorDocente: {
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
    },
  });

  return grupos;
};

const obtenerGrupoPorId = async (id) => {
  const grupo = await prisma.grupo.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      directorDocente: {
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
      estudiantes: true,
    },
  });

  if (!grupo) {
    throw new Error('Grupo no encontrado');
  }

  return grupo;
};

const actualizarGrupo = async (id, datos) => {
  const { nombre, grado, directorDocenteId, activo } = datos;

  const grupoActualizado = await prisma.grupo.update({
    where: {
      id: Number(id),
    },
    data: {
      nombre,
      grado,
      directorDocenteId: directorDocenteId ? Number(directorDocenteId) : null,
      activo,
    },
  });

  return grupoActualizado;
};

const desactivarGrupo = async (id) => {
  const grupo = await prisma.grupo.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: false,
    },
  });

  return grupo;
};

module.exports = {
  crearGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  desactivarGrupo,
};