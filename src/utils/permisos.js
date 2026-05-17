const prisma = require('../config/prisma');

const esAdministrativo = (usuario) => {
  return usuario.rol === 'ADMINISTRATIVO';
};

const obtenerDocentePorUsuario = async (usuarioId) => {
  return prisma.docente.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });
};

const obtenerEstudiantePorUsuario = async (usuarioId) => {
  return prisma.estudiante.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });
};

const obtenerAcudientePorUsuario = async (usuarioId) => {
  return prisma.acudiente.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });
};

const acudienteTieneEstudiante = async (usuarioId, estudianteId) => {
  const acudiente = await obtenerAcudientePorUsuario(usuarioId);

  if (!acudiente) {
    return false;
  }

  const relacion = await prisma.estudianteAcudiente.findFirst({
    where: {
      acudienteId: acudiente.id,
      estudianteId: Number(estudianteId),
    },
  });

  return Boolean(relacion);
};

const estudianteEsElMismoUsuario = async (usuarioId, estudianteId) => {
  const estudiante = await obtenerEstudiantePorUsuario(usuarioId);

  if (!estudiante) {
    return false;
  }

  return estudiante.id === Number(estudianteId);
};

const docentePuedeVerEstudiante = async (usuarioId, estudianteId) => {
  const docente = await obtenerDocentePorUsuario(usuarioId);

  if (!docente) {
    return false;
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: Number(estudianteId),
    },
  });

  if (!estudiante || !estudiante.grupoId) {
    return false;
  }

  const grupoDirigido = await prisma.grupo.findFirst({
    where: {
      id: estudiante.grupoId,
      directorDocenteId: docente.id,
    },
  });

  return Boolean(grupoDirigido);
};

const puedeVerEstudiante = async (usuario, estudianteId) => {
  if (esAdministrativo(usuario)) {
    return true;
  }

  if (usuario.rol === 'DOCENTE') {
    return docentePuedeVerEstudiante(usuario.id, estudianteId);
  }

  if (usuario.rol === 'ESTUDIANTE') {
    return estudianteEsElMismoUsuario(usuario.id, estudianteId);
  }

  if (usuario.rol === 'ACUDIENTE') {
    return acudienteTieneEstudiante(usuario.id, estudianteId);
  }

  return false;
};

const puedeVerAcudiente = async (usuario, acudienteId) => {
  if (esAdministrativo(usuario)) {
    return true;
  }

  if (usuario.rol === 'ACUDIENTE') {
    const acudiente = await obtenerAcudientePorUsuario(usuario.id);

    if (!acudiente) {
      return false;
    }

    return acudiente.id === Number(acudienteId);
  }

  return false;
};

module.exports = {
  esAdministrativo,
  puedeVerEstudiante,
  puedeVerAcudiente,
  obtenerDocentePorUsuario,
  obtenerEstudiantePorUsuario,
  obtenerAcudientePorUsuario,
};