import { Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import type { MenuProduct } from '../../modules/menu/types/menu.types';

interface Props {
  product: MenuProduct;
}

function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:5000${imageUrl}`;
}

function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();

  const imageSrc = resolveImageUrl(product.imageUrl);

  // Stock actual del backend
  const stockCurrent = product.inventory?.stockCurrent ?? 0;

  // Lo que ya está agregado en carrito de este producto
  const cartItem = items.find((item) => item.productId === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  // Lo que realmente queda disponible para seguir agregando
  const remainingStock = stockCurrent - quantityInCart;

  // Si ya no queda stock, apagamos el botón
  const isOutOfStock = remainingStock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;

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
          <img
            src={imageSrc}
            alt={product.name}
            className="client-product-image"
          />
        ) : (
          <div className="client-product-placeholder">Sin imagen</div>
        )}

        {isOutOfStock ? (
          <div className="client-product-stock-badge out">
            Sin stock
          </div>
        ) : (
          <div className="client-product-stock-badge">
            Stock: {remainingStock}
          </div>
        )}
      </div>

      <div className="client-product-content">
        <span className="client-product-category">{product.category.name}</span>
        <h3>{product.name}</h3>
        <p>{product.description || 'Producto sin descripción'}</p>

        <div className="client-product-footer">
          <strong>${product.price}</strong>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={
              isOutOfStock
                ? 'client-add-button disabled'
                : 'client-add-button'
            }
          >
            <Plus size={16} />
            <span>{isOutOfStock ? 'Agotado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;