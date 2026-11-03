
<?php
session_start();

// Check whether the user is logged in
if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

require_once __DIR__ . "/../db.php";

// Fetch logged-in user's details
try {
    $query = $conn->prepare(
        "SELECT id, name, email FROM users WHERE id = :id"
    );

    $query->execute([
        "id" => $_SESSION["user_id"]
    ]);

    $profileUser = $query->fetch(PDO::FETCH_ASSOC);

    if (!$profileUser) {
        session_unset();
        session_destroy();
        header("Location: login.php");
        exit;
    }

} catch (PDOException $e) {
    error_log($e->getMessage());
    die("Unable to load your profile. Please try again later.");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile | IROHA</title>
    <link rel="stylesheet" href="profile.css">
</head>

<body>

    <nav class="navbar">
        <a href="../index.html" class="logo">IROHA</a>

        <div class="nav-links">
            <a href="../index.html">Home</a>
            <a href="courses.html">Courses</a>
            <a href="vocabulary.html">Vocabulary</a>
            <a href="grammar.html">Grammar</a>
            <a href="characters.html">Characters</a>
            <a href="practice.html">Practice</a>
            <a href="review.html">Smart Review</a>
            <a href="progress.html">My Progress</a>
            <a href="profile.php">Profile</a>
        </div>
    </nav>

    <main>

        <section class="profile-hero">
            <span class="eyebrow">YOUR PERSONAL SPACE</span>
            <h1>Make your learning <span>your own.</span></h1>
            <p>Set your goals, personalize your experience, and keep growing in Japanese.</p>
        </section>

        <section class="profile-layout">

            <aside class="profile-card">

                <div class="avatar">日</div>

                <h2 id="profileName">
                    <?= htmlspecialchars($profileUser["name"], ENT_QUOTES, 'UTF-8') ?>
                </h2>

                <p class="profile-subtitle">
                    <?= htmlspecialchars($profileUser["email"], ENT_QUOTES, 'UTF-8') ?>
                </p>

                <span class="level-badge">🌱 Beginner</span>

                <div class="profile-divider"></div>

                <div class="profile-summary">
                    <div>
                        <span>Current Level</span>
                        <strong id="profileLevel">JLPT N5</strong>
                    </div>

                    <div>
                        <span>Daily Goal</span>
                        <strong id="profileGoal">20 minutes</strong>
                    </div>
                </div>

                <a href="progress.html" class="profile-link">
                    View My Progress →
                </a>

            </aside>

            <div class="settings-content">

                <section class="settings-card">

                    <div class="settings-heading">
                        <span class="settings-icon">👤</span>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Choose how you appear in your learning space.</p>
                        </div>
                    </div>

                    <form id="profileForm">

                        <div class="form-group">
                            <label for="displayName">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                placeholder="Enter your name"
                                maxlength="50"
                                value="<?= htmlspecialchars($profileUser["name"], ENT_QUOTES, 'UTF-8') ?>"
                            >
                        </div>

                        <div class="form-group">
                            <label for="learningReason">
                                Why are you learning Japanese?
                            </label>

                            <select id="learningReason" name="learningReason">
                                <option value="jlpt">Preparing for JLPT</option>
                                <option value="anime">Anime and Japanese culture</option>
                                <option value="study">Higher education in Japan</option>
                                <option value="career">Career opportunities</option>
                                <option value="travel">Travel and communication</option>
                                <option value="other">Personal interest</option>
                            </select>
                        </div>

                        <button type="submit" class="primary-btn">
                            Save Profile
                        </button>

                        <p id="profileMessage" class="form-message" aria-live="polite"></p>

                    </form>

                </section>

                <section class="settings-card">

                    <div class="settings-heading">
                        <span class="settings-icon">🎯</span>
                        <div>
                            <h2>Learning Preferences</h2>
                            <p>Adjust your goals to suit your routine.</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="jlptLevel">Current JLPT Level</label>
                        <select id="jlptLevel">
                            <option value="N5">JLPT N5 — Beginner</option>
                            <option value="N4">JLPT N4 — Elementary</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="dailyGoal">Daily Study Goal</label>
                        <select id="dailyGoal">
                            <option value="10">10 minutes</option>
                            <option value="20" selected>20 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="studyDays">Preferred Study Schedule</label>
                        <select id="studyDays">
                            <option value="daily">Every day</option>
                            <option value="weekdays">Weekdays</option>
                            <option value="weekends">Weekends</option>
                            <option value="flexible">Flexible schedule</option>
                        </select>
                    </div>

                    <button type="button" id="savePreferences" class="primary-btn">
                        Save Preferences
                    </button>

                    <p id="preferencesMessage" class="form-message" aria-live="polite"></p>

                </section>

                <section class="settings-card">

                    <div class="settings-heading">
                        <span class="settings-icon">🌿</span>
                        <div>
                            <h2>Appearance</h2>
                            <p>Choose the look of your learning experience.</p>
                        </div>
                    </div>

                    <div class="setting-row">
                        <div>
                            <h3>Classroom Theme</h3>
                            <p>Keep the calm cream and sage-green design.</p>
                        </div>
                        <span class="theme-preview">Aa</span>
                    </div>

                    <div class="setting-row">
                        <div>
                            <h3>Japanese Learning Tips</h3>
                            <p>Show helpful tips while studying.</p>
                        </div>

                        <label class="toggle">
                            <input type="checkbox" id="tipsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <button type="button" id="saveAppearance" class="secondary-btn">
                        Save Appearance
                    </button>

                    <p id="appearanceMessage" class="form-message" aria-live="polite"></p>

                </section>

                <section class="settings-card">

                    <div class="settings-heading">
                        <span class="settings-icon">🔐</span>
                        <div>
                            <h2>Account & Privacy</h2>
                            <p>Manage your learning data and account options.</p>
                        </div>
                    </div>

                    <div class="setting-row">
                        <div>
                            <h3>Your Learning Data</h3>
                            <p>Your account is connected to the IROHA database.</p>
                        </div>
                        <span class="status-badge">Connected</span>
                    </div>

                    <div class="setting-row">
                        <div>
                            <h3>Reset Preferences</h3>
                            <p>Return your settings to their default values.</p>
                        </div>

                        <button type="button" id="resetPreferences" class="secondary-btn">
                            Reset
                        </button>
                    </div>

                </section>

            </div>
        </section>

    </main>

    <footer class="footer">
        <h3>🌸 IROHA</h3>
        <p>One character at a time, one step closer to fluency.</p>
        <a href="../index.html">Back to Home</a>
    </footer>

    <script src="profile.js"></script>

</body>
</html>
