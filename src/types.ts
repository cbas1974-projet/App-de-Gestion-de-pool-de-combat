export interface Fighter {
  id: string;
  name: string;
  age: number;
  weight: number;
  grade: string;
  category?: string;
}

export interface ValidationRules {
  maxAge: number;
  maxWeight: number;
  allowedGrades: string[];
}

export interface Match {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  winner?: string; // fighter id
  duration?: number; // in seconds
  status: 'pending' | 'ongoing' | 'completed';
}

export interface Pool {
  id: string;
  name: string;
  fighters: Fighter[];
  matches: Match[];
  minMatches: 2 | 3 | 4;
  winners: {
    gold?: Fighter;
    silver?: Fighter;
    bronze?: Fighter;
  };
  status: 'setup' | 'running' | 'completed';
}

export interface TimerConfig {
  roundDuration: number; // in seconds
  restDuration: number; // in seconds
  totalRounds: number;
}

export interface AppState {
  fighters: Fighter[];
  pools: Pool[];
  validationRules: ValidationRules;
  activePoolIds: string[]; // max 2
}
