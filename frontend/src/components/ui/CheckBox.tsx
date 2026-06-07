import type { ChangeEvent } from 'react';

type ToggleType = 'checkbox' | 'radio';
type ToggleVariant = 'base' | 'primary' | 'success' | 'danger' | 'ghost';

interface ToggleProps {
  type?: ToggleType;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  value?: string;
  variant?: ToggleVariant;
  disabled?: boolean;
  className?: string;
}

const variantClasses: Record<ToggleVariant, { track: string; thumb: string; ring: string; control: string }> = {
  base: {
    track: 'bg-gray-800 peer-checked:bg-gray-650',
    thumb: 'bg-white',
    ring: 'focus:ring-gray-700',
    control: 'text-gray-400',
  },
  primary: {
    track: 'bg-gray-800 peer-checked:bg-purple-600',
    thumb: 'bg-white',
    ring: 'focus:ring-purple-650',
    control: 'text-purple-500',
  },
  success: {
    track: 'bg-gray-800 peer-checked:bg-emerald-600',
    thumb: 'bg-white',
    ring: 'focus:ring-emerald-600',
    control: 'text-emerald-500',
  },
  danger: {
    track: 'bg-gray-800 peer-checked:bg-red-600',
    thumb: 'bg-white',
    ring: 'focus:ring-red-650',
    control: 'text-red-500',
  },
  ghost: {
    track: 'bg-gray-900 peer-checked:bg-purple-950/40',
    thumb: 'bg-white',
    ring: 'focus:ring-purple-650',
    control: 'text-purple-400',
  },
};

function Toggle({
  type = 'checkbox',
  name,
  checked,
  onChange,
  label,
  description,
  value,
  variant = 'primary',
  disabled = false,
  className = '',
}: ToggleProps) {
  const currentVariant = variantClasses[variant];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={`flex items-start gap-3 select-none cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      <div className="relative mt-0.5">
        <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={
            type === 'checkbox'
              ? 'peer sr-only'
              : `h-4 w-4 rounded-full border border-border-dark bg-bg-card text-purple-600 focus:ring-2 ${currentVariant.ring} cursor-pointer`
          }
        />

        {type === 'checkbox' && (
          <span
            className={`
              relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-250
              ${currentVariant.track}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-250
                ${checked ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            />
          </span>
        )}
      </div>

      <div className="flex flex-col">
        {label && (
          <span className="text-xs font-semibold text-gray-300">
            {label}
          </span>
        )}

        {description && (
          <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}

export default Toggle;