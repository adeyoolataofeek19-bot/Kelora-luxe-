/* =========================================
KELORA LUXE — APP.JS
PART 1: LOADER, HEADER & MOBILE NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

/* ---------- LOADING SCREEN ---------- */

const pageLoader = document.getElementById("pageLoader");

function hidePageLoader() {
    if (pageLoader) {
        pageLoader.classList.add("hidden");
    }
}

window.addEventListener("load", function () {
    setTimeout(hidePageLoader, 500);
});

// Fallback in case the loading screen gets stuck.
setTimeout(hidePageLoader, 2500);


/* ---------- HEADER SCROLL EFFECT ---------- */

const siteHeader = document.getElementById("siteHeader");

function updateHeader() {
    if (!siteHeader) return;

    if (window.scrollY > 30) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

updateHeader();

window.addEventListener("scroll", updateHeader, {
    passive: true
});


/* ---------- MOBILE NAVIGATION ---------- */

const menuToggle = document.getElementById("menuToggle");
const mainNavigation = document.getElementById("mainNavigation");

function closeMobileMenu() {
    if (!menuToggle || !mainNavigation) return;

    menuToggle.classList.remove("active");
    mainNavigation.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

function openMobileMenu() {
    if (!menuToggle || !mainNavigation) return;

    menuToggle.classList.add("active");
    mainNavigation.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
}

if (menuToggle && mainNavigation) {

    menuToggle.addEventListener("click", function () {
        const isOpen =
            mainNavigation.classList.contains("active");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close the menu after a navigation link is selected.
    mainNavigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close the menu when the user taps outside it.
    document.addEventListener("click", function (event) {
        const clickedInsideMenu =
            mainNavigation.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

}


/* ---------- CURRENT FOOTER YEAR ---------- */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

});
/* =========================================
KELORA LUXE — APP.JS
PART 2: FEATURED IMAGE LIGHTBOX
========================================= */

document.addEventListener("DOMContentLoaded", function () {

const imageLightbox = document.getElementById("imageLightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const imageButtons = document.querySelectorAll(
    ".featured-image-button"
);

let previousFocusedElement = null;

/* ---------- OPEN LIGHTBOX ---------- */

function openLightbox(button) {

    if (
        !imageLightbox ||
        !lightboxImage ||
        !lightboxCaption
    ) {
        return;
    }

    const imageSource = button.getAttribute("data-image");
    const imageTitle = button.getAttribute("data-title") || "";

    if (!imageSource) {
        return;
    }

    previousFocusedElement = button;

    lightboxImage.src = imageSource;
    lightboxImage.alt = imageTitle;
    lightboxCaption.textContent = imageTitle;

    imageLightbox.classList.add("active");
    imageLightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    if (lightboxClose) {
        lightboxClose.focus();
    }
}


/* ---------- CLOSE LIGHTBOX ---------- */

function closeLightbox() {

    if (!imageLightbox) {
        return;
    }

    imageLightbox.classList.remove("active");
    imageLightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    if (lightboxImage) {
        lightboxImage.src = "";
        lightboxImage.alt = "";
    }

    if (lightboxCaption) {
        lightboxCaption.textContent = "";
    }

    if (previousFocusedElement) {
        previousFocusedElement.focus();
        previousFocusedElement = null;
    }
}


/* ---------- IMAGE BUTTON EVENTS ---------- */

imageButtons.forEach(function (button) {

    button.addEventListener("click", function () {
        openLightbox(button);
    });

});


/* ---------- CLOSE BUTTON ---------- */

if (lightboxClose) {

    lightboxClose.addEventListener("click", function () {
        closeLightbox();
    });

}


/* ---------- CLICK OUTSIDE THE IMAGE ---------- */

if (imageLightbox) {

    imageLightbox.addEventListener("click", function (event) {

        if (event.target === imageLightbox) {
            closeLightbox();
        }

    });

}


/* ---------- ESCAPE KEY ---------- */

document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        imageLightbox &&
        imageLightbox.classList.contains("active")
    ) {
        closeLightbox();
    }

});

});
/* KELORA LUXE — LIKE BUTTON FUNCTIONALITY */
document.addEventListener("click", function (event) {
const button = event.target.closest(".like-button");

if (!button) return;

const isLiked = button.classList.toggle("is-liked");

button.setAttribute("aria-pressed", String(isLiked));

button.innerHTML = isLiked
    ? '♥ <span>Liked</span>'
    : '♡ <span>Like</span>';

});