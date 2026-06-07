import type { InputHTMLAttributes } from 'react';

type InputVariant = 'base' | 'error' | 'success' | 'ghost';

interface InputsProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  title?: string;
  variant?: InputVariant;
  type?: React.HTMLInputTypeAttribute;
}

const variantClasses: Record<InputVariant, string> = {
  base: 'w-full rounded-md border border-border-dark bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
  error: 'w-full rounded-md border border-red-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
  success: 'w-full rounded-md border border-emerald-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
  ghost: 'w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-sm text-white placeholder-gray-500 outline-none',
};

function Inputs({
  value,
  onChange,
  label,
  placeholder,
  className,
  title,
  variant = 'base',
  type = 'text',
  ...props
}: InputsProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}

      <input
        {...props}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        title={title}
        className={className ?? variantClasses[variant]}
      />
    </div>
  );
}

export default Inputs;