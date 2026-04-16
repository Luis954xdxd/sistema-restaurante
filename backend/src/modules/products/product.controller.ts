import { Request, Response } from 'express';
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  toggleProductAvailabilityService,
  updateProductService,
} from './product.service';

export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    const payload = {
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      categoryId:
        req.body.categoryId !== undefined ? Number(req.body.categoryId) : undefined,
      imageUrl,
    };

    const result = await createProductService(payload);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined;
    const isAvailableParam = req.query.isAvailable as string | undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    let isAvailable: boolean | undefined;

    if (isAvailableParam === 'true') {
      isAvailable = true;
    } else if (isAvailableParam === 'false') {
      isAvailable = false;
    }

    const result = await getAllProductsService({
      search,
      categoryId,
      isAvailable,
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

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'El id debe ser un número válido',
      });
    }

    const result = await getProductByIdService(id);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(404).json({
      message: errorMessage,
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'El id debe ser un número válido',
      });
    }

    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    const payload = {
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      categoryId:
        req.body.categoryId !== undefined ? Number(req.body.categoryId) : undefined,
      ...(imageUrl ? { imageUrl } : {}),
    };

    const result = await updateProductService(id, payload);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const toggleProductAvailabilityController = async (
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

    const result = await toggleProductAvailabilityService(id);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(404).json({
      message: errorMessage,
    });
  }
};