interface Props {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onChangePage: (page: number) => void;
}

function PaginationControls({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onChangePage,
}: Props) {
  return (
    <div className="pagination-controls">
      <button
        type="button"
        className="button-secondary"
        disabled={!hasPreviousPage}
        onClick={() => onChangePage(page - 1)}
      >
        Anterior
      </button>

      <span>
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        type="button"
        className="button-secondary"
        disabled={!hasNextPage}
        onClick={() => onChangePage(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}

export default PaginationControls;