// Importamos iconos.
import { Clock3, ShoppingCart } from 'lucide-react';

// Importamos hook del carrito.
import { useCart } from '../../hooks/useCart';

// Props que recibe el header del cliente.
interface Props {
  // Función para abrir el carrito.
  onOpenCart: () => void;

  // Texto opcional de mesa. Ejemplo: Mesa #5.
  mesaLabel?: string | null;

  // Cantidad de pedidos pendientes de pago.
  pendingOrdersCount?: number;

  // Función para abrir el panel de pedidos pendientes.
  onOpenPendingOrders?: () => void;
}

// Header principal del menú del cliente.
function ClientHeader({
  onOpenCart,
  mesaLabel,
  pendingOrdersCount = 0,
  onOpenPendingOrders,
}: Props) {
  // Obtenemos productos del carrito.
  const { items } = useCart();

  // Calculamos cantidad total de productos en carrito.
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="client-menu-header">
      <div>
        {mesaLabel && (
          <span className="client-menu-table-label">
            {mesaLabel}
          </span>
        )}

        <h1>Menú del Restaurante</h1>

        <p>Explora los productos disponibles y arma tu pedido</p>
      </div>

      <div className="client-menu-header-actions">
        {pendingOrdersCount > 0 && (
          <button
            type="button"
            className="client-pending-header-button"
            onClick={onOpenPendingOrders}
          >
            <Clock3 size={18} />
            <span>Pendientes ({pendingOrdersCount})</span>
          </button>
        )}

        <button
          type="button"
          className="client-cart-button"
          onClick={onOpenCart}
        >
          <ShoppingCart size={20} />
          <span>Carrito ({totalItems})</span>
        </button>
      </div>
    </header>
  );
}

export default ClientHeader;