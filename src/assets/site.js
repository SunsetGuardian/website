const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".nav-links");

if (menuToggle && navigationLinks) {
    function closeMenu() {
        navigationLinks.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    menuToggle.addEventListener("click", () => {
        const isOpen =
            navigationLinks.classList.toggle("is-open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });

    navigationLinks.addEventListener("click", event => {
        if (event.target.matches("a")) {
            closeMenu();
        }
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".site-nav")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 620) {
            closeMenu();
        }
    });
}
