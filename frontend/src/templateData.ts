import { Meal, NavItem } from './types';

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Recipes',
    children: [
      {
        label: 'Breakfast',
      },
    ],
  },
  {
    label: 'Ingredients',
    children: [
      {
        label: 'Meat',
        children: [
          {
            label: 'Chicken',
          },
          {
            label: 'Beef',
          },
        ],
      },
      {
        label: 'Drinks',
        children: [
          {
            label: 'Milk',
          },
          {
            label: 'Tea',
          },
          {
            label: 'Coffee',
          },
        ],
      },
    ],
  },
];

export const templateMeal: Meal = {
  id: '53012',
  name: 'Gigantes Plaki',
  category: 'Vegetarian',
  area: 'Greek',
  instructions: 'Soak '.repeat(Math.floor(Math.random() * 50)),
  image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
  video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
  ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
  measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
};

export const templateIngredients = [
  {
    id: `${Math.random()}`,
    label: 'Red Chilli',
    category: 'd',
    measure: '1 large',
  },
  {
    id: `${Math.random()}`,
    label: 'Ginger',
    category: 'q',
    measure: '0.2',
  },
  {
    id: `${Math.random()}`,
    label: 'Garlic',
    category: 'a',
    measure: '2 large',
  },
  {
    id: `${Math.random()}`,
    label: 'Coriander',
    category: 'c',
    measure: 'Bunch',
  },
  {
    id: `${Math.random()}`,
    label: 'Chicken Stock',
    category: 'b',
    measure: '100g',
  },
];

export const templateMeals: Meal[] = [
  {
    id: '53012',
    name: 'Gigantes Plaki',
    category: 'Vegetarian',
    area: 'Greek',
    instructions: 'Soak '.repeat(Math.floor(Math.random() * 25)),
    image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
    ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
    measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
  },
  {
    id: '53012',
    name: 'Gigantes Plaki',
    category: 'Vegetarian',
    area: 'Greek',
    instructions: 'Soak '.repeat(Math.floor(Math.random() * 25)),
    image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
    ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
    measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
  },
  {
    id: '53012',
    name: 'Gigantes Plaki',
    category: 'Vegetarian',
    area: 'Greek',
    instructions: 'Soak '.repeat(Math.floor(Math.random() * 25)),
    image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
    ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
    measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
  },
  {
    id: '53012',
    name: 'Gigantes Plaki',
    category: 'Vegetarian',
    area: 'Greek',
    instructions: 'Soak '.repeat(Math.floor(Math.random() * 25)),
    image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
    ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
    measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
  },
  {
    id: '53012',
    name: 'Gigantes Plaki',
    category: 'Vegetarian',
    area: 'Greek',
    instructions: 'Soak '.repeat(Math.floor(Math.random() * 25)),
    image: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    video: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
    ingredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
    measures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
  },
];
