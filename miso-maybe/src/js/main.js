import {
    searchRecipes,
    getRandomRecipe,
    filterRecipesByIngredient,
} from "./api.js";

const moodSearches = {
    sweet: "cake",
    cozy: "soup",
    spicy: "curry",
    fresh: "salad",
    quick: "pasta",
};

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

function recipeCard(recipe) {
    return `
    <a
      href="${import.meta.env.BASE_URL}recipe/?id=${recipe.idMeal}"
      class="recipe-card"
    >
      <img
        src="${recipe.strMealThumb}"
        alt="${recipe.strMeal}"
      />

      <div class="recipe-info">
        <h3>${recipe.strMeal}</h3>

        <p>${recipe.strCategory || "Recipe"}</p>

        <p>${recipe.strArea || ""}</p>

        <span class="view-recipe">
          View Recipe →
        </span>
      </div>
    </a>
  `;
}

async function handleSearch(event) {
    event.preventDefault();

    const input = document.querySelector("#search-input");
    const results = document.querySelector("#recipe-results");

    const query = input.value.trim();

    if (!query) return;

    results.innerHTML = "<p>Miso is looking for recipes... 🐱</p>";

    const recipes = await searchRecipes(query);

    if (recipes.length === 0) {
        results.innerHTML =
            "<p>Miso couldn't find any recipes. Try another search! 🐱</p>";
        return;
    }

    results.innerHTML = recipes
        .map(recipeCard)
        .join("");
}

async function handleIngredientSearch(event) {
    event.preventDefault();

    const input = document.querySelector("#ingredient-input");
    const results = document.querySelector("#recipe-results");
    const ingredient = input.value.trim();

    if (!ingredient) return;

    results.innerHTML =
        "<p>Miso is checking your kitchen... 🐱🥕</p>";

    const recipes = await filterRecipesByIngredient(ingredient);

    if (recipes.length === 0) {
        results.innerHTML =
            "<p>Miso couldn't find recipes with that ingredient. Try another one! 🐱</p>";
        return;
    }

    results.innerHTML = recipes.map(recipeCard).join("");
}

async function handleSurprise() {
    const results = document.querySelector("#recipe-results");

    results.innerHTML = "<p>Miso is choosing something delicious... 🐱✨</p>";

    const recipe = await getRandomRecipe();

    if (!recipe) {
        results.innerHTML =
            "<p>Miso couldn't find a surprise recipe. Try again! 🐱</p>";
        return;
    }

    results.innerHTML = `
    <a
      href="${import.meta.env.BASE_URL}recipe/?id=${recipe.idMeal}"
      class="recipe-card"
    >
      <img
        src="${recipe.strMealThumb}"
        alt="${recipe.strMeal}"
      />

      <div class="recipe-info">
        <p class="eyebrow">✨ Miso's Surprise Pick</p>

        <h3>${recipe.strMeal}</h3>

        <p>${recipe.strCategory || "Recipe"}</p>

        <p>${recipe.strArea || ""}</p>

        <span class="view-recipe">
          View Recipe →
        </span>
      </div>
    </a>
  `;
}

async function handleMood(mood) {
    const results = document.querySelector("#recipe-results");

    const searchTerm = moodSearches[mood];

    if (!searchTerm) return;

    results.innerHTML = `
    <p>
      Miso is looking for something ${mood}... 🐱💗
    </p>
  `;

    const recipes = await searchRecipes(searchTerm);

    if (recipes.length === 0) {
        results.innerHTML = `
      <p>
        Miso couldn't find anything for this mood. Try another one! 🐱
      </p>
    `;

        return;
    }

    results.innerHTML = recipes
        .map(recipeCard)
        .join("");
}

loadHeaderFooter();

document
    .querySelector("#search-form")
    .addEventListener("submit", handleSearch);

document
    .querySelector("#ingredient-form")
    .addEventListener("submit", handleIngredientSearch);

document
    .querySelector("#surprise-button")
    .addEventListener("click", handleSurprise);

document.querySelectorAll("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
        const mood = button.dataset.mood;

        handleMood(mood);
    });
});

async function loadFeaturedRecipes() {
    const results = document.querySelector("#recipe-results");

    results.innerHTML = `
        <p class="loading-message">
            Miso is picking a few favorites for you... 🐱💗
        </p>
    `;

    const recipes = await searchRecipes("chicken");

    if (recipes.length === 0) {
        results.innerHTML = `
            <p>
                Miso couldn't find today's picks. Try searching for something!
                🐱
            </p>
        `;
        return;
    }

    results.innerHTML = recipes
        .slice(0, 6)
        .map(recipeCard)
        .join("");
}

loadFeaturedRecipes();

console.log("Miso Maybe is ready! 🐱🍜");