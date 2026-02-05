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
  const updateTaxesMunicipales = (field: 'anneeCourante' | 'anneePrecedente', value: number) => {
    updateFormData({
      taxesMunicipales: {
        ...formData.taxesMunicipales,
        [field]: value,
      },
    });
  };

  const updateTaxesScolaires = (field: 'anneeCourante' | 'anneePrecedente', value: number) => {
    updateFormData({
      taxesScolaires: {
        ...formData.taxesScolaires,
        [field]: value,
      },
    });
  };

  const updateAssurances = (field: 'dec2025' | 'dec2024', value: number) => {
    updateFormData({
      assurances: {
        ...formData.assurances,
        [field]: value,
      },
    });
  };

  // Calculer les ajustements individuels pour l'affichage
  const ajustementTaxesMunicipales = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { taxesMunicipales } = formData;
    const { loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    
    if (taxesMunicipales.anneePrecedente === 0) return 0;
    
    const variation = taxesMunicipales.anneeCourante - taxesMunicipales.anneePrecedente;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    
    if (variation < 0) {
      return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    }
    
    const seuilInflation = tauxIPC * taxesMunicipales.anneePrecedente;
    if (variation <= seuilInflation) return 0;
    
    const variationNette = variation - seuilInflation;
    return Math.round((variationNette * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  const ajustementTaxesScolaires = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { taxesScolaires } = formData;
    const { loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    
    const variation = taxesScolaires.anneeCourante - taxesScolaires.anneePrecedente;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    
    if (variation <= 0) {
      return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    }
    
    const seuilInflation = tauxIPC * taxesScolaires.anneePrecedente;
    const variationNette = Math.max(variation - seuilInflation, 0);
    return Math.round((variationNette * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  const ajustementAssurances = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const { assurances } = formData;
    const { loyerMensuelActuel } = formData;
    const { revenusImmeuble, tauxIPC } = calculatedValues;
    
    if (assurances.dec2024 === 0) return 0;
    
    const variation = assurances.dec2025 - assurances.dec2024;
    const poidsLoyer = (loyerMensuelActuel * 12) / revenusImmeuble;
    
    if (variation < 0) {
      return Math.round((variation * poidsLoyer) / 12 * 100) / 100;
    }
    
    const seuilInflation = tauxIPC * assurances.dec2024;
    if (variation <= seuilInflation) return 0;
    
    const variationNette = variation - seuilInflation;
    return Math.round((variationNette * poidsLoyer) / 12 * 100) / 100;
  }, [formData, calculatedValues]);

  return (
    <div>
      <SectionCard 
        title={t.step2.title}
        badge={2}
        tooltip={t.step2.tooltip}
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>{t.step2.important}</strong> {t.step2.importantNote.replace('{rate}', ((calculatedValues?.tauxIPC || 0) * 100).toFixed(1))}
          </p>
        </div>

        <div className="space-y-6">
          {/* Taxes municipales */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-1">
              {t.step2.municipalTaxes}
              <InfoTooltip content={t.step2.municipalTaxesTooltip} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LabelWithTooltip htmlFor="taxeMuni2026">
                  {t.step2.year2026}
                </LabelWithTooltip>
                <CurrencyInput
                  id="taxeMuni2026"
                  value={formData.taxesMunicipales.anneeCourante}
                  onChange={(v) => updateTaxesMunicipales('anneeCourante', v)}
                />
              </div>
              <div>
                <LabelWithTooltip htmlFor="taxeMuni2025">
                  {t.step2.year2025}
                </LabelWithTooltip>
                <CurrencyInput
                  id="taxeMuni2025"
                  value={formData.taxesMunicipales.anneePrecedente}
                  onChange={(v) => updateTaxesMunicipales('anneePrecedente', v)}
                />
              </div>
              <div>
                <LabelWithTooltip tooltip={t.step2.monthlyAdjustmentTooltip}>
                  {t.step2.monthlyAdjustment}
                </LabelWithTooltip>
                <CalculatedField value={ajustementTaxesMunicipales} />
              </div>
            </div>
          </div>

          {/* Taxes scolaires */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-1">
              {t.step2.schoolTaxes}
              <InfoTooltip content={t.step2.schoolTaxesTooltip} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LabelWithTooltip htmlFor="taxeScol2526">
                  {t.step2.year2025_2026}
                </LabelWithTooltip>
                <CurrencyInput
                  id="taxeScol2526"
                  value={formData.taxesScolaires.anneeCourante}
                  onChange={(v) => updateTaxesScolaires('anneeCourante', v)}
                />
              </div>
              <div>
                <LabelWithTooltip htmlFor="taxeScol2425">
                  {t.step2.year2024_2025}
                </LabelWithTooltip>
                <CurrencyInput
                  id="taxeScol2425"
                  value={formData.taxesScolaires.anneePrecedente}
                  onChange={(v) => updateTaxesScolaires('anneePrecedente', v)}
                />
              </div>
              <div>
                <LabelWithTooltip>{t.step2.monthlyAdjustment}</LabelWithTooltip>
                <CalculatedField value={ajustementTaxesScolaires} />
              </div>
            </div>
          </div>

          {/* Assurances */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-1">
              {t.step2.insurance}
              <InfoTooltip content={t.step2.insuranceTooltip} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LabelWithTooltip htmlFor="assur2025">
                  {t.step2.asOfDec31} <strong>2025</strong>
                </LabelWithTooltip>
                <CurrencyInput
                  id="assur2025"
                  value={formData.assurances.dec2025}
                  onChange={(v) => updateAssurances('dec2025', v)}
                />
              </div>
              <div>
                <LabelWithTooltip htmlFor="assur2024">
                  {t.step2.asOfDec31} <strong>2024</strong>
                </LabelWithTooltip>
                <CurrencyInput
                  id="assur2024"
                  value={formData.assurances.dec2024}
                  onChange={(v) => updateAssurances('dec2024', v)}
                />
              </div>
              <div>
                <LabelWithTooltip>{t.step2.monthlyAdjustment}</LabelWithTooltip>
                <CalculatedField value={ajustementAssurances} />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-corpiq-light p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-corpiq-bordeaux text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span className="font-semibold">{t.step2.totalAdjustment}</span>
                <InfoTooltip content={t.step2.totalAdjustmentTooltip} />
              </div>
              <div className="w-40">
                <CalculatedField 
                  value={calculatedValues?.totalAjustementTaxesAssurances || 0} 
                  highlight
                />
              </div>
            </div>
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
