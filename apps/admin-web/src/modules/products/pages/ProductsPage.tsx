import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';
import { getCategories } from '../../categories/services/categories.service';
import ProductFilters from '../components/ProductFilters';
import ProductForm from '../components/ProductForm';
import ProductPaginationControls from '../components/ProductPaginationControls';
import ProductTable from '../components/ProductTable';
import {
  createProduct,
  getProducts,
  toggleProductAvailability,
  updateProduct,
} from '../services/products.service';
import '../styles/products.css';
import type { Product } from '../types/products.types';

function ProductsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'all' | 'available' | 'unavailable'
  >('all');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const parsedAvailability = useMemo(() => {
    if (availabilityFilter === 'available') return true;
    if (availabilityFilter === 'unavailable') return false;
    return undefined;
  }, [availabilityFilter]);

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
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo crear el producto',
      });
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
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo actualizar el producto',
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleProductAvailability,
    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo cambiar el estado',
      });
    },
  });

  const handleSubmit = (values: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    image: File | null;
  }) => {
    setFeedback(null);

    if (selectedProduct) {
      updateMutation.mutate({
        id: selectedProduct.id,
        payload: values,
      });
      return;
    }

    createMutation.mutate(values);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFeedback(null);
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  const handleToggleAvailability = (product: Product) => {
    setFeedback(null);
    toggleMutation.mutate(product.id);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setAvailabilityFilter('all');
    setPage(1);
  };

  const categories = categoriesQuery.data?.data ?? [];
  const products = productsQuery.data?.data ?? [];
  const pagination = productsQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Administra productos e imágenes del restaurante"
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

      <div className="products-page-grid">
        <ProductForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          initialData={selectedProduct}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={selectedProduct ? handleCancelEdit : undefined}
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
            onReset={handleResetFilters}
          />

          {productsQuery.isLoading ? (
            <div className="product-empty-state">Cargando productos...</div>
          ) : productsQuery.isError ? (
            <div className="product-empty-state">
              No se pudieron cargar los productos.
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onToggleAvailability={handleToggleAvailability}
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
    </div>
  );
}

export default ProductsPage;