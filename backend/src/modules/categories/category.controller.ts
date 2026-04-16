import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  toggleCategoryStatusService,
  updateCategoryService,
} from './category.service';
import { AppError } from '../../shared/errors/AppError';

export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = await createCategoryService(req.body);

  res.status(201).json(result);
});

export const getAllCategoriesController = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const isActiveParam = req.query.isActive as string | undefined;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  let isActive: boolean | undefined;

  if (isActiveParam === 'true') {
    isActive = true;
  } else if (isActiveParam === 'false') {
    isActive = false;
  }

  const result = await getAllCategoriesService({
    search,
    isActive,
    page,
    limit,
  });

  res.status(200).json(result);
});

export const getCategoryByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError('El id debe ser un número válido', 400);
  }

  const result = await getCategoryByIdService(id);

  res.status(200).json(result);
});

export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError('El id debe ser un número válido', 400);
  }

  const result = await updateCategoryService(id, req.body);

  res.status(200).json(result);
});

export const toggleCategoryStatusController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError('El id debe ser un número válido', 400);
  }

  const result = await toggleCategoryStatusService(id);

  res.status(200).json(result);
});