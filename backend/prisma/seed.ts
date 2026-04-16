import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('No se encontró DATABASE_URL en el archivo .env');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Ejecutando seed...');

  // ======================
  // 1. ROLES
  // ======================
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador del sistema',
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
      description: 'Empleado del restaurante',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      description: 'Cliente del sistema',
    },
  });

  console.log('✅ Roles listos');

  // ======================
  // 2. PASSWORDS
  // ======================
  const adminPass = await bcrypt.hash('Admin123*', 10);
  const jesusPass = await bcrypt.hash('Jesus123*', 10);
  const employeePass = await bcrypt.hash('Empleado123*', 10);
  const customerPass = await bcrypt.hash('Cliente123*', 10);

  // ======================
  // 3. USUARIOS
  // ======================
  await prisma.user.upsert({
    where: { email: 'admin@restaurante.com' },
    update: {},
    create: {
      firstName: 'Luis',
      lastName: 'Lopez',
      email: 'admin@restaurante.com',
      passwordHash: adminPass,
      phone: '3334834354',
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'jesus.bautista@restaurante.com' },
    update: {},
    create: {
      firstName: 'Jesus',
      lastName: 'Bautista',
      email: 'jesus.bautista@restaurante.com',
      passwordHash: jesusPass,
      phone: '3331593592',
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'empleado@restaurante.com' },
    update: {},
    create: {
      firstName: 'Empleado',
      lastName: 'General',
      email: 'empleado@restaurante.com',
      passwordHash: employeePass,
      roleId: employeeRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'cliente@restaurante.com' },
    update: {},
    create: {
      firstName: 'Cliente',
      lastName: 'Demo',
      email: 'cliente@restaurante.com',
      passwordHash: customerPass,
      roleId: customerRole.id,
    },
  });

  console.log('✅ Usuarios listos');

  // ======================
  // 4. CATEGORÍAS
  // ======================
  const bebidas = await prisma.category.upsert({
    where: { name: 'Bebidas' },
    update: {},
    create: {
      name: 'Bebidas',
      description: 'Refrescos y bebidas',
    },
  });

  const comidas = await prisma.category.upsert({
    where: { name: 'Comidas' },
    update: {},
    create: {
      name: 'Comidas',
      description: 'Platillos principales',
    },
  });

  console.log('✅ Categorías listas');

  // ======================
  // 5. PRODUCTOS
  // ======================
  let coca = await prisma.product.findFirst({
    where: { name: 'Coca-Cola 600ml Zero' },
  });

  if (!coca) {
    coca = await prisma.product.create({
      data: {
        name: 'Coca-Cola 600ml Zero',
        description: 'Refresco sin azúcar',
        price: 28,
        categoryId: bebidas.id,
      },
    });
  }

  let hamburguesa = await prisma.product.findFirst({
    where: { name: 'Hamburguesa Clásica' },
  });

  if (!hamburguesa) {
    hamburguesa = await prisma.product.create({
      data: {
        name: 'Hamburguesa Clásica',
        description: 'Carne, queso, lechuga',
        price: 89,
        categoryId: comidas.id,
      },
    });
  }

  console.log('✅ Productos listos');

  // ======================
  // 6. INVENTARIO
  // ======================
  await prisma.inventory.upsert({
    where: { productId: coca.id },
    update: {},
    create: {
      productId: coca.id,
      stockCurrent: 30,
      stockMinimum: 10,
      unit: 'botellas',
    },
  });

  await prisma.inventory.upsert({
    where: { productId: hamburguesa.id },
    update: {},
    create: {
      productId: hamburguesa.id,
      stockCurrent: 20,
      stockMinimum: 5,
      unit: 'piezas',
    },
  });

  console.log('✅ Inventario listo');
  console.log('🎉 SEED TERMINADO');
  console.log('');
  console.log('Usuarios iniciales:');
  console.log('Admin 1: admin@restaurante.com / Admin123*');
  console.log('Admin 2: jesus.bautista@restaurante.com / Jesus123*');
  console.log('Empleado: empleado@restaurante.com / Empleado123*');
  console.log('Cliente: cliente@restaurante.com / Cliente123*');
}

main()
  .catch((error) => {
    console.error('❌ Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });