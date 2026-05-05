// Importamos hooks de React.
import { useMemo, useState } from 'react';

// Importamos useNavigate para mover al cliente a la pantalla de estado.
// Importamos useParams para leer la mesa desde la URL.
import { useNavigate, useParams } from 'react-router-dom';

// Importamos header del cliente.
import ClientHeader from '../../../components/ui/ClientHeader';

// Importamos estado vacío.
import EmptyState from '../../../components/ui/EmptyState';

// Importamos modal de éxito.
import OrderSuccessModal from '../../../components/ui/OrderSuccessModal';

// Importamos estilos UI.
import '../../../components/ui/ui.css';

// Importamos tabs de categorías.
import CategoryTabs from '../../../components/menu/CategoryTabs';

// Importamos grid de productos.
import ProductGrid from '../../../components/menu/ProductGrid';

// Importamos estilos del menú.
import '../../../components/menu/menu.css';

// Importamos carrito lateral.
import CartDrawer from '../../../components/cart/CartDrawer';

// Importamos estilos del carrito.
import '../../../components/cart/cart.css';

// Importamos hook que obtiene productos.
import { useMenu } from '../../../hooks/useMenu';

// Importamos drawer de pedidos pendientes.
import PendingOrdersDrawer from '../../order-status/components/PendingOrdersDrawer';

// Importamos funciones para guardar y leer pedidos pendientes.
import {
  addPendingOrderId,
  getPendingOrderIds,
} from '../../order-status/storage/pendingOrders.storage';

// Importamos estilos de la pantalla de estado y pendientes.
import '../../order-status/styles/orderStatus.css';

// Importamos tipos.
import type {
  CreateOrderResponse,
  MenuProduct,
} from '../types/menu.types';

// Componente principal del menú.
function MenuPage() {
  // Leemos mesaId desde la URL. Ejemplo: /menu/mesa/7.
  const { mesaId } = useParams();

  // Creamos navigate para cambiar de página desde código.
  const navigate = useNavigate();

  // Estado para abrir o cerrar carrito.
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para abrir o cerrar el panel de pedidos pendientes.
  const [isPendingDrawerOpen, setIsPendingDrawerOpen] = useState(false);

  // Estado de categoría activa.
  const [activeCategoryId, setActiveCategoryId] =
    useState<number | null>(null);

  // Estado para guardar el pedido exitoso.
  const [successOrder, setSuccessOrder] =
    useState<CreateOrderResponse['order'] | null>(null);

  // Estado con los IDs de pedidos pendientes guardados en este dispositivo.
  const [pendingOrderIds, setPendingOrderIds] = useState<number[]>(
    getPendingOrderIds()
  );

  // Función para refrescar la lista de pendientes desde localStorage.
  const refreshPendingOrders = () => {
    setPendingOrderIds(getPendingOrderIds());
  };

  // Traemos productos del backend.
  const { data, isLoading, isError } = useMenu();

  // Obtenemos lista de productos.
  const products: MenuProduct[] = data?.data ?? [];

  // Creamos lista única de categorías.
  const categories = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();

    products.forEach((product) => {
      map.set(product.category.id, {
        id: product.category.id,
        name: product.category.name,
      });
    });

    return Array.from(map.values());
  }, [products]);

  // Filtramos productos por categoría seleccionada.
  const filteredProducts = useMemo(() => {
    if (activeCategoryId === null) return products;

    return products.filter(
      (product) => product.category.id === activeCategoryId
    );
  }, [products, activeCategoryId]);

  // Creamos texto de mesa para mostrarlo en pantalla.
  const mesaLabel = mesaId ? `Mesa #${mesaId}` : null;

  // Render principal.
  return (
    <div className="client-menu-page">
      <ClientHeader
        onOpenCart={() => setIsCartOpen(true)}
        mesaLabel={mesaLabel}
        pendingOrdersCount={pendingOrderIds.length}
        onOpenPendingOrders={() => setIsPendingDrawerOpen(true)}
        />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {isLoading ? (
        <EmptyState
          title="Cargando menú..."
          description="Estamos preparando los productos."
        />
      ) : isError ? (
        <EmptyState
          title="Error al cargar"
          description="Intenta nuevamente."
        />
      ) : (
        <ProductGrid products={filteredProducts} />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(order) => {
          // Guardamos el ID del pedido como pendiente de pago en este dispositivo.
          addPendingOrderId(order.id);

          // Refrescamos el contador del botón "Pendientes".
          refreshPendingOrders();

          // Guardamos el pedido exitoso por si después quieres usar el modal.
          setSuccessOrder(order);

          // Mandamos al cliente directamente a la pantalla de estado del pedido.
          navigate(`/order-status/${order.id}`);
        }}
        mesaId={mesaId}
      />

      <OrderSuccessModal
        isOpen={Boolean(successOrder)}
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
      />

      <PendingOrdersDrawer
        isOpen={isPendingDrawerOpen}
        orderIds={pendingOrderIds}
        onClose={() => setIsPendingDrawerOpen(false)}
        onPendingOrdersChanged={() => {
          refreshPendingOrders();
          setIsPendingDrawerOpen(false);
        }}
      />
    </div>
  );
}

// Exportamos la página.
export default MenuPage;