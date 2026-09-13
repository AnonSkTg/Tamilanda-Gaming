/* =====================================================
   TAMILANDA GAMING
   Main Website High Performance JavaScript
   Features: Wishlist, Floating WhatsApp, Sales Toast Ticker, Lightbox
   Premium Interaction Layer + Admin Selector
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const ADMIN_CONTACTS = [
        {
            name: "Admin 1",
            label: "@Visualize",
            number: "919786267475",
            display: "+91 97862 67475"
        },
        {
            name: "Admin 2",
            label: "Tamilanda Gaming Admin",
            number: "919363063571",
            display: "+91 93630 63571"
        }
    ];

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

    document.querySelectorAll(".side-menu a").forEach((link) => {
        link.addEventListener("click", () => {
            if (sideMenu) sideMenu.classList.remove("open");
        });
    });

    /* =================================================
       CURRENT YEAR
       ================================================= */

    document.querySelectorAll("#current-year").forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    /* =================================================
       WISHLIST (LOCALSTORAGE)
       ================================================= */

    window.TamilandaWishlist = {
        get() {
            try {
                const data = JSON.parse(
                    localStorage.getItem("tamilanda_wishlist")
                );
                return Array.isArray(data) ? data : [];
            } catch (error) {
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
                list = list.filter((item) => item !== strId);
            } else {
                list.push(strId);
            }

            localStorage.setItem(
                "tamilanda_wishlist",
                JSON.stringify(list)
            );

            window.dispatchEvent(
                new CustomEvent("wishlistUpdated", {
                    detail: {
                        id: strId,
                        list
                    }
                })
            );

            return list.includes(strId);
        }
    };

    /* =================================================
       PROOF LIGHTBOX MODAL
       ================================================= */

    window.openProofModal = function (src, title) {
        const lightbox = document.getElementById("proofLightbox");
        const img = document.getElementById("lightboxImg");

        if (lightbox && img) {
            img.src = src;
            img.alt = title || "Proof Screenshot";
            lightbox.classList.add("open");
        }
    };

    window.closeProofModal = function () {
        const lightbox = document.getElementById("proofLightbox");

        if (lightbox) {
            lightbox.classList.remove("open");
        }
    };

    /* =================================================
       GLOBAL ADMIN WHATSAPP SELECTOR
       ================================================= */

    function buildAdminChooser() {
        if (document.getElementById("tgAdminChooser")) return;

        const chooser = document.createElement("div");
        chooser.id = "tgAdminChooser";
        chooser.className = "tg-admin-chooser";
        chooser.innerHTML = `
            <div class="tg-admin-backdrop" data-tg-admin-close></div>

            <div class="tg-admin-dialog" role="dialog"
                 aria-modal="true"
                 aria-labelledby="tgAdminTitle">

                <button type="button"
                        class="tg-admin-close"
                        aria-label="Close"
                        data-tg-admin-close>×</button>

                <div class="tg-admin-icon">💬</div>

                <h3 id="tgAdminTitle">Choose Admin</h3>
                <p class="tg-admin-subtitle">
                    Select an official Tamilanda Gaming admin to continue on WhatsApp.
                </p>

                <div class="tg-admin-list">
                    ${ADMIN_CONTACTS.map((admin, index) => `
                        <button type="button"
                                class="tg-admin-option"
                                data-admin-index="${index}">
                            <span class="tg-admin-avatar">👤</span>
                            <span class="tg-admin-info">
                                <strong>${admin.name}</strong>
                                <span>${admin.label}</span>
                                <small>${admin.display}</small>
                            </span>
                            <span class="tg-admin-arrow">›</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        `;

        document.body.appendChild(chooser);

        chooser.querySelectorAll("[data-tg-admin-close]").forEach((element) => {
            element.addEventListener("click", closeAdminChooser);
        });

        chooser.querySelectorAll(".tg-admin-option").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.adminIndex);
                const admin = ADMIN_CONTACTS[index];

                if (!admin) return;

                const message =
                    window.TamilandaPendingWhatsAppMessage ||
                    "Hi Tamilanda Gaming, I have an inquiry regarding Free Fire IDs.";

                const url =
                    `https://wa.me/${admin.number}?text=${encodeURIComponent(message)}`;

                window.open(url, "_blank", "noopener,noreferrer");
                closeAdminChooser();
            });
        });
    }

    function openAdminChooser(message) {
        buildAdminChooser();

        window.TamilandaPendingWhatsAppMessage =
            message ||
            "Hi Tamilanda Gaming, I have an inquiry regarding Free Fire IDs.";

        const chooser = document.getElementById("tgAdminChooser");

        if (chooser) {
            chooser.classList.add("open");
            document.body.classList.add("tg-admin-modal-open");

            const firstOption =
                chooser.querySelector(".tg-admin-option");

            if (firstOption) {
                setTimeout(() => firstOption.focus(), 50);
            }
        }
    }

    function closeAdminChooser() {
        const chooser = document.getElementById("tgAdminChooser");

        if (chooser) {
            chooser.classList.remove("open");
        }

        document.body.classList.remove("tg-admin-modal-open");
        window.TamilandaPendingWhatsAppMessage = "";
    }

    window.TamilandaAdminChooser = {
        open: openAdminChooser,
        close: closeAdminChooser,
        admins: ADMIN_CONTACTS
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
                    <img src="assets/ic_launcher.png"
                         alt="Tamilanda Support"
                         class="widget-avatar">

                    <div class="widget-header-text">
                        <strong>Tamilanda Support</strong>
                        <span>Online | Fast Response</span>
                    </div>
                </div>

                <p class="widget-body-text">
                    Hi there! 🎮 Looking to buy or sell a Free Fire account?
                    Chat directly with our official admin on WhatsApp.
                </p>

                <button type="button"
                        class="widget-btn"
                        id="widgetChatBtn">
                    💬 CHOOSE ADMIN
                </button>
            </div>

            <button type="button"
                    class="widget-trigger"
                    id="widgetTriggerBtn"
                    aria-label="Open WhatsApp Support">
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
                const message =
                    "Hi Tamilanda Gaming, I have an inquiry regarding Free Fire IDs.";

                openAdminChooser(message);
            });
        }
    }

    buildAdminChooser();
    initWhatsAppWidget();

    /* =================================================
       LIVE SALES TICKER TOAST
       ================================================= */

    function initSalesTicker() {
        if (document.querySelector(".sales-toast")) return;

        const toast = document.createElement("div");
        toast.className = "sales-toast";
        toast.id = "salesToast";

        toast.innerHTML = `
            <div class="toast-icon">⚡</div>

            <div class="toast-body">
                <strong id="toastTitle">Tamilanda Gaming</strong>
                <span id="toastSubtitle">Verified marketplace update</span>
            </div>

            <button type="button"
                    class="toast-close"
                    id="toastCloseBtn"
                    aria-label="Close notification">×</button>
        `;

        document.body.appendChild(toast);

        /*
         * Keep this ticker factual.
         * It is populated from IDs marked as sold in the public API.
         * If the API is unavailable, no fake sale notification is shown.
         */

        const closeBtn =
            document.getElementById("toastCloseBtn");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                toast.classList.remove("show");
            });
        }

        async function loadSoldDeals() {
            try {
                const response = await fetch(
                    "https://long-glade-ef77.tamilandaoffcyt.workers.dev/api/ids",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

                if (!response.ok) return;

                const ids = await response.json();

                if (!Array.isArray(ids)) return;

                const soldDeals = ids
                    .filter((item) => {
                        const status =
                            String(item.status || "").toLowerCase();

                        return (
                            status === "sold" ||
                            status === "soldout" ||
                            status === "sold-out"
                        );
                    })
                    .slice(0, 8)
                    .map((item) => ({
                        id: item.id || "",
                        name:
                            item.name ||
                            `Free Fire ID #${item.id || ""}`
                    }));

                if (!soldDeals.length) return;

                let index = 0;

                function showNextToast() {
                    const deal = soldDeals[index];

                    const title =
                        document.getElementById("toastTitle");

                    const subtitle =
                        document.getElementById("toastSubtitle");

                    if (!title || !subtitle) return;

                    title.textContent =
                        `${deal.name} — SOLD`;

                    subtitle.textContent =
                        deal.id
                            ? `ID #${deal.id} • Recently marked sold`
                            : "Recently marked sold";

                    toast.classList.add("show");

                    window.setTimeout(() => {
                        toast.classList.remove("show");
                    }, 6000);

                    index =
                        (index + 1) % soldDeals.length;
                }

                window.setTimeout(() => {
                    showNextToast();

                    if (soldDeals.length > 1) {
                        window.setInterval(
                            showNextToast,
                            25000
                        );
                    }
                }, 4000);

            } catch (error) {
                /*
                 * Do nothing.
                 * Never display an unverified sale.
                 */
            }
        }

        loadSoldDeals();
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
        if (event.key !== "Escape") return;

        if (sideMenu) {
            sideMenu.classList.remove("open");
        }

        const popup =
            document.getElementById("whatsappPopup");

        if (popup) {
            popup.classList.remove("open");
        }

        closeAdminChooser();
        window.closeProofModal();
    });

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            button.blur();
        });
    });

    /* =================================================
       GLOBAL IMAGE ERROR FALLBACK
       ================================================= */

    document.addEventListener(
        "error",
        (event) => {
            const target = event.target;

            if (!target || target.tagName !== "IMG") return;

            target.style.display = "none";

            const next = target.nextElementSibling;

            if (
                next &&
                next.classList.contains("proof-placeholder")
            ) {
                next.style.display = "flex";
            } else if (
                next &&
                next.classList.contains("id-image-placeholder")
            ) {
                next.style.display = "flex";
            }
        },
        true
    );

    /* =================================================
       PREMIUM INTERACTION LAYER
       Subtle 3D + Scroll Reveal + Touch Polish
       ================================================= */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const finePointer =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

    /* -------------------------------------------------
       HEADER SCROLL DEPTH
       ------------------------------------------------- */

    const header =
        document.querySelector(".top-header");

    if (header) {
        const updateHeader = () => {
            header.classList.toggle(
                "tg-scrolled",
                window.scrollY > 12
            );
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );
    }

    if (!reduceMotion) {

        /* -------------------------------------------------
           3D CARD TILT
           ------------------------------------------------- */

        const tiltSelector = [
            ".quick-card",
            ".step-card",
            ".why-card",
            ".proof-card",
            ".review-card",
            ".id-card",
            ".faq-item"
        ].join(",");

        const tiltCards =
            document.querySelectorAll(
                tiltSelector
            );

        if (finePointer) {
            tiltCards.forEach((card) => {

                card.style.setProperty(
                    "--tg-rx",
                    "0deg"
                );

                card.style.setProperty(
                    "--tg-ry",
                    "0deg"
                );

                card.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            card.getBoundingClientRect();

                        if (
                            !rect.width ||
                            !rect.height
                        ) {
                            return;
                        }

                        const x =
                            (event.clientX - rect.left) /
                            rect.width;

                        const y =
                            (event.clientY - rect.top) /
                            rect.height;

                        const rotateY =
                            (x - 0.5) * 3.8;

                        const rotateX =
                            (0.5 - y) * 3.0;

                        card.style.transform =
                            `perspective(900px)
                             rotateX(${rotateX.toFixed(2)}deg)
                             rotateY(${rotateY.toFixed(2)}deg)
                             translateY(-3px)
                             scale(1.008)`;

                        card.style.zIndex = "5";
                    },
                    {
                        passive: true
                    }
                );

                card.addEventListener(
                    "pointerleave",
                    () => {
                        card.style.transform = "";
                        card.style.zIndex = "";
                    }
                );
            });
        }

        /* -------------------------------------------------
           SCROLL REVEAL
           ------------------------------------------------- */

        const revealSelector = [
            ".quick-card",
            ".step-card",
            ".why-card",
            ".proof-card",
            ".review-card",
            ".faq-item",
            ".quick-section",
            ".trust-section",
            ".middleman-section",
            ".proofs-section",
            ".why-section",
            ".reviews-section",
            ".faq-section",
            ".bottom-cta",
            ".request-banner",
            ".catalog-toolbar",
            ".category-filters",
            ".id-card",
            ".description-section",
            ".details-notice"
        ].join(",");

        const revealElements =
            document.querySelectorAll(
                revealSelector
            );

        revealElements.forEach((element, index) => {

            element.classList.add(
                "tg-reveal"
            );

            element.style.setProperty(
                "--tg-delay",
                `${Math.min(index * 45, 320)}ms`
            );
        });

        if ("IntersectionObserver" in window) {

            const observer =
                new IntersectionObserver(
                    (entries, instance) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            entry.target.classList.add(
                                "tg-visible"
                            );

                            instance.unobserve(
                                entry.target
                            );
                        });
                    },
                    {
                        threshold: 0.08,
                        rootMargin:
                            "0px 0px -35px 0px"
                    }
                );

            revealElements.forEach((element) => {
                observer.observe(element);
            });

        } else {

            revealElements.forEach((element) => {
                element.classList.add(
                    "tg-visible"
                );
            });
        }

        /* -------------------------------------------------
           DYNAMIC CONTENT REVEAL
           ------------------------------------------------- */

        if ("MutationObserver" in window) {

            const dynamicObserver =
                new MutationObserver(
                    (mutations) => {

                        mutations.forEach(
                            (mutation) => {

                                mutation.addedNodes.forEach(
                                    (node) => {

                                        if (
                                            node.nodeType !== 1
                                        ) {
                                            return;
                                        }

                                        const matches =
                                            node.matches?.(
                                                revealSelector
                                            );

                                        const children =
                                            node.querySelectorAll?.(
                                                revealSelector
                                            ) || [];

                                        if (matches) {

                                            node.classList.add(
                                                "tg-reveal"
                                            );

                                            requestAnimationFrame(
                                                () => {
                                                    node.classList.add(
                                                        "tg-visible"
                                                    );
                                                }
                                            );
                                        }

                                        children.forEach(
                                            (element) => {
                                                element.classList.add(
                                                    "tg-visible"
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );

            dynamicObserver.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );
        }

        /* -------------------------------------------------
           IMAGE LOAD POLISH
           ------------------------------------------------- */

        document
            .querySelectorAll("img")
            .forEach((image) => {

                if (image.complete) {
                    image.classList.add(
                        "tg-image-ready"
                    );
                }

                image.addEventListener(
                    "load",
                    () => {
                        image.classList.add(
                            "tg-image-ready"
                        );
                    },
                    {
                        once: true
                    }
                );
            });

        /* -------------------------------------------------
           TOUCH PRESS FEEDBACK
           ------------------------------------------------- */

        const touchSelector = [
            "button",
            ".primary-button",
            ".secondary-button",
            ".request-btn",
            ".view-id-btn",
            ".quick-buy-whatsapp-btn",
            ".buy-now-button",
            ".social-button",
            ".gallery-thumb",
            ".category-btn"
        ].join(",");

        document.addEventListener(
            "pointerdown",
            (event) => {

                if (event.pointerType !== "touch") {
                    return;
                }

                const element =
                    event.target.closest(
                        touchSelector
                    );

                if (!element) return;

                element.classList.add(
                    "tg-touch-active"
                );
            },
            {
                passive: true
            }
        );

        const clearTouch = (event) => {

            if (event.pointerType !== "touch") {
                return;
            }

            document
                .querySelectorAll(
                    ".tg-touch-active"
                )
                .forEach((element) => {
                    element.classList.remove(
                        "tg-touch-active"
                    );
                });
        };

        document.addEventListener(
            "pointerup",
            clearTouch,
            {
                passive: true
            }
        );

        document.addEventListener(
            "pointercancel",
            clearTouch,
            {
                passive: true
            }
        );
    }

    /* -------------------------------------------------
       REDUCE MOTION: KEEP CONTENT ALWAYS VISIBLE
       ------------------------------------------------- */

    if (reduceMotion) {
        document
            .querySelectorAll(".tg-reveal")
            .forEach((element) => {
                element.classList.add(
                    "tg-visible"
                );
            });
    }

});
