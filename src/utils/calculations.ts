// Fonctions de calcul pour le calculateur de loyer CORPIQ 2026
import { 
  FormData, 
  CalculatedValues, 
  TAUX_IPC_2026,
  TAUX_SERVICES_AINES_2026,
  TAUX_IMMOBILISATION_TAL,
  LigneReparation,
  LigneNouvelleDepense,
  LigneVariationAide 
} from '../types';

// ROUND_HALF_UP : arrondi commercial (0.5 arrondi vers le haut)
// Gère correctement les problèmes de précision flottante
export const roundHalfUp = (num: number, decimals: number): number => {
  const sign = num >= 0 ? 1 : -1;
  const abs = Math.abs(num);
  const factor = Math.pow(10, decimals);
  // Utiliser toFixed pour éviter les erreurs de précision flottante
  // Ex: 1.005 * 100 = 100.49999... → toFixed corrige
  const shifted = parseFloat((abs * factor).toFixed(8));
  return sign * (Math.floor(shifted + 0.5) / factor);
};

// Arrondir à 2 décimales (ROUND_HALF_UP)
export const round2 = (num: number): number => {
  return roundHalfUp(num, 2);
};

// Formater en devise canadienne
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Parser une valeur monétaire
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  // Enlever les espaces, le symbole $ et remplacer la virgule par un point
  const cleaned = value.replace(/\s/g, '').replace('$', '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Calculer les sous-totaux des revenus
export const calculSousTotaux = (formData: FormData) => {
  const soustotalLogements = {
    nombre: formData.logements.loues.nombre + 
            formData.logements.inoccupes.nombre + 
            formData.logements.occupesLocateur.nombre,
    loyer: formData.logements.loues.loyerMensuel + 
           formData.logements.inoccupes.loyerMensuel + 
           formData.logements.occupesLocateur.loyerMensuel,
  };
  
  const soustotalNonResidentiels = {
    nombre: formData.locauxNonResidentiels.loues.nombre + 
            formData.locauxNonResidentiels.inoccupes.nombre + 
            formData.locauxNonResidentiels.occupesLocateur.nombre,
    loyer: formData.locauxNonResidentiels.loues.loyerMensuel + 
           formData.locauxNonResidentiels.inoccupes.loyerMensuel + 
           formData.locauxNonResidentiels.occupesLocateur.loyerMensuel,
  };
  
  const totalLoyersAnnuel = (soustotalLogements.loyer + soustotalNonResidentiels.loyer) * 12;
  const revenusImmeuble = totalLoyersAnnuel + formData.autresRevenus;
  const poidsLoyer = revenusImmeuble > 0 
    ? (formData.loyerMensuelActuel * 12) / revenusImmeuble 
    : 0;
  
  return {
    soustotalLogements,
    soustotalNonResidentiels,
    totalLoyersAnnuel,
    revenusImmeuble,
    poidsLoyer,
  };
};

// Calcul de l'ajustement de base (IPC) - avec gestion RPA
// CAS 1: Immeuble normal → loyer × IPC
// CAS 2: RPA → (services × 6.7%) + ((loyer - services) × IPC)
export interface AjustementBaseResult {
  ajustementBase: number;
  ajustementServices: number;
  ajustementSansServices: number;
}

export const calculAjustementBase = (
  loyerMensuel: number,
  isRPA: boolean = false,
  partServicesPersonne: number = 0
): AjustementBaseResult => {
  // Protection contre les valeurs undefined/NaN
  const partServices = partServicesPersonne || 0;
  
  if (!isRPA) {
    // CAS 1: Immeuble normal (pas RPA)
    // Formule: loyer × IPC (arrondi une seule fois à la fin)
    const ajustement = loyerMensuel * TAUX_IPC_2026;
    return {
      ajustementBase: round2(ajustement),
      ajustementServices: 0,
      ajustementSansServices: round2(ajustement),
    };
  }
  
  // CAS 2: Résidence privée pour aînés (RPA)
  // Bloc A: Services à la personne × 6.7%
  const ajustementServices = partServices * TAUX_SERVICES_AINES_2026;
  
  // Bloc B: (Loyer - Services) × IPC
  const loyerSansServices = loyerMensuel - partServices;
  const ajustementSansServices = loyerSansServices * TAUX_IPC_2026;
  
  // Total: Pas d'arrondi intermédiaire, arrondi unique à la fin
  const ajustementTotal = ajustementServices + ajustementSansServices;
  
  return {
    ajustementBase: round2(ajustementTotal),
    ajustementServices: round2(ajustementServices), // Pour affichage uniquement
    ajustementSansServices: round2(ajustementSansServices), // Pour affichage uniquement
  };
};

// Calcul ajustement taxes (municipales ou scolaires)
// Retourne une valeur BRUTE (sans arrondi) pour permettre un arrondi unique à la fin
export const calculAjustementTaxesBrut = (
  taxeCourante: number,
  taxePrecedente: number,
  loyerMensuel: number,
  revenusImmeuble: number,
  tauxIPC: number = TAUX_IPC_2026
): number => {
  if (taxePrecedente === 0 || revenusImmeuble === 0) return 0;
  
  const variation = taxeCourante - taxePrecedente;
  const poidsLoyer = (loyerMensuel * 12) / revenusImmeuble;
  
  if (variation < 0) {
    // Si diminution, on la répercute entièrement (pas de franchise)
    return (variation * poidsLoyer) / 12;
  }
  
  // Si augmentation, on soustrait la franchise (IPC)
  const franchise = tauxIPC * taxePrecedente;
  if (variation <= franchise) {
    return 0; // Augmentation couverte par la franchise
  }
  
  // Seulement la partie au-dessus de la franchise
  const variationNette = variation - franchise;
  return (variationNette * poidsLoyer) / 12;
};

// Version avec arrondi pour affichage individuel
export const calculAjustementTaxes = (
  taxeCourante: number,
  taxePrecedente: number,
  loyerMensuel: number,
  revenusImmeuble: number,
  tauxIPC: number = TAUX_IPC_2026
): number => {
  return round2(calculAjustementTaxesBrut(taxeCourante, taxePrecedente, loyerMensuel, revenusImmeuble, tauxIPC));
};

// Calcul ajustement assurances
// Retourne une valeur BRUTE (sans arrondi) pour permettre un arrondi unique à la fin
export const calculAjustementAssurancesBrut = (
  assuranceCourante: number,
  assurancePrecedente: number,
  loyerMensuel: number,
  revenusImmeuble: number,
  tauxIPC: number = TAUX_IPC_2026
): number => {
  if (assurancePrecedente === 0 || revenusImmeuble === 0) return 0;
  
  const variation = assuranceCourante - assurancePrecedente;
  const poidsLoyer = (loyerMensuel * 12) / revenusImmeuble;
  
  if (variation < 0) {
    // Si diminution, pas de franchise
    return (variation * poidsLoyer) / 12;
  }
  
  // Si augmentation, on soustrait la franchise (IPC)
  const franchise = tauxIPC * assurancePrecedente;
  if (variation <= franchise) {
    return 0;
  }
  
  const variationNette = variation - franchise;
  return (variationNette * poidsLoyer) / 12;
};

// Version avec arrondi pour affichage individuel
export const calculAjustementAssurances = (
  assuranceCourante: number,
  assurancePrecedente: number,
  loyerMensuel: number,
  revenusImmeuble: number,
  tauxIPC: number = TAUX_IPC_2026
): number => {
  return round2(calculAjustementAssurancesBrut(assuranceCourante, assurancePrecedente, loyerMensuel, revenusImmeuble, tauxIPC));
};

// Calcul ajustement pour une ligne de réparation (version BRUTE sans arrondi)
// Implémente la logique complète TAL avec prêt à intérêt réduit
export const calculAjustementReparationBrut = (
  ligne: LigneReparation,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  // Si non concerné ou dépense retenue <= 0, retour 0
  if (!ligne.logementConcerne || ligne.depenseRetenue <= 0) return 0;
  
  // 1) Loyer moyen des autres logements résidentiels
  const loyerMoyResAutres = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  // 2) Loyer moyen des locaux non résidentiels
  const loyerMoyNonRes = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  // 3) Base concernée (pondération TAL)
  // Le logement concerné compte via loyerMensuelLogement
  // Les autres logements résidentiels concernés comptent via (nbLogements - 1)
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * loyerMoyResAutres 
    + ligne.nbLocauxNonResidentiels * loyerMoyNonRes;
  
  if (baseConcernee === 0) return 0;
  
  // 4) Poids du logement
  const poids = loyerMensuelLogement / baseConcernee;
  
  // 5) Montant annuel admissible (avec prêt à intérêt réduit)
  const taux = TAUX_IMMOBILISATION_TAL; // 5%
  const pretMontant = ligne.montantPretReduit || 0;
  const versementAnnuel = ligne.versementAnnuel || 0;
  
  // Partie financée par prêt (plafonnée à la dépense retenue)
  const partFinancee = Math.min(pretMontant, ligne.depenseRetenue);
  const partNonFinancee = ligne.depenseRetenue - partFinancee;
  
  // Annuel pour la partie NON financée par prêt
  const annuelNonFinance = taux * partNonFinancee;
  
  // Annuel pour la partie financée par prêt (plafonné au versement réel)
  let annuelFinanceReel = 0;
  if (partFinancee > 0) {
    const annuelFinancePotentiel = taux * partFinancee;
    annuelFinanceReel = Math.min(annuelFinancePotentiel, versementAnnuel);
  }
  
  // Total annuel admissible
  const annuelAdmissible = annuelNonFinance + annuelFinanceReel;
  
  // 6) Ajustement mensuel = (annuel admissible × poids) / 12
  const mensuelLigneBrut = (annuelAdmissible * poids) / 12;
  
  return mensuelLigneBrut;
};

// Version avec arrondi pour affichage individuel
export const calculAjustementReparation = (
  ligne: LigneReparation,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  return round2(calculAjustementReparationBrut(
    ligne, loyerMensuelLogement, soustotalNbLogements, 
    soustotalLoyerLogements, soustotalNbLocaux, soustotalLoyerLocaux
  ));
};

// Calcul ajustement pour une nouvelle dépense (version BRUTE sans arrondi)
// Section 5-1 TAL : mensuel = (depenseRetenue / 12) × poids
export const calculAjustementNouvelleDepenseBrut = (
  ligne: LigneNouvelleDepense,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  // Si non concerné ou dépense retenue <= 0, retour 0
  if (!ligne.logementConcerne || ligne.depenseRetenue <= 0) return 0;
  
  // AA = Loyer moyen des autres logements résidentiels
  const AA = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  // AB = Loyer moyen des locaux non résidentiels
  const AB = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  // Base concernée = loyer + (nbRes-1)×AA + nbNonRes×AB
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * AA 
    + ligne.nbLocauxNonResidentiels * AB;
  
  if (baseConcernee === 0) return 0;
  
  // Poids = loyer / base
  const poids = loyerMensuelLogement / baseConcernee;
  
  // Mensuel brut = (depenseRetenue / 12) × poids
  // Pas d'amortissement sur 20 ans pour les nouvelles dépenses
  const mensuelBrut = (ligne.depenseRetenue / 12) * poids;
  
  return mensuelBrut;
};

// Version avec arrondi pour affichage individuel
export const calculAjustementNouvelleDepense = (
  ligne: LigneNouvelleDepense,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  return round2(calculAjustementNouvelleDepenseBrut(
    ligne, loyerMensuelLogement, soustotalNbLogements,
    soustotalLoyerLogements, soustotalNbLocaux, soustotalLoyerLocaux
  ));
};

// Calcul ajustement pour une variation d'aide (version BRUTE sans arrondi)
// Section 5-2 TAL : mensuel = -(variation / 12) × poids
// Le signe est INVERSÉ car une DIMINUTION de l'aide entraîne une AUGMENTATION pour le locataire
export const calculAjustementVariationAideBrut = (
  ligne: LigneVariationAide,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  if (!ligne.logementConcerne) return 0;
  
  // AA = Loyer moyen des autres logements résidentiels
  const AA = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  // AB = Loyer moyen des locaux non résidentiels
  const AB = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  // Base concernée = loyer + (nbRes-1)×AA + nbNonRes×AB
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * AA 
    + ligne.nbLocauxNonResidentiels * AB;
  
  if (baseConcernee === 0) return 0;
  
  // Poids = loyer / base
  const poids = loyerMensuelLogement / baseConcernee;
  
  // Variation = montant2025 - montant2024 (déjà calculé dans ligne.variation)
  // Mensuel brut = -(variation / 12) × poids
  // Signe inversé : diminution d'aide = augmentation pour locataire
  const mensuelBrut = -(ligne.variation / 12) * poids;
  
  return mensuelBrut;
};

// Version avec arrondi pour affichage individuel
export const calculAjustementVariationAide = (
  ligne: LigneVariationAide,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  return round2(calculAjustementVariationAideBrut(
    ligne, loyerMensuelLogement, soustotalNbLogements,
    soustotalLoyerLogements, soustotalNbLocaux, soustotalLoyerLocaux
  ));
};

// Calcul ajustement déneigement (version BRUTE sans arrondi)
// Section 6 TAL : ajustement = (delta × poidsAnnuel) / 12
export const calculAjustementDeneigementBrut = (
  frais2025: number,
  frais2024: number,
  loyerMensuel: number,
  revenusImmeuble: number
): number => {
  if (revenusImmeuble === 0) return 0;
  
  // Delta = variation annuelle des frais
  const delta = frais2025 - frais2024;
  
  // Poids annuel = (loyer × 12) / revenus annuels totaux
  const poidsAnnuel = (loyerMensuel * 12) / revenusImmeuble;
  
  // Ajustement mensuel brut = (delta × poidsAnnuel) / 12
  const ajustementMensuelBrut = (delta * poidsAnnuel) / 12;
  
  return ajustementMensuelBrut;
};

// Version avec arrondi pour affichage
export const calculAjustementDeneigement = (
  frais2025: number,
  frais2024: number,
  loyerMensuel: number,
  revenusImmeuble: number
): number => {
  return round2(calculAjustementDeneigementBrut(frais2025, frais2024, loyerMensuel, revenusImmeuble));
};

// Calcul complet de toutes les valeurs
export const calculerToutesLesValeurs = (formData: FormData): CalculatedValues => {
  // Sous-totaux
  const sousTotaux = calculSousTotaux(formData);
  
  // Ajustement de base (avec gestion RPA)
  const ajustementBaseResult = calculAjustementBase(
    formData.loyerMensuelActuel,
    formData.isRPA,
    formData.partServicesPersonne
  );
  const ajustementBase = ajustementBaseResult.ajustementBase;
  
  // Ajustements taxes et assurances
  // Calcul en valeurs BRUTES (sans arrondi) pour un arrondi unique à la fin - conforme TAL
  const ajustementTaxesMunicipalesBrut = calculAjustementTaxesBrut(
    formData.taxesMunicipales.anneeCourante,
    formData.taxesMunicipales.anneePrecedente,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  const ajustementTaxesScolairesBrut = calculAjustementTaxesBrut(
    formData.taxesScolaires.anneeCourante,
    formData.taxesScolaires.anneePrecedente,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  const ajustementAssurancesBrut = calculAjustementAssurancesBrut(
    formData.assurances.dec2025,
    formData.assurances.dec2024,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  // Arrondi UNIQUE à la fin pour le total (règle TAL)
  // Les valeurs brutes sont sommées PUIS arrondies une seule fois
  const totalAjustementTaxesAssurances = round2(
    ajustementTaxesMunicipalesBrut + ajustementTaxesScolairesBrut + ajustementAssurancesBrut
  );
  
  // Ajustements réparations - somme des valeurs BRUTES puis arrondi unique (règle TAL)
  let totalAjustementReparationsBrut = 0;
  formData.reparations.forEach(ligne => {
    const ajustBrut = calculAjustementReparationBrut(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementReparationsBrut += ajustBrut;
  });
  // Arrondi UNIQUE à la fin (règle TAL)
  const totalAjustementReparations = round2(totalAjustementReparationsBrut);
  
  // Ajustements nouvelles dépenses - somme des valeurs BRUTES puis arrondi unique (règle TAL)
  let totalAjustementNouvellesDepensesBrut = 0;
  formData.nouvellesDepenses.forEach(ligne => {
    const ajustBrut = calculAjustementNouvelleDepenseBrut(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementNouvellesDepensesBrut += ajustBrut;
  });
  // Arrondi UNIQUE à la fin (règle TAL)
  const totalAjustementNouvellesDepenses = round2(totalAjustementNouvellesDepensesBrut);
  
  // Ajustements variations d'aide (Section 5-2) - somme des valeurs BRUTES puis arrondi unique
  let totalAjustementVariationsAideBrut = 0;
  formData.variationsAide.forEach(ligne => {
    const ajustBrut = calculAjustementVariationAideBrut(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementVariationsAideBrut += ajustBrut;
  });
  // Arrondi UNIQUE à la fin (règle TAL)
  const totalAjustementVariationsAide = round2(totalAjustementVariationsAideBrut);
  
  // Total Section 4 (= Section 5 TAL = 5-1 + 5-2)
  // IMPORTANT: additionner les BRUTS puis arrondir une seule fois
  const totalSection4Brut = totalAjustementNouvellesDepensesBrut + totalAjustementVariationsAideBrut;
  const totalSection4 = round2(totalSection4Brut);
  
  // Ajustement déneigement (Section 6) - valeur BRUTE
  const ajustementDeneigementBrut = calculAjustementDeneigementBrut(
    formData.deneigement.frais2025,
    formData.deneigement.frais2024,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  // Version arrondie pour affichage
  const ajustementDeneigement = round2(ajustementDeneigementBrut);
  
  // ============================================
  // RÉCAPITULATIF FINAL - Conforme TAL
  // ============================================
  
  // Total des ajustements = somme des BRUTS de toutes les sections
  // Section 1: ajustement base (déjà arrondi car c'est un calcul simple)
  // Section 2: taxes et assurances (brut)
  // Section 3: réparations (brut)
  // Section 4: nouvelles dépenses + variations aide (brut)
  // Section 5: déneigement (brut)
  const totalAjustementsBrut = 
    ajustementBase + // Section 1 (simple, pas de sous-lignes)
    (ajustementTaxesMunicipalesBrut + ajustementTaxesScolairesBrut + ajustementAssurancesBrut) + // Section 2 brut
    totalAjustementReparationsBrut + // Section 3 brut
    totalSection4Brut + // Section 4 brut (5-1 + 5-2)
    ajustementDeneigementBrut; // Section 5 brut
  
  // Total affiché = ROUND_HALF_UP(totalBrut, 2)
  const totalAjustements = roundHalfUp(totalAjustementsBrut, 2);
  
  // Nouveau loyer recommandé = ROUND(loyerAvant + totalAjustements, 0)
  // Arrondi au dollar le plus proche (0 décimale) — conforme TAL
  const nouveauLoyerRecommande = roundHalfUp(formData.loyerMensuelActuel + totalAjustementsBrut, 0);
  
  // Pourcentage de variation conforme TAL :
  // Calculé sur le nouveau loyer ARRONDI (au $) vs le loyer avant augmentation
  // pct_variation = ROUND( ((new_rent - base_rent) / base_rent) * 100 , 2 )
  const pourcentageVariation = formData.loyerMensuelActuel > 0
    ? roundHalfUp(((nouveauLoyerRecommande - formData.loyerMensuelActuel) / formData.loyerMensuelActuel) * 100, 2)
    : 0;
  
  return {
    tauxIPC: TAUX_IPC_2026,
    tauxServicesAines: TAUX_SERVICES_AINES_2026,
    ajustementBase,
    ajustementServices: ajustementBaseResult.ajustementServices,
    ajustementSansServices: ajustementBaseResult.ajustementSansServices,
    ...sousTotaux,
    totalAjustementTaxesAssurances,
    totalAjustementReparations,
    totalAjustementNouvellesDepenses,
    totalAjustementVariationsAide,
    totalSection4,
    ajustementDeneigement,
    totalAjustements,
    nouveauLoyerRecommande,
    pourcentageVariation,
  };
};
