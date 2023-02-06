export const sortByLabel = <T>(values: T[], param: string): T[] =>
  values.sort((a: any, b: any) => {
    if (a[param] < b[param]) {
      return -1;
    }
    if (a[param] > b[param]) {
      return 1;
    }
    return 0;
  });
