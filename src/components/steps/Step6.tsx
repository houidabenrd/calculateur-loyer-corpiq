import React from 'react';
import { FormData, CalculatedValues } from '../../types';
import { 
  SectionCard, 
  NavigationButtons,
} from '../ui';
import { 
  Download, RotateCcw, TrendingUp, Home, 
  AlertTriangle, Sparkles, Calculator, Target 
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step6Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  onPrevious: () => void;
  onReset: () => void;
  onExportPDF: () => void;
}

export const Step6: React.FC<Step6Props> = ({
  formData,
  calculatedValues,
  onPrevious,
  onReset,
  onExportPDF,
}) => {
  const { t } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleReset = () => { onReset(); setShowResetConfirm(false); };

  const ajustementDeneigement = React.useMemo(() => {
    if (!calculatedValues || calculatedValues.revenusImmeuble === 0) return 0;
    const variation = formData.deneigement.frais2025 - formData.deneigement.frais2024;
    const poidsLoyer = (formData.loyerMensuelActuel * 12) / calculatedValues.revenusImmeuble;
    return Math.round((variation / 12) * poidsLoyer * 100) / 100;
  }, [formData, calculatedValues]);

  const summaryRows = [
    { badge: '1', label: t.step5.summary.baseAdjustment.replace('{rate}', ((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)), value: calculatedValues?.ajustementBase || 0 },
    { badge: '2', label: t.step5.summary.taxesAndInsurance, value: calculatedValues?.totalAjustementTaxesAssurances || 0 },
    { badge: '3', label: t.step5.summary.majorRepairs, value: calculatedValues?.totalAjustementReparations || 0 },
    { badge: '4', label: t.step5.summary.newExpenses, value: calculatedValues?.totalSection4 || 0 },
    ...(formData.hasDeneigement ? [{ badge: '5', label: t.step5.summary.snowRemoval, value: ajustementDeneigement }] : []),
  ];

  const totalAjustements = calculatedValues?.totalAjustements || 0;
  const variation = calculatedValues?.pourcentageVariation || 0;

  return (
    <div>
      {/* Récapitulatif */}
      <SectionCard title={t.step5.summary.title}>
        <div className="space-y-2">
          {summaryRows.map((row) => (
            <div key={row.badge}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-200">
              <div className="flex items-center gap-3">
                <span className={`${row.badge.length > 1 ? 'w-8 px-0.5 text-[10px]' : 'w-7 text-[11px]'} h-7 rounded-lg font-extrabold inline-flex items-center justify-center text-white`}
                  style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}}>
                  {row.badge}
                </span>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug max-w-md">{row.label}</span>
              </div>
              <span className={`text-sm font-bold tabular-nums px-3 py-1 rounded-lg ${
                row.value > 0 ? 'text-emerald-700 bg-emerald-50' 
                : row.value < 0 ? 'text-red-600 bg-red-50' 
                : 'text-gray-500 bg-gray-100'
              }`}>
                {row.value >= 0 ? '+' : ''}{formatCurrency(row.value)}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="mt-4 rounded-xl text-white flex items-center justify-between p-5"
            style={{background: 'linear-gradient(135deg, #0c2240, #13315c 50%, #1a4178)'}}>
            <div className="flex items-center gap-3">
              <Target size={18} />
              <span className="font-extrabold text-sm tracking-wide">{t.step5.summary.totalAdjustments}</span>
            </div>
            <span className="text-2xl font-extrabold tabular-nums">
              {totalAjustements >= 0 ? '+' : ''}{formatCurrency(totalAjustements)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Résultat */}
      <div className="rounded-2xl mb-6 overflow-hidden" style={{background: 'linear-gradient(135deg, #0c2240, #13315c 40%, #1a4178 70%, #530f32)'}}>
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-3">
            <Calculator size={20} />
            {t.step5.result.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Loyer actuel */}
            <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 mb-3">
                <Home size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.step5.result.currentRent}</span>
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-white/90">
                {formatCurrency(formData.loyerMensuelActuel)}
              </div>
              <div className="text-[10px] text-white/30 mt-1 font-medium">par mois</div>
            </div>

            {/* Nouveau loyer */}
            <div className="relative bg-white/[0.14] backdrop-blur-md rounded-xl p-5 border border-white/20 ring-1 ring-white/10">
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-2 text-white/60 mb-3">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.step5.result.newRent}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-white animate-count-up">
                {formatCurrency(calculatedValues?.nouveauLoyerRecommande || 0)}
              </div>
              <div className="text-[10px] text-white/30 mt-1 font-medium">par mois</div>
            </div>

            {/* Variation */}
            <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 mb-3">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.step5.result.variation}</span>
              </div>
              <div className={`text-2xl font-extrabold tabular-nums ${variation >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {variation >= 0 ? '+' : ''}{variation.toFixed(2)} %
              </div>
              <div className="text-xs text-white/35 mt-1 tabular-nums font-medium">
                {totalAjustements >= 0 ? '+' : ''}{formatCurrency(totalAjustements)} / mois
              </div>
            </div>
          </div>

          {formData.adresse && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-[10px] text-white/35 font-bold uppercase tracking-widest mb-1">{t.step5.result.concernedDwelling}</div>
              <div className="font-semibold text-white/80">{formData.adresse}</div>
            </div>
          )}
        </div>
      </div>

      {/* Avertissement */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <div>
          <p className="font-bold text-amber-900 text-xs mb-0.5">{t.step5.legalNotice.title}</p>
          <p className="text-xs text-amber-800/80 leading-relaxed">{t.step5.legalNotice.text}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
        <button type="button" onClick={onExportPDF}
          className="btn-primary inline-flex items-center gap-2.5 w-full sm:w-auto justify-center"
          style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}}>
          <Download size={18} />
          {t.step5.actions.exportPDF}
        </button>
        <button type="button" onClick={() => setShowResetConfirm(true)}
          className="btn-secondary inline-flex items-center gap-2.5 w-full sm:w-auto justify-center text-gray-600 hover:text-red-600 hover:border-red-200">
          <RotateCcw size={18} />
          {t.step5.actions.restart}
        </button>
      </div>

      {/* Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 info-overlay-enter">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full info-panel-enter" style={{boxShadow: '0 20px 60px rgba(0,0,0,0.15)'}}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 text-center">{t.step5.actions.confirmReset}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center">{t.step5.actions.confirmResetText}</p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={() => setShowResetConfirm(false)} className="btn-secondary py-2.5 px-5 text-sm">
                {t.step5.actions.cancel}
              </button>
              <button type="button" onClick={handleReset}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-md hover:shadow-lg">
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
