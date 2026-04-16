import { Request, Response } from 'express';
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  toggleCategoryStatusService,
  updateCategoryService,
} from './category.service';

export async function createCategoryController(req: Request, res: Response) {
  try {
    const result = await createCategoryService(req.body);

    return res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(400).json({ message });
  }
}

export async function getAllCategoriesController(req: Request, res: Response) {
  try {
    const result = await getAllCategoriesService({
      search: req.query.search as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === 'true'
          : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(500).json({ message });
  }
}

export async function getCategoryByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await getCategoryByIdService(id);

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(404).json({ message });
  }
}

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await updateCategoryService(id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(400).json({ message });
  }
}

export async function toggleCategoryStatusController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await toggleCategoryStatusService(id);

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(404).json({ message });
  }
}

export async function deleteCategoryController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await deleteCategoryService(id);

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(409).json({ message });
  }
}