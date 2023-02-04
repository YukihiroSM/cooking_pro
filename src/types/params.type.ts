type Params = {
  userID: string;
  mealID: string;
};

type SearchParams = {
  category?: string;
  ingredient?: string[];
  userID?: string;
  page: number;
  perPage: number;
};

export type { Params, SearchParams };
