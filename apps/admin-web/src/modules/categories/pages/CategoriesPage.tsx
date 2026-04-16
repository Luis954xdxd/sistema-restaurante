import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import PageHeader from '../../../components/ui/PageHeader';
import Toast from '../../../components/ui/Toast';
import '../../../components/ui/ui.css';
import { useToast } from '../../../hooks/useToast';
import CategoryFilters from '../components/CategoryFilters';
import CategoryForm from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';
import PaginationControls from '../components/PaginationControls';
import {
  createCategory,
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
  updateCategory,
} from '../services/categories.service';
import '../styles/categories.css';
import type { Category } from '../types/categories.types';

function CategoriesPage() {
  const queryClient = useQueryClient();
  const { toasts, showToast, removeToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const isActiveFilter = useMemo(() => {
    if (statusFilter === 'active') return true;
    if (statusFilter === 'inactive') return false;
    return undefined;
  }, [statusFilter]);

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-low-stock'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-recent-orders'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-top-products'] });
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories', search, statusFilter, page],
    queryFn: () =>
      getCategories({
        search: search || undefined,
        isActive: isActiveFilter,
        page,
        limit: 5,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setSelectedCategory(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo crear la categoría'
          : 'No se pudo crear la categoría'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) =>
      updateCategory(id, payload),
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setSelectedCategory(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo actualizar la categoría'
          : 'No se pudo actualizar la categoría'
      );
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCategoryStatus,
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
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      showToast('success', response.message);
      refreshAll();
      setCategoryToDelete(null);
      if (selectedCategory) setSelectedCategory(null);
    },
    onError: (error: unknown) => {
      showToast(
        'error',
        isAxiosError(error)
          ? error.response?.data?.message || 'No se pudo eliminar la categoría'
          : 'No se pudo eliminar la categoría'
      );
      setCategoryToDelete(null);
    },
  });

  const handleSubmit = (values: { name: string; description: string }) => {
    if (selectedCategory) {
      updateMutation.mutate({
        id: selectedCategory.id,
        payload: values,
      });
      return;
    }

    createMutation.mutate(values);
  };

  const categories = categoriesQuery.data?.data ?? [];
  const pagination = categoriesQuery.data?.pagination;

  return (
    <div>
      <PageHeader title="Categorías" subtitle="Administra las categorías del menú" />

      <div className="categories-page-grid">
        <CategoryForm
          initialData={selectedCategory}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={selectedCategory ? () => setSelectedCategory(null) : undefined}
        />

        <div className="category-panel-card">
          <h3>Listado de categorías</h3>
          <p>Consulta, busca y administra las categorías registradas.</p>

          <CategoryFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onStatusChange={(value) => {
              setStatusFilter(value as 'all' | 'active' | 'inactive');
              setPage(1);
            }}
            onReset={() => {
              setSearch('');
              setStatusFilter('all');
              setPage(1);
            }}
          />

          {categoriesQuery.isLoading ? (
            <div className="category-empty-state">Cargando categorías...</div>
          ) : categoriesQuery.isError ? (
            <div className="category-empty-state">No se pudieron cargar las categorías.</div>
          ) : (
            <>
              <CategoryTable
                categories={categories}
                onEdit={(category) => setSelectedCategory(category)}
                onToggleStatus={(category) => toggleMutation.mutate(category.id)}
                onDelete={(category) => setCategoryToDelete(category)}
              />

              {pagination && (
                <PaginationControls
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
        isOpen={Boolean(categoryToDelete)}
        title="Eliminar categoría"
        message={
          categoryToDelete
            ? `¿Seguro que deseas eliminar la categoría "${categoryToDelete.name}"? Si tiene productos asociados, el sistema no permitirá borrarla.`
            : ''
        }
        confirmText="Sí, eliminar"
        secondaryText="Mejor ocultar"
        cancelText="Cancelar"
        isDanger
        isLoading={deleteMutation.isPending || toggleMutation.isPending}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) deleteMutation.mutate(categoryToDelete.id);
        }}
        onSecondaryAction={() => {
          if (categoryToDelete) {
            toggleMutation.mutate(categoryToDelete.id);
            setCategoryToDelete(null);
          }
        }}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default CategoriesPage;