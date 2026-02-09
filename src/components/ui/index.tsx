import React from 'react';
import { HelpCircle, X, Info, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

// ─── InfoTooltip (Dramatic) ─────────────────────────────────
interface InfoTooltipProps {
  content: string;
}

const renderFormattedText = (text: string) => {
  // Support **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLongContent = content.length > 200;

  if (!isLongContent) {
    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button type="button"
              className="ml-1.5 inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-corpiq-blue/70 hover:text-white transition-all duration-300 focus:outline-none hover:scale-125 flex-shrink-0 relative group/tip"
              style={{background: 'linear-gradient(135deg, rgba(19,49,92,0.08), rgba(26,65,120,0.12))'}}>
              <span className="absolute inset-0 rounded-full opacity-0 group-hover/tip:opacity-100 transition-opacity duration-300"
                style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}} />
              <HelpCircle size={12} strokeWidth={2.5} className="relative z-10" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] animate-fade-in-up"
              sideOffset={8}
              side="top">
              <div className="relative max-w-sm rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 8px 40px rgba(19,49,92,0.18), 0 2px 8px rgba(0,0,0,0.08)' }}>
                {/* Gradient accent top */}
                <div className="h-1" style={{background: 'linear-gradient(90deg, #13315c, #1a4178, #2563eb, #1a4178, #13315c)'}} />
                <div className="bg-white px-4 py-3.5">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{background: 'linear-gradient(135deg, rgba(19,49,92,0.08), rgba(37,99,235,0.08))'}}>
                      <Info size={14} className="text-corpiq-blue" />
                    </div>
                    <span className="whitespace-pre-line text-[13px] text-gray-700 leading-relaxed">{renderFormattedText(content)}</span>
                  </div>
                </div>
              </div>
              <Tooltip.Arrow className="fill-white" width={12} height={6} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <>
      <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(true); }}
        className="ml-1.5 inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-corpiq-blue/70 hover:text-white transition-all duration-300 focus:outline-none hover:scale-125 flex-shrink-0 relative group/tip"
        style={{background: 'linear-gradient(135deg, rgba(19,49,92,0.08), rgba(26,65,120,0.12))'}}>
        <span className="absolute inset-0 rounded-full opacity-0 group-hover/tip:opacity-100 transition-opacity duration-300"
          style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}} />
        <HelpCircle size={12} strokeWidth={2.5} className="relative z-10" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(false); }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md info-overlay-enter" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden info-panel-enter"
            style={{ boxShadow: '0 25px 80px rgba(19,49,92,0.25), 0 8px 24px rgba(0,0,0,0.1)' }}
            onClick={(e) => e.stopPropagation()}>
            {/* Gradient header */}
            <div className="relative px-6 py-5 text-white overflow-hidden"
              style={{background: 'linear-gradient(135deg, #0c2240, #13315c 50%, #1a4178)'}}>
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)'}} />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/10">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight">Information</span>
                    <p className="text-blue-200/50 text-[10px] font-medium">Détails et explications</p>
                  </div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(false); }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-5rem)] text-[14px] text-gray-700 leading-[1.7] whitespace-pre-line">
              {renderFormattedText(content)}
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
      {tooltip && <HeaderTooltip content={tooltip} />}
    </div>
    <div className="section-content">{children}</div>
  </div>
);

// Tooltip visible sur fond sombre (header)
const HeaderTooltip: React.FC<{ content: string }> = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLongContent = content.length > 200;

  if (!isLongContent) {
    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button type="button"
              className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-white hover:bg-white/30 transition-all duration-300 focus:outline-none hover:scale-110 flex-shrink-0 border border-white/10">
              <HelpCircle size={14} strokeWidth={2.5} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] animate-fade-in-up"
              sideOffset={10}
              side="top">
              <div className="relative max-w-sm rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 8px 40px rgba(19,49,92,0.18), 0 2px 8px rgba(0,0,0,0.08)' }}>
                <div className="h-1" style={{background: 'linear-gradient(90deg, #13315c, #1a4178, #2563eb, #1a4178, #13315c)'}} />
                <div className="bg-white px-4 py-3.5">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{background: 'linear-gradient(135deg, rgba(19,49,92,0.08), rgba(37,99,235,0.08))'}}>
                      <Info size={14} className="text-corpiq-blue" />
                    </div>
                    <span className="whitespace-pre-line text-[13px] text-gray-700 leading-relaxed">{renderFormattedText(content)}</span>
                  </div>
                </div>
              </div>
              <Tooltip.Arrow className="fill-white" width={12} height={6} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <>
      <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(true); }}
        className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-white hover:bg-white/30 transition-all duration-300 focus:outline-none hover:scale-110 flex-shrink-0 border border-white/10">
        <HelpCircle size={14} strokeWidth={2.5} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(false); }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md info-overlay-enter" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden info-panel-enter"
            style={{ boxShadow: '0 25px 80px rgba(19,49,92,0.25), 0 8px 24px rgba(0,0,0,0.1)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="relative px-6 py-5 text-white overflow-hidden"
              style={{background: 'linear-gradient(135deg, #0c2240, #13315c 50%, #1a4178)'}}>
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)'}} />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/10">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight">Information</span>
                    <p className="text-blue-200/50 text-[10px] font-medium">Détails et explications</p>
                  </div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsOpen(false); }}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-5rem)] text-[14px] text-gray-700 leading-[1.7] whitespace-pre-line">
              {renderFormattedText(content)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── CurrencyInput ───────────────────────────────────────────
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = React.memo(({
  value, onChange, placeholder = '0,00 $', disabled = false, className = '', id,
}) => {
  const [displayValue, setDisplayValue] = React.useState('');
  const isFocusedRef = React.useRef(false);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    if (!isFocusedRef.current) {
      setDisplayValue(value === 0 ? '' : value.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [value]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9,.-]/g, '');
    setDisplayValue(rawValue);
    const parsed = parseFloat(rawValue.replace(',', '.').replace(/\s/g, ''));
    if (!isNaN(parsed)) onChangeRef.current(Math.round(parsed * 100) / 100);
    else if (rawValue === '' || rawValue === '-') onChangeRef.current(0);
  }, []);

  const handleFocus = React.useCallback(() => {
    isFocusedRef.current = true;
  }, []);

  const handleBlur = React.useCallback(() => {
    isFocusedRef.current = false;
    setDisplayValue(prev => {
      const parsed = parseFloat(prev.replace(',', '.').replace(/\s/g, ''));
      if (isNaN(parsed)) { onChangeRef.current(0); return ''; }
      const rounded = Math.round(parsed * 100) / 100;
      onChangeRef.current(rounded);
      return rounded.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
  }, []);

  return (
    <div className="relative group/currency">
      <input type="text" id={id} value={displayValue} onChange={handleChange}
        onFocus={handleFocus} onBlur={handleBlur}
        placeholder={placeholder} disabled={disabled}
        className={`input-currency pr-9 ${disabled ? 'input-readonly' : ''} ${className}`} />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none font-bold transition-colors duration-200 text-gray-400 group-focus-within/currency:text-corpiq-blue">$</span>
    </div>
  );
});

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

// ─── StepIndicator (Dynamic) ───────────────────────
interface StepIndicatorProps {
  currentStep: number; totalSteps: number;
  steps: { id: number; title: string; description: string }[];
  onStepClick?: (step: number) => void; canAccessStep?: (step: number) => boolean; disabledMessage?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep, steps, onStepClick, canAccessStep, disabledMessage,
}) => {
  return (
    <div className="mb-8">
      {/* Desktop */}
      <div className="hidden sm:block">
        <div className="bg-white rounded-2xl border border-gray-200/60 px-6 py-5"
          style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'}}>
          <div className="flex items-start">
            {steps.map((step, index) => {
              const accessible = canAccessStep ? canAccessStep(step.id) : true;
              const clickable = onStepClick && accessible;
              const done = step.id < currentStep;
              const current = step.id === currentStep;
              const isLast = index === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step circle + title */}
                  <button type="button"
                    onClick={() => clickable && onStepClick(step.id)}
                    disabled={!clickable}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${clickable ? 'cursor-pointer group' : 'cursor-default'}`}
                    style={{minWidth: 0, width: 'auto'}}
                    title={!accessible ? disabledMessage : step.title}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-500 flex-shrink-0 ${
                      done ? 'text-white scale-100'
                      : current ? 'text-white shadow-lg shadow-corpiq-blue/25 scale-110'
                      : accessible ? 'text-gray-400 border-2 border-gray-200 bg-white group-hover:border-corpiq-blue/30 group-hover:text-corpiq-blue'
                      : 'text-gray-300 border-2 border-gray-100 bg-gray-50'
                    }`}
                    style={done ? {background: 'linear-gradient(135deg, #10b981, #059669)'} : current ? {background: 'linear-gradient(135deg, #13315c, #1a4178)'} : undefined}>
                      {done ? <Check size={15} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`hidden md:block text-[10px] font-semibold leading-tight text-center max-w-[80px] transition-colors duration-300 ${
                      current ? 'text-corpiq-blue font-bold' : done ? 'text-emerald-600' : accessible ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-300'
                    }`}>{step.title}</span>
                  </button>
                  {/* Connector line */}
                  {!isLast && (
                    <div className="flex-1 flex items-center px-1.5 mt-[18px]">
                      <div className="w-full h-[2px] rounded-full transition-all duration-700 ease-out"
                        style={{background: done ? 'linear-gradient(90deg, #10b981, #059669)' : '#e5e7eb'}} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
          <div className="px-4 py-3">
            {/* Stepper row */}
            <div className="flex items-center mb-2.5">
              {steps.map((step, index) => {
                const done = step.id < currentStep;
                const current = step.id === currentStep;
                const isLast = index === steps.length - 1;
                return (
                  <React.Fragment key={step.id}>
                    <button type="button"
                      onClick={() => onStepClick && canAccessStep?.(step.id) && onStepClick(step.id)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                        done ? 'text-white' : current ? 'text-white' : 'text-gray-300 border-2 border-gray-200 bg-white'
                      }`}
                      style={done ? {background: 'linear-gradient(135deg, #10b981, #059669)'} : current ? {background: 'linear-gradient(135deg, #13315c, #1a4178)'} : undefined}>
                      {done ? <Check size={12} strokeWidth={3} /> : step.id}
                    </button>
                    {!isLast && (
                      <div className="flex-1 h-[2px] mx-1 rounded-full transition-all duration-500"
                        style={{background: done ? 'linear-gradient(90deg, #10b981, #059669)' : '#e5e7eb'}} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Current step label */}
            <div className="flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">{steps[currentStep - 1]?.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
