import { describe, expect, it } from 'vitest';

import {
  calculateStudentResult,
  calculateWeightedScore,
  getEctsGrade,
  type StudentScores
} from '../src/studentScore';


// Тестування розрахунку підсумкового бала

describe('calculateWeightedScore', () => {

  it('calculates the weighted result using 30%, 30% and 40%', () => {

    const scores: StudentScores = {
      laboratories: 80,
      tests: 90,
      project: 100
    };

    expect(calculateWeightedScore(scores)).toBe(91);
  });

  // Параметризовані тести розрахунку
  it.each([
    {
      laboratories: 0,
      tests: 0,
      project: 0,
      expected: 0
    },
    {
      laboratories: 100,
      tests: 100,
      project: 100,
      expected: 100
    },
    {
      laboratories: 50,
      tests: 50,
      project: 50,
      expected: 50
    },
    {
      laboratories: 70,
      tests: 80,
      project: 90,
      expected: 81
    }
  ])(
    'calculates weighted score for $laboratories, $tests, $project',
    ({ laboratories, tests, project, expected }) => {

      expect(
        calculateWeightedScore({
          laboratories,
          tests,
          project
        })
      ).toBe(expected);
    }
  );

  // Перевірка округлення
  it('rounds the weighted result to two decimal places', () => {

    expect(
      calculateWeightedScore({
        laboratories: 80.11,
        tests: 80.22,
        project: 80.33
      })
    ).toBe(80.23);
  });

  // Перевірка нижньої та верхньої меж оцінок
  it.each([
    ['laboratories', -1, 'INVALID_SCORE_RANGE:laboratories'],
    ['laboratories', 100.01, 'INVALID_SCORE_RANGE:laboratories'],
    ['tests', -1, 'INVALID_SCORE_RANGE:tests'],
    ['tests', 101, 'INVALID_SCORE_RANGE:tests'],
    ['project', -0.01, 'INVALID_SCORE_RANGE:project'],
    ['project', 100.1, 'INVALID_SCORE_RANGE:project']
  ] as const)(
    'rejects out-of-range %s score: %s',
    (field, value, error) => {

      const scores: StudentScores = {
        laboratories: 50,
        tests: 50,
        project: 50
      };

      scores[field] = value;

      expect(() => calculateWeightedScore(scores))
        .toThrow(error);
    }
  );

  // Перевірка некоректних типів даних
  it.each([
    [
      'laboratories',
      Number.NaN,
      'INVALID_SCORE_TYPE:laboratories'
    ],
    [
      'tests',
      Number.POSITIVE_INFINITY,
      'INVALID_SCORE_TYPE:tests'
    ],
    [
      'project',
      '90' as unknown as number,
      'INVALID_SCORE_TYPE:project'
    ]
  ] as const)(
    'rejects invalid data type for %s',
    (field, value, error) => {

      const scores: StudentScores = {
        laboratories: 50,
        tests: 50,
        project: 50
      };

      scores[field] = value;

      expect(() => calculateWeightedScore(scores))
        .toThrow(error);
    }
  );
});