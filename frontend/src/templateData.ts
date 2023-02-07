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

export const ingredients = [
  {
    id: `${Math.random()}`,
    label: 'b',
    category: 'd',
    measure: `${Math.random()}`,
  },
  {
    id: `${Math.random()}`,
    label: 'a',
    category: 'q',
    measure: `${Math.random()}`,
  },
  {
    id: `${Math.random()}`,
    label: 'd',
    category: 'a',
    measure: `${Math.random()}`,
  },
  {
    id: `${Math.random()}`,
    label: 'c',
    category: 'c',
    measure: `${Math.random()}`,
  },
  {
    id: `${Math.random()}`,
    label: 'q',
    category: 'b',
    measure: `${Math.random()}`,
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
