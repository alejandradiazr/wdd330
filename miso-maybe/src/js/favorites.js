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
    loadPartial("#main-header", "/partials/header.html");
    loadPartial("#main-footer", "/partials/footer.html");
}

function displayFavorites() {
    const container = document.querySelector("#favorites-results");

    const favorites =
        JSON.parse(localStorage.getItem("misoFavorites")) || [];

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
        <a
          href="/recipe/?id=${recipe.idMeal}"
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
      `
        )
        .join("");
}

loadHeaderFooter();
displayFavorites();