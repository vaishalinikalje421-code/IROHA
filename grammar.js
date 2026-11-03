
const N5_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n5.json";

const N4_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n4.json";

const levelButtons = document.querySelectorAll(".jlpt-card");
const grammarLibrary = document.querySelector(".grammar-library");
const grammarGrid = document.getElementById("grammarCategoryGrid");
const levelTitle = document.getElementById("selectedLevelTitle");
const categoryCount = document.getElementById("categoryCount");
const noCategoriesMessage = document.getElementById("noCategoriesMessage");

let grammarData = [];
let selectedLevel = "";
let selectedCategory = "";

// Convert tags into readable category names
function formatCategory(tag) {
    return tag
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

// Load grammar data
async function loadGrammar(level) {
    selectedLevel = level;

    const api = level === "N5" ? N5_API : N4_API;

    grammarGrid.innerHTML = "<p>Loading grammar patterns...</p>";

    try {
        const response = await fetch(api);

        if (!response.ok) {
            throw new Error("Unable to load grammar data.");
        }

        grammarData = await response.json();

        showCategories();

    } catch (error) {
        console.error(error);
        grammarGrid.innerHTML =
            "<p>Something went wrong while loading grammar. Please try again.</p>";
    }
}

// Show grammar categories
function showCategories() {
    selectedCategory = "";

    levelTitle.textContent = `JLPT ${selectedLevel} Grammar`;
    categoryCount.textContent = `${grammarData.length} grammar patterns`;

    grammarGrid.innerHTML = "";

    const categories = [...new Set(
        grammarData.flatMap(item =>
            Array.isArray(item.tags) && item.tags.length
                ? item.tags
                : ["other"]
        )
    )].sort();

    categories.forEach(tag => {
        const patterns = grammarData.filter(item =>
            Array.isArray(item.tags)
                ? item.tags.includes(tag)
                : tag === "other"
        );

        const card = document.createElement("button");
        card.className = "grammar-category-card";

        card.innerHTML = `
            <span class="category-label">${selectedLevel}</span>
            <h3>${formatCategory(tag)}</h3>
            <p>Explore grammar patterns in this category.</p>
            <span class="category-count">${patterns.length} patterns</span>
            <span class="category-arrow">Explore →</span>
        `;

        card.addEventListener("click", () => {
            selectedCategory = tag;

            const url = new URL(window.location.href);
            url.searchParams.set("level", selectedLevel);
            url.searchParams.set("category", tag);

            window.location.href = url;
        });

        grammarGrid.appendChild(card);
    });

    noCategoriesMessage.hidden = categories.length > 0;
}

// Show patterns inside a selected category
function showPatterns(tag) {
    selectedCategory = tag;

    const patterns = grammarData.filter(item =>
        Array.isArray(item.tags)
            ? item.tags.includes(tag)
            : tag === "other"
    );

    levelTitle.textContent = formatCategory(tag);
    categoryCount.textContent = `${patterns.length} patterns`;

    grammarGrid.innerHTML = "";

    const backButton = document.createElement("button");
    backButton.className = "back-btn";
    backButton.textContent = "← All Categories";

    backButton.addEventListener("click", () => {
        const url = new URL(window.location.href);
        url.searchParams.delete("category");
        window.location.href = url;
    });

    grammarGrid.appendChild(backButton);

    patterns.forEach(item => {
        const card = document.createElement("a");

        card.className = "pattern-card";

        // Updated lesson page filename
        card.href =
            `grammer-lesson.html?id=${encodeURIComponent(item.id)}&level=${selectedLevel}`;

        card.innerHTML = `
            <span class="pattern-level">${item.level}</span>
            <h3>${item.pattern}</h3>
            <p>${item.meaning}</p>
            <span class="pattern-arrow">Learn pattern →</span>
        `;

        grammarGrid.appendChild(card);
    });

    noCategoriesMessage.hidden = patterns.length > 0;
}

// Handle N5 and N4 selection
levelButtons.forEach(button => {
    button.addEventListener("click", () => {
        const level = button.dataset.level;

        window.location.href = `grammar.html?level=${level}`;
    });
});

// Read URL and display the correct view
async function initializeGrammarPage() {
    const params = new URLSearchParams(window.location.search);

    const level = params.get("level");
    const category = params.get("category");

    if (!level || !["N5", "N4"].includes(level)) {
        return;
    }

    // Hide main landing sections
    document.querySelector(".grammar-hero").hidden = true;
    document.querySelector(".jlpt-section").hidden = true;

    grammarLibrary.hidden = false;

    await loadGrammar(level);

    if (category) {
        showPatterns(category);
    }
}

initializeGrammarPage();
