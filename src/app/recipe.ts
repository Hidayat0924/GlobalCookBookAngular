import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecipeData {
  id?: number;
  name: string;
  country: string;
  category: string;
  ingredients: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://127.0.0.1:8000/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<RecipeData[]> {
    return this.http.get<RecipeData[]>(this.apiUrl);
  }

  addRecipe(recipe: RecipeData): Observable<RecipeData> {
    return this.http.post<RecipeData>(this.apiUrl, recipe);
  }

  updateRecipe(
    id: number,
    recipe: RecipeData
  ): Observable<RecipeData> {
    return this.http.put<RecipeData>(
      `${this.apiUrl}/${id}`,
      recipe
    );
  }

  deleteRecipe(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}