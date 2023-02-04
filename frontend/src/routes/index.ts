import createIngredient from './create-ingredient.route';
import main from './main.route';
import mealsSingle from './meals-single.route';
import mealsByIngredients from './meals-by-ingredients.route';
import mealsByCategory from './meals-by-category.route';
import userPossibleMeals from './user-possible-meals.route';
import notFound from './not-found.route';
import userLogin from './user-login.route';
import userRegister from './user-register.route';

const routes = [
  createIngredient,
  main,
  mealsByIngredients,
  mealsByCategory,
  userPossibleMeals,
  mealsSingle,
  userLogin,
  userRegister,
  notFound,
];

export default routes;
