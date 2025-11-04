# 🎯 **Mastermind du GOAT**

> Une adaptation moderne du jeu de logique classique — conçue avec **JavaScript**, **HTML** et **CSS**.  
> Teste ta logique, ta mémoire, et ton sens de la déduction pour trouver la combinaison secrète avant la fin !

---

## 🧠 **Principe du jeu**

Le but du jeu est simple : **deviner la combinaison secrète de couleurs** générée par l’ordinateur.

🔹 À chaque tentative :
- ✅ Tu sauras combien de couleurs sont **bien placées**.  
- ~ Tu découvriras combien de couleurs sont **correctes mais mal placées**.

💡 Utilise ces indices pour **déduire la bonne combinaison** avant d’épuiser tes essais !

---

## 🕹️ **Comment jouer**

### 🎚️ 1. Choisis ta difficulté
| Niveau | Emplacements | Couleurs disponibles |
|:-------|:--------------|:--------------------|
| 🟢 Facile | 2 | 3 |
| 🟡 Moyen | 4 | 5 |
| 🔴 Difficile | 6 | 9 |

---

### 🔢 2. Choisis le nombre d’essais  
Tu peux sélectionner : **8**, **10** ou **12** tentatives maximum.

---

### 🚀 3. Démarre une nouvelle partie  
Appuie sur **“Nouvelle Partie”** pour générer un nouveau code secret.

---

### 🎨 4. Compose ta combinaison  
- Clique sur les couleurs dans la **palette** pour remplir les emplacements.  
- Clique sur une case déjà remplie pour **retirer** la couleur.

---

### 🧩 5. Valide ta proposition  
- Clique sur **“Valider”** ou appuie sur **Entrée** pour confirmer ton essai.

---

### 📜 6. Analyse les résultats  
Dans l’historique, tu verras :
- La **combinaison proposée** 🎨  
- Le nombre de couleurs **bien placées** ✅  
- Le nombre de couleurs **mal placées** ~

---

### 🏁 7. Fin de partie  
- 🎉 **Victoire** : tu as trouvé la combinaison !  
- 😔 **Défaite** : le jeu révèle le code secret.

---

### 💻 Technologies utilisées
| Langage | Rôle |
|:--------|:------|
| 🧱 **HTML** | Structure du jeu |
| 🎨 **CSS** | Styles, couleurs et mise en page |
| ⚙️ **JavaScript** | Logique, génération du code secret, interactions UI |

---

### 🧩 Classes principales

#### 🧠 `MastermindGame`
- Gère la **logique du jeu**
- Génère le **code secret**
- Vérifie les **propositions**
- Gère les **tentatives et la victoire/défaite**

#### 💡 `MastermindUI`
- Gère l’**interface utilisateur**
- Met à jour la **palette**, les **tentatives**, et les **messages**
- Permet de **jouer de manière interactive**

---

## 🚀 **Lancer le jeu**

### Option 1 — 💻 Ouvrir localement
1. Télécharge ou clone le projet :
   ```bash
   git clone https://github.com/ton-repo/mastermind.git
   ```
2.  Ouvre le fichier index.html dans ton navigateur.
3. Joue directement ! 🥳
