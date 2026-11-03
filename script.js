
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // 1. SMOOTH SCROLLING FOR HOMEPAGE SECTIONS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                event.preventDefault();
                return;
            }

            const target = document.getElementById(href.slice(1));

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });

                // Update the URL hash without jumping abruptly.
                history.replaceState(null, "", href);
            }
        });
    });


    // ==========================================
    // 2. NAVIGATION LINKS
    // ==========================================
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        const linkPath = new URL(
            link.href,
            window.location.href
        ).pathname;

        // Highlight the page currently open.
        if (linkPath === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });


    // ==========================================
    // 3. COURSE BUTTONS: N5 AND N4
    // ==========================================
    document.querySelectorAll(".course-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const destination = button.getAttribute("href");

            if (!destination) {
                event.preventDefault();
                console.warn("Course button has no destination.");
                return;
            }

            // The browser follows valid links automatically.
            // No forced navigation is needed.
        });
    });


    // ==========================================
    // 4. LEARNING CATEGORY CARDS
    // ==========================================
    document.querySelectorAll(".category-card").forEach((card) => {
        const link = card.querySelector("a[href]");

        if (!link) return;

        // Allow keyboard users to focus the card itself.
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "group");

        // Clicking the card outside its link opens its page.
        card.addEventListener("click", (event) => {
            if (event.target.closest("a, button")) return;

            if (
                event.target.closest("input, select, textarea")
            ) return;

            window.location.href = link.href;
        });

        // Enter or Space opens the card's destination.
        card.addEventListener("keydown", (event) => {
            if (event.target !== card) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = link.href;
            }
        });
    });


    // ==========================================
    // 5. PRACTICE LINKS
    // ==========================================
    document.querySelectorAll(".practice-link").forEach((link) => {
        if (!link.getAttribute("href")) {
            console.warn("A practice link needs an href.");
        }
    });


    // ==========================================
    // 6. ACCESSIBLE KEYBOARD FOCUS
    // ==========================================
    document.querySelectorAll("a, button").forEach((element) => {
        element.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                element.blur();
            }
        });
    });


    // ==========================================
    // 7. CHECK INTERNAL SECTION LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        const href = link.getAttribute("href");

        if (href && href !== "#" &&
            !document.getElementById(href.slice(1))) {
            console.warn("Section not found:", href);
        }
    });


    // ==========================================
    // 8. HOMEPAGE READY
    // ==========================================
    console.log("🌸 Nihongo homepage JavaScript loaded!");
});
