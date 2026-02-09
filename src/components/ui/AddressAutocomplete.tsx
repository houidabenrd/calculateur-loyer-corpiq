import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Search, X, Home } from 'lucide-react';

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
  onUnitDetected?: (unit: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
}

// ─── Détection automatique d'unité / appartement ───────────────────────────
// Patterns courants au Québec : "app 3", "apt. 4B", "unité 5", "#3", "suite 2"
// En début : "app 3, 123 rue..." ou "apt. 4B - 456 boul..."
// En fin   : "123 rue Principale, app 3" ou "456 boul. St-Laurent apt. 4B"
// Format tiret : "3-123 rue..." (unité-numéro civique)

const UNIT_PREFIX_PATTERNS: RegExp[] = [
  /^(?:app\.?|apt\.?|unit[ée]?\.?|suite|bureau)\s+(\d+\w*)\s*[,\-–]\s*/i,
  /^#\s*(\d+\w*)\s*[,\-–]\s*/i,
];

const UNIT_SUFFIX_PATTERNS: RegExp[] = [
  /[,\-–]\s*(?:app\.?|apt\.?|unit[ée]?\.?|suite|bureau)\s+(\d+\w*)\s*$/i,
  /[,\-–]\s*#\s*(\d+\w*)\s*$/i,
];

// Format "3-1234 rue..." : le premier chiffre (1-2 chars) suivi d'un tiret puis du numéro civique (3+ chars)
const DASH_UNIT_PATTERN = /^(\d{1,2})\s*[-–]\s*(\d{3,}.*)$/;

function extractUnit(input: string): { unit: string; cleanQuery: string } {
  // Vérifier les patterns de préfixe
  for (const pattern of UNIT_PREFIX_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        unit: match[1],
        cleanQuery: input.replace(match[0], '').trim(),
      };
    }
  }

  // Vérifier les patterns de suffixe
  for (const pattern of UNIT_SUFFIX_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        unit: match[1],
        cleanQuery: input.replace(match[0], '').trim(),
      };
    }
  }

  // Format tiret : "3-1234 rue Principale" → unité 3, adresse "1234 rue Principale"
  const dashMatch = input.match(DASH_UNIT_PATTERN);
  if (dashMatch) {
    return {
      unit: dashMatch[1],
      cleanQuery: dashMatch[2].trim(),
    };
  }

  return { unit: '', cleanQuery: input };
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onUnitDetected,
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
  const [detectedUnit, setDetectedUnit] = useState('');
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
    // Détecter l'unité et nettoyer la requête
    const { unit, cleanQuery } = extractUnit(searchQuery);
    
    // Mettre à jour l'unité détectée
    if (unit !== detectedUnit) {
      setDetectedUnit(unit);
      if (unit && onUnitDetected) {
        onUnitDetected(unit);
      }
    }
    
    // Utiliser la requête nettoyée (sans l'unité) pour la recherche
    const trimmed = cleanQuery.trim();
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
  }, [detectedUnit, onUnitDetected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setHasSelected(false);
    onChange(newValue);

    // Détecter l'unité en temps réel pendant la saisie
    const { unit } = extractUnit(newValue);
    if (unit !== detectedUnit) {
      setDetectedUnit(unit);
      if (onUnitDetected) {
        onUnitDetected(unit);
      }
    }
    // Si l'utilisateur efface tout le texte, réinitialiser l'unité
    if (!newValue.trim()) {
      setDetectedUnit('');
      if (onUnitDetected) {
        onUnitDetected('');
      }
    }

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
    // Notifier le parent de l'unité détectée lors de la sélection
    if (detectedUnit && onUnitDetected) {
      onUnitDetected(detectedUnit);
    }
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
    setDetectedUnit('');
    if (onUnitDetected) {
      onUnitDetected('');
    }
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

      {/* Indicateur d'unité détectée */}
      {detectedUnit && (
        <div className="mt-1.5 flex items-center gap-1.5 px-1">
          <Home size={13} className="text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-emerald-700 font-medium">
            Unité / App. <span className="font-bold">{detectedUnit}</span> détectée automatiquement
          </span>
        </div>
      )}

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
                  <div className="flex flex-col">
                    {detectedUnit && (
                      <span className="text-[10px] text-emerald-600 font-semibold mb-0.5">
                        App. {detectedUnit}
                      </span>
                    )}
                    <span className="text-sm leading-snug">{suggestion.label}</span>
                  </div>
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
