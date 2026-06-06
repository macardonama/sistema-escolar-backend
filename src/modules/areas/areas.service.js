const prisma = require('../../config/prisma');

const crearArea = async (datos) => {
  const { nombre, descripcion } = datos;

  const nombreLimpio = nombre?.trim();

  if (!nombreLimpio) {
    throw new Error('El nombre del área es obligatorio');
  }

  const areaExistente = await prisma.area.findUnique({
    where: {
      nombre: nombreLimpio,
    },
  });

  if (areaExistente) {
    throw new Error('Ya existe un área con este nombre');
  }

  const area = await prisma.area.create({
    data: {
      nombre: nombreLimpio,
      descripcion: descripcion?.trim() || null,
    },
  });

  return area;
};

const listarAreas = async (filtros = {}) => {
  const { activo } = filtros;

  const where = {};

  if (activo !== undefined) {
    where.activo = activo === 'true';
  }

  const areas = await prisma.area.findMany({
    where,
    orderBy: {
      nombre: 'asc',
    },
  });

  return areas;
};

const obtenerAreaPorId = async (id) => {
  const area = await prisma.area.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!area) {
    throw new Error('Área no encontrada');
  }

  return area;
};

const actualizarArea = async (id, datos) => {
  const { nombre, descripcion, activo } = datos;

  const areaActual = await prisma.area.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!areaActual) {
    throw new Error('Área no encontrada');
  }

  const data = {};

  if (nombre !== undefined) {
    const nombreLimpio = nombre?.trim();

    if (!nombreLimpio) {
      throw new Error('El nombre del área no puede estar vacío');
    }

    const areaConNombre = await prisma.area.findUnique({
      where: {
        nombre: nombreLimpio,
      },
    });

    if (areaConNombre && areaConNombre.id !== Number(id)) {
      throw new Error('Ya existe un área con este nombre');
    }

    data.nombre = nombreLimpio;
  }

  if (descripcion !== undefined) {
    data.descripcion = descripcion?.trim() || null;
  }

  if (activo !== undefined) {
    data.activo = Boolean(activo);
  }

  const areaActualizada = await prisma.area.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return areaActualizada;
};

module.exports = {
  crearArea,
  listarAreas,
  obtenerAreaPorId,
  actualizarArea,
};