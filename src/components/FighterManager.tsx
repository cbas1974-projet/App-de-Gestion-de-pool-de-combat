import { useState } from 'react';
import type { Fighter, ValidationRules } from '../types';
import type { ValidationWarning } from '../utils/validation';
import { validateFighter } from '../utils/validation';
import { bellSound } from '../utils/sounds';

interface FighterManagerProps {
  fighters: Fighter[];
  validationRules: ValidationRules;
  onAddFighter: (fighter: Fighter) => void;
  onRemoveFighter: (id: string) => void;
  onUpdateRules: (rules: ValidationRules) => void;
}

export default function FighterManager({
  fighters,
  validationRules,
  onAddFighter,
  onRemoveFighter,
  onUpdateRules,
}: FighterManagerProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [grade, setGrade] = useState('Blanc');
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  const handleAddFighter = () => {
    if (!name || !age || !weight) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newFighter: Fighter = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      grade,
    };

    const validationWarnings = validateFighter(newFighter, validationRules);
    setWarnings(validationWarnings);

    if (validationWarnings.length > 0) {
      bellSound.playWarning();
      const hasError = validationWarnings.some((w) => w.severity === 'error');
      if (hasError) {
        return; // Ne pas ajouter si erreur critique
      }

      // Demander confirmation pour les warnings
      const confirmed = window.confirm(
        `Avertissements détectés:\n${validationWarnings
          .map((w) => w.message)
          .join('\n')}\n\nVoulez-vous quand même ajouter ce combattant?`
      );

      if (!confirmed) return;
    }

    onAddFighter(newFighter);
    setName('');
    setAge('');
    setWeight('');
    setGrade('Blanc');
    setWarnings([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Gestion des Combattants
      </h2>

      {/* Formulaire d'ajout */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Ajouter un combattant</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Âge"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Poids (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {validationRules.allowedGrades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddFighter}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Ajouter
        </button>

        {warnings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            {warnings.map((w, i) => (
              <div
                key={i}
                className={`text-sm ${
                  w.severity === 'error' ? 'text-red-600' : 'text-yellow-700'
                }`}
              >
                {w.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des combattants */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Liste ({fighters.length} combattants)
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {fighters.map((fighter) => {
            const fWarnings = validateFighter(fighter, validationRules);
            return (
              <div
                key={fighter.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  fWarnings.length > 0
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {fighter.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {fighter.age} ans • {fighter.weight} kg • {fighter.grade}
                  </div>
                  {fWarnings.length > 0 && (
                    <div className="text-xs text-yellow-700 mt-1">
                      {fWarnings.map((w) => w.message).join(' • ')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onRemoveFighter(fighter.id)}
                  className="ml-4 text-red-600 hover:text-red-700 font-medium"
                >
                  Supprimer
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration des règles */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Règles de validation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Âge maximum
            </label>
            <input
              type="number"
              value={validationRules.maxAge}
              onChange={(e) =>
                onUpdateRules({
                  ...validationRules,
                  maxAge: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Poids maximum (kg)
            </label>
            <input
              type="number"
              value={validationRules.maxWeight}
              onChange={(e) =>
                onUpdateRules({
                  ...validationRules,
                  maxWeight: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
