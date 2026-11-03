async function loadVocabulary() {
    const url = "https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n5.json";

    const response = await fetch(url);

    const words = await response.json();

    console.log(words);
    console.log(words[0]); // Add this line

    console.log("Japanese:", words[0].word);
console.log("Meaning:", words[0].meanings[0]);
}

loadVocabulary();