// Importamos tipos de Express.
import { Request, Response } from 'express';

// Importamos servicios.
import {
  createInventoryMovementService,
  getInventoryMovementsService,
  getInventoryService,
} from './inventory.service';

// ==============================
// OBTENER INVENTARIO
// ==============================
export const getInventoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getInventoryService();

    return res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(500).json({
      message: errorMessage,
    });
  }
};

// ==============================
// CREAR MOVIMIENTO DE INVENTARIO
// ==============================
export const createInventoryMovementController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createInventoryMovementService(req.body);

    return res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(400).json({
      message: errorMessage,
    });
  }
};

// ==============================
// OBTENER HISTORIAL DE MOVIMIENTOS
// ==============================
export const getInventoryMovementsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getInventoryMovementsService();

    return res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(500).json({
      message: errorMessage,
    });
  }
};