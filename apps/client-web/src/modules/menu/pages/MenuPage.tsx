// Importamos hooks de React.
import { useEffect, useMemo, useState } from 'react';

// Importamos iconos para mejorar el diseño.
import { Flame, Search, Sparkles, Utensils } from 'lucide-react';

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

  // Estado del buscador.
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para guardar el pedido exitoso.
  const [successOrder, setSuccessOrder] =
    useState<CreateOrderResponse['order'] | null>(null);

  // Estado con los IDs de pedidos pendientes guardados en este dispositivo.
  const [pendingOrderIds, setPendingOrderIds] = useState<number[]>(
    getPendingOrderIds()
  );

  // Estado para mostrar mini toast cuando se agrega al carrito.
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Función para refrescar la lista de pendientes desde localStorage.
  const refreshPendingOrders = () => {
    setPendingOrderIds(getPendingOrderIds());
  };

  // Escuchamos el evento que manda ProductCard cuando agrega producto.
  useEffect(() => {
    const handleCartToast = (event: Event) => {
      const customEvent = event as CustomEvent<{
        productName?: string;
      }>;

      const productName = customEvent.detail?.productName || 'Producto';

      setCartToast(`${productName} agregado al carrito ✅`);
    };

    window.addEventListener('client:cart-toast', handleCartToast);

    return () => {
      window.removeEventListener('client:cart-toast', handleCartToast);
    };
  }, []);

  // Ocultamos el mini toast después de unos segundos.
  useEffect(() => {
    if (!cartToast) return;

    const timeout = setTimeout(() => {
      setCartToast(null);
    }, 2600);

    return () => clearTimeout(timeout);
  }, [cartToast]);

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

  // Obtenemos nombre de categoría activa.
  const activeCategoryName = useMemo(() => {
    if (activeCategoryId === null) return 'Todo el menú';

    const foundCategory = categories.find(
      (category) => category.id === activeCategoryId
    );

    return foundCategory?.name || 'Categoría';
  }, [categories, activeCategoryId]);

  // Filtramos productos por categoría y búsqueda.
  const filteredProducts = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategoryId === null || product.category.id === activeCategoryId;

      const matchesSearch =
        cleanSearch.length === 0 ||
        product.name.toLowerCase().includes(cleanSearch) ||
        product.description?.toLowerCase().includes(cleanSearch) ||
        product.category.name.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategoryId, searchTerm]);

  // Productos disponibles.
  const availableProductsCount = products.filter((product) => {
    const stock = product.inventory?.stockCurrent ?? 0;

    return product.isAvailable && stock > 0;
  }).length;

  // Productos con poco stock.
  const lowStockProductsCount = products.filter((product) => {
    const stock = product.inventory?.stockCurrent ?? 0;

    return stock > 0 && stock <= 5;
  }).length;

  // Creamos texto de mesa para mostrarlo en pantalla.
  const mesaLabel = mesaId ? `Mesa #${mesaId}` : null;

  // Texto dinámico para el contador de productos.
  const productsCounterText =
    filteredProducts.length === 1
      ? '1 producto encontrado'
      : `${filteredProducts.length} productos encontrados`;

  // Render principal.
  return (
    <div className="client-menu-page">
      {/* Fondo decorativo con blur */}
      <div className="client-menu-bg-orb client-menu-bg-orb-1" />
      <div className="client-menu-bg-orb client-menu-bg-orb-2" />
      <div className="client-menu-bg-orb client-menu-bg-orb-3" />

      {/* Hero animado del menú */}
      <div className="client-menu-hero-shell client-menu-super-hero">
        <div className="client-menu-hero-orb client-menu-hero-orb-1" />
        <div className="client-menu-hero-orb client-menu-hero-orb-2" />
        <div className="client-menu-hero-grid" />

        <div className="client-menu-hero-badge">
          <Sparkles size={16} />
          Menú interactivo
        </div>

        <ClientHeader
          onOpenCart={() => setIsCartOpen(true)}
          mesaLabel={mesaLabel}
          pendingOrdersCount={pendingOrderIds.length}
          onOpenPendingOrders={() => setIsPendingDrawerOpen(true)}
        />

        <div className="client-menu-hero-extra">
          <div className="client-menu-hero-extra-card">
            <Utensils size={20} />
            <div>
              <strong>{products.length}</strong>
              <span>Productos</span>
            </div>
          </div>

          <div className="client-menu-hero-extra-card">
            <Sparkles size={20} />
            <div>
              <strong>{categories.length}</strong>
              <span>Categorías</span>
            </div>
          </div>

          <div className="client-menu-hero-extra-card">
            <Flame size={20} />
            <div>
              <strong>{availableProductsCount}</strong>
              <span>Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini toast al agregar al carrito */}
      {cartToast && (
        <div className="client-cart-mini-toast">
          <div className="client-cart-mini-toast-icon">🛒</div>

          <div>
            <strong>Agregado</strong>
            <span>{cartToast}</span>
          </div>
        </div>
      )}

      {/* Botón flotante para abrir carrito al hacer scroll */}
      <button
        type="button"
        className="client-floating-cart-button"
        onClick={() => setIsCartOpen(true)}
      >
        🛒 Ver carrito
      </button>

      <div className="client-menu-glass-section client-menu-premium-panel">
        <div className="client-menu-section-heading">
          <div>
            <span>Explora el menú</span>
            <h2>{activeCategoryName}</h2>
            <p>{productsCounterText}</p>
          </div>

          {lowStockProductsCount > 0 && (
            <div className="client-menu-low-stock-pill">
              <Flame size={16} />
              {lowStockProductsCount} con pocas existencias
            </div>
          )}
        </div>

        <div className="client-menu-search-panel">
          <div className="client-menu-search-box">
            <Search size={19} />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar tacos, bebidas, hamburguesas..."
            />

            {searchTerm.trim().length > 0 && (
              <button type="button" onClick={() => setSearchTerm('')}>
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="client-menu-tabs-shell">
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
          />
        </div>

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
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos productos con esa búsqueda o categoría."
          />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>

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