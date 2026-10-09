function loadPartial(selector, file) {
  const element = document.querySelector(selector);

  if (!element) return;

  fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${file}`);
      }

      return response.text();
    })
    .then((html) => {
      element.innerHTML = html;
    })
    .catch((error) => {
      console.error(error);
    });
}

function loadHeaderFooter() {
  loadPartial(
    "#main-header",
    `${import.meta.env.BASE_URL}partials/header.html`
  );

  loadPartial(
    "#main-footer",
    `${import.meta.env.BASE_URL}partials/footer.html`
  );
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("misoFavorites")) || [];
}

function displayFavorites() {
  const container = document.querySelector("#favorites-results");
  const favorites = getFavorites();

  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `
            <p>
                Your cookbook is still empty. 🐱
                Go find a recipe you love!
            </p>
        `;
    return;
  }

  container.innerHTML = favorites
    .map(
      (recipe) => `
                <article class="recipe-card">
                    <img
                        src="${recipe.strMealThumb}"
                        alt="${recipe.strMeal}"
                    />

                    <div class="recipe-info">
                        <h3>${recipe.strMeal}</h3>

                        <p>${recipe.strCategory || "Recipe"}</p>

                        <p>${recipe.strArea || ""}</p>

                        <a
                            href="${import.meta.env.BASE_URL}recipe/?id=${recipe.idMeal}"
                            class="view-recipe"
                        >
                            View Recipe →
                        </a>

                        <button
                            type="button"
                            class="remove-recipe-button"
                            data-remove-id="${recipe.idMeal}"
                        >
                            🗑️ Remove from Cookbook
                        </button>
                    </div>
                </article>
            `
    )
    .join("");
}

function removeFavorite(recipeId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (recipe) => recipe.idMeal !== recipeId
  );

  localStorage.setItem(
    "misoFavorites",
    JSON.stringify(updatedFavorites)
  );

  displayFavorites();
}

const favoritesContainer = document.querySelector("#favorites-results");

if (favoritesContainer) {
  favoritesContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-id]");

    if (!removeButton) return;

    removeFavorite(removeButton.dataset.removeId);
  });
}

loadHeaderFooter();
displayFavorites();