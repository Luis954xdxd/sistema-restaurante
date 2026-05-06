import type { InventoryMovement } from '../types/inventory.types';

interface Props {
  movements: InventoryMovement[];
}

function getMovementLabel(type: string) {
  if (type === 'ENTRY') return 'Entrada';
  if (type === 'EXIT') return 'Salida';
  if (type === 'ADJUSTMENT') return 'Ajuste';

  return type;
}

function getMovementSymbol(type: string) {
  if (type === 'ENTRY') return '+';
  if (type === 'EXIT') return '-';
  if (type === 'ADJUSTMENT') return '=';

  return '';
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function InventoryMovementHistory({ movements }: Props) {
  if (movements.length === 0) {
    return (
      <div className="employee-inventory-empty">
        Todavía no hay movimientos de inventario.
      </div>
    );
  }

  return (
    <section className="employee-inventory-history-card">
      <div className="employee-inventory-history-header">
        <div>
          <h3>Historial reciente</h3>
          <p>Últimos movimientos registrados en el inventario.</p>
        </div>
      </div>

      <div className="employee-inventory-history-list">
        {movements.map((movement) => (
          <article
            key={movement.id}
            className={`employee-inventory-history-item ${movement.movementType.toLowerCase()}`}
          >
            <div className="employee-inventory-history-symbol">
              {getMovementSymbol(movement.movementType)}
            </div>

            <div className="employee-inventory-history-content">
              <div className="employee-inventory-history-top">
                <strong>{movement.product.name}</strong>

                <span>{formatDate(movement.createdAt)}</span>
              </div>

              <div className="employee-inventory-history-detail">
                <span>{getMovementLabel(movement.movementType)}</span>
                <b>
                  {movement.quantity} {movement.product.category.name}
                </b>
              </div>

              {movement.reason && (
                <p>{movement.reason}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InventoryMovementHistory;