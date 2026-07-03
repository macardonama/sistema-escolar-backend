const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');
const XLSX = require('xlsx');
const rolesValidos = [
  'ADMINISTRATIVO',
  'DIRECTIVO',
  'DOCENTE',
  'ESTUDIANTE',
  'ACUDIENTE',
  'PSICORIENTADOR',
  'COORDINADOR'
];

const normalizarTexto = (valor) => {
  if (valor === undefined || valor === null) return '';
  return String(valor).trim();
};

const normalizarRol = (valor) => normalizarTexto(valor).toUpperCase();

const normalizarNumero = (valor) => {
  const texto = normalizarTexto(valor);
  if (!texto) return null;

  const numero = Number(texto);
  return Number.isNaN(numero) ? null : numero;
};

const leerUsuariosDesdeArchivo = (archivo) => {
  if (!archivo) {
    throw new Error('El archivo es obligatorio');
  }

  const workbook = XLSX.read(archivo.buffer, {
    type: 'buffer',
  });

  const primeraHoja = workbook.SheetNames[0];

  if (!primeraHoja) {
    throw new Error('El archivo no contiene hojas válidas');
  }

  const worksheet = workbook.Sheets[primeraHoja];

  const filas = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
  });

  if (!filas.length) {
    throw new Error('El archivo no contiene registros');
  }

  return filas;
};

const normalizarFilaCargaMasiva = (fila, index) => {
  return {
    numeroFila: index + 2,
    datos: {
      nombre: normalizarTexto(fila.nombre),
      correo: normalizarTexto(fila.correo).toLowerCase(),
      password: normalizarTexto(fila.password),
      rol: normalizarRol(fila.rol),
      documento: normalizarTexto(fila.documento),
      telefono: normalizarTexto(fila.telefono),
      grupoId: normalizarNumero(fila.grupoId),
      grupoNombre: normalizarTexto(fila.grupoNombre),
      cargo: normalizarTexto(fila.cargo),
      documentoEstudiante: normalizarTexto(fila.documentoEstudiante),
      parentesco: normalizarTexto(fila.parentesco),
    },
  };
};

const validarCargaMasivaUsuarios = async (filasNormalizadas) => {
  const errores = [];
  const correosArchivo = new Map();
  const documentosEstudiantesArchivo = new Set();
  const documentosDocentesArchivo = new Set();
  const documentosAcudientesArchivo = new Set();

  for (const fila of filasNormalizadas) {
    const { numeroFila, datos } = fila;

    if (!datos.nombre) {
      errores.push({ fila: numeroFila, campo: 'nombre', error: 'El nombre es obligatorio' });
    }

    if (!datos.rol) {
      errores.push({ fila: numeroFila, campo: 'rol', error: 'El rol es obligatorio' });
    }

    if (datos.rol && !rolesValidos.includes(datos.rol)) {
      errores.push({ fila: numeroFila, campo: 'rol', error: 'El rol no es válido' });
    }

    if (!datos.correo) {
      errores.push({ fila: numeroFila, campo: 'correo', error: 'El correo es obligatorio' });
    }

    if (!datos.password) {
      errores.push({ fila: numeroFila, campo: 'password', error: 'La contraseña es obligatoria' });
    }

    if (datos.password && datos.password.length < 6) {
      errores.push({ fila: numeroFila, campo: 'password', error: 'La contraseña debe tener mínimo 6 caracteres' });
    }

    if (datos.correo) {
      const llaveCorreo = `${datos.correo}-${datos.rol}-${datos.documento}`;

      if (correosArchivo.has(datos.correo) && correosArchivo.get(datos.correo) !== llaveCorreo) {
        errores.push({ fila: numeroFila, campo: 'correo', error: 'El correo está repetido para usuarios diferentes dentro del archivo' });
      }

      correosArchivo.set(datos.correo, llaveCorreo);
    }

    if (datos.rol === 'ESTUDIANTE') {
      if (!datos.documento) {
        errores.push({ fila: numeroFila, campo: 'documento', error: 'El documento es obligatorio para estudiantes' });
      }

      if (!datos.grupoId && !datos.grupoNombre) {
        errores.push({ fila: numeroFila, campo: 'grupoId', error: 'Debe indicar grupoId o grupoNombre para estudiantes' });
      }

      if (datos.documento) {
        if (documentosEstudiantesArchivo.has(datos.documento)) {
          errores.push({ fila: numeroFila, campo: 'documento', error: 'El documento de estudiante está repetido dentro del archivo' });
        }

        documentosEstudiantesArchivo.add(datos.documento);
      }
    }

    if (datos.rol === 'DOCENTE') {
      if (!datos.documento) {
        errores.push({ fila: numeroFila, campo: 'documento', error: 'El documento es obligatorio para docentes' });
      }

      if (datos.documento) {
        if (documentosDocentesArchivo.has(datos.documento)) {
          errores.push({ fila: numeroFila, campo: 'documento', error: 'El documento de docente está repetido dentro del archivo' });
        }

        documentosDocentesArchivo.add(datos.documento);
      }
    }

    if (datos.rol === 'ACUDIENTE') {
      if (!datos.documento) {
        errores.push({ fila: numeroFila, campo: 'documento', error: 'El documento es obligatorio para acudientes' });
      }

      if (!datos.documentoEstudiante) {
        errores.push({ fila: numeroFila, campo: 'documentoEstudiante', error: 'El documentoEstudiante es obligatorio para acudientes' });
      }

      if (datos.documento) {
        documentosAcudientesArchivo.add(datos.documento);
      }
    }
  }

  const correos = [...new Set(filasNormalizadas.map((fila) => fila.datos.correo).filter(Boolean))];

  const usuariosExistentes = await prisma.usuario.findMany({
    where: {
      correo: {
        in: correos,
      },
    },
    select: {
      correo: true,
      acudiente: {
        select: {
          documento: true,
        },
      },
    },
  });

  for (const usuario of usuariosExistentes) {
    const filasConCorreo = filasNormalizadas.filter((fila) => fila.datos.correo === usuario.correo);

    for (const fila of filasConCorreo) {
      const esAcudienteExistente =
        fila.datos.rol === 'ACUDIENTE' &&
        usuario.acudiente?.documento === fila.datos.documento;

      if (!esAcudienteExistente) {
        errores.push({
          fila: fila.numeroFila,
          campo: 'correo',
          error: 'Ya existe un usuario con este correo',
        });
      }
    }
  }

  const grupoIds = [...new Set(filasNormalizadas.map((fila) => fila.datos.grupoId).filter(Boolean))];
  const grupoNombres = [...new Set(filasNormalizadas.map((fila) => fila.datos.grupoNombre).filter(Boolean))];

  const grupos = await prisma.grupo.findMany({
    where: {
      OR: [
        grupoIds.length ? { id: { in: grupoIds } } : undefined,
        grupoNombres.length ? { nombre: { in: grupoNombres } } : undefined,
      ].filter(Boolean),
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  const gruposPorId = new Set(grupos.map((grupo) => grupo.id));
  const gruposPorNombre = new Set(grupos.map((grupo) => grupo.nombre));

  for (const fila of filasNormalizadas) {
    if (fila.datos.rol !== 'ESTUDIANTE') continue;

    if (fila.datos.grupoId && !gruposPorId.has(fila.datos.grupoId)) {
      errores.push({ fila: fila.numeroFila, campo: 'grupoId', error: 'El grupoId no existe' });
    }

    if (!fila.datos.grupoId && fila.datos.grupoNombre && !gruposPorNombre.has(fila.datos.grupoNombre)) {
      errores.push({ fila: fila.numeroFila, campo: 'grupoNombre', error: 'El grupoNombre no existe' });
    }
  }

  const documentosEstudiantes = [...documentosEstudiantesArchivo];

  if (documentosEstudiantes.length) {
    const estudiantesExistentes = await prisma.estudiante.findMany({
      where: {
        documento: {
          in: documentosEstudiantes,
        },
      },
      select: {
        documento: true,
      },
    });

    const existentes = new Set(estudiantesExistentes.map((estudiante) => estudiante.documento));

    for (const fila of filasNormalizadas) {
      if (fila.datos.rol === 'ESTUDIANTE' && existentes.has(fila.datos.documento)) {
        errores.push({ fila: fila.numeroFila, campo: 'documento', error: 'Ya existe un estudiante con este documento' });
      }
    }
  }

  const documentosDocentes = [...documentosDocentesArchivo];

  if (documentosDocentes.length) {
    const docentesExistentes = await prisma.docente.findMany({
      where: {
        documento: {
          in: documentosDocentes,
        },
      },
      select: {
        documento: true,
      },
    });

    const existentes = new Set(docentesExistentes.map((docente) => docente.documento));

    for (const fila of filasNormalizadas) {
      if (fila.datos.rol === 'DOCENTE' && existentes.has(fila.datos.documento)) {
        errores.push({ fila: fila.numeroFila, campo: 'documento', error: 'Ya existe un docente con este documento' });
      }
    }
  }

  const documentosEstudiantesReferenciados = [
    ...new Set(
      filasNormalizadas
        .filter((fila) => fila.datos.rol === 'ACUDIENTE' && fila.datos.documentoEstudiante)
        .map((fila) => fila.datos.documentoEstudiante)
    ),
  ];

  if (documentosEstudiantesReferenciados.length) {
    const estudiantesBase = await prisma.estudiante.findMany({
      where: {
        documento: {
          in: documentosEstudiantesReferenciados,
        },
      },
      select: {
        documento: true,
      },
    });

    const documentosEnBase = new Set(estudiantesBase.map((estudiante) => estudiante.documento));
    const documentosEnArchivo = new Set(documentosEstudiantes);

    for (const fila of filasNormalizadas) {
      if (
        fila.datos.rol === 'ACUDIENTE' &&
        fila.datos.documentoEstudiante &&
        !documentosEnBase.has(fila.datos.documentoEstudiante) &&
        !documentosEnArchivo.has(fila.datos.documentoEstudiante)
      ) {
        errores.push({
          fila: fila.numeroFila,
          campo: 'documentoEstudiante',
          error: 'No existe estudiante con este documento',
        });
      }
    }
  }

  return errores;
};

const obtenerGrupoId = async (tx, datos) => {
  if (datos.grupoId) return datos.grupoId;

  const grupo = await tx.grupo.findFirst({
    where: {
      nombre: datos.grupoNombre,
    },
    select: {
      id: true,
    },
  });

  return grupo?.id || null;
};

const crearUsuarioBase = async (tx, datos) => {
  return tx.usuario.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      password: datos.passwordEncriptada,
      rol: datos.rol,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
    },
  });
};

const cargarUsuariosDesdeArchivo = async (archivo) => {
  const filas = leerUsuariosDesdeArchivo(archivo);
  const filasNormalizadas = filas.map((fila, index) => normalizarFilaCargaMasiva(fila, index));

  const errores = await validarCargaMasivaUsuarios(filasNormalizadas);

  if (errores.length > 0) {
    return {
      ok: false,
      total: filasNormalizadas.length,
      creados: 0,
      relacionesCreadas: 0,
      errores,
    };
  }

  const filasConPasswordEncriptada = await Promise.all(
  filasNormalizadas.map(async (fila) => ({
    ...fila,
    datos: {
      ...fila.datos,
      passwordEncriptada: await bcrypt.hash(fila.datos.password, 10),
    },
  }))
);

  const resultado = await prisma.$transaction(async (tx) => {
    const usuariosCreados = [];
    const estudiantesPorDocumento = new Map();
    const acudientesPorDocumento = new Map();
    let relacionesCreadas = 0;

    const estudiantesBase = await tx.estudiante.findMany({
      where: {
        documento: {
          in: filasConPasswordEncriptada
            .filter((fila) => fila.datos.rol === 'ACUDIENTE')
            .map((fila) => fila.datos.documentoEstudiante)
            .filter(Boolean),
        },
      },
      select: {
        id: true,
        documento: true,
      },
    });

    for (const estudiante of estudiantesBase) {
      estudiantesPorDocumento.set(estudiante.documento, estudiante);
    }

    const acudientesBase = await tx.acudiente.findMany({
      where: {
        documento: {
          in: filasConPasswordEncriptada
            .filter((fila) => fila.datos.rol === 'ACUDIENTE')
            .map((fila) => fila.datos.documento)
            .filter(Boolean),
        },
      },
      select: {
        id: true,
        documento: true,
      },
    });

    for (const acudiente of acudientesBase) {
      acudientesPorDocumento.set(acudiente.documento, acudiente);
    }

    for (const fila of filasConPasswordEncriptada) {
      const datos = fila.datos;

      if (datos.rol === 'ACUDIENTE') continue;

      const usuario = await crearUsuarioBase(tx, datos);
      let perfilCreado = false;

      if (datos.rol === 'ESTUDIANTE') {
        const grupoId = await obtenerGrupoId(tx, datos);

        const estudiante = await tx.estudiante.create({
          data: {
            usuarioId: usuario.id,
            nombre: usuario.nombre,
            documento: datos.documento,
            grupoId,
          },
          select: {
            id: true,
            documento: true,
          },
        });

        estudiantesPorDocumento.set(estudiante.documento, estudiante);
        perfilCreado = true;
      }

      if (datos.rol === 'DOCENTE') {
        await tx.docente.create({
          data: {
            usuarioId: usuario.id,
            documento: datos.documento,
            telefono: datos.telefono || null,
          },
        });

        perfilCreado = true;
      }

      if (datos.rol === 'ADMINISTRATIVO') {
        await tx.administrativo.create({
          data: {
            usuarioId: usuario.id,
            cargo: datos.cargo || null,
          },
        });

        perfilCreado = true;
      }

      usuariosCreados.push({
        fila: fila.numeroFila,
        usuario,
        perfilCreado,
      });
    }

    for (const fila of filasConPasswordEncriptada) {
      const datos = fila.datos;

      if (datos.rol !== 'ACUDIENTE') continue;

      let acudiente = acudientesPorDocumento.get(datos.documento);

      if (!acudiente) {
        const usuario = await crearUsuarioBase(tx, datos);

        acudiente = await tx.acudiente.create({
          data: {
            usuarioId: usuario.id,
            nombre: usuario.nombre,
            documento: datos.documento,
            correo: usuario.correo,
            telefono: datos.telefono || null,
          },
          select: {
            id: true,
            documento: true,
          },
        });

        acudientesPorDocumento.set(acudiente.documento, acudiente);

        usuariosCreados.push({
          fila: fila.numeroFila,
          usuario,
          perfilCreado: true,
        });
      }

      const estudiante = estudiantesPorDocumento.get(datos.documentoEstudiante);

      const relacionExistente = await tx.estudianteAcudiente.findUnique({
        where: {
          estudianteId_acudienteId: {
            estudianteId: estudiante.id,
            acudienteId: acudiente.id,
          },
        },
      });

      if (!relacionExistente) {
        await tx.estudianteAcudiente.create({
          data: {
            estudianteId: estudiante.id,
            acudienteId: acudiente.id,
            parentesco: datos.parentesco || null,
          },
        });

        relacionesCreadas += 1;
      }
    }

    return {
      usuariosCreados,
      relacionesCreadas,
    };
  },
  {
    maxWait: 10000,
    timeout: 300000,
  }
);

  return {
    ok: true,
    total: filasNormalizadas.length,
    creados: resultado.usuariosCreados.length,
    relacionesCreadas: resultado.relacionesCreadas,
    usuarios: resultado.usuariosCreados,
    errores: [],
  };
};

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

const actualizarPasswordUsuario = async (id, datos) => {
  const { password } = datos;

  const passwordLimpio = password?.trim();

  if (!passwordLimpio) {
    throw new Error('La nueva contraseña es obligatoria');
  }

  if (passwordLimpio.length < 6) {
    throw new Error('La contraseña debe tener mínimo 6 caracteres');
  }

  const usuarioActual = await prisma.usuario.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!usuarioActual) {
    throw new Error('Usuario no encontrado');
  }

  const passwordEncriptada = await bcrypt.hash(passwordLimpio, 10);

  const usuarioActualizado = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data: {
      password: passwordEncriptada,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
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
  activarUsuario,
  actualizarPasswordUsuario,
  cargarUsuariosDesdeArchivo,
};