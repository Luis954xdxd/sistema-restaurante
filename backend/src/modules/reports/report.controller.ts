import { Request, Response } from 'express';
import {
  getDailyOrdersService,
  getDailySummaryPdfService,
  getDailySummaryService,
} from './report.service';

export const getDailySummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string | undefined;
    const result = await getDailySummaryService(date);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getDailyOrdersController = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string | undefined;
    const result = await getDailyOrdersService(date);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const getDailySummaryPdfController = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string | undefined;
    const result = await getDailySummaryPdfService(date);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`
    );

    res.status(200).send(result.pdfBuffer);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};