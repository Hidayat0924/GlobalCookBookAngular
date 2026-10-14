import { Component } from '@angular/core';

@Component({
  selector: 'app-recipe',
  imports: [],
  templateUrl: './recipe.html',
  styleUrl: './recipe.css'
})
export class Recipe {

  recipeName: string = 'Hyderabadi Biryani';

  country: string = 'India';

  category: string = 'Main Course';

  ingredients: string = 'Rice, Chicken, Yogurt, Spices';

  showDetails: boolean = true;


  changeRecipe(): void {

    this.recipeName = 'Pizza Margherita';

    this.country = 'Italy';

    this.category = 'Main Course';

    this.ingredients =
      'Dough, Tomato Sauce, Mozzarella, Basil';

  }

}