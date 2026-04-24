import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import productRoutes from './modules/products/product.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import orderRoutes from './modules/orders/order.routes';
import reportRoutes from './modules/reports/report.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import tableRoutes from './modules/tables/table.routes';

import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  res.send('API del sistema de restaurante funcionando correctamente');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tables', tableRoutes);

app.use(errorMiddleware);

export default app;