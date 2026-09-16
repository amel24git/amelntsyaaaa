document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       MENU HP
    ========================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("show");
        });

    }


    /* ==========================================
       TUTUP MENU SAAT LINK DIPILIH
    ========================================== */

    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navMenu) {
                navMenu.classList.remove("show");
            }

        });

    });


    /* ==========================================
       ANIMASI SCROLL
    ========================================== */

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


    reveals.forEach(function (element) {

        observer.observe(element);

    });


    /* ==========================================
       EFEK GERAKAN MOUSE
    ========================================== */

    const hero = document.querySelector(".hero");

    if (hero && window.matchMedia("(pointer:fine)").matches) {

        hero.addEventListener("mousemove", function (event) {

            const x =
                (event.clientX / window.innerWidth - 0.5) * 2;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 2;


            const mountains =
                document.querySelectorAll(".mountain");

            mountains.forEach(function (mountain, index) {

                const speed = (index + 1) * 3;

                mountain.style.marginLeft =
                    `${x * speed}px`;

                mountain.style.marginBottom =
                    `${y * speed}px`;

            });


            const sun =
                document.querySelector(".sun");

            if (sun) {

                sun.style.transform =
                    `translate(${x * 8}px, ${y * 8}px)`;

            }

        });

    }

});
