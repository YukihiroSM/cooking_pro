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
  instructions:
    'Soak the beans overnight in plenty of water. Drain, rinse, then place in a pan covered with water. Bring to the boil, reduce the heat, then simmer for approx 50 mins until slightly tender but not soft. Drain, then set aside.\r\n\r\nHeat oven to 180C/160C fan/gas 4. Heat the olive oil in a large frying pan, tip in the onion and garlic, then cook over a medium heat for 10 mins until softened but not browned. Add the tomato purée, cook for a further min, add remaining ingredients, then simmer for 2-3 mins. Season generously, then stir in the beans. Tip into a large ovenproof dish, then bake for approximately 1 hr, uncovered and without stirring, until the beans are tender. The beans will absorb all the fabulous flavours and the sauce will thicken. Allow to cool, then scatter with parsley and drizzle with a little more olive oil to serve.',
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

export const templateMeals: Meal[] = Array(12).fill(templateMeal);
