const BACKEND_KEYS = {
  // categories and ingredients
  GET_CATEGORIES_AND_INGREDIENTS: 'categories_and_ingredients',

  // filtering by category or ingredient
  GET_MEALS_BY_FILTER: 'meals', // + filter in search params
  // random meal
  GET_RANDOM_MEAL: 'meals/random',
  // single meal
  GET_SINGLE_MEAL: 'meals/single/', // + meal ID
  // meals which match the set of ingredients that user has
  GET_USER_MEALS_BY_INGREDIENTS: 'meals/user/', // + user ID

  // ingredients that user has (sorted by categories on backend)
  GET_USER_INGREDIENTS: 'user/ingredients/', // + user ID
  // creating new ingredient
  CREATE_USER_INGREDIENT: 'user/create_ingredient/', // + user ID

  // user registration and authorization
  REGISTER_USER: 'user/register',
  LOGIN_USER: 'user/login',

  // ----------- additional tasks ---------- //
  // GET_USER_MEALS: 'user/meals/',
  // CREATE_USER_MEAL: 'user/create_meal/',
};

const ROUTER_KEYS = {
  MAIN: '/',
  MEALS_BY_FILTER: '/meals',
  SINGLE_MEAL: '/meals/single-meal/:mealID',
  CREATE_INGREDIENT: '/meals/create-ingredient/:userID',
  USER_PROFILE: '/user/profile/:userID',
  USER_LOGIN: '/user/login',
  USER_REGISTER: '/user/register',
  NOT_FOUND: '*',
  // ----------- additional tasks ---------- //
  // CREATE_MEAL: '/meal/create-meal',
};

export { BACKEND_KEYS, ROUTER_KEYS };
