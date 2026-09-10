/* =====================================================
   TAMILANDA GAMING
   Main Website JavaScript
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       SIDE MENU
       ================================================= */

    const menuButton = document.querySelector(".menu-button");
    const closeMenuButton = document.querySelector(".close-menu");
    const sideMenu = document.querySelector(".side-menu");

    if (menuButton && sideMenu) {
        menuButton.addEventListener("click", () => {
            sideMenu.classList.add("open");
        });
    }

    if (closeMenuButton && sideMenu) {
        closeMenuButton.addEventListener("click", () => {
            sideMenu.classList.remove("open");
        });
    }


    /* Close menu when clicking a link */

    const sideMenuLinks = document.querySelectorAll(".side-menu a");

    sideMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (sideMenu) {
                sideMenu.classList.remove("open");
            }
        });
    });


    /* =================================================
       HERO IMAGE SLIDER
       Changes every 2 seconds
       ================================================= */

    const slides = document.querySelectorAll(".slider-card");
    const dots = document.querySelectorAll(".dot");

    let currentSlide = 0;
    let sliderTimer = null;

    function showSlide(index) {

        if (!slides.length) {
            return;
        }

        if (index >= slides.length) {
            index = 0;
        }

        if (index < 0) {
            index = slides.length - 1;
        }

        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        dots.forEach((dot) => {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");

        if (dots[index]) {
            dots[index].classList.add("active");
        }

        currentSlide = index;
    }


    function nextSlide() {

        const nextIndex =
            (currentSlide + 1) % slides.length;

        showSlide(nextIndex);
    }


    function startSlider() {

        if (slides.length <= 1) {
            return;
        }

        sliderTimer = setInterval(() => {
            nextSlide();
        }, 2000);
    }


    function restartSlider() {

        if (sliderTimer) {
            clearInterval(sliderTimer);
        }

        startSlider();
    }


    if (slides.length) {

        showSlide(0);

        startSlider();


        /* Click dots */

        dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                showSlide(index);

                restartSlider();

            });

        });
    }


    /* =================================================
       SMOOTH SCROLL
       ================================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =================================================
       CURRENT YEAR
       ================================================= */

    const yearElement =
        document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       ESC KEY → CLOSE SIDE MENU
       ================================================= */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && sideMenu) {
            sideMenu.classList.remove("open");
        }

    });


    /* =================================================
       PREVENT EMPTY BUTTON ACTIONS
       ================================================= */

    document.querySelectorAll("button").forEach((button) => {

        button.addEventListener("click", () => {

            button.blur();

        });

    });

});
