const prisma = require('../../config/prisma');

const ordenarPorOrdenYFecha = [
  {
    orden: 'asc',
  },
  {
    creadoEn: 'desc',
  },
];

const obtenerDashboard = async () => {
  const [noticias, eventos, galeria] = await Promise.all([
    prisma.dashboardNoticia.findMany({
      where: {
        activo: true,
      },
      orderBy: ordenarPorOrdenYFecha,
    }),
    prisma.dashboardEvento.findMany({
      where: {
        activo: true,
      },
      orderBy: [
        {
          orden: 'asc',
        },
        {
          fecha: 'asc',
        },
      ],
    }),
    prisma.dashboardGaleria.findMany({
      where: {
        activo: true,
      },
      orderBy: ordenarPorOrdenYFecha,
    }),
  ]);

  return {
    noticias,
    eventos,
    galeria,
  };
};

const crearNoticia = async (datos, usuarioId) => {
  const { titulo, descripcion, color, orden } = datos;

  const tituloLimpio = titulo?.trim();
  const descripcionLimpia = descripcion?.trim();

  if (!tituloLimpio) {
    throw new Error('El título de la noticia es obligatorio');
  }

  if (!descripcionLimpia) {
    throw new Error('La descripción de la noticia es obligatoria');
  }

  const noticia = await prisma.dashboardNoticia.create({
    data: {
      titulo: tituloLimpio,
      descripcion: descripcionLimpia,
      color: color?.trim() || 'azul',
      orden: orden !== undefined ? Number(orden) : 0,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });

  return noticia;
};

const actualizarNoticia = async (id, datos, usuarioId) => {
  const { titulo, descripcion, color, orden, activo } = datos;

  const data = {
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (titulo !== undefined) {
    const tituloLimpio = titulo?.trim();

    if (!tituloLimpio) {
      throw new Error('El título de la noticia no puede estar vacío');
    }

    data.titulo = tituloLimpio;
  }

  if (descripcion !== undefined) {
    const descripcionLimpia = descripcion?.trim();

    if (!descripcionLimpia) {
      throw new Error('La descripción de la noticia no puede estar vacía');
    }

    data.descripcion = descripcionLimpia;
  }

  if (color !== undefined) {
    data.color = color?.trim() || 'azul';
  }

  if (orden !== undefined) {
    data.orden = Number(orden);
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const noticia = await prisma.dashboardNoticia.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return noticia;
};

const cambiarEstadoNoticia = async (id, activo, usuarioId) => {
  const noticia = await prisma.dashboardNoticia.update({
    where: {
      id: Number(id),
    },
    data: {
      activo,
      actualizadoPorUsuarioId: Number(usuarioId),
    },
  });

  return noticia;
};

const crearEvento = async (datos, usuarioId) => {
  const { titulo, fecha, color, orden } = datos;

  const tituloLimpio = titulo?.trim();

  if (!tituloLimpio) {
    throw new Error('El título del evento es obligatorio');
  }

  if (!fecha) {
    throw new Error('La fecha del evento es obligatoria');
  }

  const fechaEvento = new Date(fecha);

  if (Number.isNaN(fechaEvento.getTime())) {
    throw new Error('La fecha del evento no es válida');
  }

  const evento = await prisma.dashboardEvento.create({
    data: {
      titulo: tituloLimpio,
      fecha: fechaEvento,
      color: color?.trim() || 'azul',
      orden: orden !== undefined ? Number(orden) : 0,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });

  return evento;
};

const actualizarEvento = async (id, datos, usuarioId) => {
  const { titulo, fecha, color, orden, activo } = datos;

  const data = {
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (titulo !== undefined) {
    const tituloLimpio = titulo?.trim();

    if (!tituloLimpio) {
      throw new Error('El título del evento no puede estar vacío');
    }

    data.titulo = tituloLimpio;
  }

  if (fecha !== undefined) {
    if (!fecha) {
      throw new Error('La fecha del evento no puede estar vacía');
    }

    const fechaEvento = new Date(fecha);

    if (Number.isNaN(fechaEvento.getTime())) {
      throw new Error('La fecha del evento no es válida');
    }

    data.fecha = fechaEvento;
  }

  if (color !== undefined) {
    data.color = color?.trim() || 'azul';
  }

  if (orden !== undefined) {
    data.orden = Number(orden);
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const evento = await prisma.dashboardEvento.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return evento;
};

const cambiarEstadoEvento = async (id, activo, usuarioId) => {
  const evento = await prisma.dashboardEvento.update({
    where: {
      id: Number(id),
    },
    data: {
      activo,
      actualizadoPorUsuarioId: Number(usuarioId),
    },
  });

  return evento;
};

const crearGaleria = async (datos, usuarioId) => {
  const { titulo, descripcion, imagenUrl, orden } = datos;

  const tituloLimpio = titulo?.trim();

  if (!tituloLimpio) {
    throw new Error('El título de la galería es obligatorio');
  }

  const itemGaleria = await prisma.dashboardGaleria.create({
    data: {
      titulo: tituloLimpio,
      descripcion: descripcion?.trim() || null,
      imagenUrl: imagenUrl?.trim() || null,
      orden: orden !== undefined ? Number(orden) : 0,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });

  return itemGaleria;
};

const actualizarGaleria = async (id, datos, usuarioId) => {
  const { titulo, descripcion, imagenUrl, orden, activo } = datos;

  const data = {
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (titulo !== undefined) {
    const tituloLimpio = titulo?.trim();

    if (!tituloLimpio) {
      throw new Error('El título de la galería no puede estar vacío');
    }

    data.titulo = tituloLimpio;
  }

  if (descripcion !== undefined) {
    data.descripcion = descripcion?.trim() || null;
  }

  if (imagenUrl !== undefined) {
    data.imagenUrl = imagenUrl?.trim() || null;
  }

  if (orden !== undefined) {
    data.orden = Number(orden);
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const itemGaleria = await prisma.dashboardGaleria.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return itemGaleria;
};

const cambiarEstadoGaleria = async (id, activo, usuarioId) => {
  const itemGaleria = await prisma.dashboardGaleria.update({
    where: {
      id: Number(id),
    },
    data: {
      activo,
      actualizadoPorUsuarioId: Number(usuarioId),
    },
  });

  return itemGaleria;
};

const obtenerDashboardGestion = async () => {
  const [noticias, eventos, galeria] = await Promise.all([
    prisma.dashboardNoticia.findMany({
      orderBy: [
        {
          orden: 'asc',
        },
        {
          creadoEn: 'desc',
        },
      ],
    }),
    prisma.dashboardEvento.findMany({
      orderBy: [
        {
          orden: 'asc',
        },
        {
          fecha: 'asc',
        },
      ],
    }),
    prisma.dashboardGaleria.findMany({
      orderBy: [
        {
          orden: 'asc',
        },
        {
          creadoEn: 'desc',
        },
      ],
    }),
  ]);

  return {
    noticias,
    eventos,
    galeria,
  };
};

const validarArregloDashboard = (valor, nombreCampo) => {
  if (valor === undefined) {
    return [];
  }

  if (!Array.isArray(valor)) {
    throw new Error(`${nombreCampo} debe ser un arreglo`);
  }

  return valor;
};

const normalizarBooleano = (valor, valorPorDefecto = true) => {
  if (valor === undefined) {
    return valorPorDefecto;
  }

  return Boolean(valor);
};

const guardarNoticiaDesdeTablero = async (tx, item, usuarioId, index) => {
  const titulo = item.titulo?.trim();
  const descripcion = item.descripcion?.trim();

  if (!titulo) {
    throw new Error(`El título de la noticia en la posición ${index + 1} es obligatorio`);
  }

  if (!descripcion) {
    throw new Error(`La descripción de la noticia en la posición ${index + 1} es obligatoria`);
  }

  const data = {
    titulo,
    descripcion,
    color: item.color?.trim() || 'azul',
    orden: item.orden !== undefined ? Number(item.orden) : index + 1,
    activo: normalizarBooleano(item.activo, true),
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (item.id) {
    return tx.dashboardNoticia.update({
      where: {
        id: Number(item.id),
      },
      data,
    });
  }

  return tx.dashboardNoticia.create({
    data: {
      ...data,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });
};

const guardarEventoDesdeTablero = async (tx, item, usuarioId, index) => {
  const titulo = item.titulo?.trim();

  if (!titulo) {
    throw new Error(`El título del evento en la posición ${index + 1} es obligatorio`);
  }

  if (!item.fecha) {
    throw new Error(`La fecha del evento en la posición ${index + 1} es obligatoria`);
  }

  const fechaEvento = new Date(item.fecha);

  if (Number.isNaN(fechaEvento.getTime())) {
    throw new Error(`La fecha del evento en la posición ${index + 1} no es válida`);
  }

  const data = {
    titulo,
    fecha: fechaEvento,
    color: item.color?.trim() || 'azul',
    orden: item.orden !== undefined ? Number(item.orden) : index + 1,
    activo: normalizarBooleano(item.activo, true),
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (item.id) {
    return tx.dashboardEvento.update({
      where: {
        id: Number(item.id),
      },
      data,
    });
  }

  return tx.dashboardEvento.create({
    data: {
      ...data,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });
};

const guardarGaleriaDesdeTablero = async (tx, item, usuarioId, index) => {
  const titulo = item.titulo?.trim();

  if (!titulo) {
    throw new Error(`El título de la galería en la posición ${index + 1} es obligatorio`);
  }

  const data = {
    titulo,
    descripcion: item.descripcion?.trim() || null,
    imagenUrl: item.imagenUrl?.trim() || null,
    orden: item.orden !== undefined ? Number(item.orden) : index + 1,
    activo: normalizarBooleano(item.activo, true),
    actualizadoPorUsuarioId: Number(usuarioId),
  };

  if (item.id) {
    return tx.dashboardGaleria.update({
      where: {
        id: Number(item.id),
      },
      data,
    });
  }

  return tx.dashboardGaleria.create({
    data: {
      ...data,
      creadoPorUsuarioId: Number(usuarioId),
    },
  });
};

const guardarDashboard = async (datos, usuarioId) => {
  const noticias = validarArregloDashboard(datos.noticias, 'noticias');
  const eventos = validarArregloDashboard(datos.eventos, 'eventos');
  const galeria = validarArregloDashboard(datos.galeria, 'galeria');

  const resultado = await prisma.$transaction(async (tx) => {
    const noticiasGuardadas = [];

    for (let i = 0; i < noticias.length; i += 1) {
      const noticia = await guardarNoticiaDesdeTablero(tx, noticias[i], usuarioId, i);
      noticiasGuardadas.push(noticia);
    }

    const eventosGuardados = [];

    for (let i = 0; i < eventos.length; i += 1) {
      const evento = await guardarEventoDesdeTablero(tx, eventos[i], usuarioId, i);
      eventosGuardados.push(evento);
    }

    const galeriaGuardada = [];

    for (let i = 0; i < galeria.length; i += 1) {
      const itemGaleria = await guardarGaleriaDesdeTablero(tx, galeria[i], usuarioId, i);
      galeriaGuardada.push(itemGaleria);
    }

    return {
      noticias: noticiasGuardadas,
      eventos: eventosGuardados,
      galeria: galeriaGuardada,
    };
  });

  return resultado;
};

module.exports = {
  obtenerDashboard,
  obtenerDashboardGestion,
  guardarDashboard,
  crearNoticia,
  actualizarNoticia,
  cambiarEstadoNoticia,
  crearEvento,
  actualizarEvento,
  cambiarEstadoEvento,
  crearGaleria,
  actualizarGaleria,
  cambiarEstadoGaleria,
  
};