// Importamos icono
import { Plus } from 'lucide-react';

// Importamos hook del carrito
import { useCart } from '../../hooks/useCart';

// Importamos tipo del producto
import type { MenuProduct } from '../../modules/menu/types/menu.types';

// Props de la tarjeta
interface Props {
  product: MenuProduct;
}

// Función para resolver imagen
function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:5000${imageUrl}`;
}

// Tarjeta individual del producto
function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  // Imagen final
  const imageSrc = resolveImageUrl(product.imageUrl);

  // Agregamos producto al carrito
  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    });
  };

  return (
    <article className="client-product-card">
      <div className="client-product-image-wrap">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className="client-product-image" />
        ) : (
          <div className="client-product-placeholder">Sin imagen</div>
        )}
      </div>

      <div className="client-product-content">
        <span className="client-product-category">{product.category.name}</span>
        <h3>{product.name}</h3>
        <p>{product.description || 'Producto sin descripción'}</p>

        <div className="client-product-footer">
          <strong>${product.price}</strong>

          <button type="button" onClick={handleAdd}>
            <Plus size={16} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;