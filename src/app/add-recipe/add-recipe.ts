import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService, RecipeData } from '../recipe';

@Component({
  selector: 'app-add-recipe',
  imports: [FormsModule],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})
export class AddRecipe {
  recipeName = '';
  country = '';
  category = '';
  ingredients = '';

  message = '';
  isSaving = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  addRecipe(): void {
    if (
      !this.recipeName.trim() ||
      !this.country.trim() ||
      !this.category.trim() ||
      !this.ingredients.trim()
    ) {
      this.message = 'Please fill in all fields.';
      return;
    }

    const newRecipe: RecipeData = {
      name: this.recipeName.trim(),
      country: this.country.trim(),
      category: this.category.trim(),
      ingredients: this.ingredients.trim()
    };

    this.isSaving = true;
    this.message = '';

    this.recipeService.addRecipe(newRecipe).subscribe({
      next: (savedRecipe) => {
        this.isSaving = false;
        this.message = `Recipe "${savedRecipe.name}" saved successfully!`;

        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Could not save recipe:', error);
        this.message =
          'Unable to save the recipe. Check that FastAPI is running.';
      }
    });
  }
}