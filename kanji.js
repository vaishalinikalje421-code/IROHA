const KANJI_PER_PAGE = 10;

let currentKanji = [];
let currentPage = 1;


// Display Kanji
function displayKanji(kanjiList) {

    if (!kanjiGrid) {
        console.error("Kanji grid element not found.");
        return;
    }

    currentKanji = Array.isArray(kanjiList) ? kanjiList : [];
    currentPage = 1;

    renderKanji();
}


// Render current page
function renderKanji() {

    if (!kanjiGrid) {
        console.error("Kanji grid element not found.");
        return;
    }

    kanjiGrid.innerHTML = "";

    const totalPages = Math.ceil(currentKanji.length / KANJI_PER_PAGE);

    // Keep current page within valid limits
    if (totalPages === 0) {
        currentPage = 1;
    } else {
        currentPage = Math.max(1, Math.min(currentPage, totalPages));
    }

    const startIndex = (currentPage - 1) * KANJI_PER_PAGE;
    const endIndex = Math.min(startIndex + KANJI_PER_PAGE, currentKanji.length);

    const visibleKanji = currentKanji.slice(startIndex, endIndex);

    // Create Kanji cards
    visibleKanji.forEach(item => {

        const card = document.createElement("div");
        card.className = "kanji-card";

        const character = document.createElement("div");
        character.className = "kanji-character";
        character.textContent = item.character || "—";

        const meaning = document.createElement("div");
        meaning.className = "kanji-meaning";
        meaning.textContent = Array.isArray(item.meanings)
            ? item.meanings.join(" · ")
            : "Meaning unavailable";

        const readings = document.createElement("div");
        readings.className = "kanji-readings";

        const onyomi = Array.isArray(item.onyomi) && item.onyomi.length
            ? item.onyomi.join(", ")
            : "—";

        const kunyomi = Array.isArray(item.kunyomi) && item.kunyomi.length
            ? item.kunyomi.join(", ")
            : "—";

        const onyomiText = document.createElement("p");
        onyomiText.innerHTML = `<strong>Onyomi:</strong> ${onyomi}`;

        const kunyomiText = document.createElement("p");
        kunyomiText.innerHTML = `<strong>Kunyomi:</strong> ${kunyomi}`;

        readings.append(onyomiText, kunyomiText);

        const level = document.createElement("small");
        level.className = "kanji-level";
        level.textContent = item.level || "Level unavailable";

        card.append(character, meaning, readings, level);

        kanjiGrid.appendChild(card);
    });


    // Update Kanji count
    if (kanjiCount) {

        if (currentKanji.length === 0) {
            kanjiCount.textContent = "No Kanji available.";
        } else {
            kanjiCount.textContent =
                `Showing ${startIndex + 1}–${endIndex} of ${currentKanji.length} Kanji`;
        }
    }

    updatePagination();
}


// Create Previous and Next buttons
function updatePagination() {

    let pagination = document.getElementById("kanjiPagination");

    if (!pagination) {

        pagination = document.createElement("div");
        pagination.id = "kanjiPagination";
        pagination.className = "kanji-pagination";

        kanjiGrid.after(pagination);
    }

    pagination.innerHTML = "";

    const totalPages = Math.ceil(currentKanji.length / KANJI_PER_PAGE);

    // No pagination needed if there is no Kanji
    if (totalPages <= 1) {
        pagination.style.display = "none";
        return;
    }

    pagination.style.display = "flex";


    // Previous button
    const previousButton = document.createElement("button");

    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", function () {

        if (currentPage > 1) {
            currentPage--;
            renderKanji();
        }

    });


    // Page number
    const pageInfo = document.createElement("span");

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;


    // Next button
    const nextButton = document.createElement("button");

    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", function () {

        if (currentPage < totalPages) {
            currentPage++;
            renderKanji();
        }

    });


    pagination.append(previousButton, pageInfo, nextButton);
}