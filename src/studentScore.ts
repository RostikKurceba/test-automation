
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

// РЕФАКТОРИНГ №2:
// Межі оцінювання за шкалою ЄКТС винесені в окрему конфігурацію
const ECTS_THRESHOLDS: {
  minScore: number;
  grade: EctsGrade;
}[] = [
  { minScore: 90, grade: 'A' },
  { minScore: 82, grade: 'B' },
  { minScore: 75, grade: 'C' },
  { minScore: 67, grade: 'D' },
  { minScore: 60, grade: 'E' },
  { minScore: 35, grade: 'FX' },
  { minScore: 0, grade: 'F' }
];

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

// РЕФАКТОРИНГ №1:
// Перевірка всіх складових оцінювання винесена в окрему функцію
function validateAssessmentScores(scores: StudentScores): void {
  const assessments: AssessmentType[] = [
    'laboratories',
    'tests',
    'project'
  ];

  for (const assessment of assessments) {
    validateScore(scores[assessment], assessment);
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

  // Використання рефакторингу №1
  validateAssessmentScores(scores);

  const total =
    scores.laboratories * WEIGHTS.laboratories +
    scores.tests * WEIGHTS.tests +
    scores.project * WEIGHTS.project;

  return roundToTwoDecimals(total);
}

// Переведення результату в шкалу ЄКТС
export function getEctsGrade(score: number): EctsGrade {

  validateScore(score, 'final');

  // Використання рефакторингу №2:
  // Пошук відповідної оцінки в конфігурації ECTS_THRESHOLDS
  const result = ECTS_THRESHOLDS.find(
    (threshold) => score >= threshold.minScore
  );

  return result!.grade;
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
