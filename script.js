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
       FORM ADUAN + TOKEN
    =============================== */

    const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzgDVCYu_32Z3o5bUEOuWlJMJsNV8ii3ONp-7RtaQUtfZ0EedTNQujXo5jVH91hS0Vr/exec";

    function buatToken() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let token = "ADU-";
        for (let i = 0; i < 5; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    const aduanForm = document.getElementById("aduanForm");

    if (aduanForm) {
        aduanForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const namaElement = document.getElementById("aduanNama");
            const kategoriElement = document.getElementById("aduanKategori");
            const judulElement = document.getElementById("aduanJudul");
            const deskripsiElement = document.getElementById("aduanDeskripsi");
            const button = document.getElementById("aduanSubmit");

            const nama = namaElement.value.trim();
            const kategori = kategoriElement.value;
            const judul = judulElement.value.trim();
            const deskripsi = deskripsiElement.value.trim();
            const token = buatToken();

            if (!nama || !kategori || !judul || !deskripsi) {
                alert("Mohon lengkapi semua data aduan.");
                return;
            }

            button.disabled = true;
            button.textContent = "MENGIRIM...";

            const data = {
                action: "aduan",
                token: token,
                nama: nama,
                kategori: kategori,
                judul: judul,
                deskripsi: deskripsi,
                status: "Menunggu",
                balasan: ""
            };

            fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(data)
            })
            .then(function () {
                document.getElementById("tokenValue").textContent = token;
                document.getElementById("tokenHasil").style.display = "block";
                document.getElementById("tokenCek").value = token;
                alert("✅ Aduan berhasil dikirim!\n\nToken Anda: " + token + "\nSimpan token ini untuk mengecek balasan.");
                aduanForm.reset();
                document.getElementById("tokenHasil").scrollIntoView({ behavior: "smooth", block: "center" });
            })
            .catch(function (error) {
                console.error("Error:", error);
                alert("❌ Aduan gagal dikirim. Silakan coba lagi.");
            })
            .finally(function () {
                button.disabled = false;
                button.textContent = "KIRIM ADUAN";
            });
        });

        const copyButton = document.getElementById("copyToken");
        if (copyButton) {
            copyButton.addEventListener("click", function () {
                const token = document.getElementById("tokenValue").textContent;
                navigator.clipboard.writeText(token).then(function () {
                    copyButton.textContent = "✅ Token Tersalin";
                    setTimeout(function () { copyButton.textContent = "📋 Salin Token"; }, 1800);
                });
            });
        }
    }

    /* ===============================
       CEK STATUS ADUAN
    =============================== */

    const cekAduanForm = document.getElementById("cekAduanForm");
    if (cekAduanForm) {
        cekAduanForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const token = document.getElementById("tokenCek").value.trim().toUpperCase();
            const button = document.getElementById("cekAduanButton");
            const hasil = document.getElementById("hasilCekAduan");

            if (!token) return;
            button.disabled = true;
            button.textContent = "MENGECEK...";
            hasil.style.display = "block";
            hasil.innerHTML = '<div style="padding:18px; border-radius:16px; background:#f3faff; color:#58717e; text-align:center;">🔎 Mencari data aduan...</div>';

            fetch(SCRIPT_URL + "?action=check&token=" + encodeURIComponent(token), { method: "GET" })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (!data.success || !data.data) {
                        hasil.innerHTML = '<div style="padding:18px; border-radius:16px; background:#fff4f4; color:#b34b4b; text-align:center;">❌ Token tidak ditemukan. Periksa kembali token aduan Anda.</div>';
                        return;
                    }

                    const d = data.data;
                    const status = d.status || "Menunggu";
                    const reply = d.balasan || "Belum ada balasan dari admin.";
                    hasil.innerHTML = `
                        <div style="padding:22px; border-radius:18px; background:#f7fcff; border:1px solid #d7edf7;">
                            <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:15px;">
                                <strong style="color:#176b9c;">🔑 ${escapeHTML(d.token)}</strong>
                                <span style="padding:7px 13px; border-radius:999px; background:#e3f5ff; color:#176b9c; font-weight:700; font-size:13px;">${escapeHTML(status)}</span>
                            </div>
                            <h3 style="color:#234; margin-bottom:7px;">${escapeHTML(d.judul)}</h3>
                            <p style="color:#6d7c84; margin-bottom:12px;"><b>Kategori:</b> ${escapeHTML(d.kategori)}</p>
                            <p style="color:#4d5d65; line-height:1.7; margin-bottom:16px;"><b>Aduan:</b><br>${escapeHTML(d.deskripsi)}</p>
                            <div style="padding:16px; border-radius:14px; background:white; border-left:4px solid #42a5d5;">
                                <b style="color:#176b9c;">💬 Balasan Admin</b>
                                <p style="margin-top:7px; color:#56666e; line-height:1.7;">${escapeHTML(reply)}</p>
                            </div>
                        </div>`;
                })
                .catch(function (error) {
                    console.error(error);
                    hasil.innerHTML = '<div style="padding:18px; border-radius:16px; background:#fff4f4; color:#b34b4b; text-align:center;">⚠️ Gagal mengambil data. Pastikan Apps Script sudah diperbarui dan di-deploy ulang.</div>';
                })
                .finally(function () {
                    button.disabled = false;
                    button.textContent = "🔎 CEK ADUAN";
                });
        });
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>");
    }

});
