import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';
import { getProducts } from '../../products/services/products.service';
import InventoryFilters from '../components/InventoryFilters';
import InventoryForm from '../components/InventoryForm';
import InventoryMovementForm from '../components/InventoryMovementForm';
import InventoryPaginationControls from '../components/InventoryPaginationControls';
import InventoryTable from '../components/InventoryTable';
import {
  createInventory,
  createInventoryMovement,
  getInventory,
  updateInventory,
} from '../services/inventory.service';
import '../styles/inventory.css';
import type { InventoryItem } from '../types/inventory.types';

function InventoryPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const productsQuery = useQuery({
    queryKey: ['products-for-inventory'],
    queryFn: () =>
      getProducts({
        isAvailable: true,
        page: 1,
        limit: 100,
      }),
  });

  const inventoryQuery = useQuery({
    queryKey: ['inventory', search, lowStockOnly, page],
    queryFn: () =>
      getInventory({
        search: search || undefined,
        lowStockOnly,
        page,
        limit: 5,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createInventory,
    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setSelectedInventory(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo crear el inventario',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: number;
      payload: { stockMinimum: number; unit: string };
    }) => updateInventory(productId, payload),
    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setSelectedInventory(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo actualizar el inventario',
      });
    },
  });

  const movementMutation = useMutation({
    mutationFn: createInventoryMovement,
    onSuccess: (response) => {
      setFeedback({
        type: 'success',
        text: response.lowStockAlert
          ? `${response.message}. Atención: el producto quedó con stock bajo.`
          : response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo registrar el movimiento',
      });
    },
  });

  const handleCreateInventory = (values: {
    productId: number;
    stockCurrent: number;
    stockMinimum: number;
    unit: string;
  }) => {
    setFeedback(null);
    createMutation.mutate(values);
  };

  const handleUpdateInventory = (values: {
    stockMinimum: number;
    unit: string;
  }) => {
    if (!selectedInventory) return;

    setFeedback(null);
    updateMutation.mutate({
      productId: selectedInventory.productId,
      payload: values,
    });
  };

  const handleCreateMovement = (values: {
    productId: number;
    movementType: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
  }) => {
    setFeedback(null);
    movementMutation.mutate(values);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedInventory(item);
    setFeedback(null);
  };

  const handleCancelEdit = () => {
    setSelectedInventory(null);
  };

  const handleResetFilters = () => {
    setSearch('');
    setLowStockOnly(false);
    setPage(1);
  };

  const inventoryItems = inventoryQuery.data?.data ?? [];
  const pagination = inventoryQuery.data?.pagination;
  const availableProducts = productsQuery.data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Controla stock, mínimos y movimientos del restaurante"
      />

      {feedback && (
        <div
          className={`feedback-message ${
            feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="inventory-page-grid">
        <InventoryForm
          products={availableProducts.map((product) => ({
            id: product.id,
            name: product.name,
          }))}
          initialData={selectedInventory}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmitCreate={handleCreateInventory}
          onSubmitUpdate={handleUpdateInventory}
          onCancel={selectedInventory ? handleCancelEdit : undefined}
        />

        <InventoryMovementForm
          inventoryItems={inventoryItems}
          isLoading={movementMutation.isPending}
          onSubmit={handleCreateMovement}
        />

        <div className="inventory-panel-card">
          <h3>Listado de inventario</h3>
          <p>Consulta productos, stock actual, mínimos y alertas.</p>

          <InventoryFilters
            search={search}
            lowStockOnly={lowStockOnly}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onLowStockChange={(value) => {
              setLowStockOnly(value);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />

          {inventoryQuery.isLoading ? (
            <div className="inventory-empty-state">Cargando inventario...</div>
          ) : inventoryQuery.isError ? (
            <div className="inventory-empty-state">
              No se pudo cargar el inventario.
            </div>
          ) : (
            <>
              <InventoryTable inventoryItems={inventoryItems} onEdit={handleEdit} />

              {pagination && (
                <InventoryPaginationControls
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  onChangePage={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;