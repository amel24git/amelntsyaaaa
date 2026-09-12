document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       ANIMASI SCROLL
    =============================== */

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


    /* ===============================
       POPUP VIDEO 9:16
    =============================== */

    const videoCards = document.querySelectorAll(".video-card");

    if (videoCards.length > 0) {

        const lightbox = document.createElement("div");

        lightbox.className = "video-lightbox";

        lightbox.innerHTML = `
            <div class="video-lightbox-content">

                <button class="video-lightbox-close">
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
            document.querySelector(".video-lightbox-close");


        /* Klik video */

        videoCards.forEach(function (card) {

            const video =
                card.querySelector("video");

            if (!video) return;

            video.addEventListener("dblclick", function (event) {

                event.preventDefault();

                const source =
                    video.querySelector("source");

                if (source) {
                    popupVideo.src = source.src;
                } else {
                    popupVideo.src = video.currentSrc;
                }

                lightbox.classList.add("show");

                document.body.style.overflow = "hidden";

                popupVideo.play().catch(function () {});

            });

        });


        /* Tutup */

        closeButton.addEventListener("click", function () {

            popupVideo.pause();

            popupVideo.removeAttribute("src");

            popupVideo.load();

            lightbox.classList.remove("show");

            document.body.style.overflow = "";

        });


        /* Klik luar */

        lightbox.addEventListener("click", function (event) {

            if (event.target === lightbox) {

                popupVideo.pause();

                popupVideo.removeAttribute("src");

                popupVideo.load();

                lightbox.classList.remove("show");

                document.body.style.overflow = "";
            }

        });


        /* Tombol ESC */

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("show")
            ) {

                popupVideo.pause();

                popupVideo.removeAttribute("src");

                popupVideo.load();

                lightbox.classList.remove("show");

                document.body.style.overflow = "";
            }

        });

    }
    /* ===============================
       FORM ADUAN → GOOGLE SHEETS
    =============================== */

    const aduanForm = document.getElementById("aduanForm");

    if (aduanForm) {

        const SCRIPT_URL =
            "https://script.google.com/macros/s/AKfycbyiWALzpMsFqJUGFlT-S8Sj26LqauOqovFBI4WHFnsgAWBXH7NZPwV4fQfMC_1bhpT0/exec";

        aduanForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nama =
                document.getElementById("nama").value.trim();

            const kategori =
                document.getElementById("kategori").value;

            const judul =
                document.getElementById("judul").value.trim();

            const deskripsi =
                document.getElementById("deskripsi").value.trim();

            if (!nama || !kategori || !judul || !deskripsi) {
                alert("Mohon lengkapi semua data aduan.");
                return;
            }

            const submitButton =
                aduanForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Mengirim...";
            }

            const data = {
                nama: nama,
                kategori: kategori,
                judul: judul,
                deskripsi: deskripsi,
                status: "Menunggu"
            };

            fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(data)
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {

                if (result.success) {

                    alert("Aduan berhasil dikirim.");

                    aduanForm.reset();

                } else {

                    alert(
                        "Aduan gagal dikirim: " +
                        (result.message || "Terjadi kesalahan.")
                    );

                }

            })
            .catch(function (error) {

                console.error(error);

                alert(
                    "Aduan gagal dikirim. Silakan coba lagi."
                );

            })
            .finally(function () {

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Kirim Aduan";
                }

            });

        });
    }

});
