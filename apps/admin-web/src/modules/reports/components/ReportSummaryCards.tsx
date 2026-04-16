interface Props {
  summary: {
    totalOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    subtotalAmount: number;
    tipAmount: number;
    totalAmount: number;
  };
}

function ReportSummaryCards({ summary }: Props) {
  return (
    <div className="report-summary-grid">
      <div className="report-stat-card">
        <span>Total de pedidos</span>
        <strong>{summary.totalOrders}</strong>
      </div>

      <div className="report-stat-card">
        <span>Entregados</span>
        <strong>{summary.deliveredOrders}</strong>
      </div>

      <div className="report-stat-card">
        <span>Cancelados</span>
        <strong>{summary.cancelledOrders}</strong>
      </div>

      <div className="report-stat-card">
        <span>Subtotal</span>
        <strong>${summary.subtotalAmount}</strong>
      </div>

      <div className="report-stat-card">
        <span>Propinas</span>
        <strong>${summary.tipAmount}</strong>
      </div>

      <div className="report-stat-card">
        <span>Total vendido</span>
        <strong>${summary.totalAmount}</strong>
      </div>
    </div>
  );
}

export default ReportSummaryCards;