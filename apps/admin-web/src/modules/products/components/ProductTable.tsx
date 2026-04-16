import type { Product } from '../types/products.types';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
}

function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:5000${imageUrl}`;
}

function ProductTable({ products, onEdit, onToggleAvailability }: Props) {
  if (products.length === 0) {
    return (
      <div className="product-empty-state">
        No se encontraron productos con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th className="col-image">Imagen</th>
            <th className="col-id">ID</th>
            <th className="col-name">Nombre</th>
            <th className="col-description">Descripción</th>
            <th className="col-price">Precio</th>
            <th className="col-category">Categoría</th>
            <th className="col-status">Estado</th>
            <th className="col-actions">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const imageSrc = resolveImageUrl(product.imageUrl);

            return (
              <tr key={product.id}>
                <td className="col-image">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="product-thumb"
                    />
                  ) : (
                    <div className="product-thumb-placeholder">Sin imagen</div>
                  )}
                </td>

                <td className="col-id">{product.id}</td>

                <td className="col-name">
                  <div className="table-text-clamp table-name">{product.name}</div>
                </td>

                <td className="col-description">
                  <div className="table-text-clamp">
                    {product.description || 'Sin descripción'}
                  </div>
                </td>

                <td className="col-price">${product.price}</td>

                <td className="col-category">
                  <div className="table-text-clamp">{product.category.name}</div>
                </td>

                <td className="col-status">
                  <span
                    className={
                      product.isAvailable
                        ? 'status-badge status-active'
                        : 'status-badge status-inactive'
                    }
                  >
                    {product.isAvailable ? 'Disponible' : 'No disponible'}
                  </span>
                </td>

                <td className="col-actions">
                  <div className="product-actions">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => onEdit(product)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={product.isAvailable ? 'button-danger' : 'button-primary'}
                      onClick={() => onToggleAvailability(product)}
                    >
                      {product.isAvailable ? 'Desactivar' : 'Activar'}
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

export default ProductTable;