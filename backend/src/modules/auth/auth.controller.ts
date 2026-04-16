import { Request, Response } from 'express';
import { loginService, registerAdminService } from './auth.service';

export const registerAdminController = async (req: Request, res: Response) => {
  try {
    const result = await registerAdminService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getAuthenticatedUserController = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    message: 'Ruta protegida accesible',
    user: req.user,
  });
};

export const adminOnlyController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Bienvenido, administrador',
    user: req.user,
  });
};