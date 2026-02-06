export type Language = 'fr' | 'en';

export interface Translations {
  // App.tsx
  app: {
    title: string;
    subtitle: string;
    loading: string;
    autoSave: string;
    footer: string;
    footerRights: string;
    footerContact: string;
  };
  
  // Steps
  steps: {
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
    step4: {
      title: string;
      description: string;
    };
    step5: {
      title: string;
      description: string;
    };
    step6: {
      title: string;
      description: string;
    };
  };
  
  // Step 1
  step1: {
    housingInfo: {
      title: string;
      tooltip: string;
      address: string;
      addressPlaceholder: string;
      rpa: string;
    };
    baseAdjustment: {
      title: string;
      tooltip: string;
      currentRent: string;
      currentRentTooltip: string;
      ipcVariation: string;
      ipcVariationTooltip: string;
      baseAdjustment: string;
      baseAdjustmentTooltip: string;
    };
    buildingRevenue: {
      title: string;
      tooltip: string;
      dwellings: string;
      nonResidential: string;
      number: string;
      monthlyRent: string;
      rented: string;
      rentedTooltip: string;
      vacant: string;
      vacantTooltip: string;
      occupiedByOwner: string;
      occupiedByOwnerTooltip: string;
      nonResidentialTooltip: string;
      subtotal: string;
      totalAnnualRent: string;
      totalAnnualRentTooltip: string;
      otherRevenue: string;
      otherRevenueTooltip: string;
    };
  };
  
  // Step 2
  step2: {
    title: string;
    tooltip: string;
    important: string;
    importantNote: string;
    municipalTaxes: string;
    municipalTaxesTooltip: string;
    year2026: string;
    year2025: string;
    year2024: string;
    year2025_2026: string;
    year2024_2025: string;
    asOfDec31: string;
    monthlyAdjustment: string;
    monthlyAdjustmentTooltip: string;
    schoolTaxes: string;
    schoolTaxesTooltip: string;
    insurance: string;
    insuranceTooltip: string;
    totalAdjustment: string;
    totalAdjustmentTooltip: string;
  };
  
  // Step 3
  step3: {
    title: string;
    tooltip: string;
    howItWorks: string;
    howItWorksNote: string;
    noRepairs: string;
    addRepair: string;
    addLine: string;
    line: string;
    nature: string;
    naturePlaceholder: string;
    expense: string;
    expenseTooltip: string;
    financialAid: string;
    financialAidTooltip: string;
    thirdPartyCompensation: string;
    thirdPartyCompensationTooltip: string;
    retainedExpense: string;
    reducedInterestLoan: string;
    annualPayment: string;
    nbDwellings: string;
    nbNonResidential: string;
    concernedDwelling: string;
    adjustment: string;
    maxLines: string;
    totalAdjustment: string;
    totalAdjustmentTooltip: string;
  };
  
  // Step 4
  step4: {
    newExpenses: {
      title: string;
      tooltip: string;
      note: string;
      noteText: string;
      noExpenses: string;
      addExpense: string;
      addLine: string;
      expense: string;
      expenseTooltip: string;
      nature: string;
      naturePlaceholder: string;
      financialAidTooltip: string;
      subtotal: string;
    };
    aidVariation: {
      title: string;
      tooltip: string;
      important: string;
      importantNote: string;
      noVariations: string;
      addVariation: string;
      addLine: string;
      aidNature: string;
      amount2025: string;
      amount2024: string;
      variation: string;
      subtotal: string;
    };
    totalSection4: string;
    totalSection4Tooltip: string;
  };
  
  // Step 5
  step5: {
    snowRemoval: {
      title: string;
      tooltip: string;
      note: string;
      noteText: string;
      fees2025: string;
      fees2024: string;
      monthlyAdjustment: string;
    };
    summary: {
      title: string;
      section: string;
      description: string;
      monthlyAdjustment: string;
      baseAdjustment: string;
      taxesAndInsurance: string;
      majorRepairs: string;
    newExpenses: string;
    aidVariations: string;
    snowRemoval: string;
    totalAdjustments: string;
    };
    result: {
      title: string;
      currentRent: string;
      newRent: string;
      variation: string;
      concernedDwelling: string;
    };
    legalNotice: {
      title: string;
      text: string;
    };
    actions: {
      exportPDF: string;
      restart: string;
      confirmReset: string;
      confirmResetText: string;
      cancel: string;
      eraseAndRestart: string;
    };
  };
  
  // Common
  common: {
    previous: string;
    next: string;
    required: string;
    delete: string;
    completePreviousSteps: string;
  };
  
  // PDF
  pdf: {
    title: string;
    subtitle: string;
    concernedDwelling: string;
    summary: string;
    totalAdjustments: string;
    result: string;
    currentRent: string;
    newRent: string;
    variation: string;
    legalNotice: string;
    generatedOn: string;
    by: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    app: {
      title: 'Calculation Tool 2026',
      subtitle: 'Administrative Housing Tribunal — CORPIQ',
      loading: 'Loading...',
      autoSave: 'Auto-save',
      footer: `© ${new Date().getFullYear()} CORPIQ - Corporation des propriétaires immobiliers du Québec`,
      footerRights: 'All rights reserved',
      footerContact: 'Contact CORPIQ for more information',
    },
    steps: {
      step1: {
        title: 'Information and base adjustment',
        description: 'Dwelling, rent and revenue from the building',
      },
      step2: {
        title: 'Taxes and insurance',
        description: 'Municipal taxes, school taxes and building insurance',
      },
      step3: {
        title: 'Major repairs',
        description: 'Major repairs or improvements',
      },
      step4: {
        title: 'Expenses and financial aid',
        description: 'New expenses and financial aid variations',
      },
      step5: {
        title: 'Snow removal',
        description: 'Snow removal fees (mobile homes)',
      },
      step6: {
        title: 'Summary',
        description: 'Final result and PDF export',
      },
    },
    step1: {
      housingInfo: {
        title: 'Information on the concerned dwelling',
        tooltip: 'Information about the dwelling for which you are calculating the rent increase',
        address: 'Address of the concerned dwelling',
        addressPlaceholder: 'Ex: 123 Main Street, Montreal, QC H1A 2B3',
        rpa: 'This building is in whole or in part a private residence for seniors (RPA) or another accommodation facility offering services to seniors',
      },
      baseAdjustment: {
        title: 'Base rent adjustment',
        tooltip: 'The base adjustment is calculated according to the annual average variation of the CPI for Quebec',
        currentRent: 'Monthly rent of the dwelling',
        currentRentTooltip: 'The current monthly rent, before any increase',
        ipcVariation: 'Annual average variation of the Consumer Price Index (CPI) for Quebec',
        ipcVariationTooltip: 'Rate set by the TAL for 2026 based on the average CPI of the last 3 years',
        baseAdjustment: 'Base monthly rent adjustment',
        baseAdjustmentTooltip: 'Rent × CPI Rate',
      },
      buildingRevenue: {
        title: 'Revenue from the building',
        tooltip: 'Rents from all dwellings and units in the building. This data is used to calculate the weight of the concerned dwelling.',
        dwellings: 'Dwellings',
        nonResidential: 'Non-residential units',
        number: 'Number',
        monthlyRent: 'Monthly rents (total)',
        rented: 'Rented',
        rentedTooltip: 'Enter the total amount of rents payable for the month of December 2025.',
        vacant: 'Vacant',
        vacantTooltip: 'Enter the total amount of rents for vacant dwellings in December 2025. This amount must be estimated based on the rent typically charged for comparable dwellings or premises.',
        occupiedByOwner: 'Occupied by the lessor',
        occupiedByOwnerTooltip: 'A unit occupied by the lessor\'s family, by an employee, or used for the operation of the building is classified under "Occupied by the lessor".\nEnter the total amount of rents for dwellings occupied by the lessor in December 2025, estimated based on the rent typically paid for comparable dwellings or premises.',
        nonResidentialTooltip: 'These are premises used for commercial, professional, industrial, or artisanal purposes. If the building includes such premises, enter the total rents for December 2025, including, if applicable, an estimate of the normal rent for unrented premises.',
        subtotal: 'Subtotal',
        totalAnnualRent: 'Total rents on an annual basis',
        totalAnnualRentTooltip: '(Total dwelling rents + units) × 12 months',
        otherRevenue: 'Other revenue from the operation of the building',
        otherRevenueTooltip: 'Enter the annual amount of revenue other than that regularly received from the tenants of your building, excluding revenue from the operation of a non-residential dwelling. This revenue may come from services billed on a per-use basis (laundry, electric vehicle charging stations, etc.) or from amounts received from non-tenants, for example, the rental of a parking space.',
      },
    },
    step2: {
      title: 'Taxes and insurance of the building',
      tooltip: 'Only the increase exceeding inflation (3.1%) is passed on to the rent',
      important: 'Important:',
      importantNote: 'Only the portion of the increase that exceeds inflation ({rate}%) is taken into account in the adjustment calculation. If your taxes or insurance decrease, the reduction is fully passed on.',
      municipalTaxes: 'Municipal taxes',
      municipalTaxesTooltip: 'Enter the amount of municipal and school taxes billed for the building for each of the indicated years to obtain the variation between the two amounts.\n\nIf your municipal tax bills are not available at the time of calculation, please contact your municipality to check if it is possible to obtain the tax rate to estimate the amount of your taxes. Otherwise, you will need to wait until they are available for an exact calculation.\n\nPlease note that there will only be a positive adjustment related to taxes if the increase exceeds the applicable base percentage for the rent.',
      year2026: 'Year 2026',
      year2025: 'Year 2025',
      year2024: 'Year 2024',
      year2025_2026: 'Year 2025-2026',
      year2024_2025: 'Year 2024-2025',
      asOfDec31: 'As of December 31',
      monthlyAdjustment: 'Monthly adjustment',
      monthlyAdjustmentTooltip: 'Monthly adjustment calculated according to the TAL formula',
      schoolTaxes: 'School taxes',
      schoolTaxesTooltip: 'Enter the amount of municipal and school taxes billed for the building for each of the indicated years to obtain the variation between the two amounts.\n\nIf your municipal tax bills are not available at the time of calculation, please contact your municipality to check if it is possible to obtain the tax rate to estimate the amount of your taxes. Otherwise, you will need to wait until they are available for an exact calculation.\n\nPlease note that there will only be a positive adjustment related to taxes if the increase exceeds the applicable base percentage for the rent.',
      insurance: 'Insurance',
      insuranceTooltip: 'For building insurance premiums (fire insurance and liability), enter the amounts billed for the policy in effect on December 31, 2025 and for the one in effect on December 31, 2024 to obtain the variation between the two amounts.\n\nTo obtain information regarding the fire insurance and liability portion of your insurance policy, please contact your insurance company. If you are unable to obtain this information, enter the total amounts on your invoices. In case of rent fixing, the clerk may at their discretion adjust the amounts under section 15 of the Regulation respecting the criteria for the fixing of rent.\n\nThe calculation takes into account the proportion of rent in the building\'s revenue.\n\nThe variation in taxes and insurance is already integrated into the Consumer Price Index used to establish the base percentage of the rent. The draft regulation therefore provides an adjustment to avoid counting this variation twice.\n\nThus, please note that there will only be a positive adjustment related to insurance if the increase exceeds the applicable base percentage for the rent.',
      totalAdjustment: 'Adjustment for taxes and insurance',
      totalAdjustmentTooltip: 'Sum of the three adjustments above',
    },
    step3: {
      title: 'Major repairs or improvements',
      tooltip: 'Major repairs or improvements give rise to capital expenditures, which are not part of the recurring expenses you regularly assume for the building. These may include work to repair or modify the main structural elements of the building (e.g., roof, plumbing, heating system, insulation, windows, exterior cladding, foundation, French drain, electrical panel) or renovation work (e.g., replacement of cabinets, countertops, plumbing, ceramic, or flooring) in dwellings or common areas.\n\nAnnex I of the Regulation amending the Regulation respecting the criteria for the fixing of rent also provides a list of expenses related to major repairs and improvements.',
      howItWorks: 'How it works:',
      howItWorksNote: 'Expenses are divided by 20 years, then distributed proportionally among the concerned dwellings/units according to their rent. Only the share attributable to the dwelling for which you are calculating the increase is counted.',
      noRepairs: 'No major repair or improvement added.',
      addRepair: 'Add a repair',
      addLine: 'Add a line',
      line: 'Line',
      nature: 'Nature of the expense',
      naturePlaceholder: 'Ex: Roof repair',
      expense: 'Expense ($)',
      expenseTooltip: 'Enter all expenses incurred between January 1 and December 31, 2025.',
      financialAid: 'Financial aid',
      financialAidTooltip: 'Enter the amount of any aid, received or to be received, granted in connection with the expense by a ministry or body of the Government of Quebec or the Government of Canada, by a municipality, or by a public utility.',
      thirdPartyCompensation: 'Third-party compensation',
      thirdPartyCompensationTooltip: 'If compensation is paid or is to be paid by a third party in respect of the expense, please indicate the amount.',
      retainedExpense: 'Retained expense',
      reducedInterestLoan: 'Reduced interest loan amount',
      annualPayment: 'Annual payment',
      nbDwellings: 'Number of concerned dwellings',
      nbNonResidential: 'Number of concerned non-res. units',
      concernedDwelling: 'Is the dwelling concerned?',
      adjustment: 'Adjustment:',
      maxLines: 'Maximum of 30 lines reached.',
      totalAdjustment: 'Adjustment for major repairs or improvements',
      totalAdjustmentTooltip: 'Sum of adjustments for all repairs where the dwelling is concerned',
    },
    step4: {
      newExpenses: {
        title: 'New expenses arising from the implementation of a service or the addition of an accessory or dependency',
        tooltip: 'In addition to capital expenditures, you may have to assume new expenses following the implementation of a service, an accessory, or a dependency. This is the case, for example, when the implementation of a service causes operating expenses that you did not previously have to assume, or when you need to pay staff to offer a new service to tenants. You must estimate the cost of these new expenses for a full year.',
        note: 'Note:',
        noteText: 'Unlike major repairs, new expenses are not amortized over 20 years. They are divided by 12 months and distributed according to the weight of the dwelling.',
        noExpenses: 'No new expense added.',
        addExpense: 'Add a new expense',
        addLine: 'Add a line',
        expense: 'Expense ($)',
        expenseTooltip: 'Please enter the expense for a full year from January 1, 2025 to December 31, 2025.',
        nature: 'Nature of the expense (reduction or addition)',
        naturePlaceholder: 'Ex: Parking',
        financialAidTooltip: 'Enter the amount of any aid, received or to be received, granted in connection with the expense by a ministry or body of the Government of Quebec or the Government of Canada, by a municipality, or by a public utility.',
        subtotal: 'Subtotal of new expenses',
      },
      aidVariation: {
        title: 'Variation or end of aid received for the implementation of a service or the addition of an accessory or dependency',
        tooltip: 'If financial aid for expenses, other than capital expenditures, arising from the implementation of a service or the addition of an accessory or a dependency was paid to you beyond the 12 consecutive months preceding the reference period, please indicate the amount paid to you during the reference period and that paid to you during the previous period.',
        important: 'Important:',
        importantNote: 'A decrease in financial aid (amount 2025 < amount 2024) results in an increase in rent. The sign is automatically reversed in the calculation.',
        noVariations: 'No aid variation added.',
        addVariation: 'Add an aid variation',
        addLine: 'Add a line',
        aidNature: 'Nature of the financial aid',
        amount2025: 'Amount received (year 2025)',
        amount2024: 'Amount received (year 2024)',
        variation: 'Variation',
        subtotal: 'Adjustment for variations and end of financial aid',
      },
      totalSection4: 'Total sections 4 and 5',
      totalSection4Tooltip: 'Sum of new expenses and financial aid variations',
    },
    step5: {
      snowRemoval: {
        title: 'Snow removal fees (mobile home parks)',
        tooltip: 'Only fill in this section if it is a mobile home park.',
        note: 'This section only applies to mobile home parks. If you are not in this case, leave these fields at zero.',
        noteText: '',
        fees2025: 'Fees 2025',
        fees2024: 'Fees 2024',
        monthlyAdjustment: 'Monthly adjustment',
      },
      summary: {
        title: 'Adjustment of the rent of the concerned dwelling',
        section: 'Section',
        description: 'Description',
        monthlyAdjustment: 'Monthly adjustment',
        baseAdjustment: 'Base rent adjustment (CPI {rate}%)',
        taxesAndInsurance: 'Taxes and insurance of the building',
        majorRepairs: 'Major repairs or improvements',
        newExpenses: 'New expenses arising from the implementation of a service or the addition of an accessory or dependency',
        aidVariations: 'Variation or end of aid received for the implementation of a service or the addition of an accessory or dependency',
        snowRemoval: 'Snow removal fees (mobile home parks)',
        totalAdjustments: 'TOTAL ADJUSTMENTS',
      },
      result: {
        title: 'Calculation result',
        currentRent: 'Current rent',
        newRent: 'Recommended new rent',
        variation: 'Variation',
        concernedDwelling: 'Concerned dwelling:',
      },
      legalNotice: {
        title: 'Important notice:',
        text: 'This calculator is provided for informational purposes only and reproduces the methodology of the Administrative Housing Tribunal (TAL). The result obtained does not constitute a TAL decision and does not bind the parties. In case of disagreement, only the TAL can set the rent in a binding manner.',
      },
      actions: {
        exportPDF: 'Export to PDF',
        restart: 'Restart',
        confirmReset: 'Confirm reset',
        confirmResetText: 'Are you sure you want to erase all data and start a new calculation? This action is irreversible.',
        cancel: 'Cancel',
        eraseAndRestart: 'Erase and restart',
      },
    },
    common: {
      previous: 'Previous',
      next: 'Next',
      required: '*',
      delete: 'Delete',
      completePreviousSteps: 'Complete previous steps first',
    },
    pdf: {
      title: 'Calculation Tool 2026',
      subtitle: 'CORPIQ - Corporation des propriétaires immobiliers du Québec',
      concernedDwelling: 'Concerned dwelling:',
      summary: 'SUMMARY OF ADJUSTMENTS',
      totalAdjustments: 'TOTAL ADJUSTMENTS',
      result: 'CALCULATION RESULT',
      currentRent: 'Current monthly rent:',
      newRent: 'Recommended new monthly rent:',
      variation: 'Variation:',
      legalNotice: 'IMPORTANT NOTICE',
      generatedOn: 'Document generated on',
      by: 'by the CORPIQ Calculator 2026',
    },
  },
  fr: {
    app: {
      title: 'Outil de calcul 2026',
      subtitle: 'Tribunal administratif du logement — CORPIQ',
      loading: 'Chargement...',
      autoSave: 'Sauvegarde automatique',
      footer: `© ${new Date().getFullYear()} CORPIQ - Corporation des propriétaires immobiliers du Québec`,
      footerRights: 'Tous droits réservés',
      footerContact: 'Contactez la CORPIQ pour plus d\'informations',
    },
    steps: {
      step1: {
        title: 'Renseignements et ajustement de base',
        description: 'Logement, loyer et revenus de l\'immeuble',
      },
      step2: {
        title: 'Taxes et assurances',
        description: 'Taxes municipales, scolaires et assurances de l\'immeuble',
      },
      step3: {
        title: 'Réparations majeures',
        description: 'Réparations ou améliorations majeures',
      },
      step4: {
        title: 'Dépenses et aide financière',
        description: 'Nouvelles dépenses et variations d\'aide financière',
      },
      step5: {
        title: 'Déneigement',
        description: 'Frais de déneigement (maisons mobiles)',
      },
      step6: {
        title: 'Récapitulatif',
        description: 'Résultat final et export PDF',
      },
    },
    step1: {
      housingInfo: {
        title: 'Renseignements sur le logement concerné',
        tooltip: 'Informations sur le logement pour lequel vous calculez l\'augmentation de loyer',
        address: 'Adresse du logement concerné',
        addressPlaceholder: 'Ex: 123, rue Principale, Montréal, QC H1A 2B3',
        rpa: 'Cet immeuble est en tout ou en partie une résidence privée pour aînés (RPA) ou un autre lieu d\'hébergement offrant des services aux aînés',
      },
      baseAdjustment: {
        title: 'Ajustement de base du loyer',
        tooltip: 'L\'ajustement de base est calculé selon la variation annuelle moyenne de l\'IPC pour le Québec',
        currentRent: 'Loyer mensuel du logement',
        currentRentTooltip: 'Le loyer mensuel actuel, avant toute augmentation',
        ipcVariation: 'Variation annuelle moyenne de l\'indice des prix à la consommation (IPC) pour le Québec',
        ipcVariationTooltip: 'Taux fixé par le TAL pour 2026 basé sur la moyenne de l\'IPC des 3 dernières années',
        baseAdjustment: 'Ajustement de base du loyer mensuel',
        baseAdjustmentTooltip: 'Loyer × Taux IPC',
      },
      buildingRevenue: {
        title: 'Revenus de l\'immeuble',
        tooltip: 'Loyers de tous les logements et locaux de l\'immeuble. Ces données servent à calculer le poids du logement concerné.',
        dwellings: 'Logements',
        nonResidential: 'Locaux non résidentiels',
        number: 'Nombre',
        monthlyRent: 'Loyers mensuels (totaux)',
        rented: 'Loués',
        rentedTooltip: 'Loués : Indiquez le montant total des loyers exigibles pour le mois de décembre 2025.',
        vacant: 'Inoccupés',
        vacantTooltip: 'Inoccupés : Indiquez le montant total des loyers des logements vacants en décembre 2025. Ce montant doit être estimé en fonction du loyer habituellement demandé pour des logements ou locaux comparables',
        occupiedByOwner: 'Occupés par le locateur ou la locatrice',
        occupiedByOwnerTooltip: 'Occupés par le locateur : Un local occupé par la famille du locateur, par un employé ou utilisé pour l\'exploitation de l\'immeuble est classé dans la catégorie « Occupés par le locateur ».\nIndiquez le montant total des loyers correspondant aux logements occupés par le locateur en décembre 2025, en l\'évaluant selon le loyer habituellement payé pour des logements ou locaux comparables.',
        nonResidentialTooltip: 'Locaux non résidentiels : Il s\'agit de locaux utilisés à des fins commerciales, professionnelles, industrielles ou artisanales. Si l\'immeuble en comprend, indiquez le total des loyers du mois de décembre 2025, en incluant, si applicable, une estimation du loyer normal pour les locaux non loués.',
        subtotal: 'Sous-total',
        totalAnnualRent: 'Total des loyers sur une base annuelle',
        totalAnnualRentTooltip: '(Total loyers logements + locaux) × 12 mois',
        otherRevenue: 'Autres revenus provenant de l\'exploitation de l\'immeuble',
        otherRevenueTooltip: 'Occupés par le locateur :Indiquez le montant annuel des revenus autres que ceux perçus de façon régulière auprès des locataires de votre immeuble, à l\'exclusion des revenus d\'exploitation d\'un logement non résidentiel. Ces revenus peuvent notamment provenir de services facturés à l\'utilisation (buanderie, bornes de recharge électrique, etc.) ou de sommes perçues auprès de personnes non locataires, par exemple la location d\'un espace de stationnement.',
      },
    },
    step2: {
      title: 'Taxes et assurances de l\'immeuble',
      tooltip: 'Seule l\'augmentation excédant l\'inflation (3,1%) est répercutée sur le loyer',
      important: 'Important:',
      importantNote: 'Seule la portion de l\'augmentation qui dépasse l\'inflation ({rate}%) est prise en compte dans le calcul de l\'ajustement. Si vos taxes ou assurances diminuent, la réduction est entièrement répercutée.',
      municipalTaxes: 'Taxes municipales',
      municipalTaxesTooltip: 'Inscrire le montant des taxes municipales et scolaires facturées pour l\'immeuble pour chacune des années indiquées pour obtenir la variation entre les deux montants.\n\nSi vos comptes de taxes municipales ne sont pas disponibles au moment du calcul, veuillez communiquer avec votre municipalité afin de vérifier s\'il est possible d\'obtenir le taux de taxation pour estimer le montant de vos taxes. À défaut, vous devrez attendre qu\'ils soient disponibles afin d\'avoir un calcul exact.\n\nPrenez note qu\'il y aura uniquement un ajustement positif en lien avec les taxes si l\'augmentation excède le pourcentage applicable de base pour le loyer.',
      year2026: 'Année 2026',
      year2025: 'Année 2025',
      year2024: 'Année 2024',
      year2025_2026: 'Année 2025-2026',
      year2024_2025: 'Année 2024-2025',
      asOfDec31: 'Au 31 décembre',
      monthlyAdjustment: 'Ajustement mensuel',
      monthlyAdjustmentTooltip: 'Ajustement mensuel calculé selon la formule du TAL',
      schoolTaxes: 'Taxes scolaires',
      schoolTaxesTooltip: 'Inscrire le montant des taxes municipales et scolaires facturées pour l\'immeuble pour chacune des années indiquées pour obtenir la variation entre les deux montants.\n\nSi vos comptes de taxes municipales ne sont pas disponibles au moment du calcul, veuillez communiquer avec votre municipalité afin de vérifier s\'il est possible d\'obtenir le taux de taxation pour estimer le montant de vos taxes. À défaut, vous devrez attendre qu\'ils soient disponibles afin d\'avoir un calcul exact.\n\nPrenez note qu\'il y aura uniquement un ajustement positif en lien avec les taxes si l\'augmentation excède le pourcentage applicable de base pour le loyer.',
      insurance: 'Assurances',
      insuranceTooltip: 'Dans le cas des primes d\'assurance de l\'immeuble (assurance-incendie et responsabilité), indiquez les montants facturés pour la police en vigueur au 31 décembre 2025 et pour celle en vigueur au 31 décembre 2024 pour obtenir la variation entre les deux montants.\n\nPour obtenir l\'information concernant la portion assurance-incendie et responsabilité de votre police d\'assurance, veuillez contacter votre compagnie d\'assurance. Si vous êtes dans l\'impossibilité d\'obtenir ces informations, mettez les montants totaux sur vos factures. En cas de fixation de loyer, le greffier pourra à sa discrétion ajuster les montants en vertu de l\'article 15 du Règlement sur les critères de fixation de loyers.\n\nLe calcul prend en considération la proportion du loyer dans les revenus de l\'immeuble.\n\nLa variation des taxes et des assurances est déjà intégrée à l\'Indice des prix à la consommation utilisé pour établir le pourcentage de base du loyer. Le projet de règlement prévoit donc un ajustement afin d\'éviter que cette variation soit prise en compte en double.\n\nAinsi, prenez note qu\'il y aura uniquement un ajustement positif en lien avec les assurances si l\'augmentation excède le pourcentage applicable de base pour le loyer.',
      totalAdjustment: 'Ajustement pour les taxes et les assurances',
      totalAdjustmentTooltip: 'Somme des trois ajustements ci-dessus',
    },
    step3: {
      title: 'Réparations ou améliorations majeures',
      tooltip: 'Les réparations ou améliorations majeures donnent lieu à des dépenses d\'immobilisation, qui ne font pas partie des dépenses récurrentes que vous assumez régulièrement pour l\'immeuble. Il peut s\'agir de travaux visant à réparer ou modifier les principaux éléments de la structure de l\'immeuble (p. ex. : toit, tuyauterie, système de chauffage, isolation, fenestration, revêtement extérieur, fondation, drain français, panneau électrique) ou de travaux de rénovation (p. ex. : remplacement des armoires, comptoirs, de la plomberie, de la céramique ou du plancher) dans les logements ou les espaces communs.\n\nL\'annexe I du Règlement modifiant le Règlement sur les critères de fixation de loyer prévoit également une liste de dépenses rattachées aux réparations et améliorations majeures.\n\n« 1. Travaux de maintien de l\'intégrité physique du bâtiment :\n\n1° Structure et fondations :\na) Réparation ou renforcement des fondations relativement, entre autres, à des fissures ou à des affaissements;\nb) Réfection ou renforcement de la charpente relativement, entre autres, à des poutres, à des colonnes ou à des murs porteurs;\n\n2° Toiture et enveloppe extérieure :\na) Réfection de la toiture comprenant, entre autres, le remplacement du bardeau, de la membrane ou de l\'isolation de l\'entretoit;\nb) Réparation ou remplacement du revêtement extérieur;\nc) Réfection des balcons, des escaliers ou des garde-corps;\nd) Réparation des corniches, des solins ou des gouttières;\n\n3° Maçonnerie :\na) Rejointement des briques;\nb) Réparation des fissures et délamination;\n\n4° Menuiseries extérieures :\na) Remplacement ou réparation majeure des portes ou des fenêtres détériorées;\nb) Réparation majeure des cadres ou des seuils;\n\n5° Drainage et fondations :\na) Remplacement ou installation de drains français;\nb) Étanchéisation des fondations;\n\n6° Mise à niveau des systèmes de sécurité, entre autres des gicleurs, des détecteurs de fumée, des extincteurs ou des escaliers de secours.\n\n2. Travaux d\'amélioration ou de modernisation :\n\n1° Cuisine et salle de bain :\na) Rénovation majeure, entre autres le remplacement des armoires, des comptoirs, de la plomberie ou de la céramique;\nb) Mise aux normes de la plomberie;\n\n2° Revêtements intérieurs :\na) Réfection ou remplacement des planchers;\nb) Réfection ou peinture des murs ou des plafonds;\n\n3° Électricité :\na) Ajout de prises électriques ou d\'éclairage encastré;\nb) Remplacement ou ajout de panneaux électriques;\nc) Mise aux normes des installations électriques;\n\n4° Ajout ou amélioration de l\'insonorisation entre unités;\n\n5° Agréments modernes :\na) Installation de buanderies privées ou partagées;\nb) Ajout de rangements, entre autres des casiers au sous-sol, ou des cabanons;\nc) Réfection des espaces communs, notamment le hall d\'entrée ou les escaliers.\n\n3. Travaux à impact énergétique, efficacité énergétique et adaptation aux changements climatiques :\n\n1° Ajout d\'isolant dans les murs, la toiture ou les planchers;\n\n2° Remplacement ou amélioration du système de chauffage ou de climatisation;\n\n3° Énergie renouvelable :\na) Installation de panneaux solaires photovoltaïques ou thermiques;\nb) Installation de bornes de recharge de véhicules électriques;\n\n4° Adaptation aux changements climatiques :\na) Aménagements pour prévenir les inondations, entre autres un système de pompage ou des clapets antiretour;\nb) Végétalisation, entre autres l\'aménagement de toits verts ou la plantation d\'arbres dans le but de réduire les îlots de chaleur;\nc) Réfection des aires imperméabilisées, notamment le pavage. »',
      howItWorks: 'Comment ça fonctionne:',
      howItWorksNote: 'Les dépenses sont divisées par 20 ans, puis réparties proportionnellement entre les logements/locaux concernés selon leur loyer. Seule la part attribuable au logement pour lequel vous calculez l\'augmentation est comptée.',
      noRepairs: 'Aucune réparation ou amélioration majeure ajoutée.',
      addRepair: 'Ajouter une réparation',
      addLine: 'Ajouter une ligne',
      line: 'Ligne',
      nature: 'Nature de la dépense',
      naturePlaceholder: 'Ex: Réfection toiture',
      expense: 'Dépense ($)',
      expenseTooltip: 'Inscrivez toutes les dépenses engagées entre le 1er janvier et le 31 décembre 2025.',
      financialAid: 'Aide financière',
      financialAidTooltip: 'Indiquez le montant de toute aide, reçue ou à recevoir, accordée en lien avec la dépense par un ministère ou un organisme du gouvernement du Québec ou du gouvernement du Canada, par une municipalité ou par une entreprise d\'utilité publique.',
      thirdPartyCompensation: 'Indemnité versée par un tiers',
      thirdPartyCompensationTooltip: 'Si une indemnité est versée ou doit l\'être par un tiers à l\'égard de la dépense, veuillez en indiquer le montant.',
      retainedExpense: 'Dépense retenue',
      reducedInterestLoan: 'Montant du prêt à intérêt réduit',
      annualPayment: 'Versement annuel',
      nbDwellings: 'Nombre de logements concernés',
      nbNonResidential: 'Nombre de locaux non résidentiels concernés',
      concernedDwelling: 'Le logement est-il concerné?',
      adjustment: 'Ajustement:',
      maxLines: 'Maximum de 30 lignes atteint.',
      totalAdjustment: 'Ajustement pour les réparations ou améliorations majeures',
      totalAdjustmentTooltip: 'Somme des ajustements pour toutes les réparations où le logement est concerné',
    },
    step4: {
      newExpenses: {
        title: 'Nouvelles dépenses découlant de la mise en place d\'un service ou de l\'ajout d\'un accessoire ou d\'une dépendance',
        tooltip: 'En plus des dépenses d\'immobilisation, il est possible que vous ayez à assumer de nouvelles dépenses à la suite de la mise en place d\'un service, d\'un accessoire ou d\'une dépendance. C\'est le cas, par exemple, lorsque la mise en place d\'un service occasionne des dépenses de fonctionnement que vous n\'aviez pas à assumer précédemment, ou encore lorsque vous devez rémunérer du personnel pour offrir un nouveau service aux locataires. Vous devez estimer le coût de ces nouvelles dépenses pour une année complète.',
        note: 'Note:',
        noteText: 'Contrairement aux réparations majeures, les nouvelles dépenses ne sont pas amorties sur 20 ans. Elles sont divisées par 12 mois et réparties selon le poids du logement.',
        noExpenses: 'Aucune nouvelle dépense ajoutée.',
        addExpense: 'Ajouter une nouvelle dépense',
        addLine: 'Ajouter une ligne',
        expense: 'Dépense ($)',
        expenseTooltip: 'Veuillez inscrire la dépense pour une année complète du 1er janvier 2025 au 31 décembre 2025.',
        nature: 'Nature de la dépense (réduction ou ajout)',
        naturePlaceholder: 'Ex: Stationnement',
        financialAidTooltip: 'Indiquez le montant de toute aide, reçue ou à recevoir, accordée en lien avec la dépense par un ministère ou un organisme du gouvernement du Québec ou du gouvernement du Canada, par une municipalité ou par une entreprise d\'utilité publique.',
        subtotal: 'Sous-total des nouvelles dépenses',
      },
      aidVariation: {
        title: 'Variation ou fin d\'une aide reçue pour la mise en place d\'un service ou l\'ajout d\'un accessoire ou d\'une dépendance',
        tooltip: 'Si une aide financière pour des dépenses, autre que des dépenses d\'immobilisation, découlant de la mise en place d\'un service ou l\'ajout d\'un accessoire ou d\'une dépendance vous a été versée au-delà de la période de 12 mois consécutifs qui précède la période de référence, veuillez indiquer le montant qui vous a été versé au cours de la période de référence et celui qui vous a été versé au cours de la période précédente.',
        important: 'Important:',
        importantNote: 'Une diminution de l\'aide financière (montant 2025 < montant 2024) entraîne une augmentation du loyer. Le signe est inversé automatiquement dans le calcul.',
        noVariations: 'Aucune variation d\'aide ajoutée.',
        addVariation: 'Ajouter une variation d\'aide',
        addLine: 'Ajouter une ligne',
        aidNature: 'Nature de l\'aide financière',
        amount2025: 'Montant reçu (année 2025)',
        amount2024: 'Montant reçu (année 2024)',
        variation: 'Variation',
        subtotal: 'Ajustement pour les variations et les fins d\'aide financière',
      },
      totalSection4: 'Total des sections 4 et 5',
      totalSection4Tooltip: 'Somme des nouvelles dépenses et des variations d\'aide financière',
    },
    step5: {
      snowRemoval: {
        title: 'Frais de déneigement (parc de maisons mobiles)',
        tooltip: 'Ne remplissez cette section que s\'il s\'agit d\'un parc de maisons mobiles.',
        note: 'Cette section s\'applique uniquement aux parcs de maisons mobiles. Si vous n\'êtes pas dans ce cas, laissez ces champs à zéro.',
        noteText: '',
        fees2025: 'Frais 2025',
        fees2024: 'Frais 2024',
        monthlyAdjustment: 'Ajustement mensuel',
      },
      summary: {
        title: 'Ajustement du loyer du logement concerné',
        section: 'Section',
        description: 'Description',
        monthlyAdjustment: 'Ajustement mensuel',
        baseAdjustment: 'Ajustement de base du loyer (IPC {rate}%)',
        taxesAndInsurance: 'Taxes et assurances de l\'immeuble',
        majorRepairs: 'Réparations ou améliorations majeures',
        newExpenses: 'Nouvelles dépenses découlant de la mise en place d\'un service ou de l\'ajout d\'un accessoire ou d\'une dépendance',
        aidVariations: 'Variation ou fin d\'une aide reçue pour la mise en place d\'un service ou l\'ajout d\'un accessoire ou d\'une dépendance',
        snowRemoval: 'Frais de déneigement (parc de maisons mobiles)',
        totalAdjustments: 'TOTAL DES AJUSTEMENTS',
      },
      result: {
        title: 'Résultat du calcul',
        currentRent: 'Loyer actuel',
        newRent: 'Nouveau loyer recommandé',
        variation: 'Variation',
        concernedDwelling: 'Logement concerné:',
      },
      legalNotice: {
        title: 'Avis important:',
        text: 'Ce calculateur est fourni à titre indicatif seulement et reproduit la méthodologie du Tribunal administratif du logement (TAL). Le résultat obtenu ne constitue pas une décision du TAL et ne lie pas les parties. En cas de désaccord, seul le TAL peut fixer le loyer de manière obligatoire.',
      },
      actions: {
        exportPDF: 'Exporter en PDF',
        restart: 'Recommencer',
        confirmReset: 'Confirmer la réinitialisation',
        confirmResetText: 'Êtes-vous sûr de vouloir effacer toutes les données et recommencer un nouveau calcul? Cette action est irréversible.',
        cancel: 'Annuler',
        eraseAndRestart: 'Effacer et recommencer',
      },
    },
    common: {
      previous: 'Précédent',
      next: 'Suivant',
      required: '*',
      delete: 'Supprimer',
      completePreviousSteps: 'Complétez les étapes précédentes d\'abord',
    },
    pdf: {
      title: 'Outil de calcul 2026',
      subtitle: 'CORPIQ - Corporation des propriétaires immobiliers du Québec',
      concernedDwelling: 'Logement concerné:',
      summary: 'RÉCAPITULATIF DES AJUSTEMENTS',
      totalAdjustments: 'TOTAL DES AJUSTEMENTS',
      result: 'RÉSULTAT DU CALCUL',
      currentRent: 'Loyer mensuel actuel:',
      newRent: 'Nouveau loyer mensuel recommandé:',
      variation: 'Variation:',
      legalNotice: 'AVIS IMPORTANT',
      generatedOn: 'Document généré le',
      by: 'par le Calculateur CORPIQ 2026',
    },
  },
};
