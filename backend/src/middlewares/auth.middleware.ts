import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No se proporcionó el token de autorización',
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Formato de token inválido. Usa: Bearer TU_TOKEN',
      });
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (_error) {
    return res.status(401).json({
      message: 'Token inválido o expirado',
    });
  }
};