

interface Props {
  status: string;
  userId: string;
  date: string;
  onStatusChange: (value: string) => void;
  onUserIdChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

function OrderFilters({
  status,
  userId,
  date,
  onStatusChange,
  onUserIdChange,
  onDateChange,
  onReset,
}: Props) {
  return (
    <div className="order-filters">
      <div className="order-filter-group">
        <label htmlFor="order-status-filter">Estado</label>
        <select
          id="order-status-filter"
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

      <div className="order-filter-group">
        <label htmlFor="order-user-filter">ID Usuario</label>
        <input
          id="order-user-filter"
          type="number"
          min="1"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          placeholder="Ej. 1"
        />
      </div>

      <div className="order-filter-group">
        <label htmlFor="order-date-filter">Fecha</label>
        <input
          id="order-date-filter"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="order-filter-actions">
        <button type="button" className="button-secondary" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default OrderFilters;