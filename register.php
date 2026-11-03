<?php
session_start();
require_once __DIR__ . "/../db.php";
$message = "";
$messageType = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["confirmPassword"] ?? "";

    if ($name === "" || $email === "" || $password === "" || $confirmPassword === "") {
        $message = "Please fill in all fields.";
        $messageType = "error";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "Please enter a valid email address.";
        $messageType = "error";

    } elseif (strlen($password) < 8) {
        $message = "Password must contain at least 8 characters.";
        $messageType = "error";

    } elseif ($password !== $confirmPassword) {
        $message = "Passwords do not match.";
        $messageType = "error";

    } else {
        try {
           $checkEmail = $conn->prepare(
    "SELECT id FROM users WHERE email = :email"
);
        
            $checkEmail->execute(["email" => $email]);

            if ($checkEmail->fetch()) {
                $message = "This email is already registered.";
                $messageType = "error";

            } else {
                $hashedPassword = password_hash(
                    $password,
                    PASSWORD_DEFAULT
                );
$insertUser = $conn->prepare(
    "INSERT INTO users (name, email, password)
     VALUES (:name, :email, :password)"
);

                $insertUser->execute([
                    "name" => $name,
                    "email" => $email,
                    "password" => $hashedPassword
                ]);

                $message = "Account created successfully! You can now log in.";
                $messageType = "success";
            }

        } catch (PDOException $e) {
            error_log($e->getMessage());

            $message = "Something went wrong. Please try again.";
            $messageType = "error";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account | IROHA</title>
    <link rel="stylesheet" href="register.css">
</head>
<body>

    <nav class="navbar">
        <a href="../index.html" class="logo">IROHA <span>いろは</span></a>
        <a href="../index.html" class="back-link">Back to Home</a>
    </nav>

    <main class="register-container">

        <section class="register-intro">
            <span class="eyebrow">YOUR JAPANESE LEARNING JOURNEY</span>
            <h1>Begin your journey with <span>IROHA.</span></h1>
            <p>Create your account and take the first step towards learning Japanese, one word at a time.</p>
        </section>

        <section class="register-card">

            <div class="card-heading">
                <div class="register-icon">あ</div>
                <h2>Create Your Account</h2>
                <p>Join IROHA and start learning Japanese.</p>
            </div>

            <form id="registerForm" action="register.php" method="POST">

                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name"
                           placeholder="Enter your full name"
                           value="<?= htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                           required>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email"
                           placeholder="Enter your email address"
                           value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                           required>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password"
                           placeholder="Create a password"
                           minlength="8" required>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword"
                           name="confirmPassword"
                           placeholder="Re-enter your password"
                           required>
                </div>

                <button type="submit" class="register-btn">
                    Create Account
                </button>

                <?php if ($message !== ""): ?>
                    <p class="form-message <?= htmlspecialchars($messageType, ENT_QUOTES, 'UTF-8') ?>">
                        <?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?>
                    </p>
                <?php endif; ?>

            </form>

            <div class="login-link">
                Already have an account?
                <a href="login.html">Log in</a>
            </div>

        </section>

        <p class="register-note">
            Your Japanese learning journey starts here.
        </p>

    </main>

    <footer class="footer">
        <h3>IROHA いろは</h3>
        <p>Learn Japanese, one step at a time.</p>
        <a href="../index.html">Return to Home</a>
    </footer>

</body>
</html>
