/* =====================================================
   TAMILANDA GAMING
   Main Website High Performance JavaScript
   Features: Wishlist, Floating WhatsApp, Sales Toast Ticker, Lightbox
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "919786267475";

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

    const sideMenuLinks = document.querySelectorAll(".side-menu a");
    sideMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (sideMenu) {
                sideMenu.classList.remove("open");
            }
        });
    });

    /* =================================================
       CURRENT YEAR
       ================================================= */

    const yearElements = document.querySelectorAll("#current-year");
    const currentYear = new Date().getFullYear();
    yearElements.forEach((el) => {
        el.textContent = currentYear;
    });

    /* =================================================
       WISHLIST (LOCALSTORAGE)
       ================================================= */

    window.TamilandaWishlist = {
        get() {
            try {
                return JSON.parse(localStorage.getItem("tamilanda_wishlist")) || [];
            } catch (e) {
                return [];
            }
        },
        has(id) {
            return this.get().includes(String(id));
        },
        toggle(id) {
            let list = this.get();
            const strId = String(id);
            if (list.includes(strId)) {
                list = list.filter(item => item !== strId);
            } else {
                list.push(strId);
            }
            localStorage.setItem("tamilanda_wishlist", JSON.stringify(list));
            window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { id: strId, list } }));
            return list.includes(strId);
        }
    };

    /* =================================================
       PROOF LIGHTBOX MODAL
       ================================================= */

    window.openProofModal = function(src, title) {
        const lightbox = document.getElementById("proofLightbox");
        const img = document.getElementById("lightboxImg");
        if (lightbox && img) {
            img.src = src;
            img.alt = title || "Proof Screenshot";
            lightbox.classList.add("open");
        }
    };

    window.closeProofModal = function() {
        const lightbox = document.getElementById("proofLightbox");
        if (lightbox) {
            lightbox.classList.remove("open");
        }
    };

    /* =================================================
       FLOATING WHATSAPP WIDGET
       ================================================= */

    function initWhatsAppWidget() {
        if (document.querySelector(".whatsapp-widget")) return;

        const widget = document.createElement("div");
        widget.className = "whatsapp-widget";
        widget.innerHTML = `
            <div class="widget-popup" id="whatsappPopup">
                <div class="widget-header">
                    <img src="assets/ic_launcher.png" alt="Tamilanda Support" class="widget-avatar">
                    <div class="widget-header-text">
                        <strong>Tamilanda Support</strong>
                        <span>Online | Fast Response</span>
                    </div>
                </div>
                <p class="widget-body-text">
                    Hi there! 🎮 Looking to buy or sell a Free Fire account? Chat directly with our admin on WhatsApp.
                </p>
                <button class="widget-btn" id="widgetChatBtn">
                    💬 START WHATSAPP CHAT
                </button>
            </div>
            <button class="widget-trigger" id="widgetTriggerBtn" aria-label="Open WhatsApp Support">
                💬
            </button>
        `;

        document.body.appendChild(widget);

        const popup = document.getElementById("whatsappPopup");
        const trigger = document.getElementById("widgetTriggerBtn");
        const chatBtn = document.getElementById("widgetChatBtn");

        if (trigger && popup) {
            trigger.addEventListener("click", () => {
                popup.classList.toggle("open");
            });
        }

        if (chatBtn) {
            chatBtn.addEventListener("click", () => {
                const msg = encodeURIComponent("Hi Tamilanda Gaming, I have an inquiry regarding Free Fire IDs.");
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
            });
        }
    }

    initWhatsAppWidget();

    /* =================================================
       LIVE SALES TICKER TOAST (FOMO PROOF)
       ================================================= */

    function initSalesTicker() {
        if (document.querySelector(".sales-toast")) return;

        const toast = document.createElement("div");
        toast.className = "sales-toast";
        toast.id = "salesToast";
        toast.innerHTML = `
            <div class="toast-icon">⚡</div>
            <div class="toast-body">
                <strong id="toastTitle">Free Fire ID #001</strong>
                <span id="toastSubtitle">Verified deal completed recently</span>
            </div>
            <button class="toast-close" id="toastCloseBtn">×</button>
        `;

        document.body.appendChild(toast);

        const recentDeals = [
            { id: "001", name: "Vk id (Level 82)", time: "12 mins ago" },
            { id: "002", name: "Golden Elite #002", time: "35 mins ago" },
            { id: "003", name: "High Level 85 ID", time: "1 hour ago" },
            { id: "004", name: "Starter ID Bundle", time: "2 hours ago" }
        ];

        let index = 0;
        const closeBtn = document.getElementById("toastCloseBtn");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                toast.classList.remove("show");
            });
        }

        function showNextToast() {
            const deal = recentDeals[index];
            document.getElementById("toastTitle").textContent = `${deal.name} Sold!`;
            document.getElementById("toastSubtitle").textContent = `Handed over securely • ${deal.time}`;

            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 6000);

            index = (index + 1) % recentDeals.length;
        }

        setTimeout(() => {
            showNextToast();
            setInterval(showNextToast, 25000);
        }, 4000);
    }

    initSalesTicker();

    /* =================================================
       SMOOTH SCROLL & ESC KEY
       ================================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (sideMenu) sideMenu.classList.remove("open");
            const popup = document.getElementById("whatsappPopup");
            if (popup) popup.classList.remove("open");
            window.closeProofModal();
        }
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            button.blur();
        });
    });

    /* =================================================
       GLOBAL IMAGE ERROR FALLBACK (STRICT HTML5 SAFE)
       ================================================= */

    document.addEventListener("error", (e) => {
        if (e.target && e.target.tagName === "IMG") {
            e.target.style.display = "none";
            if (e.target.nextElementSibling && e.target.nextElementSibling.classList.contains("proof-placeholder")) {
                e.target.nextElementSibling.style.display = "flex";
            } else if (e.target.nextElementSibling && e.target.nextElementSibling.classList.contains("id-image-placeholder")) {
                e.target.nextElementSibling.style.display = "flex";
            }
        }
    }, true);

});
