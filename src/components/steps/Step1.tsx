import React from 'react';
import { FormData, CalculatedValues } from '../../types';
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
import { AddressAutocomplete } from '../ui/AddressAutocomplete';
import { formatCurrency } from '../../utils/calculations';
import { useLanguage } from '../../i18n/LanguageContext';

interface Step1Props {
  formData: FormData;
  calculatedValues: CalculatedValues | null;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({
  formData,
  calculatedValues,
  updateFormData,
  onNext,
}) => {
  const { t } = useLanguage();
  const updateLogements = (
    type: 'loues' | 'inoccupes' | 'occupesLocateur',
    field: 'nombre' | 'loyerMensuel',
    value: number
  ) => {
    updateFormData({
      logements: {
        ...formData.logements,
        [type]: { ...formData.logements[type], [field]: value },
      },
    });
  };

  const updateLocaux = (
    type: 'loues' | 'inoccupes' | 'occupesLocateur',
    field: 'nombre' | 'loyerMensuel',
    value: number
  ) => {
    updateFormData({
      locauxNonResidentiels: {
        ...formData.locauxNonResidentiels,
        [type]: { ...formData.locauxNonResidentiels[type], [field]: value },
      },
    });
  };

  return (
    <div>
      {/* Renseignements sur le logement */}
      <SectionCard title={t.step1.housingInfo.title}>
        <div className="space-y-5">
          <div>
            <LabelWithTooltip htmlFor="adresse">
              {t.step1.housingInfo.address}
            </LabelWithTooltip>
            <AddressAutocomplete
              id="adresse"
              value={formData.adresse}
              onChange={(value) => updateFormData({ adresse: value })}
              placeholder={t.step1.housingInfo.addressPlaceholder}
            />
          </div>
          
          <Checkbox
            checked={formData.isRPA}
            onChange={(checked) => updateFormData({ isRPA: checked })}
            label={t.step1.housingInfo.rpa}
          />
        </div>
      </SectionCard>

      {/* Ajustement de base */}
      <SectionCard title={t.step1.baseAdjustment.title} badge={1}>
        <div className="bg-blue-50/70 border border-blue-200/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            *** {t.step1.baseAdjustment.note}
          </p>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <LabelWithTooltip htmlFor="loyer" required>
                {t.step1.baseAdjustment.currentRent}
              </LabelWithTooltip>
              <CurrencyInput
                id="loyer"
                value={formData.loyerMensuelActuel}
                onChange={(value) => updateFormData({ loyerMensuelActuel: value })}
                placeholder="Ex: 1 200,00 $"
              />
            </div>
            
            {formData.isRPA && (
              <div>
                <LabelWithTooltip htmlFor="partServices" required>
                  Part des services à la personne
                </LabelWithTooltip>
                <CurrencyInput
                  id="partServices"
                  value={formData.partServicesPersonne || 0}
                  onChange={(value) => updateFormData({ partServicesPersonne: value })}
                  placeholder="Ex: 500,00 $"
                />
              </div>
            )}
          </div>

          {/* Immeuble normal */}
          {!formData.isRPA && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelWithTooltip>
                    {t.step1.baseAdjustment.ipcVariation}
                  </LabelWithTooltip>
                  <div className="input-readonly text-right font-bold tabular-nums">
                    {((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)} %
                  </div>
                </div>
                <div>
                  <LabelWithTooltip>
                    {t.step1.baseAdjustment.baseAdjustment}
                  </LabelWithTooltip>
                  <CalculatedField value={calculatedValues?.ajustementBase || 0} highlight={formData.loyerMensuelActuel > 0} />
                </div>
              </div>
            </div>
          )}

          {/* RPA */}
          {formData.isRPA && (
            <div className="bg-blue-50/70 p-5 rounded-xl border border-blue-200/60">
              <h4 className="font-bold text-corpiq-blue mb-4 text-xs uppercase tracking-wider">Calcul RPA (2 blocs)</h4>
              
              <div className="bg-white/80 p-4 rounded-lg mb-3 border border-blue-100/50">
                <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                  Bloc A — Services à la personne (taux fixe 6,7%)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Montant:</span>
                    <span className="ml-2 font-bold tabular-nums">{formatCurrency(formData.partServicesPersonne || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Taux:</span>
                    <span className="ml-2 font-bold tabular-nums">{((calculatedValues?.tauxServicesAines || 0) * 100).toFixed(1)} %</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Ajustement:</span>
                    <span className="ml-2 font-bold text-corpiq-blue tabular-nums">{formatCurrency(calculatedValues?.ajustementServices || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 p-4 rounded-lg mb-3 border border-blue-100/50">
                <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                  Bloc B — Loyer sans services (taux IPC)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Montant:</span>
                    <span className="ml-2 font-bold tabular-nums">{formatCurrency(formData.loyerMensuelActuel - (formData.partServicesPersonne || 0))}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Taux:</span>
                    <span className="ml-2 font-bold tabular-nums">{((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)} %</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Ajustement:</span>
                    <span className="ml-2 font-bold text-corpiq-blue tabular-nums">{formatCurrency(calculatedValues?.ajustementSansServices || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-blue-200/60 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Ajustement de base total (Bloc A + Bloc B)</span>
                  <CalculatedField value={calculatedValues?.ajustementBase || 0} highlight={formData.loyerMensuelActuel > 0} />
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Revenus de l'immeuble */}
      <SectionCard title={t.step1.buildingRevenue.title}>
        <div className="space-y-5">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-corpiq-blue/15">
                  <th className="text-left py-2"></th>
                  <th colSpan={2} className="text-center py-2 text-[10px] font-bold text-corpiq-blue uppercase tracking-widest">
                    {t.step1.buildingRevenue.dwellings}
                  </th>
                  <th colSpan={2} className="text-center py-2 text-[10px] font-bold text-corpiq-blue uppercase tracking-widest border-l border-gray-200">
                    <div className="flex items-center justify-center gap-1">
                      {t.step1.buildingRevenue.nonResidential}
                      <InfoTooltip content={t.step1.buildingRevenue.nonResidentialTooltip} />
                    </div>
                  </th>
                </tr>
                <tr className="border-b text-[10px] text-gray-400 uppercase tracking-wider">
                  <th className="text-left py-1.5"></th>
                  <th className="text-center py-1.5 w-20 font-semibold">{t.step1.buildingRevenue.number}</th>
                  <th className="text-center py-1.5 w-32 font-semibold">{t.step1.buildingRevenue.monthlyRent}</th>
                  <th className="text-center py-1.5 w-20 border-l border-gray-200 font-semibold">{t.step1.buildingRevenue.number}</th>
                  <th className="text-center py-1.5 w-32 font-semibold">{t.step1.buildingRevenue.monthlyRent}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Loués */}
                <tr className="group hover:bg-gray-50/80 transition-colors">
                  <td className="py-3">
                    <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                      {t.step1.buildingRevenue.rented}
                      <InfoTooltip content={t.step1.buildingRevenue.rentedTooltip} />
                    </div>
                  </td>
                  <td className="py-2.5 px-1.5">
                    <NumberInput value={formData.logements.loues.nombre} onChange={(v) => updateLogements('loues', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.logements.loues.loyerMensuel} onChange={(v) => updateLogements('loues', 'loyerMensuel', v)} />
                  </td>
                  <td className="py-2.5 px-1.5 border-l border-gray-100">
                    <NumberInput value={formData.locauxNonResidentiels.loues.nombre} onChange={(v) => updateLocaux('loues', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.locauxNonResidentiels.loues.loyerMensuel} onChange={(v) => updateLocaux('loues', 'loyerMensuel', v)} />
                  </td>
                </tr>

                {/* Inoccupés */}
                <tr className="group hover:bg-gray-50/80 transition-colors">
                  <td className="py-3">
                    <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                      {t.step1.buildingRevenue.vacant}
                      <InfoTooltip content={t.step1.buildingRevenue.vacantTooltip} />
                    </div>
                  </td>
                  <td className="py-2.5 px-1.5">
                    <NumberInput value={formData.logements.inoccupes.nombre} onChange={(v) => updateLogements('inoccupes', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.logements.inoccupes.loyerMensuel} onChange={(v) => updateLogements('inoccupes', 'loyerMensuel', v)} />
                  </td>
                  <td className="py-2.5 px-1.5 border-l border-gray-100">
                    <NumberInput value={formData.locauxNonResidentiels.inoccupes.nombre} onChange={(v) => updateLocaux('inoccupes', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.locauxNonResidentiels.inoccupes.loyerMensuel} onChange={(v) => updateLocaux('inoccupes', 'loyerMensuel', v)} />
                  </td>
                </tr>

                {/* Occupés par le locateur */}
                <tr className="group hover:bg-gray-50/80 transition-colors">
                  <td className="py-3">
                    <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                      {t.step1.buildingRevenue.occupiedByOwner}
                      <InfoTooltip content={t.step1.buildingRevenue.occupiedByOwnerTooltip} />
                    </div>
                  </td>
                  <td className="py-2.5 px-1.5">
                    <NumberInput value={formData.logements.occupesLocateur.nombre} onChange={(v) => updateLogements('occupesLocateur', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.logements.occupesLocateur.loyerMensuel} onChange={(v) => updateLogements('occupesLocateur', 'loyerMensuel', v)} />
                  </td>
                  <td className="py-2.5 px-1.5 border-l border-gray-100">
                    <NumberInput value={formData.locauxNonResidentiels.occupesLocateur.nombre} onChange={(v) => updateLocaux('occupesLocateur', 'nombre', v)} />
                  </td>
                  <td className="py-2.5 px-1.5">
                    <CurrencyInput value={formData.locauxNonResidentiels.occupesLocateur.loyerMensuel} onChange={(v) => updateLocaux('occupesLocateur', 'loyerMensuel', v)} />
                  </td>
                </tr>

                {/* Sous-total */}
                <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                  <td className="py-2.5 font-bold text-xs text-gray-700 uppercase tracking-wider">{t.step1.buildingRevenue.subtotal}</td>
                  <td className="py-2.5 px-1.5 text-center font-bold tabular-nums text-gray-700 text-sm">
                    {calculatedValues?.soustotalLogements.nombre || 0}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-bold tabular-nums text-gray-700 text-sm">
                    {formatCurrency(calculatedValues?.soustotalLogements.loyer || 0)}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-l border-gray-200 font-bold tabular-nums text-gray-700 text-sm">
                    {calculatedValues?.soustotalNonResidentiels.nombre || 0}
                  </td>
                  <td className="py-2.5 px-1.5 text-right font-bold tabular-nums text-gray-700 text-sm">
                    {formatCurrency(calculatedValues?.soustotalNonResidentiels.loyer || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/80 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip>
                  {t.step1.buildingRevenue.totalAnnualRent}
                </LabelWithTooltip>
                <CalculatedField value={calculatedValues?.totalLoyersAnnuel || 0} />
              </div>
              <div>
                <LabelWithTooltip tooltip={t.step1.buildingRevenue.otherRevenueTooltip}>
                  {t.step1.buildingRevenue.otherRevenue}
                </LabelWithTooltip>
                <CurrencyInput
                  value={formData.autresRevenus}
                  onChange={(value) => updateFormData({ autresRevenus: value })}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <NavigationButtons 
        showPrevious={false}
        onNext={onNext}
        nextDisabled={formData.loyerMensuelActuel <= 0}
        nextLabel={t.common.next}
      />
    </div>
  );
};
