const decode = (
  arrayStr: (string | null)[] | undefined | null | string
): string[] | undefined => {
  if (typeof arrayStr === 'string') return arrayStr.split(',');
  else return undefined;
};

export const MyIngredientsParam = {
  encode: (array: string[] | undefined): string | undefined =>
    array ? array.join(',') : undefined,

  decode: (
    arrayStr: (string | null)[] | undefined | null | string
  ): string[] | undefined => decode(arrayStr),
};
