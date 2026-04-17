// Importamos iconos
import { ShoppingBag, X } from 'lucide-react';

// Importamos hook del carrito
import { useCart } from '../../hooks/useCart';

// Importamos card del carrito
import CartItemCard from './CartItemCard';

// Props del drawer
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Drawer lateral del carrito
function CartDrawer({ isOpen, onClose }: Props) {
  const { items, totalAmount, clearCart } = useCart();

  return (
    <aside className={`client-cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="client-cart-header">
        <div>
          <h3>Tu carrito</h3>
          <p>Revisa los productos antes de pedir</p>
        </div>

        <button type="button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="client-cart-body">
        {items.length === 0 ? (
          <div className="client-cart-empty">
            <ShoppingBag size={30} />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => <CartItemCard key={item.productId} item={item} />)
        )}
      </div>

      <div className="client-cart-footer">
        <div className="client-cart-total">
          <span>Total</span>
          <strong>${totalAmount.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="client-cart-clear-button"
          onClick={clearCart}
          disabled={items.length === 0}
        >
          Vaciar carrito
        </button>

        <button
          type="button"
          className="client-cart-submit-button"
          disabled={items.length === 0}
        >
          Realizar pedido
        </button>
      </div>
    </aside>
  );
}

export default CartDrawer;