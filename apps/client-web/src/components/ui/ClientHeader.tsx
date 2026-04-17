// Importamos iconos
import { ShoppingCart } from 'lucide-react';

// Importamos hook del carrito
import { useCart } from '../../hooks/useCart';

// Props del header
interface Props {
  onOpenCart: () => void;
  mesaLabel?: string | null;
}

// Header del cliente
function ClientHeader({ onOpenCart, mesaLabel }: Props) {
  const { totalItems } = useCart();

  return (
    <header className="client-header">
      <div>
        <h1>Menú del Restaurante</h1>
        <p>
          {mesaLabel
            ? `Realizando pedido para ${mesaLabel}`
            : 'Explora los productos disponibles y arma tu pedido'}
        </p>
      </div>

      <button type="button" className="client-cart-button" onClick={onOpenCart}>
        <ShoppingCart size={18} />
        <span>Carrito ({totalItems})</span>
      </button>
    </header>
  );
}

export default ClientHeader;