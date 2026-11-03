
document.addEventListener("DOMContentLoaded", () => {

    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Progress bar animation
    document.querySelectorAll(".progress-fill").forEach(bar => {
        const progress = bar.style.width;

        bar.style.width = "0%";

        requestAnimationFrame(() => {
            bar.style.transition = "width 1s ease";
            bar.style.width = progress;
        });
    });

});
