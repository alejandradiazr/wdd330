const COUNTRIES_API = "https://countries.dev";

const countryNames = {
    Japanese: "Japan",
    Spanish: "Spain",
    British: "United Kingdom",
    French: "France",
    Italian: "Italy",
    Chinese: "China",
    Indian: "India",
    Thai: "Thailand",
    Portuguese: "Portugal",
    Mexican: "Mexico",
    American: "United States",
    Canadian: "Canada",
    Greek: "Greece",
    Turkish: "Turkey",
    Egyptian: "Egypt",
    Moroccan: "Morocco",
    Malaysian: "Malaysia",
    Filipino: "Philippines",
    Russian: "Russia",
    Croatian: "Croatia",
    Jamaican: "Jamaica",
    Algerian: "Algeria",
    Saudi: "Saudi Arabia",
};

export async function getCountryInfo(countryName) {
    try {
        const country = countryNames[countryName] || countryName;

        const response = await fetch(
            `${COUNTRIES_API}/name/${encodeURIComponent(country)}`
        );

        if (!response.ok) {
            throw new Error("Unable to get country information.");
        }

        const data = await response.json();

        return data[0] || null;
    } catch (error) {
        console.error("Error getting country information:", error);
        return null;
    }
}