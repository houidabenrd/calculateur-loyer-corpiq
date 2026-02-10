import { jsPDF } from 'jspdf';
import { FormData, CalculatedValues } from '../types';
import { 
  formatCurrency, 
  calculAjustementTaxes, 
  calculAjustementAssurances,
  calculAjustementReparation,
  calculAjustementNouvelleDepense,
  calculAjustementVariationAide
} from './calculations';
import { Language, translations } from '../i18n/translations';

export const generatePDF = async (
  formData: FormData,
  calculatedValues: CalculatedValues,
  language: Language = 'en'
): Promise<void> => {
  const t = translations[language];
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  // Couleurs CORPIQ
  const bleuCorpiq = [19, 49, 92] as [number, number, number];
  const bordeauxCorpiq = [83, 15, 50] as [number, number, number];
  const gris = [100, 100, 100] as [number, number, number];

  // ========== HELPERS ==========

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 25) {
      addFooter();
      doc.addPage();
      y = 15;
    }
  };

  const addFooter = () => {
    const footerY = pageHeight - 10;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const dateStr = language === 'fr'
      ? new Date().toLocaleDateString('fr-CA')
      : new Date().toLocaleDateString('en-CA');
    doc.text(`${t.pdf.generatedOn} ${dateStr} ${t.pdf.by}`, margin, footerY);
    doc.text('www.corpiq.com', pageWidth - margin, footerY, { align: 'right' });
    const pageNum = doc.getNumberOfPages();
    doc.text(`${pageNum}`, pageWidth / 2, footerY, { align: 'center' });
  };

  const addSectionTitle = (badge: string, title: string) => {
    checkPageBreak(14);
    // Bande bordeaux
    doc.setFillColor(...bordeauxCorpiq);
    doc.rect(margin, y - 4, contentWidth, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    // Utiliser splitTextToSize pour les titres longs
    const maxTitleWidth = contentWidth - 10;
    const titleLines = doc.splitTextToSize(`${badge}  ${title}`, maxTitleWidth);
    if (titleLines.length > 1) {
      // Agrandir la bande pour 2 lignes
      doc.setFillColor(...bordeauxCorpiq);
      doc.rect(margin, y - 4, contentWidth, 9 + (titleLines.length - 1) * 5, 'F');
      doc.setTextColor(255, 255, 255);
      titleLines.forEach((line: string, i: number) => {
        doc.text(line, margin + 5, y + 2 + i * 5);
      });
      y += 8 + (titleLines.length - 1) * 5;
    } else {
      doc.text(titleLines[0], margin + 5, y + 2);
      y += 10;
    }
  };

  const addRow = (label: string, value: string, bold = false, indent = 0) => {
    checkPageBreak(7);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const labelLines = doc.splitTextToSize(label, contentWidth - 50 - indent);
    labelLines.forEach((line: string, i: number) => {
      doc.text(line, margin + 2 + indent, y);
      if (i === 0) {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.text(value, pageWidth - margin - 2, y, { align: 'right' });
      }
      y += 5;
    });
  };

  const addSubtotalRow = (label: string, value: string) => {
    checkPageBreak(10);
    doc.setFillColor(240, 242, 248);
    doc.rect(margin, y - 4, contentWidth, 8, 'F');
    doc.setTextColor(...bleuCorpiq);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 4, y);
    doc.text(value, pageWidth - margin - 4, y, { align: 'right' });
    y += 8;
  };

  const addSeparator = () => {
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  const addSmallLabel = (text: string) => {
    checkPageBreak(7);
    doc.setTextColor(...gris);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const lines = doc.splitTextToSize(text, contentWidth - 4);
    lines.forEach((line: string) => {
      doc.text(line, margin + 2, y);
      y += 4;
    });
    y += 1;
  };

  // ========== EN-TÊTE ==========
  doc.setFillColor(...bleuCorpiq);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.title, pageWidth / 2, 13, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t.pdf.subtitle, pageWidth / 2, 23, { align: 'center' });

  y = 40;

  // ========== LOGEMENT CONCERNÉ ==========
  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.concernedDwelling, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  y += 5;
  const fullAddress = formData.unite 
    ? `${formData.adresse}, ${language === 'fr' ? 'Unité' : 'Unit'} ${formData.unite}` 
    : (formData.adresse || (language === 'fr' ? 'Non spécifié' : 'Not specified'));
  const addressLines = doc.splitTextToSize(fullAddress, contentWidth);
  addressLines.forEach((line: string) => {
    doc.text(line, margin, y);
    y += 5;
  });
  y += 2;

  // Date de génération
  const generationDate = language === 'fr'
    ? new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(`${t.pdf.generatedOn} ${generationDate}`, margin, y);
  y += 6;

  // Note d'applicabilité
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const applicabilityLines = doc.splitTextToSize(t.common.applicabilityNote, contentWidth);
  applicabilityLines.forEach((line: string) => {
    doc.text(line, margin, y);
    y += 4;
  });
  y += 2;

  addSeparator();
  y += 2;

  // ========== SECTION 1 : AJUSTEMENT DE BASE ==========
  addSectionTitle('1', t.step1.baseAdjustment.title);
  y += 2;

  addRow(t.step1.baseAdjustment.currentRent, formatCurrency(formData.loyerMensuelActuel));
  addRow(
    t.step1.baseAdjustment.ipcVariation,
    `${(calculatedValues.tauxIPC * 100).toFixed(1)} %`
  );

  if (formData.isRPA && formData.partServicesPersonne > 0) {
    addSmallLabel(language === 'fr' ? 'Résidence privée pour aînés (RPA) :' : 'Private residence for seniors (RPA):');
    addRow(
      language === 'fr' ? 'Part services à la personne' : 'Personal services portion',
      formatCurrency(formData.partServicesPersonne),
      false, 8
    );
    addRow(
      language === 'fr' ? 'Ajustement services (6,7%)' : 'Services adjustment (6.7%)',
      formatCurrency(calculatedValues.ajustementServices),
      false, 8
    );
    addRow(
      language === 'fr' ? 'Ajustement loyer hors services (IPC)' : 'Rent adjustment excl. services (CPI)',
      formatCurrency(calculatedValues.ajustementSansServices),
      false, 8
    );
  }

  addSubtotalRow(t.step1.baseAdjustment.baseAdjustment, formatCurrency(calculatedValues.ajustementBase));
  y += 2;

  // Revenus de l'immeuble
  checkPageBreak(40);
  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(t.step1.buildingRevenue.title, margin + 2, y);
  y += 6;

  // Tableau revenus
  const logLabel = t.step1.buildingRevenue.dwellings;
  const nrLabel = t.step1.buildingRevenue.nonResidential;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...gris);
  doc.text('', margin + 2, y);
  doc.text(logLabel, margin + 60, y);
  doc.text(nrLabel, margin + 110, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const revenueRows = [
    { label: t.step1.buildingRevenue.rented, log: formData.logements.loues, nr: formData.locauxNonResidentiels.loues },
    { label: t.step1.buildingRevenue.vacant, log: formData.logements.inoccupes, nr: formData.locauxNonResidentiels.inoccupes },
    { label: t.step1.buildingRevenue.occupiedByOwner, log: formData.logements.occupesLocateur, nr: formData.locauxNonResidentiels.occupesLocateur },
  ];

  revenueRows.forEach(row => {
    checkPageBreak(6);
    doc.setFontSize(8);
    // Tronquer le label si trop long
    const truncLabel = row.label.length > 28 ? row.label.substring(0, 26) + '...' : row.label;
    doc.text(truncLabel, margin + 2, y);
    doc.text(`${row.log.nombre}`, margin + 63, y);
    doc.text(formatCurrency(row.log.loyerMensuel), margin + 85, y, { align: 'right' });
    doc.text(`${row.nr.nombre}`, margin + 113, y);
    doc.text(formatCurrency(row.nr.loyerMensuel), margin + 140, y, { align: 'right' });
    y += 5;
  });

  y += 2;
  addRow(t.step1.buildingRevenue.totalAnnualRent, formatCurrency(calculatedValues.totalLoyersAnnuel));
  if (formData.autresRevenus > 0) {
    addRow(t.step1.buildingRevenue.otherRevenue, formatCurrency(formData.autresRevenus));
  }
  addRow(
    language === 'fr' ? 'Revenus totaux de l\'immeuble' : 'Total building revenue',
    formatCurrency(calculatedValues.revenusImmeuble),
    true
  );
  y += 4;

  // ========== SECTION 2 : TAXES ET ASSURANCES ==========
  addSectionTitle('2', t.step2.title);
  y += 2;

  // Taxes municipales
  const ajTaxMun = calculAjustementTaxes(
    formData.taxesMunicipales.anneeCourante,
    formData.taxesMunicipales.anneePrecedente,
    formData.loyerMensuelActuel,
    calculatedValues.revenusImmeuble
  );
  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  checkPageBreak(20);
  doc.text(t.step2.municipalTaxes, margin + 2, y);
  y += 6;
  addRow(`${t.step2.year2026}`, formatCurrency(formData.taxesMunicipales.anneeCourante), false, 6);
  addRow(`${t.step2.year2025}`, formatCurrency(formData.taxesMunicipales.anneePrecedente), false, 6);
  addRow(t.step2.monthlyAdjustment, formatCurrency(ajTaxMun), true, 6);
  y += 2;

  // Taxes scolaires
  const ajTaxScol = calculAjustementTaxes(
    formData.taxesScolaires.anneeCourante,
    formData.taxesScolaires.anneePrecedente,
    formData.loyerMensuelActuel,
    calculatedValues.revenusImmeuble
  );
  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  checkPageBreak(20);
  doc.text(t.step2.schoolTaxes, margin + 2, y);
  y += 6;
  addRow(`${t.step2.year2025_2026}`, formatCurrency(formData.taxesScolaires.anneeCourante), false, 6);
  addRow(`${t.step2.year2024_2025}`, formatCurrency(formData.taxesScolaires.anneePrecedente), false, 6);
  addRow(t.step2.monthlyAdjustment, formatCurrency(ajTaxScol), true, 6);
  y += 2;

  // Assurances
  const ajAssur = calculAjustementAssurances(
    formData.assurances.dec2025,
    formData.assurances.dec2024,
    formData.loyerMensuelActuel,
    calculatedValues.revenusImmeuble
  );
  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  checkPageBreak(20);
  doc.text(t.step2.insurance, margin + 2, y);
  y += 6;
  addRow(`${t.step2.asOfDec31} 2025`, formatCurrency(formData.assurances.dec2025), false, 6);
  addRow(`${t.step2.asOfDec31} 2024`, formatCurrency(formData.assurances.dec2024), false, 6);
  addRow(t.step2.monthlyAdjustment, formatCurrency(ajAssur), true, 6);
  y += 2;

  addSubtotalRow(t.step2.totalAdjustment, formatCurrency(calculatedValues.totalAjustementTaxesAssurances));
  y += 4;

  // ========== SECTION 3 : RÉPARATIONS MAJEURES ==========
  addSectionTitle('3', t.step3.title);
  y += 2;

  if (formData.reparations.length === 0) {
    addSmallLabel(language === 'fr' ? 'Aucune réparation ou amélioration majeure.' : 'No major repair or improvement.');
  } else {
    formData.reparations.forEach((ligne, index) => {
      checkPageBreak(35);
      doc.setTextColor(...bleuCorpiq);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.step3.line} ${index + 1}: ${ligne.nature || '—'}`, margin + 2, y);
      y += 6;

      addRow(t.step3.expense, formatCurrency(ligne.depense), false, 6);
      if (ligne.aideFinanciere > 0) {
        addRow(t.step3.financialAid, `- ${formatCurrency(ligne.aideFinanciere)}`, false, 6);
      }
      if (ligne.indemniteTiers > 0) {
        addRow(t.step3.thirdPartyCompensation, `- ${formatCurrency(ligne.indemniteTiers)}`, false, 6);
      }
      addRow(t.step3.retainedExpense, formatCurrency(ligne.depenseRetenue), true, 6);

      if (ligne.montantPretReduit > 0) {
        addRow(t.step3.reducedInterestLoan, formatCurrency(ligne.montantPretReduit), false, 6);
        addRow(t.step3.annualPayment, formatCurrency(ligne.versementAnnuel), false, 6);
      }

      addRow(
        t.step3.concernedDwelling,
        ligne.logementConcerne ? (language === 'fr' ? 'Oui' : 'Yes') : (language === 'fr' ? 'Non' : 'No'),
        false, 6
      );

      const ajustLigne = calculAjustementReparation(
        ligne,
        formData.loyerMensuelActuel,
        calculatedValues.soustotalLogements.nombre,
        calculatedValues.soustotalLogements.loyer,
        calculatedValues.soustotalNonResidentiels.nombre,
        calculatedValues.soustotalNonResidentiels.loyer
      );
      addRow(t.step3.adjustment, formatCurrency(ajustLigne), true, 6);
      y += 3;
      if (index < formData.reparations.length - 1) {
        addSeparator();
      }
    });
  }

  addSubtotalRow(t.step3.totalAdjustment, formatCurrency(calculatedValues.totalAjustementReparations));
  y += 4;

  // ========== SECTION 4 : NOUVELLES DÉPENSES ==========
  // Titre potentiellement long - utiliser splitTextToSize
  addSectionTitle('4', language === 'fr'
    ? 'Nouvelles dépenses'
    : 'New expenses');
  y += 2;

  if (formData.nouvellesDepenses.length === 0) {
    addSmallLabel(t.step4.newExpenses.noExpenses);
  } else {
    formData.nouvellesDepenses.forEach((ligne, index) => {
      checkPageBreak(25);
      doc.setTextColor(...bleuCorpiq);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${ligne.nature || '—'}`, margin + 2, y);
      y += 6;

      addRow(t.step4.newExpenses.expense, formatCurrency(ligne.depense), false, 6);
      if (ligne.aideFinanciere > 0) {
        addRow(t.step3.financialAid, `- ${formatCurrency(ligne.aideFinanciere)}`, false, 6);
      }
      addRow(t.step3.retainedExpense, formatCurrency(ligne.depenseRetenue), false, 6);
      addRow(
        t.step3.concernedDwelling,
        ligne.logementConcerne ? (language === 'fr' ? 'Oui' : 'Yes') : (language === 'fr' ? 'Non' : 'No'),
        false, 6
      );

      const ajustLigne = calculAjustementNouvelleDepense(
        ligne,
        formData.loyerMensuelActuel,
        calculatedValues.soustotalLogements.nombre,
        calculatedValues.soustotalLogements.loyer,
        calculatedValues.soustotalNonResidentiels.nombre,
        calculatedValues.soustotalNonResidentiels.loyer
      );
      addRow(t.step3.adjustment, formatCurrency(ajustLigne), true, 6);
      y += 2;
    });
  }

  addSubtotalRow(t.step4.newExpenses.subtotal, formatCurrency(calculatedValues.totalAjustementNouvellesDepenses));
  y += 4;

  // ========== VARIATIONS D'AIDE ==========
  addSectionTitle('', language === 'fr'
    ? 'Variation ou fin d\'une aide financière'
    : 'Variation or end of financial aid');
  y += 2;

  if (formData.variationsAide.length === 0) {
    addSmallLabel(t.step4.aidVariation.noVariations);
  } else {
    formData.variationsAide.forEach((ligne, index) => {
      checkPageBreak(25);
      doc.setTextColor(...bleuCorpiq);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${ligne.nature || '—'}`, margin + 2, y);
      y += 6;

      addRow(t.step4.aidVariation.amount2025, formatCurrency(ligne.montant2025), false, 6);
      addRow(t.step4.aidVariation.amount2024, formatCurrency(ligne.montant2024), false, 6);
      addRow(t.step4.aidVariation.variation, formatCurrency(ligne.variation), false, 6);
      addRow(
        t.step3.concernedDwelling,
        ligne.logementConcerne ? (language === 'fr' ? 'Oui' : 'Yes') : (language === 'fr' ? 'Non' : 'No'),
        false, 6
      );

      const ajustLigne = calculAjustementVariationAide(
        ligne,
        formData.loyerMensuelActuel,
        calculatedValues.soustotalLogements.nombre,
        calculatedValues.soustotalLogements.loyer,
        calculatedValues.soustotalNonResidentiels.nombre,
        calculatedValues.soustotalNonResidentiels.loyer
      );
      addRow(t.step3.adjustment, formatCurrency(ajustLigne), true, 6);
      y += 2;
    });
  }

  addSubtotalRow(t.step4.aidVariation.subtotal, formatCurrency(calculatedValues.totalAjustementVariationsAide));
  y += 4;

  // ========== SECTION 5 : DÉNEIGEMENT (seulement si applicable) ==========
  if (formData.hasDeneigement) {
    addSectionTitle('5', t.step5.snowRemoval.title);
    y += 2;
    addRow(t.step5.snowRemoval.fees2025, formatCurrency(formData.deneigement.frais2025), false, 6);
    addRow(t.step5.snowRemoval.fees2024, formatCurrency(formData.deneigement.frais2024), false, 6);
    addSubtotalRow(t.step5.snowRemoval.monthlyAdjustment, formatCurrency(calculatedValues.ajustementDeneigement));
    y += 6;
  }

  // ========== RÉCAPITULATIF FINAL ==========
  checkPageBreak(80);

  // Titre récapitulatif
  doc.setFillColor(...bleuCorpiq);
  doc.rect(margin, y - 4, contentWidth, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.summary, margin + 5, y + 2);
  y += 12;

  // Tableau récap
  const ajustements = [
    [`1. ${t.step5.summary.baseAdjustment}`, formatCurrency(calculatedValues.ajustementBase)],
    [`2. ${t.step5.summary.taxesAndInsurance}`, formatCurrency(calculatedValues.totalAjustementTaxesAssurances)],
    [`3. ${t.step5.summary.majorRepairs}`, formatCurrency(calculatedValues.totalAjustementReparations)],
    [`4. ${t.step5.summary.newExpenses}`, formatCurrency(calculatedValues.totalSection4)],
    ...(formData.hasDeneigement ? [[`5. ${t.step5.summary.snowRemoval}`, formatCurrency(calculatedValues.ajustementDeneigement)]] : []),
  ];

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);

  ajustements.forEach(([label, value]) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'normal');
    // Tronquer les labels longs dans le récap
    const maxLabelW = contentWidth - 45;
    const truncated = doc.splitTextToSize(label, maxLabelW);
    truncated.forEach((line: string, i: number) => {
      doc.text(line, margin + 2, y);
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.text(value, pageWidth - margin - 2, y, { align: 'right' });
      }
      y += 5;
    });
    y += 1;
  });

  // Bande total
  y += 2;
  checkPageBreak(12);
  doc.setFillColor(...bleuCorpiq);
  doc.rect(margin, y - 4, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.totalAdjustments, margin + 5, y + 2);
  doc.text(formatCurrency(calculatedValues.totalAjustements), pageWidth - margin - 5, y + 2, { align: 'right' });
  y += 16;

  // ========== RÉSULTAT FINAL ==========
  checkPageBreak(50);

  doc.setFillColor(240, 242, 248);
  doc.roundedRect(margin, y - 5, contentWidth, 42, 3, 3, 'F');

  doc.setTextColor(...bleuCorpiq);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.result, pageWidth / 2, y + 3, { align: 'center' });
  y += 12;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t.pdf.currentRent, margin + 8, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(formData.loyerMensuelActuel), pageWidth - margin - 8, y, { align: 'right' });
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(t.pdf.newRent, margin + 8, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...bordeauxCorpiq);
  doc.text(formatCurrency(calculatedValues.nouveauLoyerRecommande), pageWidth - margin - 8, y, { align: 'right' });
  y += 8;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t.pdf.variation, margin + 8, y);
  doc.setFont('helvetica', 'bold');
  const variationText = `${calculatedValues.pourcentageVariation >= 0 ? '+' : ''}${calculatedValues.pourcentageVariation.toFixed(2)} %`;
  doc.text(variationText, pageWidth - margin - 8, y, { align: 'right' });
  y += 16;

  // ========== AVERTISSEMENT LÉGAL ==========
  checkPageBreak(30);
  doc.setFillColor(255, 248, 220);
  const avisTextWidth = contentWidth - 8;
  const avisLines = doc.splitTextToSize(t.step5.legalNotice.text, avisTextWidth);
  const avisHeight = 12 + avisLines.length * 4;
  doc.rect(margin, y, contentWidth, avisHeight, 'F');

  doc.setTextColor(146, 100, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.legalNotice, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(t.step5.legalNotice.text, margin + 4, y + 12, { maxWidth: avisTextWidth, align: 'justify' });
  y += avisHeight + 6;

  // ========== MISE EN GARDE ==========
  checkPageBreak(30);
  doc.setFillColor(255, 235, 235);
  const warningTextWidth = contentWidth - 8;
  const warningLines = doc.splitTextToSize(t.step5.legalNotice.warningText, warningTextWidth);
  const warningHeight = 12 + warningLines.length * 4;
  doc.rect(margin, y, contentWidth, warningHeight, 'F');

  doc.setTextColor(160, 30, 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.warning, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(t.step5.legalNotice.warningText, margin + 4, y + 12, { maxWidth: warningTextWidth, align: 'justify' });

  // ========== FOOTER DE LA DERNIÈRE PAGE ==========
  addFooter();

  // Ajouter le footer aux pages précédentes
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i < totalPages; i++) {
    doc.setPage(i);
    addFooter();
  }

  // Télécharger le PDF
  const fileName = `calcul-loyer-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
