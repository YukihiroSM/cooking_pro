type Meal = {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  image: string;
  video: string;
  ingredients: string[];
  measures: string[];
};

type SortBy = {
  value: string;
  label: string;
};

export type { Meal, SortBy };
