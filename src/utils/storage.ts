import type {
  AppState,
  EntrainementState,
  Fighter,
  Objectif,
  ParametresSeance,
  Pool,
  ValidationRules,
  Zone,
} from '../types';
import { PARAMETRES_PAR_DEFAUT, TOUTES_LES_ZONES } from '../data/parametres';

/** Correspondance entre l'ancien objectif unique et les zones. */
const ZONES_PAR_OBJECTIF: Record<Objectif, Zone[]> = {
  complet: TOUTES_LES_ZONES,
  haut: ['haut'],
  bas: ['bas'],
  gainage: ['gainage'],
  dos: ['dos'],
};

const STORAGE_KEY = 'combat-pool-manager';

const defaultValidationRules: ValidationRules = {
  maxAge: 18,
  maxWeight: 100,
  allowedGrades: ['Blanc', 'Jaune', 'Orange', 'Vert', 'Bleu', 'Marron', 'Noir'],
};

const defaultEntrainement: EntrainementState = {
  parametres: PARAMETRES_PAR_DEFAUT,
  seanceCourante: null,
  enCours: null,
  historique: [],
};

const defaultState: AppState = {
  fighters: [],
  pools: [],
  validationRules: defaultValidationRules,
  activePoolIds: [],
  entrainement: defaultEntrainement,
};

/** Complète des paramètres sauvegardés : valeurs par défaut des nouveaux
 *  réglages, et conversion de l'ancien objectif unique en zones. */
const migrerParametres = (sauvegardes: Partial<ParametresSeance>): ParametresSeance => {
  const zones =
    sauvegardes.zones && sauvegardes.zones.length > 0
      ? sauvegardes.zones
      : sauvegardes.objectif
        ? ZONES_PAR_OBJECTIF[sauvegardes.objectif]
        : PARAMETRES_PAR_DEFAUT.zones;
  return { ...PARAMETRES_PAR_DEFAUT, ...sauvegardes, zones: [...zones] };
};

/** Complète un état sauvegardé par une version antérieure de l'application. */
const migrer = (sauvegarde: Partial<AppState>): AppState => {
  const entrainement: Partial<EntrainementState> = sauvegarde.entrainement ?? {};
  return {
    ...defaultState,
    ...sauvegarde,
    entrainement: {
      ...defaultEntrainement,
      ...entrainement,
      parametres: migrerParametres(entrainement.parametres ?? {}),
    },
  };
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    return migrer(JSON.parse(serializedState));
  } catch (err) {
    console.error('Error loading state:', err);
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const saveFighters = (fighters: Fighter[]): void => {
  const state = loadState();
  saveState({ ...state, fighters });
};

export const savePools = (pools: Pool[]): void => {
  const state = loadState();
  saveState({ ...state, pools });
};

export const saveValidationRules = (rules: ValidationRules): void => {
  const state = loadState();
  saveState({ ...state, validationRules: rules });
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
