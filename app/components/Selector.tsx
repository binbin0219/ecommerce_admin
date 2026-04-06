'use client';

import { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconX, IconSearch } from '@tabler/icons-react';
import Dropdown from '../Dropdown/Dropdown';
import DropdownMenu from '../Dropdown/DropdownMenu';
import { DropdownItem } from '../Dropdown/DropdownItem/DropdownItem';

export interface SelectorOption {
  value: string | number;
  title: string;
}

interface SelectorProps {
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectorOption[];
  placeholder?: string;
  disabled?: boolean;
  enableSearch?: boolean;
  error?: string;
  className?: string;
}

export default function Selector({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  enableSearch = true,
  error,
  className = '',
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: SelectorOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearch('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, enableSearch]);

  return (
        <Dropdown
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        trigger={(
            <div
                className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 w-full
                bg-bgPri dark:bg-bgSec transition-all cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-appPrimary/50'}
                ${isOpen ? 'border-appPrimary shadow-lg shadow-appPrimary/10' : 'border-borderPri'}
                ${error ? 'border-red-500' : ''}
                `}
            >
                {/* Selected Value or Placeholder */}
                <span className={`flex-1 ${selectedOption ? 'text-textPri' : 'text-textSec'}`}>
                {selectedOption ? selectedOption.title : placeholder}
                </span>

                {/* Clear Button */}
                {value && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-textSec hover:text-appPrimary transition-colors"
                >
                    <IconX size={18} />
                </button>
                )}

                {/* Dropdown Arrow */}
                <IconChevronDown
                size={20}
                className={`text-textSec transition-transform ${isOpen ? 'rotate-180 text-appPrimary' : ''}`}
                />

                {/* // Error Message */}
                {error && (
                    <span className="absolute -bottom-5 right-2 text-xs text-red-500">
                    {error}
                    </span>
                )}
            </div>
        )}>
            <DropdownMenu>
                {/* Search Input */}
                {enableSearch && (
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-borderPri">
                    <IconSearch size={18} className="text-textSec" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 bg-transparent outline-none text-textPri placeholder:text-textSec"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {search && (
                        <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="text-textSec hover:text-appPrimary transition-colors"
                        >
                        <IconX size={16} />
                        </button>
                    )}
                    </div>
                )}

                {/* Options List */}
                <ul className="max-h-60 overflow-y-auto w-full flex gap-2 flex-col p-1">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <DropdownItem 
                            key={option.value} 
                            onClick={() => handleSelect(option)}
                            isActive={option.value === value}
                            >
                                {option.title}
                            </DropdownItem>
                        ))
                    ) : (
                        <li className="px-4 py-8 text-center text-textSec flex flex-col items-center gap-2">
                            <IconX size={24} />
                            <span>No items found</span>
                        </li>
                    )}
                </ul>
            </DropdownMenu>
        </Dropdown>
  );
}