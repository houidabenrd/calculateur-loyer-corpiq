import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Search, X } from 'lucide-react';

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id: number;
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    type?: string;
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
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
  const [suggestions, setSuggestions] = useState<{ id: number; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(!!value);
  const [noResults, setNoResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync valeur externe (quand le champ n'a pas le focus)
  useEffect(() => {
    if (value !== query && !inputRef.current?.matches(':focus')) {
      setQuery(value);
      if (value) setHasSelected(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Fermer le dropdown au clic dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Formater une adresse à partir des propriétés Photon
  const formatAddress = (props: PhotonFeature['properties']): string => {
    const parts: string[] = [];

    // Numéro + rue
    if (props.housenumber && props.street) {
      parts.push(`${props.housenumber} ${props.street}`);
    } else if (props.street) {
      parts.push(props.street);
    } else if (props.name) {
      parts.push(props.name);
    }

    // Ville
    if (props.city) {
      parts.push(props.city);
    }

    // Province
    if (props.state) {
      parts.push(props.state);
    }

    // Code postal
    if (props.postcode) {
      parts.push(props.postcode);
    }

    return parts.join(', ') || props.name || '';
  };

  const searchAddress = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
      return;
    }

    // Annuler requête précédente
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsLoading(true);
    setNoResults(false);

    try {
      // API Photon (Komoot) - gratuite, pas de clé API, CORS OK
      // bbox = zone Canada/Québec élargie pour capturer tout le Québec
      const params = new URLSearchParams({
        q: trimmed,
        lang: 'fr',
        limit: '6',
        lat: '46.8',    // Centre approx du Québec
        lon: '-71.2',
        bbox: '-79.8,44.9,-57.1,62.6',  // Bounding box Québec élargie
      });

      const response = await fetch(
        `https://photon.komoot.io/api/?${params.toString()}`,
        { signal: abortRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PhotonResponse = await response.json();

      if (data.features && data.features.length > 0) {
        const formatted = data.features.map(f => ({
          id: f.properties.osm_id || Math.random(),
          label: formatAddress(f.properties),
        })).filter(s => s.label.length > 0);

        // Supprimer les doublons
        const unique = formatted.filter((item, index, arr) =>
          arr.findIndex(i => i.label === item.label) === index
        );

        setSuggestions(unique);
        setShowDropdown(unique.length > 0);
        setNoResults(unique.length === 0);
        setHighlightedIndex(-1);
      } else {
        setSuggestions([]);
        setShowDropdown(true);
        setNoResults(true);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setHasSelected(false);
    onChange(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);

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

  const handleSelect = (label: string) => {
    setQuery(label);
    onChange(label);
    setShowDropdown(false);
    setHasSelected(true);
    setSuggestions([]);
    setNoResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            handleSelect(suggestions[highlightedIndex].label);
          }
          break;
      }
    }
    if (e.key === 'Escape') setShowDropdown(false);
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
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="input-field pl-10 pr-9 transition-shadow focus:shadow-md"
        />

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

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-[60] mt-1 w-full bg-white rounded-xl border border-gray-200 address-dropdown-enter" style={{boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)'}}>
          {suggestions.length > 0 ? (
            <div className="py-1 max-h-[280px] overflow-y-auto overscroll-contain">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.id}-${index}`}
                  type="button"
                  onClick={() => handleSelect(suggestion.label)}
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
                  <span className="text-sm leading-snug">{suggestion.label}</span>
                </button>
              ))}
            </div>
          ) : noResults ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Aucune adresse trouvée. Ajoutez plus de détails (ville, rue...).
            </div>
          ) : null}
          <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">© OpenStreetMap</span>
            <span className="text-[10px] text-gray-400">Photon</span>
          </div>
        </div>
      )}
    </div>
  );
};
