import { Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import type { MenuProduct } from '../../modules/menu/types/menu.types';

// Detecta si estás en PC o celular.
// PC: localhost
// Celular: 192.168.1.9
const API_HOST = window.location.hostname;

// Backend usando el mismo host donde abriste el cliente.
const BACKEND_URL = `http://${API_HOST}:5000`;

// Convierte la ruta de imagen a una URL válida.
function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('http')) {
    return imageUrl.replace('localhost', API_HOST);
  }

  return `${BACKEND_URL}${imageUrl}`;
}

interface Props {
  product: MenuProduct;
}

function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();

  // Aquí usamos la función correcta.
  const imageSrc = getImageUrl(product.imageUrl);

  const stockCurrent = product.inventory?.stockCurrent ?? 0;

  const cartItem = items.find((item) => item.productId === product.id);

  const quantityInCart = cartItem?.quantity ?? 0;

  const remainingStock = stockCurrent - quantityInCart;

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
          <div className="client-product-stock-badge out">Sin stock</div>
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
              isOutOfStock ? 'client-add-button disabled' : 'client-add-button'
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