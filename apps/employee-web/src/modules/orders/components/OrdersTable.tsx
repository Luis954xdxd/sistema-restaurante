// Importamos tipos
import type { Order } from '../types/orders.types';

// Props de la tabla
interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

// Tabla de pedidos
function OrdersTable({ orders, onSelect }: Props) {
  // Si no hay pedidos, mostramos estado vacío
  if (orders.length === 0) {
    return (
      <div className="employee-order-empty-state">
        No se encontraron pedidos con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="employee-order-table-wrapper">
      <table className="employee-order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Subtotal</th>
            <th>Propina</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>
                {order.user.firstName} {order.user.lastName}
              </td>

              <td>
                <span
                  className={`employee-order-status-badge employee-order-status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </td>

              <td>${order.subtotal}</td>
              <td>${order.tipAmount}</td>
              <td>${order.total}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>

              <td>
                <div className="employee-order-items-preview">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </td>

              <td>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => onSelect(order)}
                >
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;