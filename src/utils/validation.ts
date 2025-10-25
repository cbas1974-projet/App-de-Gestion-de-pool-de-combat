import type { Fighter, ValidationRules } from '../types';

export interface ValidationWarning {
  field: 'age' | 'weight' | 'grade';
  message: string;
  severity: 'warning' | 'error';
}

export const validateFighter = (
  fighter: Fighter,
  rules: ValidationRules
): ValidationWarning[] => {
  const warnings: ValidationWarning[] = [];

  // Validation de l'âge
  if (fighter.age > rules.maxAge) {
    warnings.push({
      field: 'age',
      message: `Âge trop élevé: ${fighter.age} ans (max: ${rules.maxAge} ans)`,
      severity: 'warning',
    });
  }

  if (fighter.age < 5) {
    warnings.push({
      field: 'age',
      message: `Âge trop faible: ${fighter.age} ans (min: 5 ans)`,
      severity: 'error',
    });
  }

  // Validation du poids
  if (fighter.weight > rules.maxWeight) {
    warnings.push({
      field: 'weight',
      message: `Poids trop élevé: ${fighter.weight} kg (max: ${rules.maxWeight} kg)`,
      severity: 'warning',
    });
  }

  if (fighter.weight < 20) {
    warnings.push({
      field: 'weight',
      message: `Poids trop faible: ${fighter.weight} kg (min: 20 kg)`,
      severity: 'error',
    });
  }

  // Validation du grade
  if (!rules.allowedGrades.includes(fighter.grade)) {
    warnings.push({
      field: 'grade',
      message: `Grade non autorisé: ${fighter.grade}`,
      severity: 'warning',
    });
  }

  return warnings;
};

export const canFightersCompete = (
  fighter1: Fighter,
  fighter2: Fighter
): { canCompete: boolean; reason?: string } => {
  // Vérification de la différence d'âge
  const ageDiff = Math.abs(fighter1.age - fighter2.age);
  if (ageDiff > 3) {
    return {
      canCompete: false,
      reason: `Différence d'âge trop importante: ${ageDiff} ans`,
    };
  }

  // Vérification de la différence de poids
  const weightDiff = Math.abs(fighter1.weight - fighter2.weight);
  const weightLimit = fighter1.weight < 50 ? 5 : 10;
  if (weightDiff > weightLimit) {
    return {
      canCompete: false,
      reason: `Différence de poids trop importante: ${weightDiff} kg`,
    };
  }

  return { canCompete: true };
};
