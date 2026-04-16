// Props de la paginación
interface Props {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onChangePage: (page: number) => void;
}

// Controles de paginación
function OrderPaginationControls({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onChangePage,
}: Props) {
  return (
    <div className="pagination-container">
      <button
        type="button"
        className="button button-secondary"
        disabled={!hasPreviousPage}
        onClick={() => onChangePage(page - 1)}
      >
        ← Anterior
      </button>

      <span className="pagination-text">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        className="button button-primary"
        disabled={!hasNextPage}
        onClick={() => onChangePage(page + 1)}
      >
        Siguiente →
      </button>
    </div>
  );
}

export default OrderPaginationControls;