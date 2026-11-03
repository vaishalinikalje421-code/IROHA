
<?php
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Please log in first."]);
    exit;
}

require_once __DIR__ . "/../db.php";

$userId = $_SESSION["user_id"];

try {

    // Retrieve profile settings
    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $query = $conn->prepare("
            SELECT
                u.name AS displayName,
                COALESCE(p.learning_reason, 'jlpt') AS learningReason,
                COALESCE(p.target_jlpt_level, 'N5') AS jlptLevel,
                COALESCE(p.daily_goal, 20) AS dailyGoal,
                COALESCE(p.study_days, 'daily') AS studyDays,
                COALESCE(p.tips_enabled, 1) AS tipsEnabled
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE u.id = :user_id
        ");

        $query->execute(["user_id" => $userId]);
        $settings = $query->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "settings" => $settings
        ]);
        exit;
    }

    // Save profile settings
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid data."]);
            exit;
        }

        $displayName = trim($data["displayName"] ?? "");
        $learningReason = $data["learningReason"] ?? "jlpt";
        $jlptLevel = $data["jlptLevel"] ?? "N5";
        $dailyGoal = (int)($data["dailyGoal"] ?? 20);
        $studyDays = $data["studyDays"] ?? "daily";
        $tipsEnabled = !empty($data["tipsEnabled"]) ? 1 : 0;

        $validReasons = ["jlpt", "anime", "study", "career", "travel", "other"];
        $validLevels = ["N5", "N4"];
        $validGoals = [10, 20, 30, 45, 60];
        $validDays = ["daily", "weekdays", "weekends", "flexible"];

        if (
            $displayName === "" ||
            strlen($displayName) > 100 ||
            !in_array($learningReason, $validReasons, true) ||
            !in_array($jlptLevel, $validLevels, true) ||
            !in_array($dailyGoal, $validGoals, true) ||
            !in_array($studyDays, $validDays, true)
        ) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Please check your profile details."]);
            exit;
        }

        // Update account name
        $query = $conn->prepare("
            UPDATE users
            SET name = :name
            WHERE id = :user_id
        ");

        $query->execute([
            "name" => $displayName,
            "user_id" => $userId
        ]);

        // Insert or update profile preferences
        $query = $conn->prepare("
            INSERT INTO user_profiles
                (user_id, learning_reason, target_jlpt_level,
                 daily_goal, study_days, tips_enabled)
            VALUES
                (:user_id, :reason, :level, :goal, :days, :tips)
            ON DUPLICATE KEY UPDATE
                learning_reason = VALUES(learning_reason),
                target_jlpt_level = VALUES(target_jlpt_level),
                daily_goal = VALUES(daily_goal),
                study_days = VALUES(study_days),
                tips_enabled = VALUES(tips_enabled)
        ");

        $query->execute([
            "user_id" => $userId,
            "reason" => $learningReason,
            "level" => $jlptLevel,
            "goal" => $dailyGoal,
            "days" => $studyDays,
            "tips" => $tipsEnabled
        ]);

        $_SESSION["user_name"] = $displayName;

        echo json_encode([
            "success" => true,
            "message" => "Profile settings saved successfully!"
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
