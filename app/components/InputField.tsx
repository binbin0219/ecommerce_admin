'use client';

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

interface InputFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
  icon?: React.ReactNode;
  autoComplete?: string;
}

export interface InputFieldRef {
  focus: () => void;
}

const InputField = forwardRef<InputFieldRef, InputFieldProps>(
  (
    {
      value,
      onChange,
      type = 'text',
      placeholder = '',
      name,
      disabled = false,
      error,
      className = '',
      rows = 3,
      icon,
      autoComplete,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose focus method to parent components
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (type === 'textarea') {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (type === 'number') {
        onChange(val === '' ? 0 : Number(val));
      } else {
        onChange(val);
      }
    };

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    const handleWrapperClick = () => {
      if (type === 'textarea') {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    };

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const baseInputClasses = `
      flex-1 bg-transparent outline-none text-textPri placeholder:text-textSec
      disabled:cursor-not-allowed disabled:opacity-50
    `;

    return (
      <div className={`relative ${className}`}>
        <div
          onClick={handleWrapperClick}
          className={`
            flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 
            bg-bgPri dark:bg-bgSec transition-all cursor-text
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-appPrimary/50'}
            ${isFocused ? 'border-appPrimary shadow-lg shadow-appPrimary/10' : 'border-borderPri'}
            ${error ? 'border-red-500' : ''}
            ${type === 'textarea' ? 'items-start' : 'items-center'}
          `}
        >
          {/* Icon */}
          {icon && <div className="text-textSec flex-shrink-0">{icon}</div>}

          {/* Input or Textarea */}
          {type === 'textarea' ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              name={name}
              disabled={disabled}
              rows={rows}
              autoComplete={autoComplete}
              className={`${baseInputClasses} resize-none w-full`}
            />
          ) : (
            <input
              ref={inputRef}
              type={inputType}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              name={name}
              disabled={disabled}
              autoComplete={autoComplete}
              min={type === 'number' ? 0 : undefined}
              className={baseInputClasses}
            />
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePassword}
              className="text-textSec hover:text-appPrimary transition-colors flex-shrink-0"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <span className="absolute -bottom-5 right-2 text-xs text-red-500" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;