import type { TextareaHTMLAttributes } from 'react';

type TextAreaVariant = 'base' | 'error' | 'success' | 'ghost';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: TextAreaVariant;
  rows?: number;
  title?: string;
}

const variantClasses: Record<TextAreaVariant, string> = {
  base: 'w-full rounded-md border border-border-dark bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none',
  error: 'w-full rounded-md border border-red-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none',
  success: 'w-full rounded-md border border-emerald-500/50 bg-bg-card px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none',
  ghost: 'w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-sm text-white placeholder-gray-500 outline-none resize-none',
};

function TextArea({
  value,
  onChange,
  label,
  placeholder,
  className,
  variant = 'base',
  rows = 4,
  title,
  ...props
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}

      <textarea
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        title={title}
        className={className ?? variantClasses[variant]}
      />
    </div>
  );
}

export default TextArea;