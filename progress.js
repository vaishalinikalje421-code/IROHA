
document.addEventListener("DOMContentLoaded", () => {

    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Load learning data
    const learningData = JSON.parse(localStorage.getItem("irohaProgress")) || {
        streak: 0,
        lessonsCompleted: 0,
        wordsLearned: 0,
        studyMinutes: 0,
        n5Lessons: 0,
        n4Lessons: 0,
        mockTests: 0,
        weeklyActivity: {}
    };

    // Update statistics
    const statValues = document.querySelectorAll(".progress-card h2");

    statValues[0].innerHTML = `${learningData.streak} <small>days</small>`;
    statValues[1].textContent = learningData.lessonsCompleted;
    statValues[2].textContent = learningData.wordsLearned;
    statValues[3].innerHTML = `${(learningData.studyMinutes / 60).toFixed(1)} <small>hrs</small>`;

    // Update course progress
    function updateCourseProgress(index, completedLessons) {
        const cards = document.querySelectorAll(".course-progress-card");
        const card = cards[index];

        const totalLessons = 20;
        const percentage = Math.min(
            Math.round((completedLessons / totalLessons) * 100),
            100
        );

        card.querySelector(".course-title span").textContent = `${percentage}%`;
        card.querySelector(".progress-fill").style.width = `${percentage}%`;
        card.querySelector(".progress-meta span").textContent =
            `${completedLessons} of ${totalLessons} lessons completed`;
    }

    updateCourseProgress(0, learningData.n5Lessons);
    updateCourseProgress(1, learningData.n4Lessons);

    // Weekly activity
    const activityDays = document.querySelectorAll(".activity-day");
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const today = new Date();
    const monday = new Date(today);
    const day = today.getDay();

    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

    let hasActivity = false;

    activityDays.forEach((dayElement, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);

        const dateKey = date.toISOString().split("T")[0];
        const minutes = learningData.weeklyActivity[dateKey] || 0;

        const dot = dayElement.querySelector(".activity-dot");

        if (minutes > 0) {
            dot.classList.add("active");
            dot.title = `${minutes} minutes studied`;
            hasActivity = true;
        } else {
            dot.classList.remove("active");
            dot.title = "No study activity";
        }

        dayElement.querySelector("span").textContent = dayNames[index];
    });

    const activityNote = document.querySelector(".activity-note");

    if (hasActivity) {
        activityNote.textContent =
            "🌸 Great work! Your weekly study activity is growing.";
    }

    // Achievements
    const achievements = document.querySelectorAll(".achievement-card");

    const achievementConditions = [
        learningData.lessonsCompleted >= 1,
        learningData.streak >= 3,
        learningData.wordsLearned >= 50,
        learningData.mockTests >= 1
    ];

    achievements.forEach((card, index) => {
        const status = card.querySelector(".achievement-status");

        if (achievementConditions[index]) {
            card.classList.remove("locked");
            card.classList.add("unlocked");
            status.textContent = "Unlocked ✓";
        } else {
            card.classList.add("locked");
            card.classList.remove("unlocked");
            status.textContent = "Not unlocked";
        }
    });

    // Animate progress bars
    document.querySelectorAll(".progress-fill").forEach(bar => {
        const targetWidth = bar.style.width;

        bar.style.width = "0%";

        requestAnimationFrame(() => {
            bar.style.transition = "width 1s ease";
            bar.style.width = targetWidth;
        });
    });

});
