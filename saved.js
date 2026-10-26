/* ==========================================
KELORA LUXE — SAVED ITEMS SYSTEM
Browser storage only; no backend required.
========================================== */

(function () {
"use strict";

const STORAGE_KEY = "keloraLuxeSavedItems";

function getSavedItems() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const items = stored ? JSON.parse(stored) : [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error("Could not load saved items:", error);
        return [];
    }
}

function storeSavedItems(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
    } catch (error) {
        console.error("Could not save items:", error);
        return false;
    }
}

function createItemId(item) {
    return [
        item.title || "Untitled",
        item.image || "",
        item.category || "Inspiration"
    ].join("::").toLowerCase();
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function saveItem(item) {
    if (!item || !item.title || !item.image) {
        return false;
    }

    const items = getSavedItems();
    const id = createItemId(item);

    if (items.some(function (saved) {
        return createItemId(saved) === id;
    })) {
        return true;
    }

    items.push({
        title: String(item.title),
        image: String(item.image),
        category: String(item.category || "Inspiration"),
        link: String(item.link || ""),
        savedAt: new Date().toISOString()
    });

    return storeSavedItems(items);
}

function removeItem(id) {
    const items = getSavedItems().filter(function (item) {
        return createItemId(item) !== id;
    });

    return storeSavedItems(items);
}

function updateSavedCount() {
    const countElement = document.getElementById("savedItemCount");

    if (countElement) {
        const count = getSavedItems().length;

        countElement.textContent = count === 1
            ? "1 item saved in your collection."
            : count + " items saved in your collection.";
    }
}

function renderSavedItems() {
    const grid = document.getElementById("savedItemsGrid");
    const emptyState = document.getElementById("savedEmptyState");

    if (!grid) {
        updateSavedCount();
        return;
    }

    const items = getSavedItems();
    updateSavedCount();

    if (items.length === 0) {
        grid.innerHTML = "";

        if (emptyState) {
            emptyState.hidden = false;
        }

        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    grid.innerHTML = items.map(function (item) {
        const id = createItemId(item);
        const safeTitle = escapeHTML(item.title);
        const safeImage = escapeHTML(item.image);
        const safeCategory = escapeHTML(item.category);
        const safeLink = escapeHTML(item.link);

        return `
            <article class="inspiration-card saved-item-card">
                <button
                    class="featured-image-button"
                    type="button"
                    data-image="${safeImage}"
                    data-title="${safeTitle}"
                    aria-label="View ${safeTitle}"
                >
                    <img
                        src="${safeImage}"
                        alt="${safeTitle}"
                        loading="lazy"
                    >
                    <span class="featured-image-overlay">
                        <span class="view-image-icon">↗</span>
                    </span>
                </button>

                <div class="inspiration-card-content">
                    <span class="eyebrow">${safeCategory}</span>
                    <h3>${safeTitle}</h3>

                    ${safeLink && safeLink.startsWith(".") && !safeLink.startsWith("..")
                        ? `<a href="${safeLink}" class="text-link">View Collection →</a>`
                        : ""}

                    <button
                        class="btn btn-outline saved-remove-button"
                        type="button"
                        data-remove-saved="${escapeHTML(id)}"
                    >
                        Remove from Saved
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function handleSaveButton(button) {
    const item = {
        title: button.dataset.saveTitle,
        image: button.dataset.saveImage,
        category: button.dataset.saveCategory || "Inspiration",
        link: button.dataset.saveLink || ""
    };

    if (!item.title || !item.image) {
        console.warn("Save button needs a title and image.");
        return;
    }

    if (saveItem(item)) {
        button.classList.add("is-saved");
        button.setAttribute("aria-pressed", "true");
        button.textContent = "♥ Saved";
    } else {
        alert("Unable to save this item. Please check your browser storage.");
    }
}

document.addEventListener("click", function (event) {
    const saveButton = event.target.closest("[data-save-item]");

    if (saveButton) {
        event.preventDefault();
        handleSaveButton(saveButton);
        renderSavedItems();
        return;
    }

    const removeButton = event.target.closest("[data-remove-saved]");

    if (removeButton) {
        event.preventDefault();

        if (removeItem(removeButton.dataset.removeSaved)) {
            renderSavedItems();
        } else {
            alert("Unable to remove this item. Please try again.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    renderSavedItems();

    document.querySelectorAll("[data-save-item]").forEach(function (button) {
        const item = {
            title: button.dataset.saveTitle,
            image: button.dataset.saveImage,
            category: button.dataset.saveCategory || "Inspiration"
        };

        const alreadySaved = getSavedItems().some(function (saved) {
            return createItemId(saved) === createItemId(item);
        });

        if (alreadySaved) {
            button.classList.add("is-saved");
            button.setAttribute("aria-pressed", "true");
            button.textContent = "♥ Saved";
        }
    });
});

// Public methods for other KELORA LUXE scripts.
window.KeloraSaved = {
    getAll: getSavedItems,
    save: saveItem,
    remove: function (item) {
        return removeItem(
            typeof item === "string" ? item : createItemId(item)
        );
    },
    render: renderSavedItems
};

})();