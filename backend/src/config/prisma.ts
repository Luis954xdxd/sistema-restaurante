import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('La variable DATABASE_URL no está definida en el archivo .env');
}

// 🔹 Creamos pool de conexiones (mejor rendimiento)
const pool = new Pool({
  connectionString,
});

// 🔹 Creamos adapter
const adapter = new PrismaPg(pool);

// 🔹 Cliente Prisma
const prisma = new PrismaClient({
  adapter,
});

export default prisma;