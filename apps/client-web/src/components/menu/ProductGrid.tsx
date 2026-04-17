// Importamos tarjeta de producto
import ProductCard from './ProductCard';

// Importamos estado vacío
import EmptyState from '../ui/EmptyState';

// Importamos tipo
import type { MenuProduct } from '../../modules/menu/types/menu.types';

// Props del grid
interface Props {
  products: MenuProduct[];
}

// Grid de productos
function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay productos disponibles"
        description="Prueba con otra categoría o vuelve más tarde."
      />
    );
  }

  return (
    <div className="client-product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;