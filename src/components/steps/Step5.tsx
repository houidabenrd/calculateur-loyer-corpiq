import React from 'react';
import { FormData, CalculatedValues } from '../../types';
import { 
  SectionCard, 
  CurrencyInput, 
  CalculatedField, 
  LabelWithTooltip,
  NavigationButtons,
} from '../ui';
import { Snowflake, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step5Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  updateFormData: (updates: Partial<FormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  formData,
  calculatedValues,
  updateFormData,
  onPrevious,
  onNext,
}) => {
  const { t } = useLanguage();

  const updateDeneigement = (field: 'frais2025' | 'frais2024', value: number) => {
    updateFormData({
      deneigement: { ...formData.deneigement, [field]: value },
    });
  };

  const ajustementDeneigement = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const variation = formData.deneigement.frais2025 - formData.deneigement.frais2024;
    const poidsLoyer = (formData.loyerMensuelActuel * 12) / calculatedValues.revenusImmeuble;
    return Math.round((variation / 12) * poidsLoyer * 100) / 100;
  }, [formData, calculatedValues]);

  return (
    <div>
      <SectionCard title={t.step5.snowRemoval.title} badge={5} tooltip={t.step5.snowRemoval.tooltip}>
        {/* Note */}
        <div className="bg-sky-50/80 border border-sky-200/50 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Info size={15} className="text-sky-600" />
            </div>
            <p className="text-sm text-sky-800/90 leading-relaxed">{t.step5.snowRemoval.note}</p>
          </div>
        </div>

        {/* Champs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <LabelWithTooltip htmlFor="deneig2025">
              <span className="flex items-center gap-1.5">
                <Snowflake size={12} className="text-sky-500" />
                {t.step5.snowRemoval.fees2025}
              </span>
            </LabelWithTooltip>
            <CurrencyInput id="deneig2025" value={formData.deneigement.frais2025} onChange={(v) => updateDeneigement('frais2025', v)} />
          </div>
          <div>
            <LabelWithTooltip htmlFor="deneig2024">
              <span className="flex items-center gap-1.5">
                <Snowflake size={12} className="text-sky-400" />
                {t.step5.snowRemoval.fees2024}
              </span>
            </LabelWithTooltip>
            <CurrencyInput id="deneig2024" value={formData.deneigement.frais2024} onChange={(v) => updateDeneigement('frais2024', v)} />
          </div>
          <div>
            <LabelWithTooltip>{t.step5.snowRemoval.monthlyAdjustment}</LabelWithTooltip>
            <CalculatedField value={ajustementDeneigement} highlight />
          </div>
        </div>
      </SectionCard>

      <NavigationButtons
        onPrevious={onPrevious}
        onNext={onNext}
        previousLabel={t.common.previous}
        nextLabel={t.common.next}
      />
    </div>
  );
};
