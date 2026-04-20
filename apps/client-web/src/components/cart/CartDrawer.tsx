import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { createPublicOrder } from '../../modules/menu/services/menu.service';
import type { CreateOrderResponse } from '../../modules/menu/types/menu.types';
import './cart.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: CreateOrderResponse['order']) => void;
  mesaId?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  onOrderSuccess,
  mesaId,
}: Props) {
  const {
    items,
    totalAmount,
    clearCart,
    increaseItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        tipAmount: 0,
        tableNumber: mesaId ? Number(mesaId) : null,
      };

      console.log('PAYLOAD DEL PEDIDO:', payload);

      const response = await createPublicOrder(payload);

      clearCart();
      onClose();
      onOrderSuccess(response.order);
    } catch (error) {
      console.error('Error al crear pedido:', error);

      if (isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al realizar el pedido';

        window.alert(backendMessage);
      } else {
        window.alert('Error al realizar el pedido');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="client-cart-overlay">
      <aside className="client-cart-drawer open">
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
            items.map((item) => (
              <div key={item.productId} className="client-cart-item-card">
                <div className="client-cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} c/u</p>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>

                <div className="client-cart-item-actions">
                  <button
                    type="button"
                    onClick={() => decreaseItem(item.productId)}
                    disabled={loading}
                    title="Disminuir"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseItem(item.productId)}
                    disabled={loading}
                    title="Aumentar"
                  >
                    <Plus size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    disabled={loading}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
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
            disabled={items.length === 0 || loading}
          >
            Vaciar carrito
          </button>

          <button
            type="button"
            className="client-cart-submit-button"
            onClick={handleCreateOrder}
            disabled={items.length === 0 || loading}
          >
            {loading ? 'Procesando...' : 'Realizar pedido'}
          </button>
        </div>
      </aside>
    </div>
  );
}