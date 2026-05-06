// Importamos React Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Importamos helper de Axios.
import { isAxiosError } from 'axios';

// Importamos hooks de React.
import { useEffect, useMemo, useState } from 'react';

// Importamos socket para escuchar cambios en tiempo real.
import { socket } from '../../../services/socket';

// Importamos UI.
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';

// Importamos componentes.
import InventoryCard from '../components/InventoryCard';
import InventoryMovementModal from '../components/InventoryMovementModal';
import InventoryMovementHistory from '../components/InventoryMovementHistory';

// Importamos servicios.
import {
  createInventoryMovement,
  getInventory,
  getInventoryMovements,
} from '../services/inventory.service';

// Importamos estilos.
import '../styles/inventory.css';

// Importamos tipos.
import type {
  InventoryItem,
  InventoryMovementType,
} from '../types/inventory.types';

// Página de inventario para empleados.
function InventoryPage() {
  // Cliente de React Query.
  const queryClient = useQueryClient();

  // Búsqueda por texto.
  const [search, setSearch] = useState('');

  // Filtro de stock bajo.
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Producto seleccionado para movimiento.
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Tipo de movimiento seleccionado.
  const [selectedMovementType, setSelectedMovementType] =
    useState<InventoryMovementType | null>(null);

  // Feedback visual normal: éxito o error.
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Alerta visual para stock bajo en tiempo real.
  const [lowStockAlert, setLowStockAlert] = useState<{
    productName: string;
    stockCurrent: number;
    stockMinimum: number;
    unit: string;
  } | null>(null);

  // Query para obtener inventario.
  const inventoryQuery = useQuery({
    queryKey: ['employee-inventory'],
    queryFn: getInventory,

    // Refresca cada 5 segundos por si Socket.IO falla.
    refetchInterval: 5000,

    // Refresca cuando vuelves a la pestaña.
    refetchOnWindowFocus: true,
  });

  // Query para obtener historial de movimientos.
  const movementsQuery = useQuery({
    queryKey: ['employee-inventory-movements'],
    queryFn: getInventoryMovements,

    // Refresca cada 5 segundos por respaldo.
    refetchInterval: 5000,

    // Refresca cuando vuelves a la pestaña.
    refetchOnWindowFocus: true,
  });

  // Mutación para crear movimientos manuales: entrada, salida o ajuste.
  const movementMutation = useMutation({
    mutationFn: createInventoryMovement,

    onSuccess: (response) => {
      // Mostramos mensaje de éxito.
      setFeedback({
        type: 'success',
        text: response.message,
      });

      // Cerramos modal.
      setSelectedItem(null);
      setSelectedMovementType(null);

      // Refrescamos inventario.
      queryClient.invalidateQueries({
        queryKey: ['employee-inventory'],
      });

      // Refrescamos historial.
      queryClient.invalidateQueries({
        queryKey: ['employee-inventory-movements'],
      });

      // Refrescamos dashboard si existe.
      queryClient.invalidateQueries({
        queryKey: ['employee-dashboard-summary'],
      });
    },

    onError: (error: unknown) => {
      // Si el error viene de Axios, usamos mensaje del backend.
      if (isAxiosError(error)) {
        setFeedback({
          type: 'error',
          text:
            error.response?.data?.message ||
            'No se pudo registrar el movimiento',
        });
      } else {
        // Error genérico.
        setFeedback({
          type: 'error',
          text: 'Error inesperado al registrar movimiento',
        });
      }
    },
  });

  // ==============================
  // SOCKET.IO: INVENTARIO EN TIEMPO REAL
  // ==============================
  useEffect(() => {
    // Si el socket no está conectado, lo conectamos.
    if (!socket.connected) {
      socket.connect();
    }

    // Esta función se ejecuta cuando el backend emite inventory:updated.
    const handleInventoryUpdated = (payload?: {
      inventory?: {
        stockCurrent: number;
        stockMinimum: number;
        unit: string;
        product?: {
          name: string;
        };
      };
    }) => {
      // Refrescamos inventario.
      queryClient.invalidateQueries({
        queryKey: ['employee-inventory'],
      });

      // Refrescamos historial de movimientos.
      queryClient.invalidateQueries({
        queryKey: ['employee-inventory-movements'],
      });

      // Refrescamos dashboard si existe.
      queryClient.invalidateQueries({
        queryKey: ['employee-dashboard-summary'],
      });

      // Obtenemos inventario que llegó desde el evento.
      const inventory = payload?.inventory;

      // Si no viene inventario, no hacemos nada más.
      if (!inventory) return;

      // Revisamos si el producto quedó en stock bajo.
      const isLowStock = inventory.stockCurrent <= inventory.stockMinimum;

      // Si quedó en stock bajo, mostramos alerta.
      if (isLowStock) {
        setLowStockAlert({
          productName: inventory.product?.name || 'Producto',
          stockCurrent: inventory.stockCurrent,
          stockMinimum: inventory.stockMinimum,
          unit: inventory.unit,
        });

        // Reproducimos sonido si existe notification.mp3 en public.
        const audio = new Audio('/notification.mp3');

        audio.play().catch(() => {
          console.log(
            'El navegador bloqueó el sonido hasta que haya interacción.'
          );
        });
      }
    };

    // Escuchamos el evento.
    socket.on('inventory:updated', handleInventoryUpdated);

    // Limpiamos evento al salir de la página.
    return () => {
      socket.off('inventory:updated', handleInventoryUpdated);
    };
  }, [queryClient]);

  // Ocultamos automáticamente la alerta de stock bajo después de 5 segundos.
  useEffect(() => {
    // Si no hay alerta, no hacemos nada.
    if (!lowStockAlert) return;

    // Creamos temporizador.
    const timeout = setTimeout(() => {
      setLowStockAlert(null);
    }, 5000);

    // Limpiamos temporizador.
    return () => clearTimeout(timeout);
  }, [lowStockAlert]);

  // Inventario base.
  const inventoryItems = inventoryQuery.data?.data ?? [];

  // Productos con stock bajo.
  const lowStockCount = inventoryItems.filter(
    (item) => item.stockCurrent <= item.stockMinimum
  ).length;

  // Total de productos con inventario.
  const totalProducts = inventoryItems.length;

  // Inventario filtrado por búsqueda y stock bajo.
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      // Texto de búsqueda limpio.
      const searchText = search.trim().toLowerCase();

      // Coincide si el producto o categoría incluyen el texto.
      const matchesSearch =
        searchText.length === 0 ||
        item.product.name.toLowerCase().includes(searchText) ||
        item.product.category.name.toLowerCase().includes(searchText);

      // Coincide si no está activado el filtro, o si sí está bajo de stock.
      const matchesLowStock =
        !onlyLowStock || item.stockCurrent <= item.stockMinimum;

      // Regresa true si cumple ambos filtros.
      return matchesSearch && matchesLowStock;
    });
  }, [inventoryItems, search, onlyLowStock]);

  // Abrir modal de movimiento.
  const handleOpenMovement = (
    item: InventoryItem,
    movementType: InventoryMovementType
  ) => {
    setSelectedItem(item);
    setSelectedMovementType(movementType);
    setFeedback(null);
  };

  // Cerrar modal.
  const handleCloseModal = () => {
    setSelectedItem(null);
    setSelectedMovementType(null);
  };

  return (
    <div>
      <PageHeader
        title="Inventario operativo"
        subtitle="Consulta stock y registra movimientos básicos"
      />

      {/* Alerta de stock bajo en tiempo real */}
      {lowStockAlert && (
        <div className="employee-low-stock-toast">
          <div className="employee-low-stock-toast-icon">⚠️</div>

          <div>
            <strong>Stock bajo: {lowStockAlert.productName}</strong>

            <span>
              Quedan {lowStockAlert.stockCurrent} {lowStockAlert.unit}. Stock
              mínimo: {lowStockAlert.stockMinimum} {lowStockAlert.unit}.
            </span>
          </div>
        </div>
      )}

      {/* Mensaje normal de éxito o error */}
      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Resumen superior */}
      <section className="employee-inventory-summary-grid">
        <div className="employee-inventory-summary-card">
          <span>Productos con inventario</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="employee-inventory-summary-card warning">
          <span>Productos con stock bajo</span>
          <strong>{lowStockCount}</strong>
        </div>
      </section>

      {/* Buscador y filtro */}
      <section className="employee-inventory-toolbar">
        <div className="employee-inventory-search">
          <label htmlFor="inventory-search">Buscar producto</label>

          <input
            id="inventory-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej. Coca-Cola, hamburguesa..."
          />
        </div>

        <button
          type="button"
          className={
            onlyLowStock
              ? 'employee-inventory-low-filter active'
              : 'employee-inventory-low-filter'
          }
          onClick={() => setOnlyLowStock((current) => !current)}
        >
          {onlyLowStock ? 'Ver todos' : 'Ver stock bajo'}
        </button>
      </section>

      {/* Listado de inventario */}
      {inventoryQuery.isLoading ? (
        <div className="employee-inventory-empty">
          Cargando inventario...
        </div>
      ) : inventoryQuery.isError ? (
        <div className="employee-inventory-empty">
          No se pudo cargar el inventario.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="employee-inventory-empty">
          No hay productos que coincidan con los filtros actuales.
        </div>
      ) : (
        <section className="employee-inventory-grid">
          {filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onOpenMovement={handleOpenMovement}
            />
          ))}
        </section>
      )}

      {/* Historial de movimientos */}
      {movementsQuery.isLoading ? (
        <div className="employee-inventory-empty">
          Cargando historial...
        </div>
      ) : movementsQuery.isError ? (
        <div className="employee-inventory-empty">
          No se pudo cargar el historial.
        </div>
      ) : (
        <InventoryMovementHistory movements={movementsQuery.data?.data ?? []} />
      )}

      {/* Modal de movimiento */}
      <InventoryMovementModal
        item={selectedItem}
        movementType={selectedMovementType}
        isLoading={movementMutation.isPending}
        onClose={handleCloseModal}
        onSubmit={(values) => movementMutation.mutate(values)}
      />
    </div>
  );
}

export default InventoryPage;