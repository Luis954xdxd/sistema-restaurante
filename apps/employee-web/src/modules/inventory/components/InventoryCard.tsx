// Importamos iconos.
import { AlertTriangle, Boxes, Minus, PackagePlus, SlidersHorizontal } from 'lucide-react';

// Importamos tipos.
import type {
  InventoryItem,
  InventoryMovementType,
} from '../types/inventory.types';

// Props del componente.
interface Props {
  item: InventoryItem;
  onOpenMovement: (
    item: InventoryItem,
    movementType: InventoryMovementType
  ) => void;
}

// Tarjeta del inventario.
function InventoryCard({ item, onOpenMovement }: Props) {
  // Revisamos si el stock está bajo.
  const isLowStock = item.stockCurrent <= item.stockMinimum;

  return (
    <article className="employee-inventory-card">
      <div className="employee-inventory-card-header">
        <div>
          <span className="employee-inventory-category">
            {item.product.category.name}
          </span>

          <h3>{item.product.name}</h3>

          <p>{item.product.description || 'Producto sin descripción'}</p>
        </div>

        <div
          className={
            isLowStock
              ? 'employee-inventory-status low'
              : 'employee-inventory-status ok'
          }
        >
          {isLowStock ? (
            <>
              <AlertTriangle size={16} />
              Stock bajo
            </>
          ) : (
            <>
              <Boxes size={16} />
              Disponible
            </>
          )}
        </div>
      </div>

      <div className="employee-inventory-stock-box">
        <div>
          <span>Stock actual</span>
          <strong>
            {item.stockCurrent} {item.unit}
          </strong>
        </div>

        <div>
          <span>Stock mínimo</span>
          <strong>
            {item.stockMinimum} {item.unit}
          </strong>
        </div>
      </div>

      <div className="employee-inventory-actions">
        <button
          type="button"
          className="employee-inventory-action entry"
          onClick={() => onOpenMovement(item, 'ENTRY')}
        >
          <PackagePlus size={17} />
          Entrada
        </button>

        <button
          type="button"
          className="employee-inventory-action adjustment"
          onClick={() => onOpenMovement(item, 'ADJUSTMENT')}
        >
          <SlidersHorizontal size={17} />
          Ajuste
        </button>

        <button
          type="button"
          className="employee-inventory-action exit"
          onClick={() => onOpenMovement(item, 'EXIT')}
        >
          <Minus size={17} />
          Salida
        </button>
      </div>
    </article>
  );
}

export default InventoryCard;