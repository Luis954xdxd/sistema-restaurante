// Importamos iconos
import { Minus, Plus, Trash2 } from 'lucide-react';

// Importamos hook del carrito
import { useCart } from '../../hooks/useCart';

// Importamos tipo
import type { CartItem } from '../../modules/menu/types/menu.types';

// Props del item
interface Props {
  item: CartItem;
}

// Card del producto dentro del carrito
function CartItemCard({ item }: Props) {
  const { increaseItem, decreaseItem, removeItem } = useCart();

  return (
    <div className="client-cart-item-card">
      <div>
        <h4>{item.name}</h4>
        <p>
          ${item.price} × {item.quantity}
        </p>
      </div>

      <div className="client-cart-item-actions">
        <button type="button" onClick={() => decreaseItem(item.productId)}>
          <Minus size={16} />
        </button>

        <span>{item.quantity}</span>

        <button type="button" onClick={() => increaseItem(item.productId)}>
          <Plus size={16} />
        </button>

        <button type="button" onClick={() => removeItem(item.productId)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;