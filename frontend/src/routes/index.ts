import main from './main.route';
import mealsSingle from './meals-single.route';
import mealsByIngredients from './meals-by-ingredients.route';
import mealsByCategory from './meals-by-category.route';
import userPossibleMeals from './user-possible-meals.route';
import notFound from './not-found.route';
import userLogin from './user-login.route';
import userRegister from './user-register.route';
import userIngredients from './user-ingredients.route';

const routes = [
  main,
  mealsByIngredients,
  mealsByCategory,
  mealsSingle,
  userLogin,
  userRegister,
  userIngredients,
  userPossibleMeals,
  notFound,
];

export default routes;
