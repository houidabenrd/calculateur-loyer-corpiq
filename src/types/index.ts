// Types pour le calculateur d'augmentation de loyer CORPIQ 2026

export interface UniteLocation {
  nombre: number;
  loyerMensuel: number;
}

export interface RevenusLogements {
  loues: UniteLocation;
  inoccupes: UniteLocation;
  occupesLocateur: UniteLocation;
}

export interface TaxeInfo {
  anneeCourante: number;
  anneePrecedente: number;
  ajustement: number;
}

export interface AssuranceInfo {
  dec2025: number;
  dec2024: number;
  ajustement: number;
}

export interface LigneReparation {
  id: string;
  nature: string;
  depense: number;
  aideFinanciere: number;
  indemniteTiers: number;
  depenseRetenue: number;
  montantPretReduit: number;
  versementAnnuel: number;
  nbLogements: number;
  nbLocauxNonResidentiels: number;
  logementConcerne: boolean;
  ajustementCalcule: number;
}

export interface LigneNouvelleDepense {
  id: string;
  nature: string;
  depense: number;
  aideFinanciere: number;
  depenseRetenue: number;
  nbLogements: number;
  nbLocauxNonResidentiels: number;
  logementConcerne: boolean;
  ajustementCalcule: number;
}

export interface LigneVariationAide {
  id: string;
  nature: string;
  montant2025: number;
  montant2024: number;
  variation: number;
  nbLogements: number;
  nbLocauxNonResidentiels: number;
  logementConcerne: boolean;
  ajustementCalcule: number;
}

export interface Deneigement {
  frais2025: number;
  frais2024: number;
  ajustement: number;
}

export interface FormData {
  // Section 1: Informations de base
  unite: string;
  adresse: string;
  isRPA: boolean;
  loyerMensuelActuel: number;
  partServicesPersonne: number; // Partie du loyer liée aux services à la personne (RPA uniquement)
  
  // Section 1: Revenus de l'immeuble
  logements: RevenusLogements;
  locauxNonResidentiels: RevenusLogements;
  autresRevenus: number;
  
  // Section 2: Taxes et assurances
  taxesMunicipales: TaxeInfo;
  taxesScolaires: TaxeInfo;
  assurances: AssuranceInfo;
  
  // Section 3: Réparations
  reparations: LigneReparation[];
  
  // Section 4: Nouvelles dépenses et variations d'aide
  nouvellesDepenses: LigneNouvelleDepense[];
  variationsAide: LigneVariationAide[];
  
  // Section 5: Déneigement
  hasDeneigement: boolean | null;
  deneigement: Deneigement;
}

export interface CalculatedValues {
  // Constantes 2026
  tauxIPC: number; // 0.031 = 3.1%
  tauxServicesAines: number; // 0.067 = 6.7%
  
  // Valeurs calculées section 1
  ajustementBase: number;
  // Détails pour RPA (résidence privée pour aînés)
  ajustementServices: number; // Bloc A: part services × 6.7%
  ajustementSansServices: number; // Bloc B: (loyer - part services) × IPC
  soustotalLogements: { nombre: number; loyer: number };
  soustotalNonResidentiels: { nombre: number; loyer: number };
  totalLoyersAnnuel: number;
  revenusImmeuble: number;
  poidsLoyer: number;
  
  // Valeurs calculées section 2
  ajustementTaxesMunicipales: number;
  ajustementTaxesScolaires: number;
  ajustementAssurances: number;
  totalAjustementTaxesAssurances: number;
  
  // Valeurs calculées section 3
  totalAjustementReparations: number;
  
  // Valeurs calculées section 4
  totalAjustementNouvellesDepenses: number;
  totalAjustementVariationsAide: number;
  totalSection4: number;
  
  // Valeurs calculées section 5
  ajustementDeneigement: number;
  
  // Résultat final
  totalAjustements: number;
  nouveauLoyerRecommande: number;
  pourcentageVariation: number;
}

export interface StepInfo {
  id: number;
  title: string;
  description: string;
}

export const STEPS: StepInfo[] = [
  { id: 1, title: 'Informations de base', description: 'Logement et revenus de l\'immeuble' },
  { id: 2, title: 'Taxes et assurances', description: 'Taxes municipales, scolaires et assurances' },
  { id: 3, title: 'Réparations majeures', description: 'Améliorations et rénovations' },
  { id: 4, title: 'Nouvelles dépenses', description: 'Services et variations d\'aide' },
  { id: 5, title: 'Déneigement', description: 'Frais de déneigement (maisons mobiles)' },
  { id: 6, title: 'Récapitulatif', description: 'Résultat final et export PDF' },
];

export const TAUX_IPC_2026 = 0.031; // 3.1%
export const TAUX_SERVICES_AINES_2026 = 0.067; // 6.7% - Taux fixe TAL 2026 pour services à la personne (RPA)
export const TAUX_IMMOBILISATION_TAL = 0.05; // 5% - Taux d'immobilisation TAL pour réparations/améliorations

export const initialFormData: FormData = {
  unite: '',
  adresse: '',
  isRPA: false,
  loyerMensuelActuel: 0,
  partServicesPersonne: 0,
  
  logements: {
    loues: { nombre: 0, loyerMensuel: 0 },
    inoccupes: { nombre: 0, loyerMensuel: 0 },
    occupesLocateur: { nombre: 0, loyerMensuel: 0 },
  },
  locauxNonResidentiels: {
    loues: { nombre: 0, loyerMensuel: 0 },
    inoccupes: { nombre: 0, loyerMensuel: 0 },
    occupesLocateur: { nombre: 0, loyerMensuel: 0 },
  },
  autresRevenus: 0,
  
  taxesMunicipales: { anneeCourante: 0, anneePrecedente: 0, ajustement: 0 },
  taxesScolaires: { anneeCourante: 0, anneePrecedente: 0, ajustement: 0 },
  assurances: { dec2025: 0, dec2024: 0, ajustement: 0 },
  
  reparations: [],
  nouvellesDepenses: [],
  variationsAide: [],
  
  hasDeneigement: null,
  deneigement: { frais2025: 0, frais2024: 0, ajustement: 0 },
};
