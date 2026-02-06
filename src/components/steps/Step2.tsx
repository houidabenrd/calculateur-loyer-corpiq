import React from 'react';
import { FormData, CalculatedValues } from '../../types';
import { 
  SectionCard, 
  CurrencyInput, 
  CalculatedField, 
  LabelWithTooltip,
  NavigationButtons,
  InfoTooltip
} from '../ui';
import { useLanguage } from '../../i18n/LanguageContext';

// TaxRow défini EN DEHORS du composant pour éviter le remontage à chaque rendu
const TaxRow: React.FC<{
  label: string; tooltip: string; value1: number; onChange1: (v: number) => void; label1: string;
  value2: number; onChange2: (v: number) => void; label2: string; adjustment: number; id1: string; id2: string;
  adjustmentLabel: string;
}> = ({ label, tooltip, value1, onChange1, label1, value2, onChange2, label2, adjustment, id1, id2, adjustmentLabel }) => (
  <div className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
      <div className="w-1 h-5 bg-corpiq-blue rounded-full" />
      {label}
      <InfoTooltip content={tooltip} />
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <LabelWithTooltip htmlFor={id1}>{label1}</LabelWithTooltip>
        <CurrencyInput id={id1} value={value1} onChange={onChange1} />
      </div>
      <div>
        <LabelWithTooltip htmlFor={id2}>{label2}</LabelWithTooltip>
        <CurrencyInput id={id2} value={value2} onChange={onChange2} />
      </div>
      <div>
        <LabelWithTooltip>{adjustmentLabel}</LabelWithTooltip>
        <CalculatedField value={adjustment} />
      </div>
    </div>
  </div>
);

interface Step2Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  formData,
  calculatedValues,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();

  const updateTaxesMunicipales = React.useCallback((field: 'anneeCourante' | 'anneePrecedente', value: number) => {
    updateFormData({ taxesMunicipales: { ...formData.taxesMunicipales, [field]: value } });
  }, [formData.taxesMunicipales, updateFormData]);

  const updateTaxesScolaires = React.useCallback((field: 'anneeCourante' | 'anneePrecedente', value: number) => {
    updateFormData({ taxesScolaires: { ...formData.taxesScolaires, [field]: value } });
  }, [formData.taxesScolaires, updateFormData]);

  const updateAssurances = React.useCallback((field: 'dec2025' | 'dec2024', value: number) => {
    updateFormData({ assurances: { ...formData.assurances, [field]: value } });
  }, [formData.assurances, updateFormData]);

  const ajustementTaxesMunicipales = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { taxesMunicipales, loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    if (taxesMunicipales.anneePrecedente === 0) return 0;
    const variation = taxesMunicipales.anneeCourante - taxesMunicipales.anneePrecedente;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    if (variation < 0) return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    const seuilInflation = tauxIPC * taxesMunicipales.anneePrecedente;
    if (variation <= seuilInflation) return 0;
    return Math.round(((variation - seuilInflation) * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  const ajustementTaxesScolaires = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { taxesScolaires, loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    const variation = taxesScolaires.anneeCourante - taxesScolaires.anneePrecedente;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    if (variation <= 0) return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    const seuilInflation = tauxIPC * taxesScolaires.anneePrecedente;
    return Math.round((Math.max(variation - seuilInflation, 0) * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  const ajustementAssurances = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { assurances, loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    if (assurances.dec2024 === 0) return 0;
    const variation = assurances.dec2025 - assurances.dec2024;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    if (variation < 0) return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    const seuilInflation = tauxIPC * assurances.dec2024;
    if (variation <= seuilInflation) return 0;
    return Math.round(((variation - seuilInflation) * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  return (
    <div>
      <SectionCard title={t.step2.title} badge={2}>
        <div className="bg-blue-50/70 border border-blue-200/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-bold">{t.step2.important}</strong>{' '}
            {t.step2.importantNote.replace('{rate}', ((calculatedValues?.tauxIPC || 0) * 100).toFixed(1))}
          </p>
        </div>

        <div className="space-y-5">
          <TaxRow
            label={t.step2.municipalTaxes} tooltip={t.step2.municipalTaxesTooltip}
            value1={formData.taxesMunicipales.anneeCourante} onChange1={(v) => updateTaxesMunicipales('anneeCourante', v)} label1={t.step2.year2026} id1="taxeMuni2026"
            value2={formData.taxesMunicipales.anneePrecedente} onChange2={(v) => updateTaxesMunicipales('anneePrecedente', v)} label2={t.step2.year2025} id2="taxeMuni2025"
            adjustment={ajustementTaxesMunicipales}
            adjustmentLabel={t.step2.monthlyAdjustment}
          />

          <TaxRow
            label={t.step2.schoolTaxes} tooltip={t.step2.schoolTaxesTooltip}
            value1={formData.taxesScolaires.anneeCourante} onChange1={(v) => updateTaxesScolaires('anneeCourante', v)} label1={t.step2.year2025_2026} id1="taxeScol2526"
            value2={formData.taxesScolaires.anneePrecedente} onChange2={(v) => updateTaxesScolaires('anneePrecedente', v)} label2={t.step2.year2024_2025} id2="taxeScol2425"
            adjustment={ajustementTaxesScolaires}
            adjustmentLabel={t.step2.monthlyAdjustment}
          />

          {/* Assurances */}
          <div className="pb-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <div className="w-1 h-5 bg-corpiq-bordeaux rounded-full" />
              {t.step2.insurance}
              <InfoTooltip content={t.step2.insuranceTooltip} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LabelWithTooltip htmlFor="assur2025">
                  {t.step2.asOfDec31} <strong>2025</strong>
                </LabelWithTooltip>
                <CurrencyInput id="assur2025" value={formData.assurances.dec2025} onChange={(v) => updateAssurances('dec2025', v)} />
              </div>
              <div>
                <LabelWithTooltip htmlFor="assur2024">
                  {t.step2.asOfDec31} <strong>2024</strong>
                </LabelWithTooltip>
                <CurrencyInput id="assur2024" value={formData.assurances.dec2024} onChange={(v) => updateAssurances('dec2024', v)} />
              </div>
              <div>
                <LabelWithTooltip>{t.step2.monthlyAdjustment}</LabelWithTooltip>
                <CalculatedField value={ajustementAssurances} />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center text-white"
                  style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}}>
                  2
                </span>
                <span className="font-bold text-sm text-gray-800">{t.step2.totalAdjustment}</span>
              </div>
              <div className="w-36">
                <CalculatedField value={calculatedValues?.totalAjustementTaxesAssurances || 0} highlight />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <NavigationButtons onPrevious={onPrevious} onNext={onNext} previousLabel={t.common.previous} nextLabel={t.common.next} />
    </div>
  );
};
