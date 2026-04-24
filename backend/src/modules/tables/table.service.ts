// Importamos Prisma para consultar y guardar datos en la base de datos.
import prisma from '../../config/prisma';

// Importamos QRCode para generar el código QR.
import QRCode from 'qrcode';

// Importamos PDFDocument para crear el PDF.
import PDFDocument from 'pdfkit';

// Importamos el tipo que recibe la función para crear una mesa.
import type { CreateTableInput } from './table.types';

// Creamos una mesa nueva y generamos su QR.
export const createTableWithQrService = async (input: CreateTableInput) => {
  // Extraemos la URL base que manda el frontend admin.
  const { baseUrl } = input;

  // Buscamos la última mesa creada para saber cuál número sigue.
  const lastTable = await prisma.restaurantTable.findFirst({
    // Ordenamos por número de mesa descendente.
    orderBy: {
      // Tomamos la mesa con el número más alto.
      number: 'desc',
    },
  });

  // Si ya existe una mesa, sumamos 1; si no existe ninguna, empezamos en 1.
  const nextTableNumber = lastTable ? lastTable.number + 1 : 1;

  // Creamos la URL que tendrá el QR, por ejemplo: http://192.168.1.68:5173/menu/mesa/1
  const menuUrl = `${baseUrl}/menu/mesa/${nextTableNumber}`;

  // Convertimos esa URL en una imagen QR en formato base64.
  const qrCodeDataUrl = await QRCode.toDataURL(menuUrl);

  // Guardamos la mesa en la base de datos.
  const table = await prisma.restaurantTable.create({
    // Datos que se guardarán.
    data: {
      // Guardamos el número de mesa.
      number: nextTableNumber,

      // Guardamos el QR generado.
      qrCodeUrl: qrCodeDataUrl,
    },
  });

  // Regresamos los datos al controller.
  return {
    // Mensaje de éxito.
    message: 'Mesa creada correctamente',

    // Mesa guardada en base de datos.
    table,

    // URL que abre el menú del cliente.
    menuUrl,

    // Imagen del QR en base64.
    qrCodeDataUrl,
  };
};

// Generamos el PDF con el QR centrado.
export const generateTablePdfBufferService = async (
  // Número de mesa.
  tableNumber: number,

  // QR en formato base64.
  qrCodeDataUrl: string
) => {
  // Regresamos una promesa porque PDFKit genera el archivo por partes.
  return new Promise<Buffer>((resolve, reject) => {
    // Creamos el documento PDF.
    const doc = new PDFDocument({
      // Tamaño de hoja A4.
      size: 'A4',

      // Margen general del documento.
      margin: 50,
    });

    // Aquí guardaremos los fragmentos del PDF.
    const chunks: Buffer[] = [];

    // Cada vez que PDFKit genere datos, los guardamos.
    doc.on('data', (chunk) => chunks.push(chunk));

    // Cuando termine el PDF, unimos todos los fragmentos.
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Si ocurre un error, rechazamos la promesa.
    doc.on('error', reject);

    // Obtenemos el ancho de la página.
    const pageWidth = doc.page.width;

    // Escribimos el título centrado.
    doc.fontSize(30).text(`Mesa #${tableNumber}`, 0, 80, {
      // Usamos todo el ancho de la página.
      width: pageWidth,

      // Centramos el texto.
      align: 'center',
    });

    // Quitamos la parte inicial del base64 para quedarnos solo con la imagen.
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

    // Convertimos el QR base64 a Buffer para insertarlo en el PDF.
    const qrBuffer = Buffer.from(base64Data, 'base64');

    // Definimos el tamaño del QR.
    const qrSize = 260;

    // Calculamos la posición horizontal para centrar el QR.
    const qrX = (pageWidth - qrSize) / 2;

    // Definimos la posición vertical del QR.
    const qrY = 170;

    // Dibujamos el QR centrado.
    doc.image(qrBuffer, qrX, qrY, {
      // Ancho del QR.
      width: qrSize,

      // Alto del QR.
      height: qrSize,
    });

    // Escribimos el texto inferior centrado.
    doc.fontSize(16).text(
      // Texto que verá el cliente.
      'Escanea este código para ver el menú y realizar tu pedido.',

      // Posición horizontal.
      0,

      // Posición vertical debajo del QR.
      qrY + qrSize + 45,

      // Opciones del texto.
      {
        // Usamos todo el ancho de la página.
        width: pageWidth,

        // Centramos el texto.
        align: 'center',
      }
    );

    // Finalizamos el PDF.
    doc.end();
  });
};