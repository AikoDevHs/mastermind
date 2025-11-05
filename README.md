# 🎯 Mastermind du GOAT

> Une adaptation moderne du jeu de logique classique — conçue avec **JavaScript**, **HTML** et **CSS**.  
> Devine la combinaison secrète avant d’épuiser tes essais !

---

## 🧠 Principe du jeu
Le but : **deviner la combinaison secrète de couleurs** générée aléatoirement.

À chaque tentative tu obtiens :
- ✅ Le nombre de couleurs **bien placées**.  
- 🔁 Le nombre de couleurs **présentes mais mal placées**.

Utilise ces indices pour affiner tes suppositions.

---

## 🕹️ Comment jouer

### 1️⃣ Choisir la difficulté  
La difficulté règle le nombre d’emplacements (longueur du code) **et** le nombre de couleurs disponibles :

| Niveau     | Emplacements (codeLength) | Couleurs disponibles |
|:----------:|:-------------------------:|:--------------------:|
| 🟢 Facile     | 2                         | 3                    |
| 🟡 Moyen      | 4                         | 5                    |
| 🔴 Difficile  | 6                         | 9                    |

> **Remarque technique :** le mapping utilisé dans le code est défini par l’objet :
> ```js
> const DIFFICULTY = {
>   2: { colorCount: 3 },
>   4: { colorCount: 5 },
>   6: { colorCount: 9 }
> };
> ```

---

### 2️⃣ Choisir le nombre d’essais  
Options disponibles : **8**, **10** ou **12** (la valeur par défaut dans le code est 10).

---

### 3️⃣ Démarrer une nouvelle partie  
Clique sur **"Nouvelle Partie"** pour générer un nouveau code secret et réinitialiser l’historique.

---

### 4️⃣ Composer une combinaison  
- Clique sur une couleur dans la **palette** pour la placer dans le prochain emplacement libre.  
- Clique sur une case remplie pour la **retirer**.

---

### 5️⃣ Valider une proposition  
- Clique sur **"Valider"** ou appuie sur **Entrée** (si le bouton n’est pas désactivé) pour soumettre ta proposition.

---

### 6️⃣ Interpréter le résultat  
L’historique affiche pour chaque tentative :
- La combinaison jouée 🎨  
- Le nombre de couleurs **bien placées** ✅  
- Le nombre de couleurs **mal placées** 🔁

---

### 7️⃣ Fin de partie  
- 🎉 **Victoire** : toutes les couleurs sont bien placées.  
- 😔 **Défaite** : le jeu révèle le code secret (visible uniquement à la fin).

---

## ⚙️ Structure du code

Les classes du code réel sont :  
- **`Game`** → logique du jeu  
- **`UI`** → interface utilisateur  

### 🧠 Classe `Game`
- Génère le **code secret** aléatoire  
- Vérifie les **propositions du joueur**  
- Gère le nombre d’essais et la **victoire/défaite**

### 💡 Classe `UI`
- Gère l’**interface graphique**  
- Met à jour la **palette**, les **emplacements**, et l’**historique**  
- Gère les interactions : clics, validation, et nouvelle partie

---

## 🧩 Fichiers du projet

| Fichier | Rôle |
|:--------|:-----|
| `index.html` | Structure du jeu |
| `styles.css` | Styles et mise en page |
| `main.js` | Logique du jeu (classes `Game` et `UI`) |
| `README.md` | Documentation du projet |

---

## 🚀 Lancer le jeu (localement)
1. Clone le dépôt :
   ```bash
   git clone https://github.com/AikoDevHs/mastermind.git
