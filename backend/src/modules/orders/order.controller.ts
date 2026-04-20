import { Request, Response } from 'express';
import {
  createOrderService,
  createPublicOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByUserIdService,
  updateOrderStatusService,
} from './order.service';

// ==============================
// CREAR PEDIDO INTERNO
// ==============================
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const result = await createOrderService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

// ==============================
// OBTENER TODOS LOS PEDIDOS
// ==============================
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as
      | 'PENDING'
      | 'IN_PREPARATION'
      | 'READY'
      | 'DELIVERED'
      | 'CANCELLED'
      | undefined;

    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const date = req.query.date as string | undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await getAllOrdersService({
      status,
      userId,
      date,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

// ==============================
// OBTENER PEDIDO POR ID
// ==============================
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'El id debe ser un número válido',
      });
    }

    const result = await getOrderByIdService(id);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(404).json({
      message: errorMessage,
    });
  }
};

// ==============================
// OBTENER PEDIDOS POR USUARIO
// ==============================
export const getOrdersByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: 'El userId debe ser un número válido',
      });
    }

    const result = await getOrdersByUserIdService(userId);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

// ==============================
// ACTUALIZAR ESTADO DEL PEDIDO
// ==============================
export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'El id debe ser un número válido',
      });
    }

    const result = await updateOrderStatusService(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

// ==============================
// CREAR PEDIDO PÚBLICO
// ==============================
export const createPublicOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createPublicOrderService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};