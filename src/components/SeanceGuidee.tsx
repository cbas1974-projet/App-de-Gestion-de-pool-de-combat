// CONTRAT D'INTERFACE — implémentation en cours par l'agent « séance guidée ».
import type { ProgressionSeance, Seance, SeanceRealisee } from '../types';

export interface SeanceGuideeProps {
  /** Séance à dérouler. */
  seance: Seance;
  /** Progression sauvegardée à reprendre (null pour démarrer du début). */
  progression: ProgressionSeance | null;
  /** Appelé régulièrement pour sauvegarder la progression ; null quand la
   *  séance est terminée ou abandonnée. */
  onProgression: (progression: ProgressionSeance | null) => void;
  /** Appelé à la fin quand l'utilisateur enregistre la séance. */
  onTerminee: (realisee: SeanceRealisee) => void;
  /** Appelé pour quitter sans enregistrer (ou après enregistrement). */
  onQuitter: () => void;
}

export default function SeanceGuidee({ onQuitter }: SeanceGuideeProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white p-6">
      <p className="text-gray-700">Mode guidé en construction.</p>
      <button onClick={onQuitter} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">
        Quitter
      </button>
    </div>
  );
}
