const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');

const login = async ({ correo, password }) => {
  if (!correo || !password) {
    throw new Error('Correo y contraseña son obligatorios');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!usuario) {
    throw new Error('Credenciales incorrectas');
  }

  if (!usuario.activo) {
    throw new Error('El usuario está desactivado');
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) {
    throw new Error('Credenciales incorrectas');
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h',
    }
  );

  const { password: _, ...usuarioSinPassword } = usuario;

  return {
    token,
    usuario: usuarioSinPassword,
  };
};

const obtenerPerfil = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: Number(usuarioId),
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

module.exports = {
  login,
  obtenerPerfil,
};