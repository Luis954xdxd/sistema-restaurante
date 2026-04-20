// ==============================
// 📦 IMPORTACIONES
// ==============================

// Hooks de React
import { useMemo, useState } from 'react';

// Hook para leer parámetros de la URL (mesa)
import { useParams } from 'react-router-dom';

// Componentes UI
import ClientHeader from '../../../components/ui/ClientHeader';
import EmptyState from '../../../components/ui/EmptyState';
import OrderSuccessModal from '../../../components/ui/OrderSuccessModal';
import '../../../components/ui/ui.css';

// Componentes del menú
import CategoryTabs from '../../../components/menu/CategoryTabs';
import ProductGrid from '../../../components/menu/ProductGrid';
import '../../../components/menu/menu.css';

// Carrito lateral
import CartDrawer from '../../../components/cart/CartDrawer';
import '../../../components/cart/cart.css';

// Hook para obtener productos
import { useMenu } from '../../../hooks/useMenu';

// Tipos
import type {
  CreateOrderResponse,
  MenuProduct,
} from '../types/menu.types';

// ==============================
// 🧾 COMPONENTE PRINCIPAL
// ==============================

function MenuPage() {
  // 🔥 Obtenemos el ID de la mesa desde la URL
  // Ejemplo: /menu/mesa/7 → mesaId = "7"
  const { mesaId } = useParams();

  // Estado para abrir/cerrar carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para categoría seleccionada
  const [activeCategoryId, setActiveCategoryId] =
    useState<number | null>(null);

  // Estado para el modal de éxito
  const [successOrder, setSuccessOrder] =
    useState<CreateOrderResponse['order'] | null>(null);

  // 🔥 Hook que trae productos del backend
  const { data, isLoading, isError } = useMenu();

  // Lista de productos
  const products: MenuProduct[] = data?.data ?? [];

  // ==============================
  // 📊 CATEGORÍAS ÚNICAS
  // ==============================
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

  // ==============================
  // 🔍 FILTRAR PRODUCTOS
  // ==============================
  const filteredProducts = useMemo(() => {
    if (activeCategoryId === null) return products;

    return products.filter(
      (product) => product.category.id === activeCategoryId
    );
  }, [products, activeCategoryId]);

  // ==============================
  // 🪑 TEXTO DE LA MESA
  // ==============================
  const mesaLabel = mesaId ? `Mesa #${mesaId}` : null;

  // ==============================
  // 🎨 RENDER
  // ==============================
  return (
    <div className="client-menu-page">
      {/* Header */}
      <ClientHeader
        onOpenCart={() => setIsCartOpen(true)}
        mesaLabel={mesaLabel}
      />

      {/* Tabs de categorías */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {/* Estado de carga */}
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

      {/* 🔥 CARRITO (IMPORTANTE: aquí pasamos la mesa) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(order) => setSuccessOrder(order)}
        mesaId={mesaId} // 👈 AQUÍ PASAMOS LA MESA
      />

      {/* MODAL DE ÉXITO */}
      <OrderSuccessModal
        isOpen={Boolean(successOrder)}
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
      />
    </div>
  );
}

// Exportamos
export default MenuPage;