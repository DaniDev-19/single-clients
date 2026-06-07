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
    track: 'bg-gray-800 peer-checked:bg-gray-600',
    thumb: 'bg-white',
    ring: 'focus:ring-gray-700',
    control: 'text-gray-400',
  },
  primary: {
    track: 'bg-gray-800 peer-checked:bg-purple-600',
    thumb: 'bg-white',
    ring: 'focus:ring-purple-600',
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
    ring: 'focus:ring-red-600',
    control: 'text-red-500',
  },
  ghost: {
    track: 'bg-gray-900 peer-checked:bg-purple-950/40',
    thumb: 'bg-white',
    ring: 'focus:ring-purple-600',
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
  const inputId = name ? `${name}-${value ?? 'toggle'}` : undefined;
  const currentVariant = variantClasses[variant];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5">
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={
            type === 'checkbox'
              ? 'peer sr-only'
              : `h-4 w-4 rounded-full border border-border-dark bg-bg-card text-purple-600 focus:ring-2 ${currentVariant.ring} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`
          }
        />

        {type === 'checkbox' && (
          <span
            className={`
              relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition
              ${currentVariant.track}
              ${disabled ? 'cursor-not-allowed opacity-40' : ''}
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full transition
                ${currentVariant.thumb}
                ${checked ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            />
          </span>
        )}
      </div>

      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium ${disabled ? 'text-gray-600' : 'text-gray-200'} cursor-pointer`}
          >
            {label}
          </label>
        )}

        {description && (
          <span className={`text-xs ${disabled ? 'text-gray-700' : 'text-gray-400'}`}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export default Toggle;