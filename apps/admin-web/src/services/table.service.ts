// Importamos la instancia de axios configurada.
import { api } from '../services/api';

// Función que pide al backend generar y descargar el PDF del QR.
export async function downloadTableQrPdf(baseUrl: string): Promise<void> {
  // Hacemos petición GET al backend.
  const response = await api.get('/tables/generate-pdf', {
    // Mandamos la URL base que se guardará dentro del QR.
    params: {
      // Ejemplo: http://192.168.1.68:5173
      baseUrl,
    },

    // Indicamos que esperamos un archivo PDF.
    responseType: 'blob',
  });

  // Creamos un archivo tipo PDF con la respuesta.
  const blob = new Blob([response.data], {
    // Tipo de archivo.
    type: 'application/pdf',
  });

  // Creamos una URL temporal para descargar el archivo.
  const blobUrl = window.URL.createObjectURL(blob);

  // Creamos un enlace temporal invisible.
  const link = document.createElement('a');

  // Asignamos la URL temporal al enlace.
  link.href = blobUrl;

  // Nombre del archivo descargado.
  link.download = 'qr-mesa.pdf';

  // Insertamos el enlace en el documento.
  document.body.appendChild(link);

  // Simulamos clic para descargar.
  link.click();

  // Eliminamos el enlace del documento.
  document.body.removeChild(link);

  // Liberamos la URL temporal.
  window.URL.revokeObjectURL(blobUrl);
}