interface Props {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

function CategoryFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <div className="category-filters">
      <div className="category-filter-group">
        <label htmlFor="search-category">Buscar</label>
        <input
          id="search-category"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre"
        />
      </div>

      <div className="category-filter-group">
        <label htmlFor="status-category">Estado</label>
        <select
          id="status-category"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>
      </div>

      <div className="category-filter-actions">
        <button type="button" className="button-secondary" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default CategoryFilters;