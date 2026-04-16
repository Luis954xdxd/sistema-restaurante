// Props del bloque de filtros
interface Props {
  status: string;
  userId: string;
  date: string;
  onStatusChange: (value: string) => void;
  onUserIdChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

// Componente de filtros de pedidos
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
    <div className="employee-order-filters">
      <div className="employee-order-filter-group">
        <label htmlFor="employee-order-status-filter">Estado</label>

        <select
          id="employee-order-status-filter"
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
        <label htmlFor="employee-order-user-filter">ID Usuario</label>

        <input
          id="employee-order-user-filter"
          type="number"
          min="1"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          placeholder="Ej. 1"
        />
      </div>

      <div className="employee-order-filter-group">
        <label htmlFor="employee-order-date-filter">Fecha</label>

        <input
          id="employee-order-date-filter"
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