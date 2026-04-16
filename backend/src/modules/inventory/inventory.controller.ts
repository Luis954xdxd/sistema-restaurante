import { Request, Response } from 'express';
import {
  createInventoryMovementService,
  createInventoryService,
  getAllInventoryService,
  getInventoryByProductIdService,
  getInventoryMovementsByProductIdService,
  getLowStockProductsService,
  updateInventoryService,
} from './inventory.service';

export const createInventoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createInventoryService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getAllInventoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const search = req.query.search as string | undefined;
    const lowStockOnlyParam = req.query.lowStockOnly as string | undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const lowStockOnly = lowStockOnlyParam === 'true';

    const result = await getAllInventoryService({
      search,
      lowStockOnly,
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

export const getInventoryByProductIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: 'El productId debe ser un número válido',
      });
    }

    const result = await getInventoryByProductIdService(productId);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(404).json({
      message: errorMessage,
    });
  }
};

export const updateInventoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: 'El productId debe ser un número válido',
      });
    }

    const result = await updateInventoryService(productId, req.body);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const createInventoryMovementController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createInventoryMovementService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getInventoryMovementsByProductIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: 'El productId debe ser un número válido',
      });
    }

    const result = await getInventoryMovementsByProductIdService(productId);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

export const getLowStockProductsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getLowStockProductsService();

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};