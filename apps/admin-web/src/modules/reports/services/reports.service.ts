import { api } from '../../../services/api';
import type {
  DailyOrdersResponse,
  DailySummaryResponse,
} from '../types/reports.types';

function buildDateQuery(date?: string) {
  if (!date) return '';
  return `?date=${encodeURIComponent(date)}`;
}

export async function getDailySummary(date?: string) {
  const { data } = await api.get<DailySummaryResponse>(
    `/reports/daily-summary${buildDateQuery(date)}`
  );
  return data;
}

export async function getDailyOrders(date?: string) {
  const { data } = await api.get<DailyOrdersResponse>(
    `/reports/daily-orders${buildDateQuery(date)}`
  );
  return data;
}

export async function downloadDailySummaryPdf(date?: string) {
  const response = await api.get(
    `/reports/daily-summary-pdf${buildDateQuery(date)}`,
    {
      responseType: 'blob',
    }
  );

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = date
    ? `reporte-diario-${date}.pdf`
    : 'reporte-diario.pdf';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}