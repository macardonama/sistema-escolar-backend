const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');

const crearUsuario = async (datos) => {
  const { nombre, correo, password, rol } = datos;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (usuarioExistente) {
    throw new Error('Ya existe un usuario con este correo');
  }

  const passwordEncriptada = await bcrypt.hash(password, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      password: passwordEncriptada,
      rol,
    },
  });

  const { password: _, ...usuarioSinPassword } = nuevoUsuario;

  return usuarioSinPassword;
};

const listarUsuarios = async () => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      creadoEn: 'desc',
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      creadoEn: true,
      actualizadoEn: true,
    },
  });

  return usuarios;
};

const obtenerUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      creadoEn: true,
      actualizadoEn: true,
    },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return usuario;
};

const actualizarUsuario = async (id, datos) => {
  const { nombre, correo, rol, activo } = datos;

  const usuarioActualizado = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data: {
      nombre,
      correo,
      rol,
      activo,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      creadoEn: true,
      actualizadoEn: true,
    },
  });

  return usuarioActualizado;
};

const desactivarUsuario = async (id) => {
  const usuario = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: false,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
    },
  });

  return usuario;
};

const activarUsuario = async (id) => {
  const usuario = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
    },
  });

  return usuario;
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario
};