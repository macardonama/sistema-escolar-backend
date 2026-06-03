const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');

const crearUsuario = async (datos) => {
  const { nombre, correo, password, rol } = datos;

  const nombreLimpio = nombre?.trim();
  const correoLimpio = correo?.trim();
  const passwordLimpio = password?.trim();
  const rolLimpio = rol?.trim();

  if (!nombreLimpio) {
    throw new Error('El nombre es obligatorio');
  }

  if (!correoLimpio) {
    throw new Error('El correo es obligatorio');
  }

  if (!passwordLimpio) {
    throw new Error('La contraseña es obligatoria');
  }

  if (!rolLimpio) {
    throw new Error('El rol es obligatorio');
  }

  const rolesValidos = ['ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'];

  if (!rolesValidos.includes(rolLimpio)) {
    throw new Error('El rol no es válido');
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      correo: correoLimpio,
    },
  });

  if (usuarioExistente) {
    throw new Error('Ya existe un usuario con este correo');
  }

  const passwordEncriptada = await bcrypt.hash(passwordLimpio, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre: nombreLimpio,
      correo: correoLimpio,
      password: passwordEncriptada,
      rol: rolLimpio,
    },
  });

  const { password: _, ...usuarioSinPassword } = nuevoUsuario;

  return usuarioSinPassword;
};

const listarUsuarios = async (filtros = {}) => {
  const { rol, activo } = filtros;

  const where = {};

  if (rol) {
    where.rol = rol;
  }

  if (activo !== undefined) {
    where.activo = activo === 'true';
  }

  const usuarios = await prisma.usuario.findMany({
    where,
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

  const usuarioActual = await prisma.usuario.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!usuarioActual) {
    throw new Error('Usuario no encontrado');
  }

  const data = {};

  if (nombre !== undefined) {
    const nombreLimpio = nombre?.trim();

    if (!nombreLimpio) {
      throw new Error('El nombre no puede estar vacío');
    }

    data.nombre = nombreLimpio;
  }

  if (correo !== undefined) {
    const correoLimpio = correo?.trim();

    if (!correoLimpio) {
      throw new Error('El correo no puede estar vacío');
    }

    const usuarioConCorreo = await prisma.usuario.findUnique({
      where: {
        correo: correoLimpio,
      },
    });

    if (usuarioConCorreo && usuarioConCorreo.id !== Number(id)) {
      throw new Error('Ya existe un usuario con este correo');
    }

    data.correo = correoLimpio;
  }

  if (rol !== undefined) {
    const rolLimpio = rol?.trim();

    if (!rolLimpio) {
      throw new Error('El rol no puede estar vacío');
    }

    const rolesValidos = ['ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'ACUDIENTE'];

    if (!rolesValidos.includes(rolLimpio)) {
      throw new Error('El rol no es válido');
    }

    data.rol = rolLimpio;
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const usuarioActualizado = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data,
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