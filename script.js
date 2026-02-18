const petNameInput = document.querySelector("#petName");
const animalTypeSelect = document.querySelector("#animalType");
const createPetBtn = document.querySelector("#createPetBtn");
const randomNameBtn = document.querySelector("#randomNameBtn");

const logEl = document.querySelector("#log");
let petsContainer = document.getElementById("petsContainer");

class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;

        this.decayInterval = null;
    }

    nap() {
        this.energy += 40;
        this.fullness -= 10;
        this.happiness -= 10;
        this.limitStats();
        addLog(`You took a nap with ${this.name} (+40⚡ -10🥞 -10💕)`);

        this.checkAlive();
    }

    play() {
        this.energy -= 10;
        this.fullness -= 10;
        this.happiness += 30;
        this.limitStats();
        addLog(`You played with ${this.name} (-10⚡ -10🥞 +30💕)`);

        this.checkAlive();
    }

    eat() {
        this.energy -= 15;
        this.fullness += 30;
        this.happiness += 5;
        this.limitStats();
        addLog(`You fed ${this.name} (-15⚡ +30🥞 +5💕)`);

        this.checkAlive();
    }

    limitStats() {
        this.energy = Math.min(100, Math.max(0, this.energy));
        this.fullness = Math.min(100, Math.max(0, this.fullness));
        this.happiness = Math.min(100, Math.max(0, this.happiness));
    }

    updateBar(i) {
        const setWidth = (id, value) => {
            const el = document.getElementById(id);
            if (!el) return;
            const safeValue = Math.max(0, Math.min(100, value));
            el.style.width = safeValue + "%";
        };

        setWidth(`energy-${i}`, this.energy);
        setWidth(`fullness-${i}`, this.fullness);
        setWidth(`happiness-${i}`, this.happiness);
    }

    statDecay() {
        this.energy -= 1;
        this.fullness -= 1;
        this.happiness -= 1;
        this.limitStats();
    }

    startDecay() {
        if (this.decayInterval) return;

        this.decayInterval = setInterval(() => {
            this.statDecay();

            const index = pets.indexOf(this);
            if (index === -1) return;

            this.updateBar(index);

            if (this.energy <= 0 || this.fullness <= 0 || this.happiness <= 0) {
                this.removePet();
            }
        }, 1000);
    }

    removePet() {
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
        }

        const index = pets.indexOf(this);
        if (index !== -1) {
            pets.splice(index, 1);
        }

        updateUI();
        addLog(`${this.name} has left... 💔`);
    }

    checkAlive() {
        if (this.energy <= 0 || this.fullness <= 0 || this.happiness <= 0) {
            this.removePet();
            return false;
        }
        return true;
    }

    static capitalizeFirstLetter(val) {
        return val.charAt(0).toUpperCase() + val.slice(1);
    }
}

let pets = [];

function updateUI() {
    petsContainer.innerHTML = "";

    pets.forEach((pet, index) => {
        const card = document.createElement("div");
        card.classList.add("pet-card");

        const title = document.createElement("h2");
        title.innerHTML = `${pet.name} the ${pet.animalType}`;
        card.appendChild(title);

        const img = document.createElement("img");
        img.src = `images/${pet.animalType}.png`;
        img.classList.add("petImage")
        card.appendChild(img);

        const stats = [
            { name: "Energy⚡", value: pet.energy, colorId: "energy" },
            { name: "Fullness🍖", value: pet.fullness, colorId: "fullness" },
            { name: "Happiness🥰", value: pet.happiness, colorId: "happiness" }
        ];

        stats.forEach(stat => {
            const p = document.createElement("p");
            p.innerHTML = `${stat.name}:`;
            card.appendChild(p);

            const progress = document.createElement("div");
            progress.classList.add("progress");

            const bar = document.createElement("div");
            bar.classList.add("bar", stat.colorId);
            bar.id = `${stat.colorId}-${index}`;
            bar.style.width = `${Math.max(0, Math.min(100, stat.value))}%`;

            progress.appendChild(bar);
            card.appendChild(progress);
        });


        const actions = document.createElement("div");
        actions.classList.add("actions");

        const napBtn = document.createElement("button");
        napBtn.innerHTML = "Nap";
        napBtn.classList.add("napBtn")
        napBtn.onclick = () => {
            pet.nap();
            updateUI();
        };

        const playBtn = document.createElement("button");
        playBtn.innerHTML = "Play";
        playBtn.classList.add("playBtn")
        playBtn.onclick = () => {
            pet.play();
            updateUI();
        };

        const eatBtn = document.createElement("button");
        eatBtn.innerHTML = "Eat";
        eatBtn.classList.add("eatBtn")
        eatBtn.onclick = () => {
            pet.eat();
            updateUI();
        };

        actions.appendChild(napBtn);
        actions.appendChild(playBtn);
        actions.appendChild(eatBtn);

        card.appendChild(actions);
        petsContainer.appendChild(card);

        pet.startDecay(index);
    });
}

function addLog(message) {
    const p = document.createElement("p");
    p.innerHTML = message;
    logEl.appendChild(p);
}

createPetBtn.addEventListener("click", () => {
    const name = petNameInput.value.trim() || "Unnamed";
    const type = animalTypeSelect.value;

    const newPet = new Pet(name, type);
    pets.push(newPet);

    addLog(`${newPet.name} the ${newPet.animalType} has joined the household 🥳`);

    if (pets.length > 4) {
        newPet.removePet();
        alert("Max pets per household is 4")
    }

    updateUI();
});

randomNameBtn.addEventListener("click", async () => {
    try {
        const response = await axios.get("https://randomuser.me/api/0.8/");
        let name = response.data.results[0].user.name.first;
        name = Pet.capitalizeFirstLetter(name);
        petNameInput.value = name;
    } catch (error) {
        console.error("Failed to get random name:", error);
        alert("Could not fetch random name.");
    }
});
