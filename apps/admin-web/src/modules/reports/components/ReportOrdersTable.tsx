import type { ReportOrder } from '../types/reports.types';

interface Props {
  orders: ReportOrder[];
}

function ReportOrdersTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="report-empty-state">
        No hubo pedidos en la fecha seleccionada.
      </div>
    );
  }

  return (
    <div className="report-table-wrapper">
      <table className="report-table">
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
                <div className="report-items-preview">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportOrdersTable;