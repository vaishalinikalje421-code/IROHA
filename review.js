
document.addEventListener("DOMContentLoaded", () => {

    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Load saved learning materials
    const savedItems = JSON.parse(localStorage.getItem("irohaReview")) || {
        vocabulary: [],
        grammar: [],
        characters: []
    };

    // Page elements
    const statValues = document.querySelectorAll(".stat-card h2");
    const tabs = document.querySelectorAll(".review-tab");
    const reviewSection = document.querySelector(".review-section");
    const emptyState = document.querySelector(".review-empty");

    // Count saved materials
    const vocabularyCount = savedItems.vocabulary.length;
    const grammarCount = savedItems.grammar.length;
    const characterCount = savedItems.characters.length;

    const totalCount = vocabularyCount + grammarCount + characterCount;

    // Update statistics
    statValues[0].textContent = vocabularyCount;
    statValues[1].textContent = grammarCount;
    statValues[2].textContent = totalCount;

    // Filter review collection
    function filterItems(category) {

        const items = category === "all"
            ? [
                ...savedItems.vocabulary,
                ...savedItems.grammar,
                ...savedItems.characters
            ]
            : savedItems[category];

        // Remove previous item list
        const existingList = document.querySelector(".review-items");

        if (existingList) {
            existingList.remove();
        }

        // Show empty state if no items exist
        if (items.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        // Create review item list
        const itemList = document.createElement("div");
        itemList.className = "review-items";

        items.forEach(item => {
            const itemCard = document.createElement("div");
            itemCard.className = "review-item";

            const title = document.createElement("h3");
            title.textContent = item.title || item.word || item.character || "Learning Item";

            const description = document.createElement("p");
            description.textContent = item.meaning || item.description || item.note || "";

            itemCard.appendChild(title);
            itemCard.appendChild(description);
            itemList.appendChild(itemCard);
        });

        reviewSection.appendChild(itemList);
    }

    // Review tab interactions
    const categories = ["all", "vocabulary", "grammar", "characters"];

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {

            tabs.forEach(button => button.classList.remove("active"));
            tab.classList.add("active");

            filterItems(categories[index]);
        });
    });

    // Initial display
    filterItems("all");

});
