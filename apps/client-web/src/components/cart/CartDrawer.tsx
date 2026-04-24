// Importamos iconos para botones del carrito.
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

// Importamos helper para detectar errores de Axios.
import { isAxiosError } from 'axios';

// Importamos useState para manejar el estado de carga.
import { useState } from 'react';

// Importamos el hook del carrito.
import { useCart } from '../../hooks/useCart';

// Importamos la función que crea el pedido público.
import { createPublicOrder } from '../../modules/menu/services/menu.service';

// Importamos el tipo de respuesta del pedido.
import type { CreateOrderResponse } from '../../modules/menu/types/menu.types';

// Importamos estilos del carrito.
import './cart.css';

// Definimos las props que recibe el componente.
interface Props {
  // Indica si el carrito está abierto.
  isOpen: boolean;

  // Función para cerrar el carrito.
  onClose: () => void;

  // Función que se ejecuta cuando el pedido se crea correctamente.
  onOrderSuccess: (order: CreateOrderResponse['order']) => void;

  // Número de mesa recibido desde la URL.
  mesaId?: string;
}

// Componente principal del carrito lateral.
export default function CartDrawer({
  isOpen,
  onClose,
  onOrderSuccess,
  mesaId,
}: Props) {
  // Obtenemos datos y funciones del carrito.
  const {
    items,
    totalAmount,
    clearCart,
    increaseItem,
    decreaseItem,
    removeItem,
  } = useCart();

  // Estado para bloquear botones mientras se procesa el pedido.
  const [loading, setLoading] = useState(false);

  // Función para crear pedido.
  const handleCreateOrder = async () => {
    try {
      // Activamos carga.
      setLoading(true);

      // Armamos el payload para enviarlo al backend.
      const payload = {
        // Convertimos los productos del carrito al formato del backend.
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),

        // Por ahora la propina va en cero.
        tipAmount: 0,

        // Convertimos la mesa a número si existe.
        tableNumber: mesaId ? Number(mesaId) : null,
      };

      // Mostramos el payload en consola para verificar.
      console.log('PAYLOAD DEL PEDIDO:', payload);

      // Enviamos el pedido al backend.
      const response = await createPublicOrder(payload);

      // Limpiamos el carrito.
      clearCart();

      // Cerramos el carrito.
      onClose();

      // Mostramos modal de éxito.
      onOrderSuccess(response.order);
    } catch (error) {
      // Mostramos error en consola.
      console.error('Error al crear pedido:', error);

      // Si el error viene de Axios, mostramos mensaje del backend.
      if (isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al realizar el pedido';

        window.alert(backendMessage);
      } else {
        // Error genérico.
        window.alert('Error al realizar el pedido');
      }
    } finally {
      // Quitamos carga.
      setLoading(false);
    }
  };

  // Si el carrito está cerrado, no renderizamos nada.
  if (!isOpen) return null;

  // Render del carrito.
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
