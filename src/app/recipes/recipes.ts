import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService, RecipeData } from '../recipe';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, RouterLink],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class Recipes implements OnInit {
  recipes: RecipeData[] = [];
  searchText = '';
  selectedCountry = 'All';
  errorMessage = '';
  isDeleting = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Could not load recipes:', error);
        this.errorMessage =
          'Could not load recipes. Please check that the backend is running.';
      }
    });
  }

  get filteredRecipes(): RecipeData[] {
    return this.recipes.filter(recipe => {
      const matchesName = recipe.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchesCountry =
        this.selectedCountry === 'All' ||
        recipe.country === this.selectedCountry;

      return matchesName && matchesCountry;
    });
  }

  deleteRecipe(recipe: RecipeData): void {
    if (recipe.id === undefined || this.isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${recipe.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.recipeService.deleteRecipe(recipe.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadRecipes();
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Could not delete recipe:', error);
        this.errorMessage =
          'Unable to delete the recipe. Please try again.';
      }
    });
  }
}