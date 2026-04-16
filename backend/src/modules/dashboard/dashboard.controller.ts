import { Request, Response } from 'express';
import {
  getDashboardLowStockService,
  getDashboardRecentOrdersService,
  getDashboardSummaryService,
  getDashboardTopProductsService,
} from './dashboard.service';

export const getDashboardSummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string | undefined;
    const result = await getDashboardSummaryService(date);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getDashboardLowStockController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getDashboardLowStockService();

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

export const getDashboardTopProductsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getDashboardTopProductsService();

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};

export const getDashboardRecentOrdersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getDashboardRecentOrdersService();

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(500).json({
      message: errorMessage,
    });
  }
};