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
      deneigement: { ...formData.deneigement, [field]: value },
    });
  };

  const ajustementDeneigement = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const variation = formData.deneigement.frais2025 - formData.deneigement.frais2024;
    const poidsLoyer = (formData.loyerMensuelActuel * 12) / calculatedValues.revenusImmeuble;
    return Math.round((variation / 12) * poidsLoyer * 100) / 100;
  }, [formData, calculatedValues]);

  const handleReset = () => { onReset(); setShowResetConfirm(false); };

  const summaryRows = [
    { badge: '1', label: t.step5.summary.baseAdjustment.replace('{rate}', ((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)), value: calculatedValues?.ajustementBase || 0 },
    { badge: '2', label: t.step5.summary.taxesAndInsurance, value: calculatedValues?.totalAjustementTaxesAssurances || 0 },
    { badge: '3', label: t.step5.summary.majorRepairs, value: calculatedValues?.totalAjustementReparations || 0 },
    { badge: '4a', label: t.step5.summary.newExpenses, value: calculatedValues?.totalAjustementNouvellesDepenses || 0 },
    { badge: '4b', label: t.step5.summary.aidVariations, value: calculatedValues?.totalAjustementVariationsAide || 0 },
    { badge: '5', label: t.step5.summary.snowRemoval, value: ajustementDeneigement },
  ];

  return (
    <div>
      {/* ─── Section 5 : Déneigement ─── */}
      <SectionCard title={t.step5.snowRemoval.title} badge={5} tooltip={t.step5.snowRemoval.tooltip}>
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 mb-6">
          <p className="text-sm text-blue-800/80 leading-relaxed">{t.step5.snowRemoval.note}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <LabelWithTooltip htmlFor="deneig2025">{t.step5.snowRemoval.fees2025}</LabelWithTooltip>
            <CurrencyInput id="deneig2025" value={formData.deneigement.frais2025} onChange={(v) => updateDeneigement('frais2025', v)} />
          </div>
          <div>
            <LabelWithTooltip htmlFor="deneig2024">{t.step5.snowRemoval.fees2024}</LabelWithTooltip>
            <CurrencyInput id="deneig2024" value={formData.deneigement.frais2024} onChange={(v) => updateDeneigement('frais2024', v)} />
          </div>
          <div>
            <LabelWithTooltip>{t.step5.snowRemoval.monthlyAdjustment}</LabelWithTooltip>
            <CalculatedField value={ajustementDeneigement} />
          </div>
        </div>
      </SectionCard>

      {/* ─── Section 6 : Récapitulatif ─── */}
      <SectionCard title={t.step5.summary.title} badge={6}>
        <div className="space-y-3">
          {summaryRows.map((row) => (
            <div key={row.badge}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 hover:bg-corpiq-blue-50/40 border border-gray-100 hover:border-corpiq-blue/10 transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <span className={`${row.badge.length > 1 ? 'w-10 px-1 text-[11px]' : 'w-9 text-xs'} h-9 rounded-xl font-extrabold inline-flex items-center justify-center text-white shadow-md`}
                  style={{background: 'linear-gradient(135deg, #530f32 0%, #6b1441 100%)'}}>
                  {row.badge}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{row.label}</span>
              </div>
              <span className={`text-sm font-bold tabular-nums px-4 py-1.5 rounded-xl ${row.value >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {formatCurrency(row.value)}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="mt-4 p-5 rounded-2xl text-white flex items-center justify-between"
            style={{background: 'linear-gradient(135deg, #13315c 0%, #1a4178 50%, #13315c 100%)'}}>
            <span className="font-extrabold text-lg">{t.step5.summary.totalAdjustments}</span>
            <span className="text-2xl font-extrabold tabular-nums">
              {formatCurrency(calculatedValues?.totalAjustements || 0)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ─── Résultat final ─── */}
      <div className="relative overflow-hidden rounded-3xl mb-8 shadow-xl-soft"
        style={{background: 'linear-gradient(135deg, #0c2240 0%, #13315c 30%, #1a4178 60%, #530f32 100%)'}}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/[0.02] rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-8 flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner-glow">
              <Calculator size={22} />
            </div>
            {t.step5.result.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Loyer actuel */}
            <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 text-white/60 mb-4">
                <Home size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{t.step5.result.currentRent}</span>
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-white">
                {formatCurrency(formData.loyerMensuelActuel)}
              </div>
            </div>

            {/* Nouveau loyer - carte mise en avant */}
            <div className="bg-white/[0.15] backdrop-blur-sm rounded-2xl p-6 border border-white/20 ring-2 ring-white/20 shadow-2xl relative">
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{t.step5.result.newRent}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tabular-nums text-white animate-count-up">
                {formatCurrency(calculatedValues?.nouveauLoyerRecommande || 0)}
              </div>
            </div>

            {/* Variation */}
            <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 text-white/60 mb-4">
                <TrendingUp size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{t.step5.result.variation}</span>
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-white">
                {calculatedValues?.pourcentageVariation !== undefined
                  ? `${calculatedValues.pourcentageVariation >= 0 ? '+' : ''}${calculatedValues.pourcentageVariation.toFixed(2)} %`
                  : '0,00 %'}
              </div>
              <div className="text-sm text-white/40 mt-2 tabular-nums font-semibold">
                ({formatCurrency(calculatedValues?.totalAjustements || 0)} / mois)
              </div>
            </div>
          </div>

          {formData.adresse && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1.5">{t.step5.result.concernedDwelling}</div>
              <div className="font-semibold text-white/80 text-lg">{formData.adresse}</div>
            </div>
          )}
        </div>
      </div>

      {/* Avertissement légal */}
      <div className="bg-amber-50 border-2 border-amber-200/80 rounded-2xl p-5 mb-8 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-amber-600" />
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong className="font-bold">{t.step5.legalNotice.title}</strong>{' '}
          {t.step5.legalNotice.text}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button type="button" onClick={onExportPDF}
          className="btn-primary inline-flex items-center gap-3 text-base w-full sm:w-auto justify-center"
          style={{background: 'linear-gradient(135deg, #13315c 0%, #1a4178 100%)'}}>
          <Download size={20} />
          {t.step5.actions.exportPDF}
        </button>
        <button type="button" onClick={() => setShowResetConfirm(true)}
          className="btn-secondary inline-flex items-center gap-3 text-base w-full sm:w-auto justify-center">
          <RotateCcw size={20} />
          {t.step5.actions.restart}
        </button>
      </div>

      {/* Modal réinitialisation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 info-overlay-enter">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl info-panel-enter">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">{t.step5.actions.confirmReset}</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">{t.step5.actions.confirmResetText}</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowResetConfirm(false)} className="btn-secondary py-3 px-6 text-sm">
                {t.step5.actions.cancel}
              </button>
              <button type="button" onClick={handleReset}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                {t.step5.actions.eraseAndRestart}
              </button>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons onPrevious={onPrevious} showNext={false} previousLabel={t.common.previous} />
    </div>
  );
};
