const API_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchRecipes(query) {
    try {
        const response = await fetch(
            `${API_URL}/search.php?s=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Unable to connect to TheMealDB.");
        }

        const data = await response.json();

        return data.meals || [];
    } catch (error) {
        console.error("Error searching recipes:", error);
        return [];
    }
}

export async function getRandomRecipe() {
    try {
        const response = await fetch(`${API_URL}/random.php`);

        if (!response.ok) {
            throw new Error("Unable to get a random recipe.");
        }

        const data = await response.json();

        return data.meals?.[0] || null;
    } catch (error) {
        console.error("Error getting random recipe:", error);
        return null;
    }
}

export async function getRecipeById(id) {
    try {
        const response = await fetch(`${API_URL}/lookup.php?i=${id}`);

        if (!response.ok) {
            throw new Error("Unable to get recipe details.");
        }

        const data = await response.json();

        return data.meals?.[0] || null;
    } catch (error) {
        console.error("Error getting recipe details:", error);
        return null;
    }
}

export async function filterRecipesByIngredient(ingredient) {
    try {
        const response = await fetch(
            `${API_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        if (!response.ok) {
            throw new Error("Unable to find recipes by ingredient.");
        }

        const data = await response.json();

        return data.meals || [];
    } catch (error) {
        console.error("Error filtering recipes by ingredient:", error);
        return [];
    }
}