import { Request, Response } from 'express';
import {
  createTableWithQrService,
  generateTablePdfBufferService,
} from './table.service';

export const createTableWithQrController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createTableWithQrService(req.body);

    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    res.status(400).json({
      message: errorMessage,
    });
  }
};

export const downloadTableQrPdfController = async (
  req: Request,
  res: Response
) => {
  try {
    const baseUrl = req.query.baseUrl as string;

    if (!baseUrl) {
      return res.status(400).json({
        message: 'Falta baseUrl',
      });
    }

    const result = await createTableWithQrService({ baseUrl });

    const pdfBuffer = await generateTablePdfBufferService(
      result.table.number,
      result.qrCodeDataUrl
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=mesa-${result.table.number}.pdf`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return res.status(400).json({
      message: errorMessage,
    });
  }
};