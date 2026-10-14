
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { RecipeService, RecipeData } from '../recipe';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-recipe.html',
  styleUrl: './edit-recipe.css'
})
export class EditRecipe implements OnInit {
  recipeId = 0;
  recipeName = '';
  country = '';
  category = '';
  ingredients = '';

  isLoading = true;
  isSaving = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    console.log('Edit Recipe component started');

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Recipe ID from URL:', id);

    if (!Number.isInteger(id) || id <= 0) {
      this.message = 'Invalid recipe ID in the URL.';
      this.isLoading = false;
      return;
    }

    this.recipeId = id;

    this.recipeService.getRecipes().subscribe({
      next: (recipes: RecipeData[]) => {
        console.log('Recipes received from API:', recipes);

        const recipe = recipes.find(
          item => Number(item.id) === id
        );

        console.log('Selected recipe:', recipe);

        if (!recipe) {
          this.message = `Recipe ID ${id} was not found.`;
          this.isLoading = false;
          return;
        }

        this.recipeName = recipe.name;
        this.country = recipe.country;
        this.category = recipe.category;
        this.ingredients = recipe.ingredients;

        console.log('Recipe name:', this.recipeName);

        this.isLoading = false;

        console.log('Loading after:', this.isLoading);
      },
      error: (error) => {
        console.error('Failed to load recipe:', error);

        this.message =
          'Could not load the recipe. Check that FastAPI is running.';

        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (this.isSaving) {
      return;
    }

    if (
      !this.recipeName.trim() ||
      !this.country.trim() ||
      !this.category.trim() ||
      !this.ingredients.trim()
    ) {
      this.message = 'Please fill in all fields.';
      return;
    }

    const updatedRecipe: RecipeData = {
      name: this.recipeName.trim(),
      country: this.country.trim(),
      category: this.category.trim(),
      ingredients: this.ingredients.trim()
    };

    this.isSaving = true;
    this.message = '';

    this.recipeService
      .updateRecipe(this.recipeId, updatedRecipe)
      .subscribe({
        next: () => {
          this.isSaving = false;
          console.log('Recipe updated successfully');

          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          console.error('Failed to update recipe:', error);

          this.isSaving = false;
          this.message =
            'Could not save changes. Please try again.';
        }
      });
  }
}
