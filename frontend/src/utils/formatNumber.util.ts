export const formatNumber = (value: string | number | symbol): string => {
  const newValue = value.toString().replace(/[^\d.-]/g, '');
  return newValue.length ? newValue : '1';
};
