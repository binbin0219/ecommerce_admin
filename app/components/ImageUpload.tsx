'use client';

import { useRef, useState, useEffect } from 'react';
import { IconPhoto, IconX } from '@tabler/icons-react';

interface ImageUploadProps {
  files: ImageUploadFile | ImageUploadFile[] | null;
  onChange: (files: ImageUploadFile | ImageUploadFile[] | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxFileSizeMB?: number;
  multiple?: boolean;
  height?: string;
}

export type ImageUploadFile = {
  url: string;
  file?: File;
}

export default function ImageUpload({
  files,
  onChange,
  placeholder = 'Click to upload images',
  disabled = false,
  error,
  className = '',
  maxFileSizeMB = 5,
  multiple = false,
  height = 'auto',
}: ImageUploadProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate preview URLs from files whenever files change
  useEffect(() => {
    // Clean up old URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));

    // Generate new preview URLs
    if (!files) {
      setPreviewUrls([]);
      return;
    }

    const fileArray = Array.isArray(files) ? files : [files];
    const newUrls = fileArray.map(file => file.file ? URL.createObjectURL(file.file) : file.url);
    setPreviewUrls(newUrls);

    // Cleanup function
    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];

    // Validate file size
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`Maximum file size is ${maxFileSizeMB}MB`);
      return;
    }

    if (multiple) {
      // Multiple files mode
      const currentFiles = Array.isArray(files) ? files : [];
      const updatedFiles = [...currentFiles, {
        file,
        url: URL.createObjectURL(file)
      }];
      onChange(updatedFiles);
    } else { 
      // Single file mode
      onChange({
        file,
        url: URL.createObjectURL(file)
      });
    }

    // Reset input to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDelete = (index: number) => {
    if (multiple) {
      // Multiple files mode
      const currentFiles = Array.isArray(files) ? files : [];
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      onChange(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      // Single file mode
      onChange(null);
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={triggerFileInput}
        style={{ height }}
        className={`
          relative border-2 border-dashed rounded-lg
          bg-bgPri dark:bg-bgSec transition-all cursor-pointer
          p-8 flex flex-col items-center justify-center gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-appPrimary/50'}
          ${isFocused ? 'border-appPrimary shadow-lg shadow-appPrimary/10' : 'border-borderPri'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="hidden"
        />

        {/* Preview or Placeholder */}
        {previewUrls.length > 0 ? (
          <div 
            className="flex flex-wrap justify-center gap-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {previewUrls.map((preview, index) => (
              <div
                key={index}
                className="relative group max-w-[150px] transition-transform hover:scale-105"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="
                    absolute -top-2 -right-2 w-7 h-7 rounded-full
                    bg-white dark:bg-gray-800 shadow-lg
                    flex items-center justify-center
                    hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-110
                    transition-all z-10
                  "
                >
                  <IconX size={16} className="text-gray-700 dark:text-gray-300" />
                </button>

                {/* Image Preview */}
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-textSec">
            <IconPhoto size={48} className="text-textSec/50" />
            <p className="text-center">{placeholder}</p>
            <p className="text-xs text-textSec/70">Max size: {maxFileSizeMB}MB</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <span className="absolute bottom-2 right-3 text-xs text-red-500" role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}