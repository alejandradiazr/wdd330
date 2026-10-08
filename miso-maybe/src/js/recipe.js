import { getRecipeById } from "./api.js";
import { getCountryInfo } from "./country.js";

async function loadPartial(selector, file) {
    const element = document.querySelector(selector);

    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Could not load ${file}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

async function loadHeaderFooter() {
    await loadPartial(
        "#main-header",
        `${import.meta.env.BASE_URL}partials/header.html`
    );

    await loadPartial(
        "#main-footer",
        `${import.meta.env.BASE_URL}partials/footer.html`
    );
}

function getRecipeId() {
    const params = new URLSearchParams(window.location.search);

    return params.get("id");
}

async function displayRecipe() {
    const recipeId = getRecipeId();
    const container = document.querySelector("#recipe-details");

    if (!recipeId) {
        container.innerHTML = "<p>Recipe not found. 🐱</p>";
        return;
    }

    container.innerHTML = "<p>Miso is preparing your recipe... 🐱🍜</p>";

    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
        container.innerHTML =
            "<p>Sorry! Miso couldn't find that recipe. 🐱</p>";
        return;
    }

    const countryInfo = await getCountryInfo(recipe.strArea);

    container.innerHTML = `
    <article class="recipe-detail-card">
      <img
        src="${recipe.strMealThumb}"
        alt="${recipe.strMeal}"
      />

      <div class="recipe-detail-content">
        <p class="eyebrow">${recipe.strCategory || "Recipe"}</p>

        <h1>${recipe.strMeal}</h1>

        <p>
          <strong>Origin:</strong>
          ${recipe.strArea || "Unknown"}
        </p>

${countryInfo
            ? `
      <div class="country-card">
        <p class="eyebrow">🌎 A Little Taste Of...</p>
        <h2>${countryInfo.name || recipe.strArea}</h2>
<p>
  <strong>Capital:</strong>
  ${countryInfo.capital || "Not available"}
</p>
          <strong>Region:</strong>
          ${countryInfo.region || "Not available"}
        </p>
      </div>
    `
            : ""
        }

        <button
          type="button"
          id="save-recipe"
          class="save-recipe-button"
        >
          ❤️ Save to My Little Cookbook
        </button>

        <h2>Ingredients</h2>

<p class="checklist-message">
  Miso says: Check them off as you cook! 🐱💗
</p>

<ul class="ingredients-checklist">
  ${getIngredients(recipe)}
</ul>

        <h2>Instructions</h2>

        <p class="instructions">
          ${recipe.strInstructions || "Instructions unavailable."}
        </p>
      </div>
    </article>
  `;

    const saveButton = document.querySelector("#save-recipe");

    saveButton.addEventListener("click", () => {
        saveRecipe(recipe);

        saveButton.textContent = "💗 Saved to My Little Cookbook!";
    });
}

function saveRecipe(recipe) {
    const favorites =
        JSON.parse(localStorage.getItem("misoFavorites")) || [];

    const alreadySaved = favorites.some(
        (favorite) => favorite.idMeal === recipe.idMeal
    );

    if (!alreadySaved) {
        favorites.push(recipe);

        localStorage.setItem(
            "misoFavorites",
            JSON.stringify(favorites)
        );
    }
}

function getIngredients(recipe) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`
        <li class="ingredient-item">
          <label>
            <input type="checkbox" />
            <span>
              ${measure || ""} ${ingredient}
            </span>
          </label>
        </li>
      `);
        }
    }

    return ingredients.join("");
}

loadHeaderFooter();
displayRecipe();