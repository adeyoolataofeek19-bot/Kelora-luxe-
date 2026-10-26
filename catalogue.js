/* ==========================================
KELORA LUXE — SHARED CATALOGUE
Pricing-ready; no invented prices.
========================================== */

(function () {
"use strict";

const WHATSAPP_NUMBER = "2348066159044";

/*
 * Prices remain null until Kelly confirms them.
 * Do not display an invented price to customers.
 */

const catalogue = {
    interiors: {
        title: "Interior Design",
        price: null,
        pricingType: "quotation",
        page: "interiors.html"
    },

    events: {
        title: "Event Styling",
        price: null,
        pricingType: "quotation",
        page: "events.html"
    },

    fragrances: {
        title: "Fragrances",
        price: null,
        pricingType: "enquiry",
        page: "fragrances.html"
    },

    basic: {
        title: "Basic Package",
        price: null,
        pricingType: "quotation",
        page: "basic.html"
    },

    premium: {
        title: "Premium Package",
        price: null,
        pricingType: "quotation",
        page: "premium.html"
    }
};

function getItem(key) {
    return catalogue[String(key).toLowerCase()] || null;
}

function getAll() {
    return Object.keys(catalogue).map(function (key) {
        return {
            id: key,
            ...catalogue[key]
        };
    });
}

function formatPrice(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
        return null;
    }

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2
    }).format(amount);
}

function getPriceLabel(key) {
    const item = getItem(key);

    if (!item) {
        return "Contact us for details";
    }

    if (typeof item.price === "number") {
        return formatPrice(item.price);
    }

    if (item.pricingType === "quotation") {
        return "Request a Quote";
    }

    return "Enquire for Current Price";
}

function getEnquiryLink(key) {
    const item = getItem(key);

    if (!item) {
        return "https://wa.me/" + WHATSAPP_NUMBER;
    }

    const message =
        "Hello KELORA LUXE, I would like to enquire about " +
        item.title +
        ". Please share the available options and current pricing.";

    return "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);
}

window.KeloraCatalogue = {
    getAll: getAll,
    getItem: getItem,
    formatPrice: formatPrice,
    getPriceLabel: getPriceLabel,
    getEnquiryLink: getEnquiryLink
};

})();