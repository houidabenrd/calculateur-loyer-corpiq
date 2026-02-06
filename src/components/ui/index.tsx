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
      <Tooltip.Provider delayDuration={150}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button type="button"
              className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-corpiq-blue/8 text-corpiq-blue/60 hover:bg-corpiq-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/20 hover:scale-110">
              <HelpCircle size={12} strokeWidth={2.5} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="tooltip-content bg-white text-gray-700 px-4 py-3 rounded-xl text-sm max-w-sm z-50 leading-relaxed border border-gray-100"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)' }}
              sideOffset={6}>
              <div className="flex gap-2.5">
                <Info size={15} className="text-corpiq-blue flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-line text-[13px]">{content}</span>
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
      <button type="button" onClick={() => setIsOpen(true)}
        className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-corpiq-blue/8 text-corpiq-blue/60 hover:bg-corpiq-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-corpiq-blue/20 hover:scale-110">
        <HelpCircle size={12} strokeWidth={2.5} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm info-overlay-enter" />
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden info-panel-enter"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-corpiq-blue/10 flex items-center justify-center">
                  <Info size={16} className="text-corpiq-blue" />
                </div>
                <span className="font-bold text-gray-900 text-sm">Information</span>
              </div>
              <button type="button" onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-4rem)] text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
    <div className="section-header flex items-center gap-2.5 relative z-10">
      {badge !== undefined && (
        <span className={`${String(badge).length > 1 ? 'w-8 px-0.5 text-[11px]' : 'w-7 text-xs'} h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-extrabold border border-white/15 tracking-wide`}>
          {badge}
        </span>
      )}
      <span className="text-sm font-bold tracking-wide flex-1">{title}</span>
      {tooltip && <InfoTooltip content={tooltip} />}
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
  value, onChange, placeholder = '0,00 $', disabled = false, className = '', id,
}) => {
  const [displayValue, setDisplayValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value === 0 ? '' : value.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9,.-]/g, '');
    setDisplayValue(rawValue);
    const parsed = parseFloat(rawValue.replace(',', '.').replace(/\s/g, ''));
    if (!isNaN(parsed)) onChange(Math.round(parsed * 100) / 100);
    else if (rawValue === '' || rawValue === '-') onChange(0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue.replace(',', '.').replace(/\s/g, ''));
    if (isNaN(parsed)) { onChange(0); setDisplayValue(''); }
    else {
      const rounded = Math.round(parsed * 100) / 100;
      onChange(rounded);
      setDisplayValue(rounded.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  };

  return (
    <div className="relative group">
      <input type="text" id={id} value={displayValue} onChange={handleChange}
        onFocus={() => setIsFocused(true)} onBlur={handleBlur}
        placeholder={placeholder} disabled={disabled}
        className={`input-currency pr-9 ${disabled ? 'input-readonly' : ''} ${className}`} />
      <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none font-bold transition-colors duration-200 ${isFocused ? 'text-corpiq-blue' : 'text-gray-400'}`}>$</span>
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
  value, prefix = '', suffix = ' $', highlight = false, className = '',
}) => {
  const formatted = value.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const color = value < 0 ? 'text-red-600 bg-red-50/60' : value > 0 ? 'text-emerald-700 bg-emerald-50/60' : 'text-gray-500 bg-gray-50';

  return (
    <div className={`input-readonly text-right font-bold tabular-nums ${color} ${highlight ? 'calc-highlight ring-1 ring-corpiq-blue/10 !bg-corpiq-blue-50/30' : ''} ${className}`}>
      {prefix}{formatted}{suffix}
    </div>
  );
};

// ─── NumberInput ─────────────────────────────────────────────
interface NumberInputProps {
  value: number; onChange: (value: number) => void;
  min?: number; max?: number; placeholder?: string; disabled?: boolean; className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value, onChange, min = 0, max, placeholder = '0', disabled = false, className = '',
}) => (
  <input type="number" value={value || ''} min={min} max={max} placeholder={placeholder} disabled={disabled}
    onChange={(e) => {
      const p = parseInt(e.target.value, 10);
      if (isNaN(p)) onChange(0);
      else onChange(Math.max(min ?? 0, max !== undefined ? Math.min(max, p) : p));
    }}
    className={`input-field text-center font-semibold ${disabled ? 'input-readonly' : ''} ${className}`} />
);

// ─── Checkbox ────────────────────────────────────────────────
interface CheckboxProps { checked: boolean; onChange: (checked: boolean) => void; label?: string; id?: string; }

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group select-none">
    <div className="relative">
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${checked ? 'bg-corpiq-blue border-corpiq-blue shadow-sm shadow-corpiq-blue/20' : 'border-gray-300 bg-white group-hover:border-corpiq-blue/40'}`}>
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
    </div>
    {label && <span className="text-gray-700 text-sm font-medium leading-snug">{label}</span>}
  </label>
);

// ─── LabelWithTooltip ────────────────────────────────────────
interface LabelWithTooltipProps { htmlFor?: string; children: React.ReactNode; tooltip?: string; required?: boolean; }

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ htmlFor, children, tooltip, required }) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {tooltip && <InfoTooltip content={tooltip} />}
  </label>
);

// ─── StepIndicator ───────────────────────────────────────────
interface StepIndicatorProps {
  currentStep: number; totalSteps: number;
  steps: { id: number; title: string; description: string }[];
  onStepClick?: (step: number) => void; canAccessStep?: (step: number) => boolean; disabledMessage?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep, steps, onStepClick, canAccessStep, disabledMessage,
}) => (
  <div className="mb-8">
    {/* Desktop */}
    <div className="hidden sm:block">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const accessible = canAccessStep ? canAccessStep(step.id) : true;
          const clickable = onStepClick && accessible;
          const done = step.id < currentStep;
          const current = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              <button type="button"
                onClick={() => clickable && onStepClick(step.id)}
                disabled={!clickable}
                className={`flex flex-col items-center transition-all duration-300 min-w-0 ${clickable ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
                title={!accessible ? disabledMessage : step.title}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  done ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : current ? 'bg-corpiq-blue text-white shadow-md shadow-corpiq-blue/25 pulse-ring scale-110'
                  : accessible ? 'bg-white text-gray-400 border-2 border-gray-200 group-hover:border-corpiq-blue/30 group-hover:text-corpiq-blue group-hover:scale-105'
                  : 'bg-gray-100 text-gray-300 border border-gray-200'
                }`}>
                  {done ? <Check size={15} strokeWidth={3} /> : step.id}
                </div>
                <span className={`text-[10px] mt-2 text-center font-semibold max-w-[72px] leading-tight hidden lg:block transition-colors ${
                  current ? 'text-corpiq-blue' : done ? 'text-emerald-600' : accessible ? 'text-gray-400' : 'text-gray-300'
                }`}>{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1.5 lg:mx-2.5 h-px bg-gray-200 relative">
                  <div className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-700 ease-out rounded-full ${done ? 'w-full' : 'w-0'}`} style={{ height: '2px', top: '-0.5px' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>

    {/* Mobile */}
    <div className="sm:hidden">
      <div className="flex items-center justify-center gap-1.5 mb-2">
        {steps.map((step) => (
          <button key={step.id} type="button"
            onClick={() => onStepClick && canAccessStep?.(step.id) && onStepClick(step.id)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step.id === currentStep ? 'w-8 bg-corpiq-blue' : step.id < currentStep ? 'w-4 bg-emerald-500' : 'w-1.5 bg-gray-300'
            }`} />
        ))}
      </div>
      <p className="text-center text-xs font-medium text-gray-500">
        {currentStep}/{steps.length} — {steps[currentStep - 1]?.title}
      </p>
    </div>
  </div>
);

// ─── NavigationButtons ───────────────────────────────────────
interface NavigationButtonsProps {
  onPrevious?: () => void; onNext?: () => void;
  previousLabel?: string; nextLabel?: string;
  showPrevious?: boolean; showNext?: boolean; nextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious, onNext, previousLabel, nextLabel,
  showPrevious = true, showNext = true, nextDisabled = false,
}) => (
  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
    {showPrevious && onPrevious ? (
      <button type="button" onClick={onPrevious} className="btn-secondary inline-flex items-center gap-2 text-sm py-3 px-5">
        <ChevronLeft size={16} strokeWidth={2.5} />
        {previousLabel || 'Précédent'}
      </button>
    ) : <div />}
    {showNext && onNext && (
      <button type="button" onClick={onNext} disabled={nextDisabled} className="btn-primary inline-flex items-center gap-2 text-sm py-3 px-5">
        {nextLabel || 'Suivant'}
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    )}
  </div>
);
