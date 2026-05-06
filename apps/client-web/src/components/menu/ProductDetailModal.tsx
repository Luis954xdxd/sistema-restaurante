// Importamos iconos.
import { Minus, Plus, ShoppingCart, Sparkles, X } from 'lucide-react';

// Importamos hooks de React.
import { useEffect, useState } from 'react';

// Importamos hook del carrito.
import { useCart } from '../../hooks/useCart';

// Importamos tipo del producto.
import type { MenuProduct } from '../../modules/menu/types/menu.types';

// Detectamos el host actual para imágenes en laptop/celular.
const API_HOST = window.location.hostname;

// URL base del backend.
const BACKEND_URL = `http://${API_HOST}:5000`;

// Props del modal.
interface Props {
  product: MenuProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

// Resolver URL de imagen.
function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('http')) {
    return imageUrl.replace('localhost', API_HOST);
  }

  return `${BACKEND_URL}${imageUrl}`;
}

// Modal premium de detalle de producto.
function ProductDetailModal({ product, isOpen, onClose }: Props) {
  // Hook del carrito.
  const { addItem, items } = useCart();

  // Cantidad seleccionada en el modal.
  const [quantity, setQuantity] = useState(1);

  // Nota especial del cliente.
  const [note, setNote] = useState('');

  // Reiniciamos cantidad/nota cuando cambia el producto o se abre el modal.
  useEffect(() => {
    if (!isOpen) return;

    setQuantity(1);
    setNote('');
  }, [isOpen, product?.id]);

  // Cerrar modal con tecla Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Si está cerrado o no hay producto, no renderizamos.
  if (!isOpen || !product) return null;

  // Imagen del producto.
  const imageSrc = resolveImageUrl(product.imageUrl);

  // Stock actual del backend.
  const stockCurrent = product.inventory?.stockCurrent ?? 0;

  // Producto dentro del carrito.
  const cartItem = items.find((item) => item.productId === product.id);

  // Cantidad ya agregada al carrito.
  const quantityInCart = cartItem?.quantity ?? 0;

  // Stock restante real.
  const remainingStock = stockCurrent - quantityInCart;

  // Saber si está agotado.
  const isOutOfStock = remainingStock <= 0;

  // Cantidad máxima que se puede seleccionar.
  const maxQuantity = Math.max(remainingStock, 0);

  // Total visual.
  // Lo calculamos normal, sin useMemo, para evitar error de hooks.
  const total = Number(product.price) * quantity;

  // Aumentar cantidad.
  const increaseQuantity = () => {
    if (quantity >= maxQuantity) return;

    setQuantity((current) => current + 1);
  };

  // Disminuir cantidad.
  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    setQuantity((current) => current - 1);
  };

  // Agregar al carrito.
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Agregamos el producto varias veces según la cantidad elegida.
    for (let index = 0; index < quantity; index += 1) {
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      });
    }

    // Lanzamos toast global.
    window.dispatchEvent(
      new CustomEvent('client:cart-toast', {
        detail: {
          productName:
            quantity > 1
              ? `${quantity}x ${product.name}`
              : product.name,
        },
      })
    );

    // Por ahora la nota solo queda lista para la siguiente fase.
    if (note.trim().length > 0) {
      console.log('Nota especial pendiente de conectar al backend:', note);
    }

    onClose();
  };

  return (
    <div className="client-product-modal-overlay" onClick={onClose}>
      <section
        className="client-product-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="client-product-modal-close"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="client-product-modal-image-area">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="client-product-modal-image"
            />
          ) : (
            <div className="client-product-modal-placeholder">
              <Sparkles size={44} />
              <span>Sin imagen</span>
            </div>
          )}

          <div className="client-product-modal-image-shade" />

          <div className="client-product-modal-category">
            {product.category.name}
          </div>

          <div
            className={
              isOutOfStock
                ? 'client-product-modal-stock out'
                : 'client-product-modal-stock'
            }
          >
            {isOutOfStock ? 'Agotado' : `Stock disponible: ${remainingStock}`}
          </div>
        </div>

        <div className="client-product-modal-content">
          <div className="client-product-modal-title-row">
            <div>
              <span>Detalle del producto</span>
              <h2>{product.name}</h2>
            </div>

            <strong>${Number(product.price).toFixed(2)}</strong>
          </div>

          <p className="client-product-modal-description">
            {product.description || 'Producto sin descripción.'}
          </p>

          <div className="client-product-modal-quantity-card">
            <div>
              <span>Cantidad</span>
              <strong>{quantity}</strong>
            </div>

            <div className="client-product-modal-quantity-actions">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus size={18} />
              </button>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= maxQuantity || isOutOfStock}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="client-product-modal-note">
            <label htmlFor="product-note">Nota especial</label>

            <textarea
              id="product-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ej. Sin cebolla, sin hielo, extra salsa..."
              rows={3}
            />

            <small>
              
            </small>
          </div>

          <div className="client-product-modal-total">
            <span>Total estimado</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="client-product-modal-add-button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={19} />
            {isOutOfStock ? 'Producto agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailModal;