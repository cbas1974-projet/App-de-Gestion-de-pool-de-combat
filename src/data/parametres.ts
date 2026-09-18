import type { FormatSeance, Niveau, ParametresSeance, Tempo } from '../types';

/** Durées de séance proposées, en minutes. */
export const DUREES_MINUTES = [5, 10, 15, 20, 30, 45] as const;

/** Tempos proposés : secondes de montée / secondes de descente. */
export const TEMPOS: { tempo: Tempo; nom: string; description: string }[] = [
  {
    tempo: { monteeSec: 5, descenteSec: 5 },
    nom: '5 s / 5 s',
    description: 'Recommandé : lent, sans rebond, protège tendons et ligaments.',
  },
  {
    tempo: { monteeSec: 3, descenteSec: 3 },
    nom: '3 s / 3 s',
    description: 'Contrôlé, un peu plus dynamique.',
  },
  {
    tempo: { monteeSec: 2, descenteSec: 4 },
    nom: '2 s / 4 s',
    description: 'Montée normale, descente lente (excentrique).',
  },
];

export const NIVEAUX: { id: Niveau; nom: string; description: string }[] = [
  { id: 'debutant', nom: 'Débutant', description: 'Reprise ou découverte : moins de séries, plus de repos.' },
  { id: 'intermediaire', nom: 'Intermédiaire', description: 'Pratique régulière depuis quelques mois.' },
  { id: 'avance', nom: 'Avancé', description: 'Bonne technique, volume plus élevé.' },
];

export const FORMATS: { id: FormatSeance; nom: string; description: string }[] = [
  { id: 'series', nom: 'Séries', description: 'Chaque exercice en plusieurs séries, repos chronométré entre les séries.' },
  { id: 'circuit', nom: 'Circuit', description: 'Enchaînement de stations au temps, plusieurs tours.' },
  { id: 'mixte', nom: 'Mixte', description: 'Séries pour la force, puis un court circuit pour finir.' },
];

export const PARAMETRES_PAR_DEFAUT: ParametresSeance = {
  dureeMinutes: 20,
  objectif: 'complet',
  niveau: 'intermediaire',
  format: 'series',
  tempo: { monteeSec: 5, descenteSec: 5 },
  banc: false,
  explosifs: false,
};
