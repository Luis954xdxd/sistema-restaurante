import PDFDocument from 'pdfkit';
import { formatDateForDisplay, formatDateTimeForDisplay } from './date';

interface DailyOrderPdfItem {
  id: number;
  customerName: string;
  status: string;
  subtotal: string;
  tipAmount: string;
  total: string;
  createdAt: Date;
}

interface DailySummaryPdfData {
  reportDate: Date;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  subtotalAmount: string;
  tipAmount: string;
  totalAmount: string;
  orders: DailyOrderPdfItem[];
}

export const buildDailySummaryPdf = (data: DailySummaryPdfData): Buffer => {
  const doc = new PDFDocument({ margin: 40 });
  const buffers: Buffer[] = [];

  doc.on('data', (chunk) => buffers.push(chunk as Buffer));

  doc.fontSize(18).text('Reporte Diario de Ventas', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Fecha del reporte: ${formatDateForDisplay(data.reportDate)}`);
  doc.text(`Total de pedidos: ${data.totalOrders}`);
  doc.text(`Pedidos entregados: ${data.deliveredOrders}`);
  doc.text(`Pedidos cancelados: ${data.cancelledOrders}`);
  doc.text(`Subtotal acumulado: $${data.subtotalAmount}`);
  doc.text(`Propinas acumuladas: $${data.tipAmount}`);
  doc.text(`Total vendido: $${data.totalAmount}`);
  doc.moveDown();

  doc.fontSize(14).text('Detalle de pedidos');
  doc.moveDown(0.5);

  if (data.orders.length === 0) {
    doc.fontSize(12).text('No hubo pedidos en la fecha seleccionada.');
  } else {
    data.orders.forEach((order) => {
      doc
        .fontSize(11)
        .text(`Pedido #${order.id}`)
        .text(`Cliente: ${order.customerName}`)
        .text(`Estado: ${order.status}`)
        .text(`Subtotal: $${order.subtotal}`)
        .text(`Propina: $${order.tipAmount}`)
        .text(`Total: $${order.total}`)
        .text(`Fecha: ${formatDateTimeForDisplay(order.createdAt)}`)
        .moveDown();
    });
  }

  doc.end();

  return Buffer.concat(buffers);
};