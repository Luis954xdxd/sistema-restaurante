// Importamos useState para manejar carga y mensajes.
import { useState } from 'react';

// Importamos el encabezado visual de páginas.
import PageHeader from '../../../components/ui/PageHeader';

// Importamos el servicio que pide el PDF al backend.
import { downloadTableQrPdf } from '../../../services/table.service';

// Creamos el componente de la página QR.
function TablesQrPage() {
  // Estado para saber si está generando el QR.
  const [loading, setLoading] = useState(false);

  // Estado para mostrar mensajes al usuario.
  const [feedback, setFeedback] = useState<string | null>(null);

  // Función que se ejecuta cuando presionas el botón.
  const handleDownloadQr = async () => {
    // Intentamos generar el QR.
    try {
      // Activamos carga.
      setLoading(true);

      // Limpiamos mensajes anteriores.
      setFeedback(null);

      // IMPORTANTE:
      // Cambia esta IP por la IPv4 de tu computadora para que el celular pueda abrir el menú.
      await downloadTableQrPdf('http://192.168.100.208: 5174');

      // Mostramos mensaje de éxito.
      setFeedback('QR de mesa generado correctamente.');
    } catch (error) {
      // Mostramos el error en consola.
      console.error('Error al generar QR:', error);

      // Mostramos mensaje visual de error.
      setFeedback('No se pudo generar el QR de mesa.');
    } finally {
      // Quitamos carga.
      setLoading(false);
    }
  };

  // Renderizamos la pantalla.
  return (
    <div>
      {/* Encabezado de la página */}
      <PageHeader
        title="QR de mesas"
        subtitle="Genera códigos QR para que los clientes pidan desde su mesa."
      />

      {/* Tarjeta principal */}
      <section className="panel-card">
        {/* Título de la tarjeta */}
        <h3>Generar nueva mesa</h3>

        {/* Explicación para el admin */}
        <p>
          Al presionar el botón, el sistema creará automáticamente una nueva mesa
          y descargará un PDF con su código QR.
        </p>

        {/* Botón para generar QR */}
        <button
          type="button"
          className="button-primary"
          onClick={handleDownloadQr}
          disabled={loading}
        >
          {/* Texto dinámico según estado de carga */}
          {loading ? 'Generando QR...' : 'Generar QR de nueva mesa'}
        </button>

        {/* Mensaje de éxito o error */}
        {feedback && <p>{feedback}</p>}
      </section>
    </div>
  );
}

// Exportamos la página.
export default TablesQrPage;