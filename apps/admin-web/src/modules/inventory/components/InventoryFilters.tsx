interface Props {
  search: string;
  lowStockOnly: boolean;
  onSearchChange: (value: string) => void;
  onLowStockChange: (value: boolean) => void;
  onReset: () => void;
}

function InventoryFilters({
  search,
  lowStockOnly,
  onSearchChange,
  onLowStockChange,
  onReset,
}: Props) {
  return (
    <div className="inventory-filters">
      <div className="inventory-filter-group">
        <label htmlFor="inventory-search">Buscar</label>
        <input
          id="inventory-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre de producto"
        />
      </div>

      <div className="inventory-filter-group inventory-checkbox-group">
        <label htmlFor="inventory-low-stock">Solo stock bajo</label>
        <input
          id="inventory-low-stock"
          type="checkbox"
          checked={lowStockOnly}
          onChange={(e) => onLowStockChange(e.target.checked)}
        />
      </div>

      <div className="inventory-filter-actions">
        <button type="button" className="button-secondary" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default InventoryFilters;