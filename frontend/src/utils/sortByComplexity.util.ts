import { SORTING_COEFFICIENT } from '../consts';
import { Meal } from '../types';

const calculateComplexity = <T>(item: T): number => {
  const { ingredients, instructions } = item as Meal;
  const value1 = ingredients.length * SORTING_COEFFICIENT['ingredients'];
  const value2 = instructions.length * SORTING_COEFFICIENT['instructions'];
  return value1 * value2;
};

export const sortByComplexity = <T>(values: T[], method: string): T[] =>
  values.sort((a: any, b: any) => {
    a = calculateComplexity(a);
    b = calculateComplexity(b);
    if (a < b) {
      return method === 'ascending' ? -1 : 1;
    }
    if (a > b) {
      return method === 'ascending' ? 1 : -1;
    }
    return 0;
  });
