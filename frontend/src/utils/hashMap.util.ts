import { formatNumber } from './formatNumber.util';

export const storeRequiredIngredients = <T>(values: T[]) => {
  const store: any = {};
  values.forEach((value: any) => {
    const measure = formatNumber(value.measure as keyof T);
    store[value.label as keyof T] = measure.length ? measure : '1';
  });
  return store;
};
