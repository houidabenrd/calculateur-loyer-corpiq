import React from 'react';
import { FormData, CalculatedValues, LigneNouvelleDepense, LigneVariationAide } from '../../types';
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
import { Plus, Trash2, PackagePlus, ArrowUpDown } from 'lucide-react';
import { calculAjustementNouvelleDepense, calculAjustementVariationAide, formatCurrency } from '../../utils/calculations';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step4Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  addNouvelleDepense: () => void;
  updateNouvelleDepense: (id: string, updates: Partial<LigneNouvelleDepense>) => void;
  removeNouvelleDepense: (id: string) => void;
  addVariationAide: () => void;
  updateVariationAide: (id: string, updates: Partial<LigneVariationAide>) => void;
  removeVariationAide: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step4: React.FC<Step4Props> = ({
  formData,
  calculatedValues,
  addNouvelleDepense,
  updateNouvelleDepense,
  removeNouvelleDepense,
  addVariationAide,
  updateVariationAide,
  removeVariationAide,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const getAjustementNouvelleDepense = (ligne: LigneNouvelleDepense): number => {
    if (!calculatedValues) return 0;
    return calculAjustementNouvelleDepense(
      ligne,
      formData.loyerMensuelActuel,
      calculatedValues.soustotalLogements.nombre,
      calculatedValues.soustotalLogements.loyer,
      calculatedValues.soustotalNonResidentiels.nombre,
      calculatedValues.soustotalNonResidentiels.loyer
    );
  };

  const getAjustementVariationAide = (ligne: LigneVariationAide): number => {
    if (!calculatedValues) return 0;
    return calculAjustementVariationAide(
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
      {/* Section 4a: Nouvelles dépenses */}
      <SectionCard 
        title={t.step4.newExpenses.title}
        badge={4}
        tooltip={t.step4.newExpenses.tooltip}
      >
        <div className="bg-blue-50/70 border border-blue-200/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>{t.step4.newExpenses.note}</strong> {t.step4.newExpenses.noteText}
          </p>
        </div>

        {formData.nouvellesDepenses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <PackagePlus size={20} className="text-gray-300" />
            </div>
            <p className="mb-4 text-sm">{t.step4.newExpenses.noExpenses}</p>
            <button
              type="button"
              onClick={addNouvelleDepense}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              {t.step4.newExpenses.addExpense}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {formData.nouvellesDepenses.map((ligne, index) => (
                <div key={ligne.id} className="bg-gray-50/80 rounded-xl p-4 space-y-3 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-corpiq-blue text-sm">{t.step4.newExpenses.expense} {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeNouvelleDepense(ligne.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div>
                    <LabelWithTooltip>{t.step4.newExpenses.nature}</LabelWithTooltip>
                    <input
                      type="text"
                      value={ligne.nature}
                      onChange={(e) => updateNouvelleDepense(ligne.id, { nature: e.target.value })}
                      className="input-field"
                      placeholder={t.step4.newExpenses.naturePlaceholder}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip tooltip={t.step4.newExpenses.expenseTooltip}>{t.step3.expense}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.depense}
                        onChange={(v) => updateNouvelleDepense(ligne.id, { depense: v })}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip tooltip={t.step4.newExpenses.financialAidTooltip}>{t.step3.financialAid}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.aideFinanciere}
                        onChange={(v) => updateNouvelleDepense(ligne.id, { aideFinanciere: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip>{t.step3.nbDwellings}</LabelWithTooltip>
                      <NumberInput
                        value={ligne.nbLogements}
                        onChange={(v) => updateNouvelleDepense(ligne.id, { nbLogements: v })}
                        min={0}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step3.nbNonResidential}</LabelWithTooltip>
                      <NumberInput
                        value={ligne.nbLocauxNonResidentiels}
                        onChange={(v) => updateNouvelleDepense(ligne.id, { nbLocauxNonResidentiels: v })}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
                    <Checkbox
                      checked={ligne.logementConcerne}
                      onChange={(v) => updateNouvelleDepense(ligne.id, { logementConcerne: v })}
                      label={t.step3.concernedDwelling}
                    />
                    <div className="text-right">
                      <span className="text-xs text-gray-400">{t.step3.adjustment}</span>
                      <div className="font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(getAjustementNouvelleDepense(ligne))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-corpiq-blue/20 text-left">
                    <th className="py-2.5 px-2 text-xs font-semibold text-gray-500">{t.step4.newExpenses.nature}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">
                      <span className="flex items-center justify-end gap-1">
                        {t.step4.newExpenses.expense}
                        <InfoTooltip content={t.step4.newExpenses.expenseTooltip} />
                      </span>
                    </th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">
                      <span className="flex items-center justify-end gap-1">
                        {t.step3.financialAid}
                        <InfoTooltip content={t.step4.newExpenses.financialAidTooltip} />
                      </span>
                    </th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step3.retainedExpense}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.nbDwellings}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.nbNonResidential}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.concernedDwelling}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step3.adjustment}</th>
                    <th className="py-2.5 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.nouvellesDepenses.map((ligne) => (
                    <tr key={ligne.id} className="group hover:bg-corpiq-light-blue/10 transition-colors">
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={ligne.nature}
                          onChange={(e) => updateNouvelleDepense(ligne.id, { nature: e.target.value })}
                          className="input-field text-sm"
                          placeholder={t.step4.newExpenses.naturePlaceholder}
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CurrencyInput
                          value={ligne.depense}
                          onChange={(v) => updateNouvelleDepense(ligne.id, { depense: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CurrencyInput
                          value={ligne.aideFinanciere}
                          onChange={(v) => updateNouvelleDepense(ligne.id, { aideFinanciere: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CalculatedField value={ligne.depenseRetenue} className="text-sm" />
                      </td>
                      <td className="py-2.5 px-2 w-20">
                        <NumberInput
                          value={ligne.nbLogements}
                          onChange={(v) => updateNouvelleDepense(ligne.id, { nbLogements: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-20">
                        <NumberInput
                          value={ligne.nbLocauxNonResidentiels}
                          onChange={(v) => updateNouvelleDepense(ligne.id, { nbLocauxNonResidentiels: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={ligne.logementConcerne}
                            onChange={(v) => updateNouvelleDepense(ligne.id, { logementConcerne: v })}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CalculatedField value={getAjustementNouvelleDepense(ligne)} className="text-sm" />
                      </td>
                      <td className="py-2.5 px-2">
                        <button
                          type="button"
                          onClick={() => removeNouvelleDepense(ligne.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addNouvelleDepense}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              {t.step4.newExpenses.addLine}
            </button>
          </div>
        )}

        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 mt-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-gray-600">{t.step4.newExpenses.subtotal}</span>
            <div className="w-36">
              <CalculatedField value={calculatedValues?.totalAjustementNouvellesDepenses || 0} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 4b: Variations d'aide */}
      <SectionCard 
        title={t.step4.aidVariation.title}
        tooltip={t.step4.aidVariation.tooltip}
      >
        <div className="bg-red-50/70 border border-red-200/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-red-800 leading-relaxed">
            <strong>{t.step4.aidVariation.important}</strong> {t.step4.aidVariation.importantNote}
          </p>
        </div>

        {formData.variationsAide.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <ArrowUpDown size={20} className="text-gray-300" />
            </div>
            <p className="mb-4 text-sm">{t.step4.aidVariation.noVariations}</p>
            <button
              type="button"
              onClick={addVariationAide}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              {t.step4.aidVariation.addVariation}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {formData.variationsAide.map((ligne, index) => (
                <div key={ligne.id} className="bg-gray-50/80 rounded-xl p-4 space-y-3 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-corpiq-blue text-sm">{t.step4.aidVariation.aidNature} {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVariationAide(ligne.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div>
                    <LabelWithTooltip>{t.step4.aidVariation.aidNature}</LabelWithTooltip>
                    <input
                      type="text"
                      value={ligne.nature}
                      onChange={(e) => updateVariationAide(ligne.id, { nature: e.target.value })}
                      className="input-field"
                      placeholder={t.step4.aidVariation.aidNature}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip>{t.step4.aidVariation.amount2025}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.montant2025}
                        onChange={(v) => updateVariationAide(ligne.id, { montant2025: v })}
                      />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step4.aidVariation.amount2024}</LabelWithTooltip>
                      <CurrencyInput
                        value={ligne.montant2024}
                        onChange={(v) => updateVariationAide(ligne.id, { montant2024: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <LabelWithTooltip>{t.step4.aidVariation.variation}</LabelWithTooltip>
                      <CalculatedField value={ligne.variation} />
                    </div>
                    <div>
                      <LabelWithTooltip>{t.step3.nbDwellings}</LabelWithTooltip>
                      <NumberInput
                        value={ligne.nbLogements}
                        onChange={(v) => updateVariationAide(ligne.id, { nbLogements: v })}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
                    <Checkbox
                      checked={ligne.logementConcerne}
                      onChange={(v) => updateVariationAide(ligne.id, { logementConcerne: v })}
                      label={t.step3.concernedDwelling}
                    />
                    <div className="text-right">
                      <span className="text-xs text-gray-400">{t.step3.adjustment}</span>
                      <div className={`font-semibold tabular-nums ${getAjustementVariationAide(ligne) > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {formatCurrency(getAjustementVariationAide(ligne))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-corpiq-blue/20 text-left">
                    <th className="py-2.5 px-2 text-xs font-semibold text-gray-500">{t.step4.aidVariation.aidNature}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step4.aidVariation.amount2025}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step4.aidVariation.amount2024}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step4.aidVariation.variation}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.nbDwellings}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.nbNonResidential}</th>
                    <th className="py-2.5 px-2 text-xs text-center font-semibold text-gray-500">{t.step3.concernedDwelling}</th>
                    <th className="py-2.5 px-2 text-xs text-right font-semibold text-gray-500">{t.step3.adjustment}</th>
                    <th className="py-2.5 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.variationsAide.map((ligne) => (
                    <tr key={ligne.id} className="group hover:bg-corpiq-light-blue/10 transition-colors">
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={ligne.nature}
                          onChange={(e) => updateVariationAide(ligne.id, { nature: e.target.value })}
                          className="input-field text-sm"
                          placeholder={t.step4.aidVariation.aidNature}
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CurrencyInput
                          value={ligne.montant2025}
                          onChange={(v) => updateVariationAide(ligne.id, { montant2025: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CurrencyInput
                          value={ligne.montant2024}
                          onChange={(v) => updateVariationAide(ligne.id, { montant2024: v })}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CalculatedField value={ligne.variation} className="text-sm" />
                      </td>
                      <td className="py-2.5 px-2 w-20">
                        <NumberInput
                          value={ligne.nbLogements}
                          onChange={(v) => updateVariationAide(ligne.id, { nbLogements: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 w-20">
                        <NumberInput
                          value={ligne.nbLocauxNonResidentiels}
                          onChange={(v) => updateVariationAide(ligne.id, { nbLocauxNonResidentiels: v })}
                          min={0}
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={ligne.logementConcerne}
                            onChange={(v) => updateVariationAide(ligne.id, { logementConcerne: v })}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-2 w-28">
                        <CalculatedField value={getAjustementVariationAide(ligne)} className="text-sm" />
                      </td>
                      <td className="py-2.5 px-2">
                        <button
                          type="button"
                          onClick={() => removeVariationAide(ligne.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addVariationAide}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              {t.step4.aidVariation.addLine}
            </button>
          </div>
        )}

        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 mt-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-gray-600">{t.step4.aidVariation.subtotal}</span>
            <div className="w-36">
              <CalculatedField value={calculatedValues?.totalAjustementVariationsAide || 0} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Total Section 4 */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center text-white"
              style={{background: 'linear-gradient(135deg, #13315c, #1a4178)'}}>
              4
            </span>
            <span className="font-bold text-sm text-gray-800">{t.step4.totalSection4}</span>
          </div>
          <div className="w-36">
            <CalculatedField value={calculatedValues?.totalSection4 || 0} highlight />
          </div>
        </div>
      </div>

      <NavigationButtons 
        onPrevious={onPrevious}
        onNext={onNext}
        previousLabel={t.common.previous}
        nextLabel={t.common.next}
      />
    </div>
  );
};
