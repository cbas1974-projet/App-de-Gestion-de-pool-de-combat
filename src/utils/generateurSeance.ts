// CONTRAT D'INTERFACE — implémentation en cours par l'agent « générateur ».
// Les signatures exportées ici sont celles que l'onglet Entraînement utilise ;
// elles ne doivent pas changer sans mettre à jour les composants appelants.
import type { BlocSeries, Exercice, ParametresSeance, Seance, Tempo } from '../types';

const NON_IMPLEMENTE = 'Générateur de séance non implémenté';

/** Secondes par répétition au tempo donné (montée + descente). */
export function secondesParRep(tempo: Tempo): number {
  return tempo.monteeSec + tempo.descenteSec;
}

/** Durée d'une série en secondes : reps × tempo (doublée si unilatéral),
 *  ou directement `reps` secondes si l'exercice se mesure au temps. */
export function dureeSerieSec(exercice: Exercice, reps: number, tempo: Tempo): number {
  if (exercice.unite === 'secondes') return reps;
  return reps * secondesParRep(tempo) * (exercice.cotes === 'unilateral' ? 2 : 1);
}

/** Exercices utilisables avec ces paramètres (matériel, niveau, explosifs). */
export function exercicesDisponibles(_parametres: ParametresSeance): Exercice[] {
  void _parametres;
  throw new Error(NON_IMPLEMENTE);
}

/** Génère une séance complète qui tient dans la durée demandée. */
export function genererSeance(_parametres: ParametresSeance, _graine?: number): Seance {
  void _parametres;
  void _graine;
  throw new Error(NON_IMPLEMENTE);
}

/** Remplace un exercice (bloc ou station) par un autre de la même zone. */
export function remplacerExercice(_seance: Seance, _exerciceId: string, _graine?: number): Seance {
  void _seance;
  void _exerciceId;
  void _graine;
  throw new Error(NON_IMPLEMENTE);
}

/** Durée totale estimée de la séance en secondes. */
export function estimerDureeSec(_seance: Seance): number {
  void _seance;
  throw new Error(NON_IMPLEMENTE);
}

/** "45 s", "12 min", "12 min 30 s", "1 h 05". */
export function formaterDuree(_sec: number): string {
  void _sec;
  throw new Error(NON_IMPLEMENTE);
}

/** "3 × 8 reps par côté · repos 60 s", "3 × 40 s · repos 60 s". */
export function libelleBloc(_bloc: BlocSeries, _exercice: Exercice): string {
  void _bloc;
  void _exercice;
  throw new Error(NON_IMPLEMENTE);
}
