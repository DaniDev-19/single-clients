interface Props {
  numberOfPages: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}

type PageItem = number | 'DOTS';

const createPageItems = (currentPage: number, numberOfPages: number): PageItem[] => {
  if (numberOfPages <= 5) {
    return Array.from({ length: numberOfPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'DOTS', numberOfPages];
  }

  if (currentPage >= numberOfPages - 2) {
    return [1, 'DOTS', numberOfPages - 3, numberOfPages - 2, numberOfPages - 1, numberOfPages];
  }

  return [1, 'DOTS', currentPage - 1, currentPage, currentPage + 1, 'DOTS', numberOfPages];
};

function Paginations({ numberOfPages, currentPage, onChangePage }: Props) {
  const pageItems = createPageItems(currentPage, numberOfPages);

  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        className="cursor-pointer inline-flex h-8 items-center justify-center rounded border border-border-dark bg-bg-card px-3 text-xs font-semibold text-gray-200 transition hover:border-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        title="Previous page"
      >
        Anterior
      </button>

      {pageItems.map((item, index) =>
        item === 'DOTS' ? (
          <span
            key={`${item}-${index}`}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-border-dark bg-bg-card px-2.5 text-xs text-gray-500"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`cursor-pointer inline-flex h-8 min-w-8 items-center justify-center rounded border px-2.5 text-xs font-semibold transition ${
              item === currentPage
                ? 'border-purple-600 bg-purple-600 text-white'
                : 'border-border-dark bg-bg-card text-gray-300 hover:border-purple-500 hover:text-white'
            }`}
            onClick={() => onChangePage(item)}
            title={`Page ${item}`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="cursor-pointer inline-flex h-8 items-center justify-center rounded border border-border-dark bg-bg-card px-3 text-xs font-semibold text-gray-200 transition hover:border-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage === numberOfPages}
        onClick={() => onChangePage(currentPage + 1)}
        title="Next page"
      >
        Siguiente
      </button>
    </nav>
  );
}

export default Paginations;
