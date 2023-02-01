import createIngredient from './create-ingredient.route';
import main from './main.route';
import mealsSingle from './meals-single.route';
import meals from './meals.route';
import notFound from './not-found.route';
import userLogin from './user-login.route';
import userProfile from './user-profile.route';
import userRegister from './user-register.route';

const routes = [
  createIngredient,
  main,
  mealsSingle,
  meals,
  userLogin,
  userProfile,
  userRegister,
  notFound,
];

export default routes;
