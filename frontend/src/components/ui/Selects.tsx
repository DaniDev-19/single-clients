import { useEffect, useMemo, useState } from 'react';

type SelectVariant = 'base' | 'error' | 'success' | 'ghost';

interface SelectsProps {
  value: string;
  title?: string;
  options: string[];
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: SelectVariant;
  searchable?: boolean;
}

const variantClasses: Record<SelectVariant, string> = {
  base: 'w-full rounded-md border border-border-dark bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
  error: 'w-full rounded-md border border-red-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
  success: 'w-full rounded-md border border-emerald-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
  ghost: 'w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-sm text-white placeholder-gray-500 outline-none',
};

function Selects({
  title,
  value,
  options,
  onChange,
  label,
  placeholder = 'Selecciona una opción',
  className,
  variant = 'base',
  searchable = false,
}: SelectsProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(term)
    );
  }, [query, options]);

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery(option);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}

      {searchable ? (
        <div className="relative">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className={className ?? variantClasses[variant]}
          />

          {open && filteredOptions.length > 0 && (
            <ul className="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-dark bg-bg-panel shadow-2xl custom-scrollbar">
              {filteredOptions.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`block w-full px-3 py-2 text-left text-sm text-white hover:bg-purple-950/40 hover:text-purple-200 transition duration-150 ${
                      option === value ? 'bg-purple-900/30 text-purple-400 font-semibold' : ''
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {open && filteredOptions.length === 0 && (
            <div className="absolute z-30 mt-1 w-full rounded-md border border-border-dark bg-bg-panel px-3 py-2 text-sm text-gray-400 shadow-2xl">
              No hay coincidencias
            </div>
          )}
        </div>
      ) : (
        <select
          title={title}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className ?? variantClasses[variant]}
        >
          <option value="" disabled className="bg-bg-panel text-gray-500">
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option} className="bg-bg-panel text-white">
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Selects;