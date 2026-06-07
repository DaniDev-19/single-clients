import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center w-full max-w-xs ${className}`}>
      <span className="absolute left-3 flex items-center justify-center text-gray-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      <input
        {...props}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-dark bg-bg-card pl-9 pr-8 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 p-1 rounded hover:bg-bg-panel text-gray-500 hover:text-white cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchInput;
