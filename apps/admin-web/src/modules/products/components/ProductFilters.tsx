interface CategoryOption {
  id: number;
  name: string;
}

interface Props {
  search: string;
  categoryId: string;
  availabilityFilter: string;
  categories: CategoryOption[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onReset: () => void;
}

function ProductFilters({
  search,
  categoryId,
  availabilityFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onReset,
}: Props) {
  return (
    <div className="product-filters">
      <div className="product-filter-group">
        <label htmlFor="search-product">Buscar</label>
        <input
          id="search-product"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre"
        />
      </div>

      <div className="product-filter-group">
        <label htmlFor="category-product">Categoría</label>
        <select
          id="category-product"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="product-filter-group">
        <label htmlFor="availability-product">Disponibilidad</label>
        <select
          id="availability-product"
          value={availabilityFilter}
          onChange={(e) => onAvailabilityChange(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="available">Disponibles</option>
          <option value="unavailable">No disponibles</option>
        </select>
      </div>

      <div className="product-filter-actions">
        <button type="button" className="button-secondary" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;