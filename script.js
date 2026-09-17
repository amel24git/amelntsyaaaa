document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       MENU HP
    =============================== */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("show");
        });

        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("show");
            });
        });
    }


    /* ===============================
       ANIMASI SCROLL
    =============================== */

    const reveals = document.querySelectorAll(".reveal");

    if (reveals.length > 0 && "IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
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
    }


    /* ===============================
       ANIMASI DESA
    =============================== */

    const villageCat = document.querySelector(".village-cat");
    const flowers = document.querySelectorAll(".flower");


    /* Kucing bergerak */

    if (villageCat) {

        let direction = 1;
        let position = 0;

        setInterval(function () {

            position += direction * 0.5;

            if (position >= 45) {
                direction = -1;
            }

            if (position <= 0) {
                direction = 1;
            }

            villageCat.style.transform =
                "translateX(" + position + "px)";

        }, 80);
    }


    /* Bunga bergoyang */

    flowers.forEach(function (flower, index) {

        let angle = 0;
        let direction = 1;

        setInterval(function () {

            angle += direction * 0.4;

            if (angle >= 4) {
                direction = -1;
            }

            if (angle <= -4) {
                direction = 1;
            }

            flower.style.transform =
                "rotate(" + angle + "deg)";

        }, 100 + (index * 30));

    });


    /* ===============================
       POPUP VIDEO 9:16
    =============================== */

    const videoCards =
        document.querySelectorAll(".video-card");

    if (videoCards.length > 0) {

        const lightbox =
            document.createElement("div");

        lightbox.className = "video-lightbox";

        lightbox.innerHTML = `
            <div class="video-lightbox-content">

                <button
                    type="button"
                    class="video-lightbox-close"
                    aria-label="Tutup video">
                    ×
                </button>

                <video
                    id="popupVideo"
                    controls
                    playsinline
                    preload="auto"
                    controlsList="nofullscreen"
                    disablePictureInPicture>
                </video>

            </div>
        `;

        document.body.appendChild(lightbox);


        const popupVideo =
            document.getElementById("popupVideo");

        const closeButton =
            lightbox.querySelector(
                ".video-lightbox-close"
            );


        /* ===============================
           DOUBLE CLICK VIDEO
        =============================== */

        videoCards.forEach(function (card) {

            const video =
                card.querySelector("video");

            if (!video) return;

            video.addEventListener(
                "dblclick",
                function (event) {

                    event.preventDefault();

                    const source =
                        video.querySelector("source");

                    if (source && source.src) {

                        popupVideo.src =
                            source.src;

                    } else if (video.currentSrc) {

                        popupVideo.src =
                            video.currentSrc;

                    } else {

                        return;
                    }

                    lightbox.classList.add("show");

                    document.body.style.overflow =
                        "hidden";

                    popupVideo.play().catch(
                        function () {}
                    );

                }
            );

        });


        /* ===============================
           TUTUP VIDEO
        =============================== */

        function closeVideo() {

            popupVideo.pause();

            popupVideo.removeAttribute("src");

            popupVideo.load();

            lightbox.classList.remove("show");

            document.body.style.overflow = "";

        }


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeVideo
            );

        }


        /* ===============================
           KLIK LUAR VIDEO
        =============================== */

        lightbox.addEventListener(
            "click",
            function (event) {

                if (event.target === lightbox) {
                    closeVideo();
                }

            }
        );


        /* ===============================
           TOMBOL ESC
        =============================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains("show")
                ) {

                    closeVideo();

                }

            }
        );

    }


    /* ===============================
       FORM ADUAN
       GOOGLE SHEETS
    =============================== */

    const aduanForm =
        document.getElementById("aduanForm");

    if (aduanForm) {

        const SCRIPT_URL =
            "https://script.google.com/macros/s/AKfycbzgDVCYu_32Z3o5bUEOuWlJMJsNV8ii3ONp-7RtaQUtfZ0EedTNQujXo5jVH91hS0Vr/exec";


        aduanForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const namaElement =
                    document.getElementById("aduanNama");

                const kategoriElement =
                    document.getElementById("aduanKategori");

                const judulElement =
                    document.getElementById("aduanJudul");

                const deskripsiElement =
                    document.getElementById("aduanDeskripsi");

                const button =
                    document.getElementById("aduanSubmit");


                if (
                    !namaElement ||
                    !kategoriElement ||
                    !judulElement ||
                    !deskripsiElement ||
                    !button
                ) {

                    console.error(
                        "Elemen form aduan tidak lengkap."
                    );

                    return;
                }


                const nama =
                    namaElement.value.trim();

                const kategori =
                    kategoriElement.value;

                const judul =
                    judulElement.value.trim();

                const deskripsi =
                    deskripsiElement.value.trim();


                /* ===============================
                   VALIDASI
                =============================== */

                if (
                    !nama ||
                    !kategori ||
                    !judul ||
                    !deskripsi
                ) {

                    alert(
                        "Mohon lengkapi semua data aduan."
                    );

                    return;
                }


                /* ===============================
                   TOMBOL MENGIRIM
                =============================== */

                button.disabled = true;

                button.textContent =
                    "MENGIRIM...";


                const data = {

                    nama: nama,

                    kategori: kategori,

                    judul: judul,

                    deskripsi: deskripsi,

                    status: "Menunggu"

                };


                /* ===============================
                   KIRIM KE GOOGLE SHEETS
                =============================== */

                fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",

                        mode: "no-cors",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(data)
                    }
                )

                .then(function () {

                    alert(
                        "✅ Aduan berhasil dikirim!"
                    );

                    aduanForm.reset();

                })

                .catch(function (error) {

                    console.error(
                        "Error:",
                        error
                    );

                    alert(
                        "❌ Aduan gagal dikirim. Silakan coba lagi."
                    );

                })

                .finally(function () {

                    button.disabled = false;

                    button.textContent =
                        "KIRIM ADUAN";

                });

            }
        );

    }

});
