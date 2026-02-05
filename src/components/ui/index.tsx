import React from 'react';
import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

// Composant Tooltip d'aide
interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => (
  <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button type="button" className="ml-1 text-gray-400 hover:text-corpiq-blue transition-colors">
          <HelpCircle size={16} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs z-50"
          sideOffset={5}
        >
          {content}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

// Composant Section Card
interface SectionCardProps {
  title: string;
  badge?: number;
  children: React.ReactNode;
  tooltip?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, badge, children, tooltip }) => (
  <div className="section-card mb-6">
    <div className="section-header flex items-center justify-between">
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-corpiq-bordeaux text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {badge}
          </span>
        )}
        <span>{title}</span>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
    </div>
    <div className="section-content">{children}</div>
  </div>
);

// Composant Input Monétaire
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0,00 $',
  disabled = false,
  className = '',
  id,
}) => {
  const [displayValue, setDisplayValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  // Mettre à jour l'affichage uniquement quand la valeur change ET que le champ n'est pas focus
  React.useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(value.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      }
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9,.-]/g, '');
    setDisplayValue(rawValue);
    
    // Mettre à jour la valeur en temps réel pour déclencher les calculs
    const parsed = parseFloat(rawValue.replace(',', '.').replace(/\s/g, ''));
    if (!isNaN(parsed)) {
      onChange(Math.round(parsed * 100) / 100);
    } else if (rawValue === '' || rawValue === '-') {
      onChange(0);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Formater proprement à la sortie du champ
    const parsed = parseFloat(displayValue.replace(',', '.').replace(/\s/g, ''));
    if (isNaN(parsed)) {
      onChange(0);
      setDisplayValue('');
    } else {
      const rounded = Math.round(parsed * 100) / 100;
      onChange(rounded);
      setDisplayValue(rounded.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  };

  return (
    <input
      type="text"
      id={id}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`input-currency ${disabled ? 'input-readonly' : ''} ${className}`}
    />
  );
};

// Composant Champ calculé (lecture seule)
interface CalculatedFieldProps {
  value: number;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
  className?: string;
}

export const CalculatedField: React.FC<CalculatedFieldProps> = ({
  value,
  prefix = '',
  suffix = ' $',
  highlight = false,
  className = '',
}) => {
  const formattedValue = value.toLocaleString('fr-CA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  const colorClass = value < 0 ? 'text-red-600' : value > 0 ? 'text-green-700' : 'text-gray-700';
  
  return (
    <div 
      className={`input-readonly text-right font-medium ${colorClass} ${highlight ? 'calc-highlight' : ''} ${className}`}
    >
      {prefix}{formattedValue}{suffix}
    </div>
  );
};

// Composant Input Numérique simple
interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  placeholder = '0',
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onChange(0);
    } else {
      let newValue = parsed;
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);
      onChange(newValue);
    }
  };

  return (
    <input
      type="number"
      value={value || ''}
      onChange={handleChange}
      min={min}
      max={max}
      placeholder={placeholder}
      disabled={disabled}
      className={`input-field text-center ${disabled ? 'input-readonly' : ''} ${className}`}
    />
  );
};

// Composant Checkbox stylisé
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 rounded border-gray-300 text-corpiq-blue focus:ring-corpiq-blue cursor-pointer"
    />
    {label && <span className="text-gray-700">{label}</span>}
  </label>
);

// Composant Label avec tooltip optionnel
interface LabelWithTooltipProps {
  htmlFor?: string;
  children: React.ReactNode;
  tooltip?: string;
  required?: boolean;
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ 
  htmlFor, 
  children, 
  tooltip,
  required 
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
    {tooltip && <InfoTooltip content={tooltip} />}
  </label>
);

// Composant Step Indicator
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: number; title: string; description: string }[];
  onStepClick?: (step: number) => void;
  canAccessStep?: (step: number) => boolean;
  disabledMessage?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  steps,
  onStepClick,
  canAccessStep,
  disabledMessage
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isAccessible = canAccessStep ? canAccessStep(step.id) : true;
        const isClickable = onStepClick && isAccessible;
        
        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center transition-all ${
                isClickable 
                  ? 'cursor-pointer group hover:opacity-80' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              title={!isAccessible ? disabledMessage : undefined}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-corpiq-blue text-white'
                    : isAccessible
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className={`text-xs mt-2 text-center hidden md:block ${
                step.id === currentStep 
                  ? 'font-semibold text-corpiq-blue' 
                  : isAccessible
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// Composant Boutons de navigation
interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  showPrevious?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  showPrevious = true,
  showNext = true,
  nextDisabled = false,
}) => {
  // Les labels par défaut seront gérés par les composants parents qui utilisent useLanguage
  const defaultPrevious = previousLabel || 'Previous';
  const defaultNext = nextLabel || 'Next';
  
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      {showPrevious && onPrevious ? (
        <button type="button" onClick={onPrevious} className="btn-secondary">
          ← {defaultPrevious}
        </button>
      ) : (
        <div />
      )}
      {showNext && onNext && (
        <button 
          type="button" 
          onClick={onNext} 
          disabled={nextDisabled}
          className="btn-primary"
        >
          {defaultNext} →
        </button>
      )}
    </div>
  );
};
