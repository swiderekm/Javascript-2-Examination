/* ==========================
   DOM ELEMENTS
========================== */

const petNameInput = document.querySelector("#petName");
const animalTypeSelect = document.querySelector("#animalType");
const createPetBtn = document.querySelector("#createPetBtn");

const petCard = document.querySelector(".pet-card");
const petTitle = document.querySelector("#petTitle");
const petImage = document.querySelector("#petImage");

const energyEl = document.querySelector("#energy");
const fullnessEl = document.querySelector("#fullness");
const happinessEl = document.querySelector("#happiness");

const napBtn = document.querySelector("#napBtn");
const playBtn = document.querySelector("#playBtn");
const eatBtn = document.querySelector("#eatBtn");

const logEl = document.querySelector("#log");


/* ==========================
   PET CLASS
========================== */

class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
    }

    nap() {
        this.energy += 40;
        this.happiness -= 10;
        this.fullness -= 10;
        this.limitStats();
        addLog(`You took a nap with ${this.name}!`);
    }

    play() {
        this.happiness += 30;
        this.fullness -= 10;
        this.energy -= 10;
        this.limitStats();
        addLog(`You played with ${this.name}!`);
    }

    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.limitStats();
        addLog(`You fed ${this.name}!`);
    }

    limitStats() {
        this.energy = Math.min(100, Math.max(0, this.energy));
        this.fullness = Math.min(100, Math.max(0, this.fullness));
        this.happiness = Math.min(100, Math.max(0, this.happiness));
    }
}

let currentPet = null;

function updateUI() {
    petTitle.textContent = `${currentPet.name} the ${currentPet.animalType}`;
    energyEl.textContent = currentPet.energy;
    fullnessEl.textContent = currentPet.fullness;
    happinessEl.textContent = currentPet.happiness;

    petImage.src = `images/${currentPet.animalType}.png`;
}

function addLog(message) {
    const p = document.createElement("p");
    p.textContent = message;
    logEl.appendChild(p);
}

createPetBtn.addEventListener("click", () => {
    const name = petNameInput.value || "";
    const type = animalTypeSelect.value;

    currentPet = new Pet(name, type);

    petCard.classList.remove("hidden");
    logEl.innerHTML = "";

    updateUI();
});

napBtn.addEventListener("click", () => {
    if (!currentPet) return;
    currentPet.nap();
    updateUI();
});

playBtn.addEventListener("click", () => {
    if (!currentPet) return;
    currentPet.play();
    updateUI();
});

eatBtn.addEventListener("click", () => {
    if (!currentPet) return;
    currentPet.eat();
    updateUI();
});
