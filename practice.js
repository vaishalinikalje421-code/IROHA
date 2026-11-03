
document.addEventListener("DOMContentLoaded", () => {

    // Active navigation link
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Mock test buttons
    const mockButtons = document.querySelectorAll(".mock-btn");

    mockButtons.forEach(button => {
        button.addEventListener("click", () => {
            const testLevel = button.textContent.includes("N5") ? "N5" : "N4";

            alert(`${testLevel} Mock Test is coming soon!`);
        });
    });

    // Smooth scrolling for section links
    document.querySelectorAll('a[href="#mock-tests"]').forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            document.querySelector("#mock-tests").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

});
