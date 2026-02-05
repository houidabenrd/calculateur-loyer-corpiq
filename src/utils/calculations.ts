// Fonctions de calcul pour le calculateur de loyer CORPIQ 2026
import { 
  FormData, 
  CalculatedValues, 
  TAUX_IPC_2026,
  TAUX_SERVICES_AINES_2026,
  LigneReparation,
  LigneNouvelleDepense,
  LigneVariationAide 
} from '../types';

// Arrondir à 2 décimales
export const round2 = (num: number): number => {
  return Math.round(num * 100) / 100;
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
export const calculAjustementTaxes = (
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
    // Si diminution, on la répercute entièrement
    return round2((variation * poidsLoyer) / 12);
  }
  
  // Si augmentation, on soustrait l'inflation (IPC)
  const seuilInflation = tauxIPC * taxePrecedente;
  if (variation <= seuilInflation) {
    return 0; // Augmentation couverte par l'IPC de base
  }
  
  // Seulement la partie au-dessus de l'inflation
  const variationNette = variation - seuilInflation;
  return round2((variationNette * poidsLoyer) / 12);
};

// Calcul ajustement assurances
export const calculAjustementAssurances = (
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
    return round2((variation * poidsLoyer) / 12);
  }
  
  const seuilInflation = tauxIPC * assurancePrecedente;
  if (variation <= seuilInflation) {
    return 0;
  }
  
  const variationNette = variation - seuilInflation;
  return round2((variationNette * poidsLoyer) / 12);
};

// Calcul ajustement pour une ligne de réparation
export const calculAjustementReparation = (
  ligne: LigneReparation,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  if (!ligne.logementConcerne || ligne.depenseRetenue <= 0) return 0;
  
  // Calcul du loyer moyen des autres logements
  const loyerMoyenAutresLogements = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  // Calcul du loyer moyen des locaux non résidentiels
  const loyerMoyenLocaux = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  // Base concernée (somme pondérée des loyers des unités concernées)
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * loyerMoyenAutresLogements 
    + ligne.nbLocauxNonResidentiels * loyerMoyenLocaux;
  
  if (baseConcernee === 0) return 0;
  
  // Poids du logement dans la dépense
  const poidsLogement = loyerMensuelLogement / baseConcernee;
  
  // Ajustement mensuel = (dépense retenue / 20 ans) × poids / 12 mois
  const ajustementMensuel = (ligne.depenseRetenue / 20) * poidsLogement / 12;
  
  return round2(ajustementMensuel);
};

// Calcul ajustement pour une nouvelle dépense
export const calculAjustementNouvelleDepense = (
  ligne: LigneNouvelleDepense,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  if (!ligne.logementConcerne || ligne.depenseRetenue <= 0) return 0;
  
  const loyerMoyenAutresLogements = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  const loyerMoyenLocaux = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * loyerMoyenAutresLogements 
    + ligne.nbLocauxNonResidentiels * loyerMoyenLocaux;
  
  if (baseConcernee === 0) return 0;
  
  const poidsLogement = loyerMensuelLogement / baseConcernee;
  
  // Nouvelle dépense: divisée par 12 mois (pas d'amortissement sur 20 ans)
  const ajustementMensuel = (ligne.depenseRetenue / 12) * poidsLogement;
  
  return round2(ajustementMensuel);
};

// Calcul ajustement pour une variation d'aide
export const calculAjustementVariationAide = (
  ligne: LigneVariationAide,
  loyerMensuelLogement: number,
  soustotalNbLogements: number,
  soustotalLoyerLogements: number,
  soustotalNbLocaux: number,
  soustotalLoyerLocaux: number
): number => {
  if (!ligne.logementConcerne) return 0;
  
  const loyerMoyenAutresLogements = 
    soustotalNbLogements <= 1 
      ? 0 
      : (soustotalLoyerLogements - loyerMensuelLogement) / (soustotalNbLogements - 1);
  
  const loyerMoyenLocaux = 
    soustotalNbLocaux === 0 
      ? 0 
      : soustotalLoyerLocaux / soustotalNbLocaux;
  
  const baseConcernee = 
    loyerMensuelLogement 
    + Math.max(0, ligne.nbLogements - 1) * loyerMoyenAutresLogements 
    + ligne.nbLocauxNonResidentiels * loyerMoyenLocaux;
  
  if (baseConcernee === 0) return 0;
  
  const poidsLogement = loyerMensuelLogement / baseConcernee;
  
  // Le signe est INVERSÉ car une DIMINUTION de l'aide
  // entraîne une AUGMENTATION pour le locataire
  const ajustementMensuel = -(ligne.variation / 12) * poidsLogement;
  
  return round2(ajustementMensuel);
};

// Calcul ajustement déneigement
export const calculAjustementDeneigement = (
  frais2025: number,
  frais2024: number,
  loyerMensuel: number,
  revenusImmeuble: number
): number => {
  if (revenusImmeuble === 0) return 0;
  
  const variation = frais2025 - frais2024;
  const poidsLoyer = (loyerMensuel * 12) / revenusImmeuble;
  
  return round2((variation / 12) * poidsLoyer);
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
  const ajustementTaxesMunicipales = calculAjustementTaxes(
    formData.taxesMunicipales.anneeCourante,
    formData.taxesMunicipales.anneePrecedente,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  const ajustementTaxesScolaires = calculAjustementTaxes(
    formData.taxesScolaires.anneeCourante,
    formData.taxesScolaires.anneePrecedente,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  const ajustementAssurances = calculAjustementAssurances(
    formData.assurances.dec2025,
    formData.assurances.dec2024,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  const totalAjustementTaxesAssurances = round2(
    ajustementTaxesMunicipales + ajustementTaxesScolaires + ajustementAssurances
  );
  
  // Ajustements réparations
  let totalAjustementReparations = 0;
  formData.reparations.forEach(ligne => {
    const ajust = calculAjustementReparation(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementReparations += ajust;
  });
  totalAjustementReparations = round2(totalAjustementReparations);
  
  // Ajustements nouvelles dépenses
  let totalAjustementNouvellesDepenses = 0;
  formData.nouvellesDepenses.forEach(ligne => {
    const ajust = calculAjustementNouvelleDepense(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementNouvellesDepenses += ajust;
  });
  totalAjustementNouvellesDepenses = round2(totalAjustementNouvellesDepenses);
  
  // Ajustements variations d'aide
  let totalAjustementVariationsAide = 0;
  formData.variationsAide.forEach(ligne => {
    const ajust = calculAjustementVariationAide(
      ligne,
      formData.loyerMensuelActuel,
      sousTotaux.soustotalLogements.nombre,
      sousTotaux.soustotalLogements.loyer,
      sousTotaux.soustotalNonResidentiels.nombre,
      sousTotaux.soustotalNonResidentiels.loyer
    );
    totalAjustementVariationsAide += ajust;
  });
  totalAjustementVariationsAide = round2(totalAjustementVariationsAide);
  
  const totalSection4 = round2(totalAjustementNouvellesDepenses + totalAjustementVariationsAide);
  
  // Ajustement déneigement
  const ajustementDeneigement = calculAjustementDeneigement(
    formData.deneigement.frais2025,
    formData.deneigement.frais2024,
    formData.loyerMensuelActuel,
    sousTotaux.revenusImmeuble
  );
  
  // Total des ajustements
  const totalAjustements = round2(
    ajustementBase + 
    totalAjustementTaxesAssurances + 
    totalAjustementReparations + 
    totalSection4 + 
    ajustementDeneigement
  );
  
  // Nouveau loyer recommandé (arrondi à l'entier)
  const nouveauLoyerRecommande = Math.round(formData.loyerMensuelActuel + totalAjustements);
  
  // Pourcentage de variation
  const pourcentageVariation = formData.loyerMensuelActuel > 0
    ? round2(((nouveauLoyerRecommande - formData.loyerMensuelActuel) / formData.loyerMensuelActuel) * 100)
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
