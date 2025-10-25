import { useState, useEffect, useCallback } from 'react';
import type { TimerConfig } from '../types';
import { bellSound } from '../utils/sounds';

interface TimerProps {
  config: TimerConfig;
  onComplete?: () => void;
  poolName?: string;
}

export default function Timer({ config, onComplete, poolName }: TimerProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.roundDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    setIsRunning(true);
    bellSound.playBell('start');
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentRound(1);
    setTimeLeft(config.roundDuration);
    setIsRest(false);
  }, [config.roundDuration]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          // Compte à rebours pour les 10 dernières secondes
          if (prev <= 10 && prev > 1 && !isRest) {
            bellSound.playCountdown();
          }

          if (prev === 1) {
            bellSound.playBell('end');

            // Passer au repos ou au prochain round
            if (!isRest && currentRound <= config.totalRounds) {
              setIsRest(true);
              return config.restDuration;
            } else if (isRest && currentRound < config.totalRounds) {
              setIsRest(false);
              setCurrentRound((r) => r + 1);
              bellSound.playBell('start');
              return config.roundDuration;
            } else {
              // Fin du combat
              setIsRunning(false);
              if (onComplete) onComplete();
              return 0;
            }
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isRest, currentRound, config, onComplete]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
      {poolName && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {poolName}
        </h3>
      )}

      <div className="text-center mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Round {currentRound} / {config.totalRounds}
        </div>
        <div
          className={`text-6xl font-bold mb-2 ${
            isRest
              ? 'text-blue-600'
              : timeLeft <= 10
              ? 'text-red-600'
              : 'text-gray-800'
          }`}
        >
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm font-medium text-gray-500">
          {isRest ? 'REPOS' : 'COMBAT'}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Démarrer
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
