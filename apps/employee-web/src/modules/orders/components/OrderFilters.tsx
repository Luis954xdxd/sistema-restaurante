interface Props {
  status: string;
  tableNumber: string;
  date: string;
  onStatusChange: (value: string) => void;
  onTableNumberChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

function OrderFilters({
  status,
  tableNumber,
  date,
  onStatusChange,
  onTableNumberChange,
  onDateChange,
  onReset,
}: Props) {
  return (
    <div className="employee-order-filters">
      <div className="employee-order-filter-group">
        <label>Estado</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="IN_PREPARATION">En preparación</option>
          <option value="READY">Listo</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      <div className="employee-order-filter-group">
        <label>Mesa</label>
        <input
          type="number"
          min="1"
          value={tableNumber}
          onChange={(e) => onTableNumberChange(e.target.value)}
          placeholder="Ej. 5"
        />
      </div>

      <div className="employee-order-filter-group">
        <label>Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="employee-order-filter-actions">
        <button
          type="button"
          className="button button-ghost"
          onClick={onReset}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default OrderFilters;