'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  searchable = false,
  className = '',
  disabled = false,
  id,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const inputId = id || uid;

  const selected = options.find(o => o.value === value) || null;

  const filtered = searchable && search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [open, searchable]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen(prev => !prev);
    if (open) setSearch('');
  };

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    setSearch('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setSearch(''); }
    if (e.key === 'Enter' && !open) setOpen(true);
  };

  const hasFloatingLabel = label && (open || !!selected);

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {/* ——— Trigger button ——— */}
      <button
        type="button"
        id={inputId}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          relative w-full flex items-center justify-between
          px-4 py-3 bg-white rounded-2xl text-sm font-medium
          border-2 transition-all duration-200 cursor-pointer text-left
          ${open
            ? 'border-brand-accent ring-4 ring-brand-accent/10 shadow-md'
            : 'border-brand-border hover:border-brand-accent/40 shadow-sm hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-brand-beige' : ''}
        `}
      >
        {/* Floating label */}
        {label && (
          <span
            className={`
              absolute left-4 font-semibold transition-all duration-200 pointer-events-none
              ${(open || selected)
                ? 'top-1.5 text-[9px] uppercase tracking-widest text-brand-accent'
                : 'top-1/2 -translate-y-1/2 text-sm text-brand-muted'
              }
            `}
          >
            {label}
          </span>
        )}

        {/* Selected value display */}
        <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${label && (open || selected) ? 'mt-3' : ''}`}>
          {selected?.icon && (
            <span className="flex-shrink-0 text-base leading-none">{selected.icon}</span>
          )}
          <span className={`truncate ${selected ? 'text-brand-text font-semibold' : 'text-brand-muted'}`}>
            {selected ? selected.label : (!label ? placeholder : '')}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`flex-shrink-0 w-4 h-4 ml-2 transition-all duration-300 ${
            open ? 'rotate-180 text-brand-accent' : 'text-brand-muted'
          }`}
        />
      </button>

      {/* ——— Dropdown panel ——— */}
      {open && (
        <div
          role="listbox"
          className="
            absolute z-50 top-full mt-2 left-0 right-0
            bg-white border border-brand-border/70
            rounded-2xl shadow-2xl shadow-black/10
            overflow-hidden animate-scale-up
          "
          style={{ transformOrigin: 'top center' }}
        >
          {/* Search input */}
          {searchable && (
            <div className="px-3 pt-3 pb-2 border-b border-brand-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 transition-all"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <ul className="py-1.5 max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-brand-muted text-center italic">
                Aucun résultat
              </li>
            ) : (
              filtered.map(option => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex items-center justify-between gap-3
                      px-4 py-2.5 cursor-pointer text-sm font-medium
                      transition-all duration-150 mx-1.5 rounded-xl
                      ${isSelected
                        ? 'bg-brand-accent/8 text-brand-accent'
                        : 'text-brand-text hover:bg-brand-hover'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {option.icon && (
                        <span className="flex-shrink-0 text-base leading-none">{option.icon}</span>
                      )}
                      <span className="truncate">
                        {searchable && search ? (
                          // Highlight matching text
                          <HighlightMatch text={option.label} query={search} />
                        ) : (
                          option.label
                        )}
                      </span>
                      {option.description && (
                        <span className="text-brand-muted text-xs font-normal truncate">{option.description}</span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="flex-shrink-0 w-4 h-4 text-brand-accent" strokeWidth={2.5} />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper — surligne la partie matchée dans le texte
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-brand-accent font-bold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}
