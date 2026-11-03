
const API_URL =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n5.json";

const vocabularyList = document.getElementById("vocabularyList");
const wordSearch = document.getElementById("wordSearch");
const levelButtons = document.querySelectorAll(".level-btn");
const resultsCount = document.getElementById("resultsCount");
const wordsPerPageSelect = document.getElementById("wordsPerPage");
const loadingMessage = document.getElementById("loadingMessage");
const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");
const pagination = document.getElementById("vocabPagination");
const previousPageButton = document.getElementById("previousPage");
const nextPageButton = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const totalWordCount = document.getElementById("totalWordCount");

let allWords = [];
let activeLevel = "all";
let currentPage = 1;
let wordsPerPage = 20;

// Temporary saved-word storage for this browser session.
// Persistent saving can be added later.
const savedWords = new Set();

async function loadVocabulary() {
    loadingMessage.hidden = false;
    emptyMessage.hidden = true;
    errorMessage.hidden = true;
    vocabularyList.innerHTML = "";
    pagination.hidden = true;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Vocabulary data is not an array.");
        }

        allWords = data.map((item, index) => ({
            id: item.id || `${item.word}-${index}`,
            word: item.word || "",
            reading: item.reading || "",
            romaji: item.romaji || "",
            meanings: Array.isArray(item.meanings)
                ? item.meanings
                : [],
            pos: Array.isArray(item.pos) ? item.pos : [],
            level: String(item.level || "N5").toUpperCase()
        })).filter(item => item.word && item.meanings.length);

        loadingMessage.hidden = true;

        updateWordCount();
        renderVocabulary();

        console.log(
            `Nihongo: Loaded ${allWords.length} vocabulary entries.`
        );
    } catch (error) {
        loadingMessage.hidden = true;
        errorMessage.hidden = false;

        console.error("Vocabulary loading failed:", error);
    }
}

function updateWordCount() {
    const count = allWords.length;

    totalWordCount.textContent = count.toLocaleString();
}

function getFilteredWords() {
    const searchTerm = wordSearch.value.trim().toLowerCase();

    return allWords.filter(item => {
        const matchesLevel =
            activeLevel === "all" || item.level === activeLevel;

        const searchableText = [
            item.word,
            item.reading,
            item.romaji,
            ...item.meanings,
            ...item.pos
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesLevel && matchesSearch;
    });
}

function renderVocabulary() {
    const filteredWords = getFilteredWords();
    const totalPages = Math.max(
        1,
        Math.ceil(filteredWords.length / wordsPerPage)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * wordsPerPage;
    const pageWords = filteredWords.slice(
        startIndex,
        startIndex + wordsPerPage
    );

    vocabularyList.innerHTML = "";

    pageWords.forEach(item => {
        const card = document.createElement("article");
        card.className = "word-card";

        const top = document.createElement("div");
        top.className = "word-card-top";

        const level = document.createElement("span");
        level.className = "word-level";
        level.textContent = item.level;

        const symbol = document.createElement("span");
        symbol.className = "word-symbol";
        symbol.textContent = item.pos[0] || "語";

        top.append(level, symbol);

        const word = document.createElement("h3");
        word.textContent = item.word;

        const reading = document.createElement("p");
        reading.className = "word-reading";
        reading.textContent = [
            item.reading,
            item.romaji
        ].filter(Boolean).join(" · ");

        const meaning = document.createElement("p");
        meaning.className = "word-meaning";
        meaning.textContent = item.meanings.join("; ");

        const partOfSpeech = document.createElement("p");
        partOfSpeech.className = "word-pos";
        partOfSpeech.textContent = item.pos.join(", ");

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.className = "save-word";

        function updateSaveButton() {
            const isSaved = savedWords.has(item.id);

            saveButton.textContent = isSaved
                ? "♥ Saved"
                : "♡ Save word";

            saveButton.classList.toggle("saved", isSaved);
            saveButton.setAttribute("aria-pressed", String(isSaved));
        }

        updateSaveButton();

        saveButton.addEventListener("click", () => {
            if (savedWords.has(item.id)) {
                savedWords.delete(item.id);
            } else {
                savedWords.add(item.id);
            }

            updateSaveButton();
        });

        card.append(
            top,
            word,
            reading,
            meaning,
            partOfSpeech,
            saveButton
        );

        vocabularyList.appendChild(card);
    });

    resultsCount.textContent = filteredWords.length
        ? `Showing ${startIndex + 1}–${startIndex + pageWords.length} of ${filteredWords.length} words`
        : "0 words found";

    emptyMessage.hidden = filteredWords.length !== 0;
    pagination.hidden = filteredWords.length === 0;

    previousPageButton.disabled = currentPage <= 1;
    nextPageButton.disabled = currentPage >= totalPages;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

wordSearch.addEventListener("input", () => {
    currentPage = 1;
    renderVocabulary();
});

levelButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeLevel = button.dataset.level;
        currentPage = 1;

        levelButtons.forEach(levelButton => {
            const isActive = levelButton === button;

            levelButton.classList.toggle("active", isActive);
            levelButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderVocabulary();
    });
});

wordsPerPageSelect.addEventListener("change", () => {
    wordsPerPage = Number(wordsPerPageSelect.value);
    currentPage = 1;
    renderVocabulary();
});

previousPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderVocabulary();
    }
});

nextPageButton.addEventListener("click", () => {
    currentPage++;
    renderVocabulary();
});

retryButton.addEventListener("click", loadVocabulary);

loadVocabulary();
