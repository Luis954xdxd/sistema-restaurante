// Importamos hooks de React
import { useMemo, useState } from 'react';

// Importamos useParams para futura mesa por URL
import { useParams } from 'react-router-dom';

// Importamos componentes UI
import ClientHeader from '../../../components/ui/ClientHeader';
import '../../../components/ui/ui.css';

// Importamos componentes del menú
import CategoryTabs from '../../../components/menu/CategoryTabs';
import ProductGrid from '../../../components/menu/ProductGrid';
import '../../../components/menu/menu.css';

// Importamos carrito
import CartDrawer from '../../../components/cart/CartDrawer';
import '../../../components/cart/cart.css';

// Importamos estado vacío
import EmptyState from '../../../components/ui/EmptyState';

// Importamos hook del menú
import { useMenu } from '../../../hooks/useMenu';

// Importamos tipos del menú
import type { MenuProduct } from '../types/menu.types';

// Página principal del cliente
function MenuPage() {
  // Leemos mesaId si viene en la URL
  const { mesaId } = useParams();

  // Estado del carrito lateral
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado de categoría seleccionada
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Obtenemos productos desde backend
  const { data, isLoading, isError } = useMenu();

  // Lista completa de productos tipada correctamente
  const products: MenuProduct[] = data?.data ?? [];

  // Categorías únicas derivadas de los productos
  const categories = useMemo(() => {
    // Mapa para evitar categorías repetidas
    const uniqueMap = new Map<number, { id: number; name: string }>();

    // Recorremos productos tipados
    products.forEach((product: MenuProduct) => {
      uniqueMap.set(product.category.id, {
        id: product.category.id,
        name: product.category.name,
      });
    });

    // Convertimos el mapa a arreglo
    return Array.from(uniqueMap.values());
  }, [products]);

  // Filtramos productos según categoría activa
  const filteredProducts = useMemo(() => {
    if (activeCategoryId === null) return products;

    return products.filter(
      (product: MenuProduct) => product.category.id === activeCategoryId
    );
  }, [products, activeCategoryId]);

  // Etiqueta visual de la mesa
  const mesaLabel = mesaId ? `Mesa #${mesaId}` : null;

  return (
    <div className="client-menu-page">
      <ClientHeader
        onOpenCart={() => setIsCartOpen(true)}
        mesaLabel={mesaLabel}
      />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      {isLoading ? (
        <EmptyState
          title="Cargando menú..."
          description="Estamos preparando los productos disponibles."
        />
      ) : isError ? (
        <EmptyState
          title="No se pudo cargar el menú"
          description="Intenta nuevamente en unos momentos."
        />
      ) : (
        <ProductGrid products={filteredProducts} />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export default MenuPage;