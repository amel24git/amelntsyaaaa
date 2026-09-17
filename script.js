```javascript
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

    if ("IntersectionObserver" in window) {

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

    } else {

        reveals.forEach(function (element) {

            element.classList.add("active");

        });

    }


    /* ==========================================
       PARALLAX DESA
    ========================================== */

    const hero = document.querySelector(".hero");

    if (hero && window.matchMedia("(pointer:fine)").matches) {

        const mountains =
            document.querySelectorAll(".mountain");

        const sun =
            document.querySelector(".sun");

        const clouds =
            document.querySelectorAll(".cloud");

        const houses =
            document.querySelectorAll(".house");

        const trees =
            document.querySelectorAll(".tree");


        hero.addEventListener("mousemove", function (event) {

            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width - 0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height - 0.5;


            /* Gunung bergerak pelan */

            mountains.forEach(function (mountain, index) {

                const speed =
                    (index + 1) * 5;

                mountain.style.translate =
                    `${x * speed}px ${y * speed}px`;

            });


            /* Matahari */

            if (sun) {

                sun.style.translate =
                    `${x * 15}px ${y * 10}px`;

            }


            /* Rumah */

            houses.forEach(function (house, index) {

                const speed =
                    (index + 1) * 2;

                house.style.translate =
                    `${x * speed}px ${y * speed}px`;

            });


            /* Pohon */

            trees.forEach(function (tree, index) {

                const speed =
                    (index + 1) * 2.5;

                tree.style.translate =
                    `${x * speed}px ${y * speed}px`;

            });


            /* Awan */

            clouds.forEach(function (cloud, index) {

                const speed =
                    (index + 1) * 3;

                cloud.style.translate =
                    `${x * speed}px ${y * speed}px`;

            });

        });


        /* Kembalikan posisi saat mouse keluar */

        hero.addEventListener("mouseleave", function () {

            mountains.forEach(function (mountain) {
                mountain.style.translate = "0 0";
            });

            houses.forEach(function (house) {
                house.style.translate = "0 0";
            });

            trees.forEach(function (tree) {
                tree.style.translate = "0 0";
            });

            clouds.forEach(function (cloud) {
                cloud.style.translate = "0 0";
            });

            if (sun) {
                sun.style.translate = "0 0";
            }

        });

    }


    /* ==========================================
       KUCING MENGIKUTI GERAKAN MOUSE
    ========================================== */

    const cat =
        document.querySelector(".cute-cat");

    if (
        cat &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        document.addEventListener("mousemove", function (event) {

            const x =
                (event.clientX / window.innerWidth - 0.5);

            const y =
                (event.clientY / window.innerHeight - 0.5);

            cat.style.marginLeft =
                `${x * 10}px`;

            cat.style.marginBottom =
                `${y * 5}px`;

        });

    }


    /* ==========================================
       EFEK KLIK TOMBOL
    ========================================== */

    const buttons =
        document.querySelectorAll(".btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            button.style.transform =
                "scale(0.94)";

            setTimeout(function () {

                button.style.transform = "";

            }, 150);

        });

    });


    /* ==========================================
       TAMBAHKAN EFEK PARALLAX SAAT SCROLL
    ========================================== */

    const landscape =
        document.querySelector(".landscape");

    window.addEventListener("scroll", function () {

        if (!landscape) return;

        const scroll =
            window.scrollY;

        if (scroll < window.innerHeight) {

            landscape.style.transform =
                `translateY(${scroll * 0.08}px)`;

        }

    });


    /* ==========================================
       SAPAAN KECIL SAAT WEBSITE DIBUKA
    ========================================== */

    const welcome =
        document.querySelector(".welcome");

    if (welcome) {

        setTimeout(function () {

            welcome.style.transform =
                "translateY(-4px)";

        }, 500);

        setTimeout(function () {

            welcome.style.transform =
                "translateY(0)";

        }, 1000);

    }

});
```
