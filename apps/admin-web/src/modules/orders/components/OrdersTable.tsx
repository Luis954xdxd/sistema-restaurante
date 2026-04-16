import type { Order } from '../types/orders.types';

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

function OrdersTable({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="order-empty-state">
        No se encontraron pedidos con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="order-table-wrapper">
      <table className="order-table">
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
                <span className={`order-status-badge order-status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>${order.subtotal}</td>
              <td>${order.tipAmount}</td>
              <td>${order.total}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <div className="order-items-preview">
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