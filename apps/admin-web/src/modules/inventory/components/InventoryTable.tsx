import type { InventoryItem } from '../types/inventory.types';

interface Props {
  inventoryItems: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
}

function InventoryTable({ inventoryItems, onEdit }: Props) {
  if (inventoryItems.length === 0) {
    return (
      <div className="inventory-empty-state">
        No se encontraron registros de inventario con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="inventory-table-wrapper">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock actual</th>
            <th>Stock mínimo</th>
            <th>Unidad</th>
            <th>Alerta</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {inventoryItems.map((item) => {
            const lowStock = item.stockCurrent <= item.stockMinimum;

            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product.name}</td>
                <td>{item.product.category.name}</td>
                <td>{item.stockCurrent}</td>
                <td>{item.stockMinimum}</td>
                <td>{item.unit}</td>
                <td>
                  <span
                    className={
                      lowStock
                        ? 'status-badge status-inactive'
                        : 'status-badge status-active'
                    }
                  >
                    {lowStock ? 'Stock bajo' : 'Normal'}
                  </span>
                </td>
                <td>
                  <div className="inventory-actions">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;