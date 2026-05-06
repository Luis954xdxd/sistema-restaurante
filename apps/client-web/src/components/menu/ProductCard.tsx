// Importamos iconos.
import { Check, Eye, Plus, Sparkles } from 'lucide-react';

// Importamos hooks de React.
import { useEffect, useRef, useState } from 'react';

// Importamos hook del carrito.
import { useCart } from '../../hooks/useCart';

// Importamos modal de detalle.
import ProductDetailModal from './ProductDetailModal';

// Importamos tipo del producto.
import type { MenuProduct } from '../../modules/menu/types/menu.types';

// Detectamos el host actual.
// Esto sirve para que las imágenes funcionen en laptop y celular.
const API_HOST = window.location.hostname;

// Construimos la URL base del backend.
const BACKEND_URL = `http://${API_HOST}:5000`;

// Props del componente.
interface Props {
  product: MenuProduct;
}

// Función para resolver la URL de imagen.
function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('http')) {
    return imageUrl.replace('localhost', API_HOST);
  }

  return `${BACKEND_URL}${imageUrl}`;
}

// Componente de tarjeta de producto.
function ProductCard({ product }: Props) {
  // Obtenemos productos del carrito.
  const { items } = useCart();

  // Referencia a la tarjeta para detectar cuando aparece en pantalla.
  const cardRef = useRef<HTMLElement | null>(null);

  // Estado para animación al aparecer con scroll.
  const [isVisible, setIsVisible] = useState(false);

  // Estado para mostrar animación cuando se agrega desde el modal.
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Estado para abrir/cerrar modal.
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Resolvemos imagen del producto.
  const imageSrc = resolveImageUrl(product.imageUrl);

  // Stock actual del backend.
  const stockCurrent = product.inventory?.stockCurrent ?? 0;

  // Producto actual dentro del carrito.
  const cartItem = items.find((item) => item.productId === product.id);

  // Cantidad de este producto ya agregada al carrito.
  const quantityInCart = cartItem?.quantity ?? 0;

  // Stock restante disponible.
  const remainingStock = stockCurrent - quantityInCart;

  // Si ya no queda stock, bloqueamos el botón.
  const isOutOfStock = remainingStock <= 0;

  // Si queda poco stock, mostramos alerta visual.
  const isLowStock = remainingStock > 0 && remainingStock <= 5;

  // Detectamos cuando la tarjeta entra en pantalla para animarla.
  useEffect(() => {
    const currentCard = cardRef.current;

    if (!currentCard) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(currentCard);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Escuchamos el toast global para animar esta card si agregaron este producto.
  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{
        productName?: string;
      }>;

      const productName = customEvent.detail?.productName || '';

      if (productName.includes(product.name)) {
        setAddedAnimation(true);

        setTimeout(() => {
          setAddedAnimation(false);
        }, 900);
      }
    };

    window.addEventListener('client:cart-toast', handleToast);

    return () => {
      window.removeEventListener('client:cart-toast', handleToast);
    };
  }, [product.name]);

  return (
    <>
      <article
        ref={cardRef}
        className={[
          'client-product-card',
          isVisible ? 'client-product-card-visible' : '',
          addedAnimation ? 'client-product-card-added' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button
          type="button"
          className="client-product-card-click-layer"
          onClick={() => setIsDetailOpen(true)}
          aria-label={`Ver detalle de ${product.name}`}
        />

        <div className="client-product-image-wrap">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="client-product-image"
              loading="lazy"
            />
          ) : (
            <div className="client-product-placeholder">
              <Sparkles size={34} />
              <span>Sin imagen</span>
            </div>
          )}

          <div className="client-product-image-gradient" />

          <div className="client-product-category-pill">
            {product.category.name}
          </div>

          {isOutOfStock ? (
            <div className="client-product-stock-badge out">Agotado</div>
          ) : isLowStock ? (
            <div className="client-product-stock-badge low">
              Últimos {remainingStock}
            </div>
          ) : (
            <div className="client-product-stock-badge">
              Stock {remainingStock}
            </div>
          )}

          {addedAnimation && (
            <div className="client-product-added-badge">
              <Check size={16} />
              Agregado
            </div>
          )}
        </div>

        <div className="client-product-content">
          <div className="client-product-title-row">
            <h3>{product.name}</h3>
            <strong>${Number(product.price).toFixed(2)}</strong>
          </div>

          <p>{product.description || 'Producto sin descripción'}</p>

          <div className="client-product-footer">
            <div className="client-product-cart-info">
              {quantityInCart > 0 ? (
                <span>{quantityInCart} en carrito</span>
              ) : (
                <span>Ver detalle y elegir cantidad</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsDetailOpen(true)}
              disabled={isOutOfStock}
              className={
                isOutOfStock
                  ? 'client-add-button disabled'
                  : 'client-add-button'
              }
            >
              {isOutOfStock ? (
                <>
                  <Eye size={17} />
                  <span>Agotado</span>
                </>
              ) : (
                <>
                  <Plus size={17} />
                  <span>Elegir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      <ProductDetailModal
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}

export default ProductCard;