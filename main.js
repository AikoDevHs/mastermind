// 🔹 Ce bloc s'assure que les modules préchargés sont supportés et les charge si nécessaire
(function () {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;

  // Pour chaque <link rel="modulepreload"> présent, on le fetch
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    fetchModule(link);
  }

  // Observer le DOM pour détecter les nouveaux liens modulepreload ajoutés dynamiquement
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.tagName === "LINK" && node.rel === "modulepreload") {
            fetchModule(node);
          }
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });

  // Préparer les options de fetch en fonction des attributs du <link>
  function getFetchOptions(link) {
    const options = {};
    if (link.integrity) options.integrity = link.integrity;
    if (link.referrerPolicy) options.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") options.credentials = "include";
    else if (link.crossOrigin === "anonymous") options.credentials = "omit";
    else options.credentials = "same-origin";
    return options;
  }

  // Effectue le fetch du module
  function fetchModule(link) {
    if (link.ep) return; // éviter de le fetch plusieurs fois
    link.ep = true;
    const options = getFetchOptions(link);
    fetch(link.href, options);
  }
})();

// 🎯 Classe principale du jeu Mastermind
class MastermindGame {
  constructor(codeLength = 4, maxAttempts = 10) {
    this.codeLength = codeLength; // longueur du code secret
    this.maxAttempts = maxAttempts; // nombre max d'essais
    this.colorCount = DIFFICULTY_CONFIG[codeLength]?.colorCount || 5; // nombre de couleurs selon difficulté
    this.generateSecretCode(); // génère le code secret au début
  }

  // Génère un code secret aléatoire
  generateSecretCode() {
    this.secretCode = Array.from(
      { length: this.codeLength },
      () => Math.floor(Math.random() * this.colorCount)
    );
    this.currentAttempt = 0;
    this.attempts = [];
    this.gameOver = false;
    this.won = false;
  }

  // Vérifie si une proposition est correcte
  checkGuess(guess) {
    if (this.gameOver || guess.length !== this.codeLength) return null;

    let wellPlaced = 0, misplaced = 0;
    const secretCopy = [...this.secretCode];
    const guessCopy = [...guess];

    // Compter les pions bien placés
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        wellPlaced++;
        secretCopy[i] = guessCopy[i] = -1;
      }
    }

    // Compter les pions mal placés
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] !== -1) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          misplaced++;
          secretCopy[index] = -1;
        }
      }
    }

    this.currentAttempt++;
    const attempt = { guess: [...guess], wellPlaced, misplaced, attemptNumber: this.currentAttempt };
    this.attempts.push(attempt);

    // Vérifie si le joueur a gagné ou perdu
    if (wellPlaced === this.codeLength) this.gameOver = this.won = true;
    else if (this.currentAttempt >= this.maxAttempts) this.gameOver = true;

    return attempt;
  }

  getSecretCode() {
    return this.gameOver ? [...this.secretCode] : null;
  }

  // Réinitialise le jeu
  reset(codeLength, maxAttempts) {
    this.codeLength = codeLength;
    this.maxAttempts = maxAttempts;
    this.colorCount = DIFFICULTY_CONFIG[codeLength]?.colorCount || 5;
    this.generateSecretCode();
  }
}

// 🎨 Couleurs disponibles et configuration selon difficulté
const COLORS = [
  { name: "Rouge", hex: "#ef4444" }, { name: "Bleu", hex: "#3b82f6" },
  { name: "Vert", hex: "#22c55e" }, { name: "Jaune", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" }, { name: "Rose", hex: "#ec4899" },
  { name: "Violet", hex: "#a855f7" }, { name: "Cyan", hex: "#06b6d4" },
  { name: "Marron", hex: "#92400e" }
];

const DIFFICULTY_CONFIG = {
  2: { colorCount: 3 }, 4: { colorCount: 5 }, 6: { colorCount: 9 }
};

// 🧩 Interface utilisateur pour interagir avec le jeu
class MastermindUI {
  constructor(game) {
    this.game = game;
    this.currentGuess = [];
    // Récupère les éléments HTML
    this.colorPalette = document.getElementById("colorPalette");
    this.currentGuessSlots = document.getElementById("currentGuessSlots");
    this.submitBtn = document.getElementById("submitGuess");
    this.historyList = document.getElementById("historyList");
    this.currentAttemptDisplay = document.getElementById("currentAttempt");
    this.maxAttemptsDisplay = document.getElementById("maxAttemptsDisplay");
    this.gameMessage = document.getElementById("gameMessage");
    this.newGameBtn = document.getElementById("newGameBtn");
    this.difficultySelect = document.getElementById("difficulty");
    this.maxAttemptsSelect = document.getElementById("maxAttempts");
  }

  // Affiche la palette de couleurs disponibles
  renderColorPalette() {
    this.colorPalette.innerHTML = "";
    COLORS.slice(0, this.game.colorCount).forEach((color, id) => {
      const btn = document.createElement("button");
      btn.className = "color-btn";
      btn.style.backgroundColor = color.hex;
      btn.title = color.name;
      btn.onclick = () => this.addColorToGuess(id);
      this.colorPalette.appendChild(btn);
    });
  }

  // Affiche les slots pour la proposition actuelle
  renderGuessSlots() {
    this.currentGuessSlots.innerHTML = "";
    for (let i = 0; i < this.game.codeLength; i++) {
      const slot = document.createElement("div");
      slot.className = "guess-slot";
      if (this.currentGuess[i] !== undefined) {
        slot.style.backgroundColor = COLORS[this.currentGuess[i]].hex;
        slot.classList.add("filled");
        slot.onclick = () => this.removeColorFromGuess(i);
      } else slot.textContent = i + 1;
      this.currentGuessSlots.appendChild(slot);
    }
    this.submitBtn.disabled = this.currentGuess.length !== this.game.codeLength || this.game.gameOver;
  }

  addColorToGuess(id) { if (this.currentGuess.length < this.game.codeLength && !this.game.gameOver) { this.currentGuess.push(id); this.renderGuessSlots(); } }
  removeColorFromGuess(i) { if (!this.game.gameOver) { this.currentGuess.splice(i, 1); this.renderGuessSlots(); } }

  // Soumet la proposition actuelle
  submitGuess() {
    if (this.currentGuess.length !== this.game.codeLength || this.game.gameOver) return;
    const result = this.game.checkGuess(this.currentGuess);
    if (!result) return;
    this.addToHistory(result); // ajoute à l'historique
    this.currentGuess = [];
    this.renderGuessSlots();
    this.updateGameInfo();
    if (this.game.gameOver) this.showGameOver();
  }

  // Ajoute un essai à l'historique
  addToHistory(result) {
    const item = document.createElement("div");
    item.className = "history-item";

    const label = document.createElement("div");
    label.className = "attempt-label";
    label.textContent = `Essai ${result.attemptNumber}`;

    const colorRow = document.createElement("div");
    colorRow.className = "history-colors";
    result.guess.forEach(id => {
      const dot = document.createElement("div");
      dot.className = "history-color-dot";
      dot.style.backgroundColor = COLORS[id].hex;
      colorRow.appendChild(dot);
    });

    const feedback = document.createElement("div");
    feedback.className = "feedback";

    const wellPlaced = document.createElement("span");
    wellPlaced.className = "feedback-well-placed";
    wellPlaced.textContent = `${result.wellPlaced} bien placé ✓`;

    const misplaced = document.createElement("span");
    misplaced.className = "feedback-misplaced";
    misplaced.textContent = `${result.misplaced} mal placé ~`;

    feedback.append(wellPlaced, misplaced);
    item.append(label, colorRow, feedback);

    this.historyList.insertBefore(item, this.historyList.firstChild);

    // Déclenche l'animation CSS
    setTimeout(() => item.classList.add("show"), 10);
  }

  updateGameInfo() { this.currentAttemptDisplay.textContent = this.game.currentAttempt; }
  
  // Affiche le message de fin de partie
  showGameOver() {
    this.gameMessage.classList.remove("hidden");
    if (this.game.won) this.gameMessage.textContent = `Bravo ! Vous avez gagné en ${this.game.currentAttempt} essai(s) !`;
    else this.gameMessage.textContent = `Dommage ! Code secret : ${this.game.getSecretCode().map(id => COLORS[id].name).join(", ")}`;
  }

  // Réinitialise le jeu et l'interface
  resetGame() {
    this.game.reset(parseInt(this.difficultySelect.value), parseInt(this.maxAttemptsSelect.value));
    this.currentGuess = [];
    this.historyList.innerHTML = "";
    this.gameMessage.classList.add("hidden");
    this.maxAttemptsDisplay.textContent = this.game.maxAttempts;
    this.updateGameInfo();
    this.renderColorPalette();
    this.renderGuessSlots();
  }

  // Initialise l'interface et les événements
  init() {
    this.renderColorPalette();
    this.renderGuessSlots();
    this.updateGameInfo();
    this.maxAttemptsDisplay.textContent = this.game.maxAttempts;
    this.submitBtn.onclick = () => this.submitGuess();
    this.newGameBtn.onclick = () => this.resetGame();
    document.addEventListener("keydown", e => { if (e.key === "Enter" && !this.submitBtn.disabled) this.submitGuess(); });
  }
}

// 🚀 Initialisation du jeu
const game = new MastermindGame(6, 10); // crée une partie avec 6 couleurs et 10 essais
const ui = new MastermindUI(game); // crée l'interface
ui.init(); // lance le jeu
