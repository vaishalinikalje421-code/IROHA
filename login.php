
<?php
session_start();
require_once __DIR__ . "/../db.php";

$message = "";
$messageType = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";

    if ($email === "" || $password === "") {
        $message = "Please enter your email and password.";
        $messageType = "error";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "Please enter a valid email address.";
        $messageType = "error";

    } else {
        try {
            $query = $conn->prepare(
                "SELECT id, name, email, password FROM users WHERE email = :email"
            );

            $query->execute(["email" => $email]);
            $user = $query->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user["password"])) {

                session_regenerate_id(true);

                $_SESSION["user_id"] = $user["id"];
                $_SESSION["user_name"] = $user["name"];
                $_SESSION["user_email"] = $user["email"];

                header("Location: profile.php");
                exit;

            } else {
                $message = "Incorrect email or password.";
                $messageType = "error";
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
    <title>Login | IROHA</title>
    <link rel="stylesheet" href="login.css">
</head>

<body>

    <nav class="navbar">
        <a href="../index.html" class="logo">IROHA <span>いろは</span></a>
        <a href="../index.html" class="back-link">Back to Home</a>
    </nav>

    <main class="register-container">

        <section class="register-intro">
            <span class="eyebrow">WELCOME BACK TO IROHA</span>
            <h1>Continue your <span>Japanese journey.</span></h1>
            <p>Log in to access your learning profile and continue where you left off.</p>
        </section>

        <section class="register-card">

            <div class="card-heading">
                <div class="register-icon">あ</div>
                <h2>Welcome Back</h2>
                <p>Enter your account details to log in.</p>
            </div>

            <form action="login.php" method="POST">

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    >
                </div>

                <button type="submit" class="register-btn">
                    Log In
                </button>

                <?php if ($message !== ""): ?>
                    <p class="form-message <?= htmlspecialchars($messageType, ENT_QUOTES, 'UTF-8') ?>">
                        <?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?>
                    </p>
                <?php endif; ?>

            </form>

            <div class="login-link">
                Don't have an account?
                <a href="register.php">Create Account</a>
            </div>

        </section>

        <p class="register-note">
            Your Japanese learning journey continues here.
        </p>

    </main>

    <footer class="footer">
        <h3>IROHA いろは</h3>
        <p>Learn Japanese, one step at a time.</p>
        <a href="../index.html">Return to Home</a>
    </footer>

</body>
</html>
