const BACKEND_KEYS = {
  GET_CATEGORIES_AND_INGREDIENTS: 'meals/categories_and_ingredients',
  GET_MEALS_BY_FILTER: 'meals',
  GET_RANDOM_MEALS: 'meals/random',
  GET_SINGLE_MEAL: 'meals/',
  GET_USER_INGREDIENTS: '/ingredients',
  CREATE_USER_INGREDIENT: '/create_ingredient',
  REGISTER_USER: 'user/register',
  LOGIN_USER: 'user/login',

  // ----------- additional tasks ---------- //
  // GET_USER_MEALS: 'user/meals/', // + userID
  // CREATE_USER_MEAL: 'user/create_meal/',
};

const ROUTER_KEYS = {
  MAIN: '/',
  MEALS_BY_FILTER: '/meals/',
  SINGLE_MEAL: '/meals/single-meal/:mealID',
  CREATE_INGREDIENT: '/meals/create-ingredient/:userID',
  USER_PROFILE: '/user/profile/:userID',
  USER_LOGIN: '/user/login',
  USER_REGISTER: '/user/register',
  NOT_FOUND: '*',
  // ----------- additional tasks ---------- //
  // CREATE_MEAL: '/meal/create-meal',
};

const REACT_QUERY_KEYS = {
  USER_INGREDIENTS: 'user-ingredients',
  SINGLE_MEAL: 'single-meal',
  ALL_MEALS: 'all-meals',
  RANDOM_MEAL: 'random-meal',
  USER_MEALS: 'user-meals',
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
    linkedIn: 'https://linkedin.com/in/ruslan-kotliarenko',
    gitHub: 'https://github.com/ruslankotliar',
  },
  {
    name: 'Dmytro Omelian',
    linkedIn: 'https://linkedin.com/in/dichik',
    gitHub: 'https://github.com/Dichik',
  },
  {
    name: 'Sofiia Shaposhnikova',
    linkedIn: 'https://linkedin.com/in/sofiia-shaposhnikova',
    gitHub: 'https://github.com/Teasotea',
  },
];

export { BACKEND_KEYS, ROUTER_KEYS, TEAM, REACT_QUERY_KEYS };
