import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import PageHeader from '../../../components/ui/PageHeader';
import Toast from '../../../components/ui/Toast';
import '../../../components/ui/ui.css';
import { useToast } from '../../../hooks/useToast';
import { getCategories } from '../../categories/services/categories.service';
import ProductFilters from '../components/ProductFilters';
import ProductForm from '../components/ProductForm';
import ProductPaginationControls from '../components/ProductPaginationControls';
import ProductTable from '../components/ProductTable';
import {
  createProduct,
  deleteProduct,
  getProducts,
  toggleProductAvailability,
  updateProduct,
} from '../services/products.service';
import '../styles/products.css';
import type { Product } from '../types/products.types';

function ProductsPage() {
  const queryClient = useQueryClient();
  const { toasts, showToast, removeToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'all' | 'available' | 'unavailable'
  >('all');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const parsedAvailability = useMemo(() => {
    if (availabilityFilter === 'available') return true;
    if (availabilityFilter === 'unavailable') return false;
    return undefined;
  }, [availabilityFilter]);

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-low-stock'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-recent-orders'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-top-products'] });
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories-for-products'],
    queryFn: () =>
      getCategories({
        isActive: true,
        page: 1,
        limit: 100,
      }),
  });

  const productsQuery = useQuery({
    queryKey: ['products', search, categoryId, availabilityFilter, page],
    queryFn: () =>
      getProducts({
        search: search || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        isAvailable: parsedAvailability,
        page,
        limit: 5,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setSelectedProduct(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo crear el producto'
          : 'No se pudo crear el producto'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        name?: string;
        description?: string;
        price?: number;
        categoryId?: number;
        image?: File | null;
      };
    }) => updateProduct(id, payload),
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setSelectedProduct(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo actualizar el producto'
          : 'No se pudo actualizar el producto'
      );
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleProductAvailability,
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo cambiar el estado'
          : 'No se pudo cambiar el estado'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setProductToDelete(null);
      if (selectedProduct) setSelectedProduct(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo eliminar el producto'
          : 'No se pudo eliminar el producto'
      );
      setProductToDelete(null);
    },
  });

  const categories = categoriesQuery.data?.data ?? [];
  const products = productsQuery.data?.data ?? [];
  const pagination = productsQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Administra productos e imágenes del restaurante"
      />

      <div className="products-page-grid">
        <ProductForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          initialData={selectedProduct}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={(values) => {
            if (selectedProduct) {
              updateMutation.mutate({
                id: selectedProduct.id,
                payload: values,
              });
              return;
            }

            createMutation.mutate(values);
          }}
          onCancel={selectedProduct ? () => setSelectedProduct(null) : undefined}
        />

        <div className="product-panel-card">
          <h3>Listado de productos</h3>
          <p>Consulta, busca y administra los productos registrados.</p>

          <ProductFilters
            search={search}
            categoryId={categoryId}
            availabilityFilter={availabilityFilter}
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onCategoryChange={(value) => {
              setCategoryId(value);
              setPage(1);
            }}
            onAvailabilityChange={(value) => {
              setAvailabilityFilter(value as 'all' | 'available' | 'unavailable');
              setPage(1);
            }}
            onReset={() => {
              setSearch('');
              setCategoryId('');
              setAvailabilityFilter('all');
              setPage(1);
            }}
          />

          {productsQuery.isLoading ? (
            <div className="product-empty-state">Cargando productos...</div>
          ) : productsQuery.isError ? (
            <div className="product-empty-state">No se pudieron cargar los productos.</div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={(product) => setSelectedProduct(product)}
                onToggleAvailability={(product) => toggleMutation.mutate(product.id)}
                onDelete={(product) => setProductToDelete(product)}
              />

              {pagination && (
                <ProductPaginationControls
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

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Eliminar producto"
        message={
          productToDelete
            ? `¿Seguro que deseas eliminar el producto "${productToDelete.name}"? Si tiene inventario, movimientos o pedidos relacionados, el sistema no permitirá borrarlo.`
            : ''
        }
        confirmText="Sí, eliminar"
        secondaryText="Mejor ocultar"
        cancelText="Cancelar"
        isDanger
        isLoading={deleteMutation.isPending || toggleMutation.isPending}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) deleteMutation.mutate(productToDelete.id);
        }}
        onSecondaryAction={() => {
          if (productToDelete) {
            toggleMutation.mutate(productToDelete.id);
            setProductToDelete(null);
          }
        }}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default ProductsPage;