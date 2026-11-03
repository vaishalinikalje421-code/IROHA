
const N5_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n5.json";

const N4_API =
    "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n4.json";

// Get lesson details from URL
const params = new URLSearchParams(window.location.search);

const lessonId = params.get("id");
const lessonLevel = params.get("level");

// HTML elements
const patternElement = document.getElementById("lessonPattern");
const meaningElement = document.getElementById("lessonMeaning");
const levelElement = document.getElementById("lessonLevel");
const formationElement = document.getElementById("lessonFormation");
const explanationElement = document.getElementById("lessonExplanation");
const examplesElement = document.getElementById("lessonExamples");

// Load selected grammar lesson
async function loadLesson() {

    if (!lessonId || !["N5", "N4"].includes(lessonLevel)) {
        patternElement.textContent = "Lesson not found";
        meaningElement.textContent = "Please select a grammar pattern first.";
        return;
    }

    const api = lessonLevel === "N5" ? N5_API : N4_API;

    try {
        const response = await fetch(api);

        if (!response.ok) {
            throw new Error("Unable to load grammar data.");
        }

        const grammarList = await response.json();

        const lesson = grammarList.find(
            item => String(item.id) === String(lessonId)
        );

        if (!lesson) {
            throw new Error("Grammar pattern not found.");
        }

        displayLesson(lesson);

    } catch (error) {
        console.error(error);

        patternElement.textContent = "Unable to load lesson";
        meaningElement.textContent =
            "Please refresh the page or try again later.";
    }
}

// Display lesson information
function displayLesson(lesson) {

    patternElement.textContent = lesson.pattern || "Grammar Pattern";
    meaningElement.textContent = lesson.meaning || "";
    levelElement.textContent = `JLPT ${lessonLevel}`;

    // Formation
    formationElement.innerHTML = "";

    if (lesson.formation) {
        const formation = document.createElement("p");
        formation.textContent = lesson.formation;
        formationElement.appendChild(formation);
    } else {
        formationElement.textContent = "Formation details are unavailable.";
    }

    // Explanation
    explanationElement.innerHTML = "";

    if (lesson.notes) {
        const explanation = document.createElement("p");
        explanation.textContent = lesson.notes;
        explanationElement.appendChild(explanation);
    } else {
        explanationElement.textContent = "No additional explanation available.";
    }

    // Examples
    examplesElement.innerHTML = "";

    if (Array.isArray(lesson.examples) && lesson.examples.length > 0) {

        lesson.examples.forEach(example => {

            const exampleCard = document.createElement("div");
            exampleCard.className = "lesson-example-card";

            const japanese = document.createElement("p");
            japanese.className = "example-japanese";
            japanese.textContent =
                example.japanese || example.sentence || "";

            const english = document.createElement("p");
            english.className = "example-english";
            english.textContent =
                example.english || example.meaning || "";

            exampleCard.appendChild(japanese);
            exampleCard.appendChild(english);

            examplesElement.appendChild(exampleCard);
        });

    } else {
        examplesElement.textContent = "No examples available.";
    }

    document.title = `${lesson.pattern} | Nihongo`;
}

loadLesson();
