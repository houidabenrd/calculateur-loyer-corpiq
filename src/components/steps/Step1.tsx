import React from 'react';
import { FormData, CalculatedValues } from '../../types';
import { 
  SectionCard, 
  CurrencyInput, 
  CalculatedField, 
  NumberInput, 
  Checkbox,
  LabelWithTooltip,
  NavigationButtons 
} from '../ui';
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
        [type]: {
          ...formData.logements[type],
          [field]: value,
        },
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
        [type]: {
          ...formData.locauxNonResidentiels[type],
          [field]: value,
        },
      },
    });
  };

  return (
    <div>
      {/* Section: Renseignements sur le logement */}
      <SectionCard 
        title={t.step1.housingInfo.title}
        tooltip={t.step1.housingInfo.tooltip}
      >
        <div className="space-y-4">
          <div>
            <LabelWithTooltip htmlFor="adresse" required>
              {t.step1.housingInfo.address}
            </LabelWithTooltip>
            <textarea
              id="adresse"
              value={formData.adresse}
              onChange={(e) => updateFormData({ adresse: e.target.value })}
              className="input-field"
              rows={2}
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

      {/* Section: Ajustement de base */}
      <SectionCard 
        title={t.step1.baseAdjustment.title}
        badge={1}
        tooltip={t.step1.baseAdjustment.tooltip}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <LabelWithTooltip 
                htmlFor="loyer" 
                required
                tooltip={t.step1.baseAdjustment.currentRentTooltip}
              >
                {t.step1.baseAdjustment.currentRent}
              </LabelWithTooltip>
              <CurrencyInput
                id="loyer"
                value={formData.loyerMensuelActuel}
                onChange={(value) => updateFormData({ loyerMensuelActuel: value })}
                placeholder="Ex: 1 200,00 $"
              />
            </div>
            
            {/* Champ RPA: Part des services à la personne */}
            {formData.isRPA && (
              <div>
                <LabelWithTooltip 
                  htmlFor="partServices" 
                  required
                  tooltip="Partie du loyer mensuel liée aux services à la personne (repas, soins, etc.). Ce montant sera ajusté au taux de 6,7% au lieu du taux IPC."
                >
                  Part des services à la personne
                </LabelWithTooltip>
                <CurrencyInput
                  id="partServices"
                  value={formData.partServicesPersonne}
                  onChange={(value) => updateFormData({ partServicesPersonne: value })}
                  placeholder="Ex: 500,00 $"
                />
              </div>
            )}
          </div>

          {/* Affichage du calcul - CAS 1: Immeuble normal */}
          {!formData.isRPA && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelWithTooltip 
                    tooltip={t.step1.baseAdjustment.ipcVariationTooltip}
                  >
                    {t.step1.baseAdjustment.ipcVariation}
                  </LabelWithTooltip>
                  <div className="input-readonly text-right font-medium">
                    {((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)} %
                  </div>
                </div>
                <div>
                  <LabelWithTooltip tooltip={t.step1.baseAdjustment.baseAdjustmentTooltip}>
                    {t.step1.baseAdjustment.baseAdjustment}
                  </LabelWithTooltip>
                  <CalculatedField 
                    value={calculatedValues?.ajustementBase || 0} 
                    highlight={formData.loyerMensuelActuel > 0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Affichage du calcul - CAS 2: RPA (Résidence privée pour aînés) */}
          {formData.isRPA && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-corpiq-blue mb-3">Calcul RPA (2 blocs)</h4>
              
              {/* Bloc A: Services à la personne */}
              <div className="bg-white p-3 rounded mb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Bloc A — Services à la personne (taux fixe 6,7%)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Montant:</span>
                    <span className="ml-2 font-medium">{formatCurrency(formData.partServicesPersonne)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Taux:</span>
                    <span className="ml-2 font-medium">{((calculatedValues?.tauxServicesAines || 0) * 100).toFixed(1)} %</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ajustement:</span>
                    <span className="ml-2 font-medium text-corpiq-blue">{formatCurrency(calculatedValues?.ajustementServices || 0)}</span>
                  </div>
                </div>
              </div>
              
              {/* Bloc B: Loyer sans services */}
              <div className="bg-white p-3 rounded mb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Bloc B — Loyer sans services (taux IPC)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Montant:</span>
                    <span className="ml-2 font-medium">{formatCurrency(formData.loyerMensuelActuel - formData.partServicesPersonne)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Taux:</span>
                    <span className="ml-2 font-medium">{((calculatedValues?.tauxIPC || 0) * 100).toFixed(1)} %</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ajustement:</span>
                    <span className="ml-2 font-medium text-corpiq-blue">{formatCurrency(calculatedValues?.ajustementSansServices || 0)}</span>
                  </div>
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t border-blue-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Ajustement de base total (Bloc A + Bloc B)</span>
                  <CalculatedField 
                    value={calculatedValues?.ajustementBase || 0} 
                    highlight={formData.loyerMensuelActuel > 0}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Section: Revenus de l'immeuble */}
      <SectionCard 
        title={t.step1.buildingRevenue.title}
        tooltip={t.step1.buildingRevenue.tooltip}
      >
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-corpiq-blue">
                  <th className="text-left py-2"></th>
                  <th colSpan={2} className="text-center py-2 text-corpiq-blue">
                    {t.step1.buildingRevenue.dwellings}
                  </th>
                  <th colSpan={2} className="text-center py-2 text-corpiq-blue border-l border-gray-200">
                    {t.step1.buildingRevenue.nonResidential}
                  </th>
                </tr>
                <tr className="border-b text-sm text-gray-600">
                  <th className="text-left py-2"></th>
                  <th className="text-center py-2 w-24">{t.step1.buildingRevenue.number}</th>
                  <th className="text-center py-2 w-36">{t.step1.buildingRevenue.monthlyRent}</th>
                  <th className="text-center py-2 w-24 border-l border-gray-200">{t.step1.buildingRevenue.number}</th>
                  <th className="text-center py-2 w-36">{t.step1.buildingRevenue.monthlyRent}</th>
                </tr>
              </thead>
              <tbody>
                {/* Loués */}
                <tr className="border-b">
                  <td className="py-3">
                    <div className="font-medium">{t.step1.buildingRevenue.rented}</div>
                    <div className="text-sm text-gray-500">{t.step1.buildingRevenue.monthlyRent}</div>
                  </td>
                  <td className="py-3 px-2">
                    <NumberInput
                      value={formData.logements.loues.nombre}
                      onChange={(v) => updateLogements('loues', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.logements.loues.loyerMensuel}
                      onChange={(v) => updateLogements('loues', 'loyerMensuel', v)}
                    />
                  </td>
                  <td className="py-3 px-2 border-l border-gray-200">
                    <NumberInput
                      value={formData.locauxNonResidentiels.loues.nombre}
                      onChange={(v) => updateLocaux('loues', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.locauxNonResidentiels.loues.loyerMensuel}
                      onChange={(v) => updateLocaux('loues', 'loyerMensuel', v)}
                    />
                  </td>
                </tr>

                {/* Inoccupés */}
                <tr className="border-b">
                  <td className="py-3">
                    <div className="font-medium">{t.step1.buildingRevenue.vacant}</div>
                    <div className="text-sm text-gray-500">{t.step1.buildingRevenue.monthlyRent}</div>
                  </td>
                  <td className="py-3 px-2">
                    <NumberInput
                      value={formData.logements.inoccupes.nombre}
                      onChange={(v) => updateLogements('inoccupes', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.logements.inoccupes.loyerMensuel}
                      onChange={(v) => updateLogements('inoccupes', 'loyerMensuel', v)}
                    />
                  </td>
                  <td className="py-3 px-2 border-l border-gray-200">
                    <NumberInput
                      value={formData.locauxNonResidentiels.inoccupes.nombre}
                      onChange={(v) => updateLocaux('inoccupes', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.locauxNonResidentiels.inoccupes.loyerMensuel}
                      onChange={(v) => updateLocaux('inoccupes', 'loyerMensuel', v)}
                    />
                  </td>
                </tr>

                {/* Occupés par le locateur */}
                <tr className="border-b">
                  <td className="py-3">
                    <div className="font-medium">{t.step1.buildingRevenue.occupiedByOwner}</div>
                    <div className="text-sm text-gray-500">{t.step1.buildingRevenue.monthlyRent}</div>
                  </td>
                  <td className="py-3 px-2">
                    <NumberInput
                      value={formData.logements.occupesLocateur.nombre}
                      onChange={(v) => updateLogements('occupesLocateur', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.logements.occupesLocateur.loyerMensuel}
                      onChange={(v) => updateLogements('occupesLocateur', 'loyerMensuel', v)}
                    />
                  </td>
                  <td className="py-3 px-2 border-l border-gray-200">
                    <NumberInput
                      value={formData.locauxNonResidentiels.occupesLocateur.nombre}
                      onChange={(v) => updateLocaux('occupesLocateur', 'nombre', v)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <CurrencyInput
                      value={formData.locauxNonResidentiels.occupesLocateur.loyerMensuel}
                      onChange={(v) => updateLocaux('occupesLocateur', 'loyerMensuel', v)}
                    />
                  </td>
                </tr>

                {/* Sous-total */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3">{t.step1.buildingRevenue.subtotal}</td>
                  <td className="py-3 px-2 text-center">
                    {calculatedValues?.soustotalLogements.nombre || 0}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {formatCurrency(calculatedValues?.soustotalLogements.loyer || 0)}
                  </td>
                  <td className="py-3 px-2 text-center border-l border-gray-200">
                    {calculatedValues?.soustotalNonResidentiels.nombre || 0}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {formatCurrency(calculatedValues?.soustotalNonResidentiels.loyer || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="bg-corpiq-light p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip tooltip={t.step1.buildingRevenue.totalAnnualRentTooltip}>
                  {t.step1.buildingRevenue.totalAnnualRent}
                </LabelWithTooltip>
                <CalculatedField value={calculatedValues?.totalLoyersAnnuel || 0} />
              </div>
              <div>
                <LabelWithTooltip 
                  tooltip={t.step1.buildingRevenue.otherRevenueTooltip}
                >
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
