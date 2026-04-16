import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import '../../../components/ui/ui.css';
import CategoryFilters from '../components/CategoryFilters';
import CategoryForm from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';
import PaginationControls from '../components/PaginationControls';
import {
  createCategory,
  getCategories,
  toggleCategoryStatus,
  updateCategory,
} from '../services/categories.service';
import '../styles/categories.css';
import type { Category } from '../types/categories.types';

function CategoriesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isActiveFilter = useMemo(() => {
    if (statusFilter === 'active') return true;
    if (statusFilter === 'inactive') return false;
    return undefined;
  }, [statusFilter]);

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
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo crear la categoría',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) =>
      updateCategory(id, payload),
    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo actualizar la categoría',
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCategoryStatus,
    onSuccess: (response) => {
      setFeedback({ type: 'success', text: response.message });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      setFeedback({
        type: 'error',
        text: error?.response?.data?.message || 'No se pudo cambiar el estado',
      });
    },
  });

  const handleSubmit = (values: { name: string; description: string }) => {
    setFeedback(null);

    if (selectedCategory) {
      updateMutation.mutate({
        id: selectedCategory.id,
        payload: values,
      });
      return;
    }

    createMutation.mutate(values);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFeedback(null);
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
  };

  const handleToggleStatus = (category: Category) => {
    setFeedback(null);
    toggleMutation.mutate(category.id);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  const categories = categoriesQuery.data?.data ?? [];
  const pagination = categoriesQuery.data?.pagination;

  return (
    <div>
      <PageHeader
        title="Categorías"
        subtitle="Administra las categorías del menú"
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

      <div className="categories-page-grid">
        <CategoryForm
          initialData={selectedCategory}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={selectedCategory ? handleCancelEdit : undefined}
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
            onReset={handleResetFilters}
          />

          {categoriesQuery.isLoading ? (
            <div className="category-empty-state">Cargando categorías...</div>
          ) : categoriesQuery.isError ? (
            <div className="category-empty-state">
              No se pudieron cargar las categorías.
            </div>
          ) : (
            <>
              <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
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
    </div>
  );
}

export default CategoriesPage;