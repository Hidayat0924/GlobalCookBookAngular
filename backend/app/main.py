from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Global CookBook API")

# Allow requests from the Angular development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep the database inside the backend folder.
DATABASE = Path(__file__).resolve().parent.parent / "cookbook.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                country TEXT NOT NULL,
                category TEXT NOT NULL,
                ingredients TEXT NOT NULL
            )
        """)


initialize_database()


class RecipeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    country: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    ingredients: str = Field(min_length=1, max_length=3000)


class RecipeResponse(RecipeCreate):
    id: int


@app.get("/")
def root():
    return {"message": "Global CookBook API is running!"}


@app.get("/api/recipes", response_model=list[RecipeResponse])
def get_recipes():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, name, country, category, ingredients "
            "FROM recipes ORDER BY id DESC"
        ).fetchall()

    return [dict(row) for row in rows]


@app.post("/api/recipes", response_model=RecipeResponse, status_code=201)
def create_recipe(recipe: RecipeCreate):
    values = [
        recipe.name.strip(),
        recipe.country.strip(),
        recipe.category.strip(),
        recipe.ingredients.strip(),
    ]

    if any(not value for value in values):
        raise HTTPException(
            status_code=422,
            detail="All recipe fields are required."
        )

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO recipes (name, country, category, ingredients)
            VALUES (?, ?, ?, ?)
            """,
            values,
        )

        recipe_id = cursor.lastrowid
        row = connection.execute(
            "SELECT id, name, country, category, ingredients "
            "FROM recipes WHERE id = ?",
            (recipe_id,),
        ).fetchone()

    return dict(row)
# Update an existing recipe
@app.put("/api/recipes/{recipe_id}", response_model=RecipeResponse)
def update_recipe(recipe_id: int, recipe: RecipeCreate):
    values = [
        recipe.name.strip(),
        recipe.country.strip(),
        recipe.category.strip(),
        recipe.ingredients.strip(),
    ]

    if any(not value for value in values):
        raise HTTPException(
            status_code=422,
            detail="All recipe fields are required."
        )

    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM recipes WHERE id = ?",
            (recipe_id,)
        ).fetchone()

        if existing is None:
            raise HTTPException(
                status_code=404,
                detail="Recipe not found."
            )

        connection.execute(
            """
            UPDATE recipes
            SET name = ?, country = ?, category = ?, ingredients = ?
            WHERE id = ?
            """,
            (*values, recipe_id)
        )

        row = connection.execute(
            """
            SELECT id, name, country, category, ingredients
            FROM recipes
            WHERE id = ?
            """,
            (recipe_id,)
        ).fetchone()

    return dict(row)


# Delete a recipe
@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM recipes WHERE id = ?",
            (recipe_id,)
        ).fetchone()

        if existing is None:
            raise HTTPException(
                status_code=404,
                detail="Recipe not found."
            )

        connection.execute(
            "DELETE FROM recipes WHERE id = ?",
            (recipe_id,)
        )

    return {
        "message": f"Recipe {recipe_id} deleted successfully."
    }