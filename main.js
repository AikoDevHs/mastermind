(function () {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;

  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    fetchModule(link);
  }

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

  function getFetchOptions(link) {
    const options = {};
    if (link.integrity) options.integrity = link.integrity;
    if (link.referrerPolicy) options.referrerPolicy = link.referrerPolicy;

    if (link.crossOrigin === "use-credentials") options.credentials = "include";
    else if (link.crossOrigin === "anonymous") options.credentials = "omit";
    else options.credentials = "same-origin";

    return options;
  }

  function fetchModule(link) {
    if (link.ep) return;
    link.ep = true;
    const options = getFetchOptions(link);
    fetch(link.href, options);
  }
})();

// 🎯 Classe principale du jeu Mastermind
class MastermindGame {
  constructor(codeLength = 4, maxAttempts = 10) {
    this.codeLength = codeLength;
    this.maxAttempts = maxAttempts;
    this.colorCount = DIFFICULTY_CONFIG[codeLength]?.colorCount || 5;
    this.secretCode = [];
    this.currentAttempt = 0;
    this.attempts = [];
    this.gameOver = false;
    this.won = false;
  }

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

  checkGuess(guess) {
    if (this.gameOver || guess.length !== this.codeLength) return null;

    let wellPlaced = 0;
    let misplaced = 0;
    const secretCopy = [...this.secretCode];
    const guessCopy = [...guess];

    // Vérifie les bien placés
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        wellPlaced++;
        secretCopy[i] = -1;
        guessCopy[i] = -2;
      }
    }

    // Vérifie les mal placés
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] !== -2) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          misplaced++;
          secretCopy[index] = -1;
        }
      }
    }

    this.currentAttempt++;

    const attempt = {
      guess: [...guess],
      wellPlaced,
      misplaced,
      attemptNumber: this.currentAttempt
    };

    this.attempts.push(attempt);

    if (wellPlaced === this.codeLength) {
      this.gameOver = true;
      this.won = true;
    } else if (this.currentAttempt >= this.maxAttempts) {
      this.gameOver = true;
      this.won = false;
    }

    return attempt;
  }

  getSecretCode() {
    return this.gameOver ? [...this.secretCode] : null;
  }

  reset(codeLength, maxAttempts) {
    this.codeLength = codeLength;
    this.maxAttempts = maxAttempts;
    this.colorCount = DIFFICULTY_CONFIG[codeLength]?.colorCount || 5;
    this.generateSecretCode();
  }
}

// 🎨 Palette de couleurs complète
const COLORS = [
  { name: "Rouge", hex: "#ef4444", id: 0 },
  { name: "Bleu", hex: "#3b82f6", id: 1 },
  { name: "Vert", hex: "#22c55e", id: 2 },
  { name: "Jaune", hex: "#eab308", id: 3 },
  { name: "Orange", hex: "#f97316", id: 4 },
  { name: "Rose", hex: "#ec4899", id: 5 },
  { name: "Violet", hex: "#a855f7", id: 6 },
  { name: "Cyan", hex: "#06b6d4", id: 7 },
  { name: "Marron", hex: "#92400e", id: 8 }
];

const DIFFICULTY_CONFIG = {
  2: { colorCount: 3, label: "Facile (2 emplacements, 3 couleurs)" },
  4: { colorCount: 5, label: "Moyen (4 emplacements, 5 couleurs)" },
  6: { colorCount: 9, label: "Difficile (6 emplacements, 9 couleurs)" }
};

// 🧩 Interface utilisateur du jeu
class MastermindUI {
  constructor(game) {
    this.game = game;
    this.currentGuess = [];
    this.initElements();
  }

  initElements() {
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

  renderColorPalette() {
    this.colorPalette.innerHTML = "";
    const activeColors = COLORS.slice(0, this.game.colorCount);
    activeColors.forEach(color => {
      const btn = document.createElement("button");
      btn.className = "color-btn";
      btn.style.backgroundColor = color.hex;
      btn.title = color.name;
      btn.onclick = () => this.addColorToGuess(color.id);
      this.colorPalette.appendChild(btn);
    });
  }

  renderGuessSlots() {
    this.currentGuessSlots.innerHTML = "";

    for (let i = 0; i < this.game.codeLength; i++) {
      const slot = document.createElement("div");
      slot.className = "guess-slot";

      if (this.currentGuess[i] !== undefined) {
        slot.style.backgroundColor = COLORS[this.currentGuess[i]].hex;
        slot.classList.add("filled");
        slot.onclick = () => this.removeColorFromGuess(i);
      } else {
        slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
      }

      this.currentGuessSlots.appendChild(slot);
    }

    this.submitBtn.disabled =
      this.currentGuess.length !== this.game.codeLength || this.game.gameOver;
  }

  addColorToGuess(colorId) {
    if (this.currentGuess.length < this.game.codeLength && !this.game.gameOver && colorId < this.game.colorCount) {
      this.currentGuess.push(colorId);
      this.renderGuessSlots();
    }
  }

  removeColorFromGuess(index) {
    if (!this.game.gameOver) {
      this.currentGuess.splice(index, 1);
      this.renderGuessSlots();
    }
  }

  submitGuess() {
    if (this.currentGuess.length !== this.game.codeLength || this.game.gameOver)
      return;

    const result = this.game.checkGuess(this.currentGuess);

    if (result) {
      this.addToHistory(result);
      this.currentGuess = [];
      this.renderGuessSlots();
      this.updateGameInfo();

      if (this.game.gameOver) this.showGameOver();
    }
  }

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
    wellPlaced.innerHTML = `<span class="feedback-icon">✓</span> ${result.wellPlaced} bien placé${result.wellPlaced > 1 ? "s" : ""}`;

    const misplaced = document.createElement("span");
    misplaced.className = "feedback-misplaced";
    misplaced.innerHTML = `<span class="feedback-icon">~</span> ${result.misplaced} mal placé${result.misplaced > 1 ? "s" : ""}`;

    feedback.append(wellPlaced, misplaced);
    item.append(label, colorRow, feedback);
    this.historyList.insertBefore(item, this.historyList.firstChild);

    setTimeout(() => item.classList.add("show"), 10);
  }

  updateGameInfo() {
    this.currentAttemptDisplay.textContent = this.game.currentAttempt + 1;
    if (this.game.gameOver)
      this.currentAttemptDisplay.textContent = this.game.currentAttempt;
  }

  showGameOver() {
    this.gameMessage.classList.remove("hidden");

    if (this.game.won) {
      this.gameMessage.className = "game-message success";
      this.gameMessage.innerHTML = `
        <div class="message-content">
          <div class="message-icon">🎉</div>
          <h2>Bravo ! Vous avez gagné !</h2>
          <p>Vous avez trouvé la combinaison en ${this.game.currentAttempt} essai${this.game.currentAttempt > 1 ? "s" : ""} !</p>
        </div>
      `;
    } else {
      const secret = this.game.getSecretCode()
        .map(id => `<div class="secret-color-dot" style="background-color: ${COLORS[id].hex}"></div>`)
        .join("");

      this.gameMessage.className = "game-message failure";
      this.gameMessage.innerHTML = `
        <div class="message-content">
          <div class="message-icon">😔</div>
          <h2>Dommage ! Vous avez perdu</h2>
          <p>La combinaison secrète était :</p>
          <div class="secret-code">${secret}</div>
        </div>
      `;
    }
  }

  resetGame() {
    const codeLength = parseInt(this.difficultySelect.value);
    const maxAttempts = parseInt(this.maxAttemptsSelect.value);

    this.game.reset(codeLength, maxAttempts);
    this.currentGuess = [];
    this.historyList.innerHTML = "";
    this.gameMessage.classList.add("hidden");
    this.maxAttemptsDisplay.textContent = maxAttempts;

    this.updateGameInfo();
    this.renderColorPalette();
    this.renderGuessSlots();
  }

  init() {
    this.renderColorPalette();
    this.renderGuessSlots();
    this.updateGameInfo();
    this.maxAttemptsDisplay.textContent = this.game.maxAttempts;

    this.submitBtn.onclick = () => this.submitGuess();
    this.newGameBtn.onclick = () => this.resetGame();

    document.addEventListener("keydown", e => {
      if (e.key === "Enter" && !this.submitBtn.disabled) this.submitGuess();
    });
  }
}

// 🚀 Initialisation du jeu
const game = new MastermindGame(6, 10);
game.generateSecretCode();

const ui = new MastermindUI(game);
ui.init();
