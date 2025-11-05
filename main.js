// Liste des couleurs disponibles avec leur nom et code hexadécimal
const COLORS = [
  { name: "Rouge", hex: "#ef4444" },
  { name: "Bleu", hex: "#3b82f6" },
  { name: "Vert", hex: "#22c55e" },
  { name: "Jaune", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Rose", hex: "#ec4899" },
  { name: "Violet", hex: "#a855f7" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Marron", hex: "#92400e" }
];

// Difficulté du jeu : plus le code est long, plus il y a de couleurs disponibles
const DIFFICULTY = {
  2: { colorCount: 3 },
  4: { colorCount: 5 },
  6: { colorCount: 9 }
};

// Classe principale du jeu (logique du Mastermind)
class Game {
  constructor(codeLength = 4, maxAttempts = 10) {
    this.codeLength = codeLength; // longueur du code secret
    this.maxAttempts = maxAttempts; // nombre d’essais max
    this.colorCount = DIFFICULTY[codeLength]?.colorCount || 5; // nombre de couleurs selon la difficulté
    this.reset(); // initialise le jeu
  }

  // Réinitialise le jeu
  reset() {
    this.secretCode = []; // code secret aléatoire
    for (let i = 0; i < this.codeLength; i++) {
      this.secretCode.push(Math.floor(Math.random() * this.colorCount));
    }
    this.currentAttempt = 0;
    this.gameOver = false;
    this.won = false;
  }

  // Vérifie une proposition du joueur
  checkGuess(guess) {
    if (this.gameOver || guess.length !== this.codeLength) return null;

    let wellPlaced = 0, misplaced = 0;
    const secretCopy = [...this.secretCode];
    const guessCopy = [...guess];

    // Vérifie les couleurs bien placées
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        wellPlaced++;
        secretCopy[i] = -1;
        guessCopy[i] = -1;
      }
    }

    // Vérifie les couleurs présentes mais mal placées
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] !== -1) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          misplaced++;
          secretCopy[index] = -1;
        }
      }
    }

    // Met à jour l’état du jeu
    this.currentAttempt++;
    if (wellPlaced === this.codeLength) {
      this.gameOver = true;
      this.won = true;
    } else if (this.currentAttempt >= this.maxAttempts) {
      this.gameOver = true;
    }

    // Retourne le résultat de la tentative
    return { guess: [...guess], wellPlaced, misplaced, attemptNumber: this.currentAttempt };
  }

  // Retourne le code secret uniquement à la fin
  getSecretCode() {
    return this.gameOver ? [...this.secretCode] : null;
  }

  // Met à jour la difficulté et recommence une partie
  updateSettings(codeLength, maxAttempts) {
    this.codeLength = codeLength;
    this.maxAttempts = maxAttempts;
    this.colorCount = DIFFICULTY[codeLength]?.colorCount || 5;
    this.reset();
  }
}

// Classe gérant l’interface utilisateur
class UI {
  constructor(game) {
    this.game = game;
    this.currentGuess = []; // combinaison actuelle du joueur
    // Récupération des éléments HTML
    this.colorPalette = document.getElementById("colorPalette");
    this.guessSlots = document.getElementById("guessSlots");
    this.submitBtn = document.getElementById("submitBtn");
    this.historyList = document.getElementById("historyList");
    this.attemptDisplay = document.getElementById("currentAttempt");
    this.maxAttemptsDisplay = document.getElementById("maxAttemptsDisplay");
    this.message = document.getElementById("message");
    this.newGameBtn = document.getElementById("newGameBtn");
    this.difficultySelect = document.getElementById("difficulty");
    this.maxAttemptsSelect = document.getElementById("maxAttempts");
  }

  // Affiche les boutons de couleur
  renderColors() {
    this.colorPalette.innerHTML = "";
    for (let i = 0; i < this.game.colorCount; i++) {
      const btn = document.createElement("button");
      btn.className = "color-btn";
      btn.style.backgroundColor = COLORS[i].hex;
      btn.onclick = () => this.addColor(i);
      this.colorPalette.appendChild(btn);
    }
  }

  // Affiche les emplacements du code en cours
  renderSlots() {
    this.guessSlots.innerHTML = "";
    for (let i = 0; i < this.game.codeLength; i++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      if (this.currentGuess[i] !== undefined) {
        slot.style.backgroundColor = COLORS[this.currentGuess[i]].hex;
        slot.classList.add("filled");
        slot.onclick = () => this.removeColor(i);
      } else {
        slot.textContent = i + 1;
      }
      this.guessSlots.appendChild(slot);
    }
    // Bouton de validation activé seulement si le code est complet
    this.submitBtn.disabled = this.currentGuess.length !== this.game.codeLength || this.game.gameOver;
  }

  // Ajoute une couleur à la combinaison
  addColor(id) {
    if (this.currentGuess.length < this.game.codeLength && !this.game.gameOver) {
      this.currentGuess.push(id);
      this.renderSlots();
    }
  }

  // Retire une couleur d’un emplacement
  removeColor(index) {
    if (!this.game.gameOver) {
      this.currentGuess.splice(index, 1);
      this.renderSlots();
    }
  }

  // Soumet la combinaison actuelle
  submit() {
    if (this.currentGuess.length !== this.game.codeLength || this.game.gameOver) return;

    const result = this.game.checkGuess(this.currentGuess);
    if (!result) return;

    this.addToHistory(result);
    this.currentGuess = [];
    this.renderSlots();
    this.attemptDisplay.textContent = this.game.currentAttempt;

    if (this.game.gameOver) this.showMessage();
  }

  // Ajoute la tentative à l’historique
  addToHistory(result) {
    const item = document.createElement("div");
    item.className = "history-item";

    const label = document.createElement("div");
    label.className = "history-label";
    label.textContent = `#${result.attemptNumber}`;

    const colors = document.createElement("div");
    colors.className = "history-colors";
    result.guess.forEach(id => {
      const dot = document.createElement("div");
      dot.className = "history-dot";
      dot.style.backgroundColor = COLORS[id].hex;
      colors.appendChild(dot);
    });

    const feedback = document.createElement("div");
    feedback.className = "feedback";

    const wellPlaced = document.createElement("span");
    wellPlaced.className = "feedback-item well-placed";
    wellPlaced.textContent = `${result.wellPlaced}`;

    const misplaced = document.createElement("span");
    misplaced.className = "feedback-item misplaced";
    misplaced.textContent = `${result.misplaced}`;

    feedback.appendChild(wellPlaced);
    feedback.appendChild(misplaced);
    item.appendChild(label);
    item.appendChild(colors);
    item.appendChild(feedback);

    this.historyList.insertBefore(item, this.historyList.firstChild);
  }

  // Affiche un message de victoire ou de défaite
  showMessage() {
    this.message.classList.add("show");
    if (this.game.won) {
      this.message.textContent = `Victoire en ${this.game.currentAttempt} essai(s) !`;
    } else {
      const names = this.game.getSecretCode().map(id => COLORS[id].name).join(", ");
      this.message.textContent = `Défaite. Code : ${names}`;
    }
  }

  // Lance une nouvelle partie
  newGame() {
    const difficulty = parseInt(this.difficultySelect.value);
    const maxAttempts = parseInt(this.maxAttemptsSelect.value);

    this.game.updateSettings(difficulty, maxAttempts);
    this.currentGuess = [];
    this.historyList.innerHTML = "";
    this.message.classList.remove("show");
    this.message.textContent = "";

    this.maxAttemptsDisplay.textContent = this.game.maxAttempts;
    this.attemptDisplay.textContent = this.game.currentAttempt;
    this.renderColors();
    this.renderSlots();
  }

  // Initialise les événements et le rendu de base
  init() {
    this.renderColors();
    this.renderSlots();
    this.submitBtn.onclick = () => this.submit();
    this.newGameBtn.onclick = () => this.newGame();
    document.addEventListener("keydown", e => {
      if (e.key === "Enter" && !this.submitBtn.disabled) this.submit();
    });
  }
}

// Création du jeu et initialisation de l’interface
const game = new Game(4, 10);
const ui = new UI(game);
ui.init();
