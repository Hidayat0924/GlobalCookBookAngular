import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Recipes } from './recipes/recipes';
import { AddRecipe } from './add-recipe/add-recipe';
import { Login } from './login/login';
import { Register } from './register/register';
import { Experiments } from './experiments/experiments';
import { EditRecipe } from './edit-recipe/edit-recipe';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'recipes', component: Recipes },
  { path: 'add-recipe', component: AddRecipe },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'experiments', component: Experiments },
  { path: 'edit-recipe/:id', component: EditRecipe },
  { path: '**', redirectTo: '' }
];