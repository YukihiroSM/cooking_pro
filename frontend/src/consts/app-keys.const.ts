const BACKEND_KEYS = {
  MEALS_BY_INGREDIENTS: 'meals/filter',
  MEALS_BY_CATEGORY: 'meals/category/',
  CATEGORIES_AND_INGREDIENTS: 'meals/categories_and_ingredients',
  RANDOM_MEALS: 'meals/random',
  SINGLE_MEAL: 'meals/',
  USER_INGREDIENTS: '/ingredients',
  USER_POSSIBLE_MEALS: '/possible_meals',
  CREATE_USER_INGREDIENT: '/create_ingredient',
  DELETE_USER_INGREDIENT: '/delete_ingredient',
  REGISTER_USER: 'user/register',
  LOGIN_USER: 'user/login',
};

const ROUTER_KEYS = {
  MAIN: '/',
  MEALS_BY_INGREDIENTS: '/meals/filter',
  MEALS_BY_CATEGORY: '/meals/category/:category',
  SINGLE_MEAL: '/meals/:mealID',
  CREATE_INGREDIENT: '/meals/create-ingredient/:userID',
  USER_POSSIBLE_MEALS: '/user/:userID/possible-meals',
  USER_INGREDIENTS: '/user/:userID/ingredients',
  USER_LOGIN: '/user/login',
  USER_REGISTER: '/user/register',
  NOT_FOUND: '*',
};

const REACT_QUERY_KEYS = {
  USER_INGREDIENTS: 'user-ingredients',
  SINGLE_MEAL: 'single-meal',
  MEALS_BY_CATEGORY: 'meals-by-category',
  MEALS_BY_INGREDIENTS: 'meals-by-ingredients',
  RANDOM_MEAL: 'random-meal',
  USER_POSSIBLE_MEALS: 'user-possible-meals',
  CATEGORIES_AND_INGREDIENTS: 'categories-and-ingredients',
};

const TEAM = [
  {
    name: 'Andrii Smidonov',
    linkedIn: 'https://www.linkedin.com/in/andrii-smidonov',
    gitHub: 'https://github.com/yukihirosm',
  },
  {
    name: 'Ruslan Kotliarenko',
    linkedIn: 'https://www.linkedin.com/in/ruslan-kotliarenko-3605b8252',
    gitHub: 'https://github.com/ruslankotliar',
  },
  {
    name: 'Dmytro Omelian',
    linkedIn: 'https://www.linkedin.com/in/dichik',
    gitHub: 'https://github.com/Dichik',
  },
  {
    name: 'Sofiia Shaposhnikova',
    linkedIn: 'https://www.linkedin.com/in/sofiia-shaposhnikova-9854931b7',
    gitHub: 'https://github.com/Teasotea',
  },
];

const CAROUSEL_CATEGORIES = ['All', 'Breakfast', 'Vegan', 'Dessert'];

const PER_PAGE_VALUES = [10, 20, 30, 40, 50];

const USER_INGREDIENTS_PARAMS = ['Category', 'Label', 'Measure'];

// string to prevent react hook order bug
const PREVENT_BUG = 'Goat';

const BASIC_INGREDIENTS_MEASURES = [
  'g',
  'tsp',
  'ml',
  'kg',
  'tbs',
  'tblsp',
  'lbs',
  'lb',
  'tbsp',
];

export {
  BACKEND_KEYS,
  ROUTER_KEYS,
  TEAM,
  REACT_QUERY_KEYS,
  CAROUSEL_CATEGORIES,
  PER_PAGE_VALUES,
  PREVENT_BUG,
  USER_INGREDIENTS_PARAMS,
  BASIC_INGREDIENTS_MEASURES,
};
