import React from 'react';
import { FormData, CalculatedValues } from '../../types';
import { 
  SectionCard, 
  CurrencyInput, 
  CalculatedField, 
  LabelWithTooltip,
  NavigationButtons,
} from '../ui';
import { Download, RotateCcw, Calculator, TrendingUp, Home, AlertTriangle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step5Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  updateFormData: (updates: Partial<FormData>) => void;
  onPrevious: () => void;
  onReset: () => void;
  onExportPDF: () => void;
}

export const Step5: React.FC<Step5Props> = ({
  formData,
  calculatedValues,
  updateFormData,
  onPrevious,
  onReset,
  onExportPDF,
}) => {
  const { t } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const updateDeneigement = (field: 'frais2025' | 'frais2024', value: number) => {
    updateFormData({
      deneigement: {
        ...formData.deneigement,
        [field]: value,
      },
    });
  };

  const ajustementDeneigement = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const variation = formData.deneigement.frais2025 - formData.deneigement.frais2024;
    const poidsLoyer = (formData.loyerMensuelActuel * 12) / calculatedValues.revenusImmeuble;
    return Math.round((variation / 12) * poidsLoyer * 100) / 100;
  }, [formData, calculatedValues]);

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  const summaryRows = [
    {
      badge: '1',
      label: t.step5.summary.baseAdjustment.replace('{rate}', ((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)),
      value: calculatedValues?.ajustementBase || 0,
    },
    {
      badge: '2',
      label: t.step5.summary.taxesAndInsurance,
      value: calculatedValues?.totalAjustementTaxesAssurances || 0,
    },
    {
      badge: '3',
      label: t.step5.summary.majorRepairs,
      value: calculatedValues?.totalAjustementReparations || 0,
    },
    {
      badge: '4a',
      label: t.step5.summary.newExpenses,
      value: calculatedValues?.totalAjustementNouvellesDepenses || 0,
    },
    {
      badge: '4b',
      label: t.step5.summary.aidVariations,
      value: calculatedValues?.totalAjustementVariationsAide || 0,
    },
    {
      badge: '5',
      label: t.step5.summary.snowRemoval,
      value: ajustementDeneigement,
    },
  ];

  return (
    <div>
      {/* Section 5: Déneigement */}
      <SectionCard 
        title={t.step5.snowRemoval.title}
        badge={5}
        tooltip={t.step5.snowRemoval.tooltip}
      >
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 mb-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.step5.snowRemoval.note}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <LabelWithTooltip htmlFor="deneig2025">
              {t.step5.snowRemoval.fees2025}
            </LabelWithTooltip>
            <CurrencyInput
              id="deneig2025"
              value={formData.deneigement.frais2025}
              onChange={(v) => updateDeneigement('frais2025', v)}
            />
          </div>
          <div>
            <LabelWithTooltip htmlFor="deneig2024">
              {t.step5.snowRemoval.fees2024}
            </LabelWithTooltip>
            <CurrencyInput
              id="deneig2024"
              value={formData.deneigement.frais2024}
              onChange={(v) => updateDeneigement('frais2024', v)}
            />
          </div>
          <div>
            <LabelWithTooltip>{t.step5.snowRemoval.monthlyAdjustment}</LabelWithTooltip>
            <CalculatedField value={ajustementDeneigement} />
          </div>
        </div>
      </SectionCard>

      {/* Récapitulatif */}
      <SectionCard title={t.step5.summary.title}>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-corpiq-blue/20">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.step5.summary.section}</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.step5.summary.description}</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">{t.step5.summary.monthlyAdjustment}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaryRows.map((row) => (
                <tr key={row.badge} className="group hover:bg-corpiq-light-blue/20 transition-colors duration-150">
                  <td className="py-3.5 px-3">
                    <span className={`bg-gradient-to-br from-corpiq-bordeaux to-corpiq-bordeaux-light text-white ${row.badge.length > 1 ? 'w-8 text-[11px]' : 'w-7 text-xs'} h-7 rounded-lg inline-flex items-center justify-center font-bold shadow-sm`}>
                      {row.badge}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-sm text-gray-700">{row.label}</td>
                  <td className={`py-3.5 px-3 text-right font-semibold tabular-nums text-sm ${row.value >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-corpiq-blue to-corpiq-blue-light text-white">
                <td className="py-4 px-3 rounded-bl-xl" colSpan={2}>
                  <span className="font-bold text-[15px]">{t.step5.summary.totalAdjustments}</span>
                </td>
                <td className="py-4 px-3 text-right rounded-br-xl">
                  <span className="text-lg font-bold tabular-nums">
                    {formatCurrency(calculatedValues?.totalAjustements || 0)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      {/* Résultat final */}
      <div className="relative overflow-hidden bg-gradient-to-br from-corpiq-blue via-corpiq-blue-light to-corpiq-bordeaux rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Calculator size={20} />
            </div>
            {t.step5.result.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Loyer actuel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <Home size={16} />
                <span className="text-sm font-medium">{t.step5.result.currentRent}</span>
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrency(formData.loyerMensuelActuel)}
              </div>
            </div>

            {/* Nouveau loyer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/20 ring-1 ring-white/20 shadow-lg">
              <div className="flex items-center gap-2 text-white/80 mb-3">
                <Sparkles size={16} />
                <span className="text-sm font-medium">{t.step5.result.newRent}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold tabular-nums">
                {formatCurrency(calculatedValues?.nouveauLoyerRecommande || 0)}
              </div>
            </div>

            {/* Variation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">{t.step5.result.variation}</span>
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {calculatedValues?.pourcentageVariation !== undefined
                  ? `${calculatedValues.pourcentageVariation >= 0 ? '+' : ''}${calculatedValues.pourcentageVariation.toFixed(2)} %`
                  : '0,00 %'
                }
              </div>
              <div className="text-sm text-white/60 mt-1.5 tabular-nums">
                ({formatCurrency(calculatedValues?.totalAjustements || 0)} / mois)
              </div>
            </div>
          </div>

          {formData.adresse && (
            <div className="mt-6 pt-5 border-t border-white/15">
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">{t.step5.result.concernedDwelling}</div>
              <div className="font-medium text-white/90">{formData.adresse}</div>
            </div>
          )}
        </div>
      </div>

      {/* Avertissement légal */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 mb-6 flex gap-3">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>{t.step5.legalNotice.title}</strong> {t.step5.legalNotice.text}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={onExportPDF}
          className="btn-primary inline-flex items-center gap-2.5 text-[15px]"
        >
          <Download size={18} />
          {t.step5.actions.exportPDF}
        </button>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="btn-secondary inline-flex items-center gap-2.5 text-[15px]"
        >
          <RotateCcw size={18} />
          {t.step5.actions.restart}
        </button>
      </div>

      {/* Modal de réinitialisation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 info-overlay-enter">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl info-panel-enter">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.step5.actions.confirmReset}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t.step5.actions.confirmResetText}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary py-2.5 px-5 text-sm"
              >
                {t.step5.actions.cancel}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t.step5.actions.eraseAndRestart}
              </button>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons
        onPrevious={onPrevious}
        showNext={false}
        previousLabel={t.common.previous}
      />
    </div>
  );
};
