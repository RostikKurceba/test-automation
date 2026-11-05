export type AssessmentType = 'laboratories' | 'tests' | 'project';

export type EctsGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'FX' | 'F';

export interface StudentScores {
  laboratories: number;
  tests: number;
  project: number;
}

export interface StudentResult {
  weightedScore: number;
  ectsGrade: EctsGrade;
}

// Вагові коефіцієнти оцінювання
const WEIGHTS = {
  laboratories: 0.3,
  tests: 0.3,
  project: 0.4
} as const;

const MIN_SCORE = 0;
const MAX_SCORE = 100;

// Перевірка коректності оцінки
function validateScore(
  value: number,
  assessment: AssessmentType | 'final'
): void {

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`INVALID_SCORE_TYPE:${assessment}`);
  }

  if (value < MIN_SCORE || value > MAX_SCORE) {
    throw new Error(`INVALID_SCORE_RANGE:${assessment}`);
  }
}

// Округлення результату до двох знаків після коми
function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Розрахунок підсумкового бала
export function calculateWeightedScore(
  scores: StudentScores
): number {

  validateScore(scores.laboratories, 'laboratories');
  validateScore(scores.tests, 'tests');
  validateScore(scores.project, 'project');

  const total =
    scores.laboratories * WEIGHTS.laboratories +
    scores.tests * WEIGHTS.tests +
    scores.project * WEIGHTS.project;

  return roundToTwoDecimals(total);
}

// Переведення результату в шкалу ЄКТС
export function getEctsGrade(score: number): EctsGrade {

  validateScore(score, 'final');

  if (score >= 90) return 'A';
  if (score >= 82) return 'B';
  if (score >= 75) return 'C';
  if (score >= 67) return 'D';
  if (score >= 60) return 'E';
  if (score >= 35) return 'FX';

  return 'F';
}

// Формування повного результату оцінювання
export function calculateStudentResult(
  scores: StudentScores
): StudentResult {

  const weightedScore = calculateWeightedScore(scores);

  return {
    weightedScore,
    ectsGrade: getEctsGrade(weightedScore)
  };
}