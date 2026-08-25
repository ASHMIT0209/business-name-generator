const firstWords = {
    bright: ["Spark", "Sunny", "Fresh", "Bright"],
    clever: ["Clever", "Nimble", "North", "Kindred"],
    warm: ["Good", "Golden", "Gather", "Dear"],
    bold: ["Atlas", "Grand", "True", "Forge"]
};
const secondWords = {
    everyday: ["Works", "House", "Collective"],
    creators: ["Studio", "Craft", "Workshop"],
    families: ["& Co.", "Nest", "Club"],
    professionals: ["Partners", "Group", "Office"],
    adventurers: ["Trail", "Outpost", "Supply"]
};
const nameElement = document.getElementById("business-name");
const resultNote = document.getElementById("result-note");
const logoMark = document.getElementById("logo-mark");
const logoSymbol = document.getElementById("logo-symbol");
const logoName = document.getElementById("logo-name");
const logoDescription = document.getElementById("logo-description");
const form = document.getElementById("name-form");
const againButton = document.getElementById("again-button");
const copyButton = document.getElementById("copy-button");
const saveButton = document.getElementById("save-button");
const savedSection = document.querySelector(".saved-section");
const savedList = document.getElementById("saved-list");
const clearButton = document.getElementById("clear-button");
const savedIdeas = JSON.parse(localStorage.getItem("foundryIdeas") || "[]");
let currentIdea = null;

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const logoSymbols = [
    { words: ["food", "bakery", "cafe", "coffee", "restaurant", "kitchen"], label: "culinary", path: "M30 57h36M35 57V43h26v14M39 43c0-13 18-13 18 0M43 32c0-6 10-6 10 0" },
    { words: ["candle", "home", "decor", "interior"], label: "home", path: "M37 64h22M40 60V38h16v22M43 38c0-8 10-8 10 0M48 30v-7" },
    { words: ["cloth", "fashion", "apparel", "dress", "wear", "boutique"], label: "fashion", path: "M38 33l10 7 10-7 11 10-8 8-5-5v18H40V46l-5 5-8-8z" },
    { words: ["tech", "software", "digital", "app", "data", "design"], label: "digital", path: "M29 32h38v27H29zM39 67h18M48 59v8M37 39h22v13H37z" },
    { words: ["fitness", "gym", "health", "yoga", "sport", "wellness"], label: "wellness", path: "M31 39v18M38 34v28M58 34v28M65 39v18M38 48h20" },
    { words: ["travel", "tour", "adventure", "outdoor", "camp", "trail"], label: "adventure", path: "M27 62l21-35 21 35M35 50h26M42 62V47h12v15" },
    { words: ["beauty", "salon", "skin", "hair", "cosmetic"], label: "beauty", path: "M48 26v39M39 34c-11 7-7 19 9 19s20-12 9-19M40 65h16" }
];

function chooseLogoSymbol(businessType) {
    const words = businessType.toLowerCase();
    return logoSymbols.find((symbol) => symbol.words.some((word) => words.includes(word))) || {
        label: "original",
        path: "M48 25l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z"
    };
}

function generateName() {
    const businessType = document.getElementById("business-type").value.trim();
    const audience = document.getElementById("audience").value;
    const style = document.getElementById("style").value;
    const location = document.getElementById("location").value.trim();
    const place = location ? `${location} ` : "";
    let generatedName = `${place}${randomItem(firstWords[style])} ${randomItem(secondWords[audience])}`;
    const previousName = currentIdea ? currentIdea.name : "";
    while (generatedName === previousName) {
        generatedName = `${place}${randomItem(firstWords[style])} ${randomItem(secondWords[audience])}`;
    }
    const logo = chooseLogoSymbol(businessType);
    currentIdea = { name: generatedName, businessType, style, logoLabel: logo.label };

    nameElement.textContent = generatedName;
    resultNote.textContent = `A ${style} name for ${businessType}. Generate again to explore another direction.`;
    logoMark.dataset.style = style;
    logoSymbol.setAttribute("d", logo.path);
    logoName.textContent = `${generatedName} mark`;
    logoDescription.textContent = `${style[0].toUpperCase()}${style.slice(1)} ${logo.label} identity for ${businessType}.`;
    againButton.hidden = false;
    copyButton.hidden = false;
    saveButton.hidden = savedIdeas.some((idea) => idea.name === generatedName);
}

function renderSavedIdeas() {
    savedList.replaceChildren();
    savedSection.hidden = savedIdeas.length === 0;
    savedIdeas.forEach((idea) => {
        const item = document.createElement("li");
        item.innerHTML = `<div><strong></strong><span></span></div><button type="button" aria-label="Remove saved idea">Remove</button>`;
        item.querySelector("strong").textContent = idea.name;
        item.querySelector("span").textContent = `${idea.style} ${idea.logoLabel} identity for ${idea.businessType}`;
        item.querySelector("button").addEventListener("click", () => {
            savedIdeas.splice(savedIdeas.indexOf(idea), 1);
            localStorage.setItem("foundryIdeas", JSON.stringify(savedIdeas));
            renderSavedIdeas();
            if (currentIdea && currentIdea.name === idea.name) saveButton.hidden = false;
        });
        savedList.append(item);
    });
}

copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(currentIdea.name);
    copyButton.textContent = "Copied";
    setTimeout(() => { copyButton.textContent = "Copy name"; }, 1400);
});

saveButton.addEventListener("click", () => {
    savedIdeas.unshift(currentIdea);
    localStorage.setItem("foundryIdeas", JSON.stringify(savedIdeas.slice(0, 12)));
    saveButton.hidden = true;
    renderSavedIdeas();
});

clearButton.addEventListener("click", () => {
    savedIdeas.length = 0;
    localStorage.removeItem("foundryIdeas");
    renderSavedIdeas();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    generateName();
});

againButton.addEventListener("click", generateName);
renderSavedIdeas();
