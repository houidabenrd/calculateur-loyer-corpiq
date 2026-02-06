import React from 'react';
import { HelpCircle, X, Info, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

// ─── InfoTooltip ─────────────────────────────────────────────
interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLongContent = content.length > 200;

  if (!isLongContent) {
    return (
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-corpiq-blue/8 text-corpiq-blue/60 hover:bg-corpiq-blue/15 hover:text-corpiq-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/20"
            >
              <HelpCircle size={13} />
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-corpiq-blue/8 text-corpiq-blue/60 hover:bg-corpiq-blue/15 hover:text-corpiq-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/20"
      >
        <HelpCircle size={13} />
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
                <div className="w-9 h-9 rounded-xl bg-corpiq-blue/10 flex items-center justify-center">
                  <Info size={18} className="text-corpiq-blue" />
                </div>
                <span className="font-semibold text-gray-800 text-base">Information</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
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

// ─── SectionCard ─────────────────────────────────────────────
interface SectionCardProps {
  title: string;
  badge?: number | string;
  children: React.ReactNode;
  tooltip?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, badge, children, tooltip }) => (
  <div className="section-card mb-6">
    <div className="section-header flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {badge !== undefined && (
          <span className={`bg-white/20 backdrop-blur-sm text-white ${String(badge).length > 1 ? 'w-8 text-xs' : 'w-7 text-sm'} h-7 rounded-lg flex items-center justify-center font-bold border border-white/10`}>
            {badge}
          </span>
        )}
        <span className="text-[15px]">{title}</span>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
    </div>
    <div className="section-content">{children}</div>
  </div>
);

// ─── CurrencyInput ───────────────────────────────────────────
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
    const parsed = parseFloat(rawValue.replace(',', '.').replace(/\s/g, ''));
    if (!isNaN(parsed)) {
      onChange(Math.round(parsed * 100) / 100);
    } else if (rawValue === '' || rawValue === '-') {
      onChange(0);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
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
    <div className="relative">
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
      {!disabled && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none font-medium">$</span>
      )}
    </div>
  );
};

// ─── CalculatedField ─────────────────────────────────────────
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
    maximumFractionDigits: 2,
  });

  const colorClass = value < 0 ? 'text-red-600' : value > 0 ? 'text-emerald-700' : 'text-gray-500';

  return (
    <div
      className={`input-readonly text-right font-semibold tabular-nums ${colorClass} ${highlight ? 'calc-highlight ring-1 ring-corpiq-blue/10' : ''} ${className}`}
    >
      {prefix}{formattedValue}{suffix}
    </div>
  );
};

// ─── NumberInput ─────────────────────────────────────────────
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

// ─── Checkbox ────────────────────────────────────────────────
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group select-none">
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white peer-checked:border-corpiq-blue peer-checked:bg-corpiq-blue transition-all duration-200 flex items-center justify-center group-hover:border-corpiq-blue/50">
        {checked && <Check size={13} className="text-white" strokeWidth={3} />}
      </div>
    </div>
    {label && <span className="text-gray-700 text-sm">{label}</span>}
  </label>
);

// ─── LabelWithTooltip ────────────────────────────────────────
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
  required,
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {tooltip && <InfoTooltip content={tooltip} />}
  </label>
);

// ─── StepIndicator ───────────────────────────────────────────
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
  disabledMessage,
}) => (
  <div className="mb-8">
    {/* Desktop */}
    <div className="hidden sm:flex items-center justify-between">
      {steps.map((step, index) => {
        const isAccessible = canAccessStep ? canAccessStep(step.id) : true;
        const isClickable = onStepClick && isAccessible;
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center transition-all duration-200 ${
                isClickable
                  ? 'cursor-pointer group hover:opacity-90'
                  : 'cursor-not-allowed'
              }`}
              title={!isAccessible ? disabledMessage : undefined}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-corpiq-blue text-white shadow-lg shadow-corpiq-blue/25 pulse-ring'
                    : isAccessible
                    ? 'bg-white text-gray-400 border-2 border-gray-200 group-hover:border-corpiq-blue/30 group-hover:text-corpiq-blue/60'
                    : 'bg-gray-100 text-gray-300 border border-gray-200'
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={`text-xs mt-2.5 text-center font-medium max-w-[80px] leading-tight hidden md:block ${
                  isCurrent
                    ? 'text-corpiq-blue'
                    : isCompleted
                    ? 'text-emerald-600'
                    : isAccessible
                    ? 'text-gray-400'
                    : 'text-gray-300'
                }`}
              >
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-3 h-[3px] rounded-full overflow-hidden bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isCompleted ? 'bg-emerald-500 w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>

    {/* Mobile */}
    <div className="sm:hidden">
      <div className="flex items-center justify-center gap-2 mb-3">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          return (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-8 bg-corpiq-blue'
                  : isCompleted
                  ? 'w-6 bg-emerald-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          );
        })}
      </div>
    </div>
  </div>
);

// ─── NavigationButtons ───────────────────────────────────────
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
  const defaultPrevious = previousLabel || 'Previous';
  const defaultNext = nextLabel || 'Next';

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200/80">
      {showPrevious && onPrevious ? (
        <button type="button" onClick={onPrevious} className="btn-secondary inline-flex items-center gap-2">
          <ChevronLeft size={18} />
          {defaultPrevious}
        </button>
      ) : (
        <div />
      )}
      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="btn-primary inline-flex items-center gap-2"
        >
          {defaultNext}
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
};
