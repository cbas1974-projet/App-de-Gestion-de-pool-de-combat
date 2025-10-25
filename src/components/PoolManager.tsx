import { useState, useEffect } from 'react';
import type { Pool, Fighter, Match } from '../types';
import { canFightersCompete } from '../utils/validation';
import Timer from './Timer';

interface PoolManagerProps {
  pool: Pool;
  availableFighters: Fighter[];
  onUpdatePool: (pool: Pool) => void;
  onRemovePool: (poolId: string) => void;
}

export default function PoolManager({
  pool,
  availableFighters,
  onUpdatePool,
  onRemovePool,
}: PoolManagerProps) {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    // Trouver le premier match en attente
    const pendingMatch = pool.matches.find((m) => m.status === 'pending');
    if (pendingMatch) {
      setCurrentMatch(pendingMatch);
    }
  }, [pool.matches]);

  const handleAddFighter = (fighterId: string) => {
    const fighter = availableFighters.find((f) => f.id === fighterId);
    if (!fighter) return;

    // Vérifier si déjà dans le pool
    if (pool.fighters.some((f) => f.id === fighterId)) {
      alert('Ce combattant est déjà dans le pool');
      return;
    }

    const updatedPool = {
      ...pool,
      fighters: [...pool.fighters, fighter],
    };

    onUpdatePool(updatedPool);
  };

  const handleRemoveFighter = (fighterId: string) => {
    const updatedPool = {
      ...pool,
      fighters: pool.fighters.filter((f) => f.id !== fighterId),
    };
    onUpdatePool(updatedPool);
  };

  const generateMatches = () => {
    if (pool.fighters.length < 2) {
      alert('Il faut au moins 2 combattants');
      return;
    }

    const matches: Match[] = [];
    const fighters = [...pool.fighters];

    // Générer tous les matchs possibles (round robin)
    for (let i = 0; i < fighters.length; i++) {
      for (let j = i + 1; j < fighters.length; j++) {
        const compatibility = canFightersCompete(fighters[i], fighters[j]);
        if (compatibility.canCompete) {
          matches.push({
            id: `${fighters[i].id}-${fighters[j].id}`,
            fighter1: fighters[i],
            fighter2: fighters[j],
            status: 'pending',
          });
        }
      }
    }

    // Limiter selon minMatches
    const limitedMatches = matches.slice(0, pool.minMatches * fighters.length);

    const updatedPool = {
      ...pool,
      matches: limitedMatches,
      status: 'running' as const,
    };

    onUpdatePool(updatedPool);
  };

  const handleMatchComplete = (winnerId: string) => {
    if (!currentMatch) return;

    const updatedMatches = pool.matches.map((m) =>
      m.id === currentMatch.id
        ? { ...m, winner: winnerId, status: 'completed' as const }
        : m
    );

    // Vérifier si tous les matchs sont terminés
    const allCompleted = updatedMatches.every((m) => m.status === 'completed');

    let updatedPool = {
      ...pool,
      matches: updatedMatches,
    };

    if (allCompleted) {
      // Calculer les médailles
      const scores = new Map<string, number>();

      pool.fighters.forEach((f) => scores.set(f.id, 0));

      updatedMatches.forEach((m) => {
        if (m.winner) {
          scores.set(m.winner, (scores.get(m.winner) || 0) + 1);
        }
      });

      // Trier par score
      const ranked = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => pool.fighters.find((f) => f.id === id)!);

      updatedPool = {
        ...updatedPool,
        winners: {
          gold: ranked[0],
          silver: ranked[1],
          bronze: ranked[2],
        },
        status: 'completed',
      };
    }

    onUpdatePool(updatedPool);

    // Passer au prochain match
    const nextMatch = updatedMatches.find((m) => m.status === 'pending');
    setCurrentMatch(nextMatch || null);
  };

  const getMedalEmoji = (position: 'gold' | 'silver' | 'bronze') => {
    switch (position) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{pool.name}</h2>
        <button
          onClick={() => onRemovePool(pool.id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Supprimer Pool
        </button>
      </div>

      {pool.status === 'setup' && (
        <>
          {/* Configuration du pool */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Nombre minimum de combats par combattant
            </label>
            <select
              value={pool.minMatches}
              onChange={(e) =>
                onUpdatePool({
                  ...pool,
                  minMatches: parseInt(e.target.value) as 2 | 3 | 4,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 combats</option>
              <option value={3}>3 combats</option>
              <option value={4}>4 combats</option>
            </select>
          </div>

          {/* Ajouter des combattants */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Ajouter des combattants
            </label>
            <select
              onChange={(e) => {
                handleAddFighter(e.target.value);
                e.target.value = '';
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un combattant</option>
              {availableFighters
                .filter((f) => !pool.fighters.some((pf) => pf.id === f.id))
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.age} ans, {f.weight} kg, {f.grade})
                  </option>
                ))}
            </select>
          </div>

          {/* Liste des combattants du pool */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Combattants du pool ({pool.fighters.length})
            </h3>
            <div className="space-y-1">
              {pool.fighters.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">
                    {f.name} - {f.age} ans, {f.weight} kg, {f.grade}
                  </span>
                  <button
                    onClick={() => handleRemoveFighter(f.id)}
                    className="text-red-600 text-sm"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generateMatches}
            disabled={pool.fighters.length < 2}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Générer les combats
          </button>
        </>
      )}

      {pool.status === 'running' && currentMatch && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Combat en cours
            </h3>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-blue-900">
                  {currentMatch.fighter1.name}
                </div>
                <div className="text-sm text-blue-700">
                  {currentMatch.fighter1.grade}
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-900 px-4">VS</div>
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-blue-900">
                  {currentMatch.fighter2.name}
                </div>
                <div className="text-sm text-blue-700">
                  {currentMatch.fighter2.grade}
                </div>
              </div>
            </div>

            <Timer
              config={{
                roundDuration: 120,
                restDuration: 60,
                totalRounds: 3,
              }}
              poolName={pool.name}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleMatchComplete(currentMatch.fighter1.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {currentMatch.fighter1.name} gagne
              </button>
              <button
                onClick={() => handleMatchComplete(currentMatch.fighter2.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {currentMatch.fighter2.name} gagne
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Progression: {pool.matches.filter((m) => m.status === 'completed').length} /{' '}
              {pool.matches.length} combats
            </h4>
          </div>
        </div>
      )}

      {pool.status === 'completed' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Résultats - Podium
          </h3>
          <div className="space-y-3">
            {pool.winners.gold && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <span className="text-3xl">{getMedalEmoji('gold')}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">
                    {pool.winners.gold.name}
                  </div>
                  <div className="text-sm text-gray-600">Médaille d'Or</div>
                </div>
              </div>
            )}
            {pool.winners.silver && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-gray-400 rounded-lg">
                <span className="text-3xl">{getMedalEmoji('silver')}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">
                    {pool.winners.silver.name}
                  </div>
                  <div className="text-sm text-gray-600">Médaille d'Argent</div>
                </div>
              </div>
            )}
            {pool.winners.bronze && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 border-2 border-orange-400 rounded-lg">
                <span className="text-3xl">{getMedalEmoji('bronze')}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">
                    {pool.winners.bronze.name}
                  </div>
                  <div className="text-sm text-gray-600">Médaille de Bronze</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
