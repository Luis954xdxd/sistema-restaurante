interface Props {
  date: string;
  onDateChange: (value: string) => void;
  onReset: () => void;
  onDownloadPdf: () => void;
  isDownloading?: boolean;
}

function ReportDateFilter({
  date,
  onDateChange,
  onReset,
  onDownloadPdf,
  isDownloading,
}: Props) {
  return (
    <div className="report-filter-bar">
      <div className="report-filter-group">
        <label htmlFor="report-date">Fecha del reporte</label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="report-filter-actions">
        <button type="button" className="button-secondary" onClick={onReset}>
          Hoy
        </button>

        <button
          type="button"
          className="button-primary"
          onClick={onDownloadPdf}
          disabled={isDownloading}
        >
          {isDownloading ? 'Descargando...' : 'Descargar PDF'}
        </button>
      </div>
    </div>
  );
}

export default ReportDateFilter;