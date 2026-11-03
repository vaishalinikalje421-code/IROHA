
const N5_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n5.json";

const N4_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n4.json";

const kanjiGrid = document.getElementById("kanjiGrid");
const loadingMessage = document.getElementById("kanjiLoadingMessage");

async function fetchKanji() {
    try {
        if (loadingMessage) {
            loadingMessage.hidden = false;
            loadingMessage.textContent = "Loading kanji...";
        }

        const [n5Response, n4Response] = await Promise.all([
            fetch(N5_API),
            fetch(N4_API)
        ]);

        if (!n5Response.ok || !n4Response.ok) {
            throw new Error("Unable to fetch kanji data.");
        }

        const [n5Data, n4Data] = await Promise.all([
            n5Response.json(),
            n4Response.json()
        ]);

        // Combine N5 and N4 data
        const combinedData = [...n5Data, ...n4Data];

        // Remove duplicate characters
        const uniqueKanji = Array.from(
            new Map(
                combinedData.map(item => [item.character, item])
            ).values()
        );

        displayKanji(uniqueKanji);

        if (loadingMessage) {
            loadingMessage.hidden = true;
        }

    } catch (error) {
        console.error("Kanji API Error:", error);

        if (loadingMessage) {
            loadingMessage.hidden = false;
            loadingMessage.textContent =
                "Unable to load kanji. Please refresh the page.";
        }
    }
}


function displayKanji(kanjiList) {

    if (!kanjiGrid) {
        console.error("Kanji grid element not found.");
        return;
    }

    kanjiGrid.innerHTML = "";

    kanjiList.forEach(item => {

        const card = document.createElement("div");
        card.className = "kanji-card";

        // Kanji character
        const character = document.createElement("div");
        character.className = "kanji-character";
        character.textContent = item.character;

        // Meaning
        const meaning = document.createElement("div");
        meaning.className = "kanji-meaning";

        meaning.textContent = Array.isArray(item.meanings)
            ? item.meanings.join(" · ")
            : "Meaning unavailable";

        // Readings
        const readings = document.createElement("div");
        readings.className = "kanji-readings";

        const onyomi = item.onyomi?.length
            ? item.onyomi.join(", ")
            : "—";

        const kunyomi = item.kunyomi?.length
            ? item.kunyomi.join(", ")
            : "—";

        readings.innerHTML = `
            <p><strong>Onyomi:</strong> ${onyomi}</p>
            <p><strong>Kunyomi:</strong> ${kunyomi}</p>
        `;

        // JLPT Level
        const level = document.createElement("small");
        level.className = "kanji-level";
        level.textContent = item.level || "Level unavailable";

        // Add everything to card
        card.appendChild(character);
        card.appendChild(meaning);
        card.appendChild(readings);
        card.appendChild(level);

        kanjiGrid.appendChild(card);
    });

    console.log("Kanji loaded:", kanjiList.length);
}


// Start loading Kanji
fetchKanji();
