import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';
import ReportDateFilter from '../components/ReportDateFilter';
import ReportOrdersTable from '../components/ReportOrdersTable';
import ReportSummaryCards from '../components/ReportSummaryCards';
import {
  downloadDailySummaryPdf,
  getDailyOrders,
  getDailySummary,
} from '../services/reports.service';
import '../styles/reports.css';

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function ReportsPage() {
  const [date, setDate] = useState(getTodayDateString());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const summaryQuery = useQuery({
    queryKey: ['daily-summary', date],
    queryFn: () => getDailySummary(date || undefined),
  });

  const ordersQuery = useQuery({
    queryKey: ['daily-orders', date],
    queryFn: () => getDailyOrders(date || undefined),
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadDailySummaryPdf(date || undefined),
    onSuccess: () => {
      setFeedback({
        type: 'success',
        text: 'El PDF del reporte se descargó correctamente.',
      });
    },
    onError: () => {
      setFeedback({
        type: 'error',
        text: 'No se pudo descargar el PDF del reporte.',
      });
    },
  });

  const summary = summaryQuery.data?.summary;
  const orders = ordersQuery.data?.orders ?? [];

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Consulta resúmenes diarios, pedidos y descarga PDF"
      />

      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="reports-page-layout">
        <div className="report-panel-card">
          <h3>Filtros del reporte</h3>
          <p>Selecciona una fecha para consultar el resumen diario.</p>

          <ReportDateFilter
            date={date}
            onDateChange={(value) => {
              setDate(value);
              setFeedback(null);
            }}
            onReset={() => {
              setDate(getTodayDateString());
              setFeedback(null);
            }}
            onDownloadPdf={() => downloadMutation.mutate()}
            isDownloading={downloadMutation.isPending}
          />
        </div>

        <div className="report-panel-card">
          <h3>Resumen diario</h3>
          <p>Métricas principales de ventas y pedidos del día.</p>

          {summaryQuery.isLoading ? (
            <div className="report-empty-state">Cargando resumen...</div>
          ) : summaryQuery.isError || !summary ? (
            <div className="report-empty-state">
              No se pudo cargar el resumen diario.
            </div>
          ) : (
            <ReportSummaryCards summary={summary} />
          )}
        </div>

        <div className="report-panel-card">
          <h3>Pedidos del día</h3>
          <p>Detalle de pedidos registrados para la fecha seleccionada.</p>

          {ordersQuery.isLoading ? (
            <div className="report-empty-state">Cargando pedidos del día...</div>
          ) : ordersQuery.isError ? (
            <div className="report-empty-state">
              No se pudieron cargar los pedidos del día.
            </div>
          ) : (
            <ReportOrdersTable orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;