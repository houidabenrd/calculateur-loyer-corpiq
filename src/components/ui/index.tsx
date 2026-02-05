import React from 'react';
import { HelpCircle, X, Info } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

// Composant Tooltip d'aide - UX améliorée
interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLongContent = content.length > 200;

  // Contenu court : tooltip au survol (Radix)
  if (!isLongContent) {
    return (
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-corpiq-blue hover:bg-blue-100 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/30"
            >
              <HelpCircle size={14} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="tooltip-content bg-white text-gray-700 px-4 py-3 rounded-xl text-sm max-w-sm z-50 shadow-xl border border-gray-100 leading-relaxed"
              sideOffset={5}
            >
              <div className="flex gap-2.5">
                <Info size={16} className="text-corpiq-blue flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{content}</span>
              </div>
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  // Contenu long : panneau modal au clic
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-corpiq-blue hover:bg-blue-100 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/30"
      >
        <HelpCircle size={14} />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm info-overlay-enter" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden info-panel-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-corpiq-blue/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-corpiq-blue/10 flex items-center justify-center">
                  <Info size={20} className="text-corpiq-blue" />
                </div>
                <span className="font-semibold text-gray-800 text-base">Information</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-4.5rem)] text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Composant Section Card
interface SectionCardProps {
  title: string;
  badge?: number | string;
  children: React.ReactNode;
  tooltip?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, badge, children, tooltip }) => (
  <div className="section-card mb-6">
    <div className="section-header flex items-center justify-between">
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`bg-corpiq-bordeaux text-white ${String(badge).length > 1 ? 'w-7 text-xs' : 'w-6 text-sm'} h-6 rounded-full flex items-center justify-center font-bold`}>
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
