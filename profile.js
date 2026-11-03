
document.addEventListener("DOMContentLoaded", async () => {

    const profileForm = document.getElementById("profileForm");
    const displayName = document.getElementById("displayName");
    const learningReason = document.getElementById("learningReason");

    const jlptLevel = document.getElementById("jlptLevel");
    const dailyGoal = document.getElementById("dailyGoal");
    const studyDays = document.getElementById("studyDays");

    const tipsToggle = document.getElementById("tipsToggle");

    const profileLevel = document.getElementById("profileLevel");
    const profileGoal = document.getElementById("profileGoal");
    const profileName = document.querySelector(".profile-card h2");
    const levelBadge = document.querySelector(".level-badge");

    const API_URL = "profile_settings.php";

    const defaultSettings = {
        displayName: "",
        learningReason: "jlpt",
        jlptLevel: "N5",
        dailyGoal: 20,
        studyDays: "daily",
        tipsEnabled: true
    };

    let settings = { ...defaultSettings };
    let accountName = "";

    // Show messages
    function showMessage(elementId, message) {
        const element = document.getElementById(elementId);

        if (!element) return;

        element.textContent = message;

        setTimeout(() => {
            element.textContent = "";
        }, 3000);
    }

    // Update profile card
    function updateProfileCard() {
        profileName.textContent =
            settings.displayName.trim() || "Japanese Learner";

        profileLevel.textContent = `JLPT ${settings.jlptLevel}`;
        profileGoal.textContent = `${settings.dailyGoal} minutes`;

        levelBadge.textContent =
            settings.jlptLevel === "N5"
                ? "🌱 Beginner"
                : "🌿 Elementary";
    }

    // Load settings into form
    function loadSettings() {
        displayName.value = settings.displayName;
        learningReason.value = settings.learningReason;

        jlptLevel.value = settings.jlptLevel;
        dailyGoal.value = String(settings.dailyGoal);
        studyDays.value = settings.studyDays;

        tipsToggle.checked = settings.tipsEnabled;

        updateProfileCard();
    }

    // Save settings to MySQL through PHP
    async function saveToDatabase() {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(settings)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to save settings.");
            }

            return true;

        } catch (error) {
            console.error("Save error:", error);
            return false;
        }
    }

    // Retrieve settings from MySQL
    async function loadFromDatabase() {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load settings.");
            }

            const saved = result.settings;

            settings = {
                displayName: saved.displayName || "",
                learningReason: saved.learningReason || "jlpt",
                jlptLevel: saved.jlptLevel || "N5",
                dailyGoal: Number(saved.dailyGoal) || 20,
                studyDays: saved.studyDays || "daily",
                tipsEnabled: Number(saved.tipsEnabled) === 1
            };

            accountName = settings.displayName;

            loadSettings();

        } catch (error) {
            console.error("Load error:", error);
            showMessage("profileMessage", "Unable to load your saved profile.");
        }
    }

    // Save personal information
    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        settings.displayName = displayName.value.trim();
        settings.learningReason = learningReason.value;

        const saved = await saveToDatabase();

        if (saved) {
            updateProfileCard();
            accountName = settings.displayName;
            showMessage("profileMessage", "Profile saved successfully!");
        } else {
            showMessage("profileMessage", "Could not save profile. Please try again.");
        }
    });

    // Save learning preferences
    document.getElementById("savePreferences").addEventListener("click", async () => {

        settings.jlptLevel = jlptLevel.value;
        settings.dailyGoal = Number(dailyGoal.value);
        settings.studyDays = studyDays.value;

        const saved = await saveToDatabase();

        if (saved) {
            updateProfileCard();
            showMessage("preferencesMessage", "Preferences saved successfully!");
        } else {
            showMessage("preferencesMessage", "Could not save preferences. Please try again.");
        }
    });

    // Save appearance settings
    document.getElementById("saveAppearance").addEventListener("click", async () => {

        settings.tipsEnabled = tipsToggle.checked;

        const saved = await saveToDatabase();

        if (saved) {
            showMessage("appearanceMessage", "Appearance settings saved!");
        } else {
            showMessage("appearanceMessage", "Could not save settings. Please try again.");
        }
    });

    // Reset preferences
    document.getElementById("resetPreferences").addEventListener("click", async () => {

        const confirmReset = confirm(
            "Are you sure you want to reset all your profile settings?"
        );

        if (!confirmReset) return;

        settings = {
            ...defaultSettings,
            displayName: accountName
        };

        const saved = await saveToDatabase();

        if (saved) {
            loadSettings();
            showMessage("preferencesMessage", "Your settings have been reset!");
        } else {
            showMessage("preferencesMessage", "Could not reset settings. Please try again.");
        }
    });

    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Initialize profile from database
    await loadFromDatabase();

});
