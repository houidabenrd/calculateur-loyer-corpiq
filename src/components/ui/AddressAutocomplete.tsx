import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Search, X } from 'lucide-react';

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  type: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = '',
  id,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(!!value);
  const [noResults, setNoResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController | null>(null);

  // Sync external value changes (seulement quand le champ n'a pas le focus)
  useEffect(() => {
    if (value !== query && !inputRef.current?.matches(':focus')) {
      setQuery(value);
      if (value) setHasSelected(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Fermer le dropdown quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
      return;
    }

    // Annuler la requête précédente si elle est en cours
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsLoading(true);
    setNoResults(false);

    try {
      // Ajouter "Québec" au query pour améliorer les résultats
      const enhancedQuery = searchQuery.includes('QC') || searchQuery.includes('Québec') || searchQuery.includes('Quebec')
        ? searchQuery
        : `${searchQuery}, Québec`;

      const params = new URLSearchParams({
        format: 'json',
        q: enhancedQuery,
        countrycodes: 'ca',
        limit: '6',
        addressdetails: '1',
        email: 'calculateur@corpiq.com',
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          signal: abortRef.current.signal,
          headers: {
            'Accept-Language': 'fr',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AddressSuggestion[] = await response.json();

      if (data.length > 0) {
        setSuggestions(data);
        setShowDropdown(true);
        setHighlightedIndex(-1);
        setNoResults(false);
      } else {
        setSuggestions([]);
        setShowDropdown(true);
        setNoResults(true);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Requête annulée, on ne fait rien
        return;
      }
      setSuggestions([]);
      setNoResults(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setHasSelected(false);
    onChange(newValue);

    // Debounce la recherche
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (newValue.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchAddress(newValue);
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
    }
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    const cleanAddress = formatDisplayAddress(suggestion.display_name);
    setQuery(cleanAddress);
    onChange(cleanAddress);
    setShowDropdown(false);
    setHasSelected(true);
    setSuggestions([]);
    setNoResults(false);
  };

  const formatDisplayAddress = (displayName: string): string => {
    const parts = displayName.split(', ');
    const seen = new Set<string>();
    const filtered = parts.filter(part => {
      const normalized = part.toLowerCase().trim();
      if (seen.has(normalized)) return false;
      if (normalized === 'canada') return false;
      seen.add(normalized);
      return true;
    });
    return filtered.slice(0, 5).join(', ');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
      }
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
    setHasSelected(false);
    setNoResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {/* Icone de recherche / pin */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-corpiq-blue animate-spin" />
          ) : hasSelected ? (
            <MapPin size={18} className="text-green-600" />
          ) : (
            <Search size={18} className="text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          id={id}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="input-field pl-10 pr-9 transition-shadow focus:shadow-md"
        />

        {/* Bouton clear */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown des suggestions */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden address-dropdown-enter">
          {suggestions.length > 0 ? (
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-50 text-corpiq-blue'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <MapPin
                    size={16}
                    className={`flex-shrink-0 mt-0.5 ${
                      index === highlightedIndex ? 'text-corpiq-blue' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm leading-snug">
                    {formatDisplayAddress(suggestion.display_name)}
                  </span>
                </button>
              ))}
            </div>
          ) : noResults ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Aucune adresse trouvée. Essayez avec plus de détails.
            </div>
          ) : null}
          <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100">
            <span className="text-[10px] text-gray-400">
              © OpenStreetMap
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
