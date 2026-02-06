import React from 'react';
import { FormData, CalculatedValues, LigneReparation } from '../../types';
import { 
  SectionCard, 
  CurrencyInput, 
  CalculatedField, 
  NumberInput,
  Checkbox,
  LabelWithTooltip,
  NavigationButtons,
  InfoTooltip
} from '../ui';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { calculAjustementReparation, formatCurrency } from '../../utils/calculations';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step3Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  addReparation: () => void;
  updateReparation: (id: string, updates: Partial<LigneReparation>) => void;
  removeReparation: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step3: React.FC<Step3Props> = ({
  formData,
  calculatedValues,
  addReparation,
  updateReparation,
  removeReparation,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const getAjustementLigne = (ligne: LigneReparation): number => {
    if (!calculatedValues) return 0;
    return calculAjustementReparation(
      ligne,
      formData.loyerMensuelActuel,
      calculatedValues.soustotalLogements.nombre,
      calculatedValues.soustotalLogements.loyer,
      calculatedValues.soustotalNonResidentiels.nombre,
      calculatedValues.soustotalNonResidentiels.loyer
    );
  };

  return (
    <div>
      <SectionCard 
        title={t.step3.title}
        badge={3}
        tooltip={t.step3.tooltip}
      >
        <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>{t.step3.howItWorks}</strong> {t.step3.howItWorksNote}
          </p>
        </div>

        {formData.reparations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Wrench size={20} className="text-gray-300" />
            </div>
            <p className="mb-4 text-sm">{t.step3.noRepairs}</p>
            <button
              type="button"
              onClick={addReparation}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              {t.step3.addRepair}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {formData.reparations.map((ligne, index) => (
                <div key={ligne.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200/80">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-corpiq-blue text-xs uppercase tracking-wider">{t.step3.line} {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReparation(ligne.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div>
                    <LabelWithTooltip>{t.step3.nature}</LabelWithTooltip>
                    <input
                      type="text"
                      value={ligne.nature}
                      onChange={(e) => updateReparation(ligne.id, { nature: e.target.value })}
                      className="input-field"
                      placeholder={t.step3.naturePlaceholder}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip tooltip={t.step3.expenseTooltip}>{t.step3.expense}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.depense}
                        onChange={(v) => updateReparation(ligne.id, { depense: v })}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip tooltip={t.step3.financialAidTooltip}>{t.step3.financialAid}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.aideFinanciere}
                        onChange={(v) => updateReparation(ligne.id, { aideFinanciere: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip tooltip={t.step3.thirdPartyCompensationTooltip}>{t.step3.thirdPartyCompensation}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.indemniteTiers}
                        onChange={(v) => updateReparation(ligne.id, { indemniteTiers: v })}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step3.retainedExpense}</LabelWithTooltip>
                      <CalculatedField value={ligne.depenseRetenue} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip>{t.step3.reducedInterestLoan}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.montantPretReduit}
                        onChange={(v) => updateReparation(ligne.id, { montantPretReduit: v })}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step3.annualPayment}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.versementAnnuel}
                        onChange={(v) => updateReparation(ligne.id, { versementAnnuel: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip>{t.step3.nbDwellings}</LabelWithTooltip>
                      <NumberInput
                        value={ligne.nbLogements}
                        onChange={(v) => updateReparation(ligne.id, { nbLogements: v })}
                        min={0}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step3.nbNonResidential}</LabelWithTooltip>
                      <NumberInput
                        value={ligne.nbLocauxNonResidentiels}
                        onChange={(v) => updateReparation(ligne.id, { nbLocauxNonResidentiels: v })}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
                    <Checkbox
                      checked={ligne.logementConcerne}
                      onChange={(v) => updateReparation(ligne.id, { logementConcerne: v })}
                      label={t.step3.concernedDwelling}
                    />
                    <div className="text-right">
                      <span className="text-xs text-gray-400">{t.step3.adjustment}</span>
                      <div className="font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(getAjustementLigne(ligne))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto -mx-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600">{t.step3.nature}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-36">
                      <span className="flex items-center justify-center gap-1">
                        {t.step3.expense}
                        <InfoTooltip content={t.step3.expenseTooltip} />
                      </span>
                    </th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-32">
                      <span className="flex items-center justify-center gap-1">
                        {t.step3.financialAid}
                        <InfoTooltip content={t.step3.financialAidTooltip} />
                      </span>
                    </th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-32">
                      <span className="flex items-center justify-center gap-1">
                        {t.step3.thirdPartyCompensation}
                        <InfoTooltip content={t.step3.thirdPartyCompensationTooltip} />
                      </span>
                    </th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 bg-blue-50/40 w-36">{t.step3.retainedExpense}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-36">{t.step3.reducedInterestLoan}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-36">{t.step3.annualPayment}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-28">{t.step3.nbDwellings}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600 w-28">{t.step3.nbNonResidential}</th>
                    <th className="py-2 px-1.5 text-center text-[11px] font-semibold text-gray-600">{t.step3.concernedDwelling}</th>
                    <th className="py-2 px-1.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.reparations.map((ligne, index) => (
                    <tr key={ligne.id} className="group hover:bg-corpiq-light-blue/10 transition-colors">
                      <td className="py-2 px-1.5">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-xs w-4 tabular-nums">{index + 1}</span>
                          <input
                            type="text"
                            value={ligne.nature}
                            onChange={(e) => updateReparation(ligne.id, { nature: e.target.value })}
                            className="input-field text-sm w-28"
                            placeholder="Nature..."
                          />
                        </div>
                      </td>
                      <td className="py-2 px-1.5 w-36">
                        <CurrencyInput
                          value={ligne.depense}
                          onChange={(v) => updateReparation(ligne.id, { depense: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-32">
                        <CurrencyInput
                          value={ligne.aideFinanciere}
                          onChange={(v) => updateReparation(ligne.id, { aideFinanciere: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-32">
                        <CurrencyInput
                          value={ligne.indemniteTiers}
                          onChange={(v) => updateReparation(ligne.id, { indemniteTiers: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-36 bg-blue-50/30">
                        <CalculatedField value={ligne.depenseRetenue} className="text-sm" />
                      </td>
                      <td className="py-2 px-1.5 w-36">
                        <CurrencyInput
                          value={ligne.montantPretReduit}
                          onChange={(v) => updateReparation(ligne.id, { montantPretReduit: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-36">
                        <CurrencyInput
                          value={ligne.versementAnnuel}
                          onChange={(v) => updateReparation(ligne.id, { versementAnnuel: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-28">
                        <NumberInput
                          value={ligne.nbLogements}
                          onChange={(v) => updateReparation(ligne.id, { nbLogements: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 w-28">
                        <NumberInput
                          value={ligne.nbLocauxNonResidentiels}
                          onChange={(v) => updateReparation(ligne.id, { nbLocauxNonResidentiels: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-1.5 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={ligne.logementConcerne}
                            onChange={(v) => updateReparation(ligne.id, { logementConcerne: v })}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-1.5 w-8">
                        <button
                          type="button"
                          onClick={() => removeReparation(ligne.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title={t.common.delete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total sous tableau */}
            <div className="hidden md:flex justify-end mt-4">
              <div className="bg-gray-50/80 px-5 py-2.5 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-600 mr-4">{t.step3.totalAdjustment}:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(calculatedValues?.totalAjustementReparations || 0)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={addReparation}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
              disabled={formData.reparations.length >= 30}
            >
              <Plus size={18} />
              {t.step3.addLine}
            </button>
            {formData.reparations.length >= 30 && (
              <p className="text-sm text-amber-600">{t.step3.maxLines}</p>
            )}
          </div>
        )}

        {/* Total */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 mt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center text-white"
                style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}}>
                3
              </span>
              <span className="font-bold text-sm text-gray-800">{t.step3.totalAdjustment}</span>
            </div>
            <div className="w-36">
              <CalculatedField value={calculatedValues?.totalAjustementReparations || 0} highlight />
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
