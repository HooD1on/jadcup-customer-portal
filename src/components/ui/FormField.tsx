import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface BaseFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  hint?: ReactNode;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  as?: 'input';
  suffix?: ReactNode;
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  as: 'textarea';
  suffix?: never;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, id, error, required, hint, as, ...rest } = props;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  const baseInputClasses = `w-full px-3 py-2.5 text-sm border rounded-(--radius-button) outline-none transition-colors ${
    error
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
      : 'border-gray-200 focus:ring-2 focus:ring-jade-200 focus:border-jade-500'
  }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          className={`${baseInputClasses} resize-none`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            className={`${baseInputClasses} ${(props as InputFieldProps).suffix ? 'pr-10' : ''}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
          {(props as InputFieldProps).suffix && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-1">
              {(props as InputFieldProps).suffix}
            </div>
          )}
        </div>
      )}
      {hint && (
        <p id={hintId} className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">{error}</p>
      )}
    </div>
  );
}
