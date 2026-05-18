require('dotenv').config();

const bcrypt = require('bcrypt');
const prisma = require('../../src/config/prisma');

const main = async () => {
  const correoAdmin = 'mateo@test.com';

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      correo: correoAdmin,
    },
  });

  if (usuarioExistente) {
    console.log('El usuario administrativo ya existe.');
    return;
  }

  const passwordEncriptada = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Mateo Cardona',
      correo: correoAdmin,
      password: passwordEncriptada,
      rol: 'ADMINISTRATIVO',
      activo: true,
    },
  });

  console.log('Usuario administrativo creado correctamente:', {
    id: admin.id,
    nombre: admin.nombre,
    correo: admin.correo,
    rol: admin.rol,
  });
};

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });