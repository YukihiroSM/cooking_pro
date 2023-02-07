import { BASIC_INGREDIENTS_MEASURES } from '../consts';

export const formatString = (value: string | number | symbol): string => {
  let newValue = value
    .toString()
    .replace(/\d+([,./]\d+)?/g, '')
    .trim();
  if (!newValue.length) return 'Quantity';
  if (BASIC_INGREDIENTS_MEASURES.includes(newValue.toLowerCase()))
    return newValue.toLowerCase();
  return newValue.charAt(0).toUpperCase() + newValue.slice(1);
};
