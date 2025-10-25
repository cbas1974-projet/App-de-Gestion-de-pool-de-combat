import { useState, useEffect } from 'react';
import type { AppState, Fighter, Pool, ValidationRules } from './types';
import { loadState, saveState } from './utils/storage';
import FighterManager from './components/FighterManager';
import PoolManager from './components/PoolManager';

function App() {
  const [appState, setAppState] = useState<AppState>(loadState());
  const [activeTab, setActiveTab] = useState<'fighters' | 'pools'>('fighters');

  // Sauvegarder automatiquement l'état
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  const handleAddFighter = (fighter: Fighter) => {
    setAppState((prev) => ({
      ...prev,
      fighters: [...prev.fighters, fighter],
    }));
  };

  const handleRemoveFighter = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      fighters: prev.fighters.filter((f) => f.id !== id),
    }));
  };

  const handleUpdateRules = (rules: ValidationRules) => {
    setAppState((prev) => ({
      ...prev,
      validationRules: rules,
    }));
  };

  const handleCreatePool = () => {
    const poolNumber = appState.pools.length + 1;
    const newPool: Pool = {
      id: Date.now().toString(),
      name: `Pool ${poolNumber}`,
      fighters: [],
      matches: [],
      minMatches: 3,
      winners: {},
      status: 'setup',
    };

    setAppState((prev) => ({
      ...prev,
      pools: [...prev.pools, newPool],
    }));
  };

  const handleUpdatePool = (updatedPool: Pool) => {
    setAppState((prev) => ({
      ...prev,
      pools: prev.pools.map((p) => (p.id === updatedPool.id ? updatedPool : p)),
    }));
  };

  const handleRemovePool = (poolId: string) => {
    setAppState((prev) => ({
      ...prev,
      pools: prev.pools.filter((p) => p.id !== poolId),
      activePoolIds: prev.activePoolIds.filter((id) => id !== poolId),
    }));
  };

  const handleToggleActivePool = (poolId: string) => {
    setAppState((prev) => {
      const isActive = prev.activePoolIds.includes(poolId);

      if (isActive) {
        // Désactiver
        return {
          ...prev,
          activePoolIds: prev.activePoolIds.filter((id) => id !== poolId),
        };
      } else {
        // Activer (max 2)
        if (prev.activePoolIds.length >= 2) {
          alert('Maximum 2 pools actifs simultanément');
          return prev;
        }

        return {
          ...prev,
          activePoolIds: [...prev.activePoolIds, poolId],
        };
      }
    });
  };

  const activePools = appState.pools.filter((p) =>
    appState.activePoolIds.includes(p.id)
  );
  const inactivePools = appState.pools.filter(
    (p) => !appState.activePoolIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion de Pools de Combat
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Application de gestion de compétitions de combat
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('fighters')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'fighters'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Combattants ({appState.fighters.length})
            </button>
            <button
              onClick={() => setActiveTab('pools')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'pools'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pools de Combat ({appState.pools.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'fighters' && (
          <FighterManager
            fighters={appState.fighters}
            validationRules={appState.validationRules}
            onAddFighter={handleAddFighter}
            onRemoveFighter={handleRemoveFighter}
            onUpdateRules={handleUpdateRules}
          />
        )}

        {activeTab === 'pools' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Pools de Combat
              </h2>
              <button
                onClick={handleCreatePool}
                disabled={appState.fighters.length < 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Créer un Pool
              </button>
            </div>

            {appState.fighters.length < 2 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  Ajoutez au moins 2 combattants pour créer un pool.
                </p>
              </div>
            )}

            {/* Pools actifs */}
            {activePools.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Pools Actifs ({activePools.length}/2)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activePools.map((pool) => (
                    <div key={pool.id}>
                      <div className="mb-2">
                        <button
                          onClick={() => handleToggleActivePool(pool.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Désactiver ce pool
                        </button>
                      </div>
                      <PoolManager
                        pool={pool}
                        availableFighters={appState.fighters}
                        onUpdatePool={handleUpdatePool}
                        onRemovePool={handleRemovePool}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pools inactifs */}
            {inactivePools.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Pools en Attente
                </h3>
                <div className="space-y-4">
                  {inactivePools.map((pool) => (
                    <div
                      key={pool.id}
                      className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {pool.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {pool.fighters.length} combattants • Statut:{' '}
                            {pool.status === 'setup'
                              ? 'Configuration'
                              : pool.status === 'running'
                              ? 'En cours'
                              : 'Terminé'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleActivePool(pool.id)}
                            disabled={appState.activePoolIds.length >= 2}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Activer
                          </button>
                          <button
                            onClick={() => handleRemovePool(pool.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appState.pools.length === 0 && appState.fighters.length >= 2 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Aucun pool créé. Créez votre premier pool pour commencer.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          Application de Gestion de Pools de Combat - Sauvegarde automatique
        </div>
      </footer>
    </div>
  );
}

export default App;
