# User List App 📱

Application mobile complète de gestion d'utilisateurs développée avec **React Native 0.76**, **Expo 52**, **Expo Router 4** et **TypeScript**.

L'application intègre une expérience utilisateur soignée avec persistance locale intégrale, recherche en direct, modale d'édition, gestion du mode sombre réactif et verrouillage/déverrouillage de l'orientation de l'écran.

---

## 📑 Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation et lancement](#-installation-et-lancement)
- [Scripts disponibles](#-scripts-disponibles)
- [Architecture du projet](#-architecture-du-projet)
- [Design System & Thème](#-design-system--thème)
- [Tests unitaires](#-tests-unitaires)

---

## ✨ Fonctionnalités

### 1. Ajout d'utilisateur (`app/(tabs)/index.tsx`)
- Formulaire contrôlé avec champs : **Prénom**, **Nom**, **Email**, **Âge**.
- **Validation inline en temps réel** :
  - Champs obligatoires avec longueur minimale.
  - Validation stricte du format d'adresse email (regex RFC).
  - Validation de l'âge (entier compris entre 1 et 120 ans).
- Retour visuel de succès immédiat avec bouton d'accès rapide vers la liste.
- Prise en charge du clavier via `KeyboardAvoidingView` pour éviter tout masquage des champs.

### 2. Répertoire d'utilisateurs (`app/(tabs)/users.tsx`)
- **Virtualisation fluide** avec `FlatList` pour garantir des performances optimales même avec un nombre élevé d'entrées.
- **Barre de recherche instantanée** : filtrage en temps réel par prénom, nom, email ou âge.
- **Avatars génératifs** : initiales calculées dynamiquement avec palette de couleurs dérivée du nom.
- **Boîte de dialogue modale d'édition** : pré-remplissage des données, validation et mise à jour en un clic.
- **Suppression sécurisée** avec boîte de confirmation native (`Alert.alert`).
- **État vide interactif** : illustration contextuelle et bouton d'action pour créer un premier utilisateur.

### 3. Paramètres & Ergonomie (`app/(tabs)/settings.tsx`)
- **Mode Sombre / Mode Clair** : bascule dynamique et instantanée sur l'ensemble des écrans et composants.
- **Rotation de l'écran** : autorisation du passage en mode paysage ou verrouillage en portrait via `expo-screen-orientation`.
- **Réinitialisation des données** : restauration des profils de démonstration ou réinitialisation des préférences.
- Cartes d'informations techniques (version, stack, statut du stockage).

### 4. Persistance des données
- Sauvegarde locale automatique et synchrone des utilisateurs et des préférences dans `AsyncStorage`.
- Données conservées entre chaque fermeture ou rechargement de l'application.

---

## 🛠️ Stack technique

| Élément | Version / Outil | Rôle |
|---|---|---|
| **Framework** | Expo SDK `~52.0.39` | Plateforme de développement React Native |
| **Moteur Mobile** | React Native `0.76.7` (React `18.3.1`) | Rendu natif Android & iOS |
| **Routage** | Expo Router `~4.0.19` | Routage basé sur les fichiers (File-based navigation) |
| **Typage** | TypeScript `^5.3.3` | Typage statique strict et sécurité du code |
| **Stockage** | `@react-native-async-storage/async-storage` `^1.23.1` | Persistance locale clé-valeur |
| **Orientation** | `expo-screen-orientation` `~8.0.4` | Gestion native des orientations d'écran |
| **Icônes** | `@expo/vector-icons` (Ionicons) `^14.0.2` | Icônes vectorielles natives |
| **Tests** | Jest `^29.2.1` & `jest-expo` `~52.0.6` | Tests unitaires & snapshots de composants |

---

## 📋 Prérequis

- **Node.js** version 18.x ou supérieure
- Gestionnaire de paquets **npm**
- Pour tester sur votre smartphone : l'application **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) ou un émulateur Android Studio / simulateur Xcode.

---

## 🚀 Installation et lancement

1. **Cloner ou ouvrir le projet** et se placer dans le sous-dossier `user-list` :
   ```bash
   cd user-list
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur Metro** :
   ```bash
   npx expo start
   ```

4. **Ouvrir l'application** :
   - Flashez le QR code affiché dans le terminal avec l'application **Expo Go** (Android) ou l'appareil photo (iOS).
   - Appuyez sur `a` dans le terminal pour démarrer sur émulateur Android.
   - Appuyez sur `i` pour démarrer sur simulateur iOS (macOS uniquement).
   - Appuyez sur `w` pour démarrer dans le navigateur web.

---

## 📜 Scripts disponibles

| Commande | Action |
|---|---|
| `npm start` ou `npx expo start` | Démarre le bundler Metro pour Expo |
| `npm run android` | Démarre directement sur un appareil/émulateur Android |
| `npm run ios` | Démarre directement sur un simulateur iOS |
| `npm run web` | Démarre l'application dans le navigateur web |
| `npm test -- --watchAll=false` | Exécute la suite de tests unitaires Jest |
| `npx tsc --noEmit` | Vérifie l'absence totale d'erreurs de typage TypeScript |
| `npm run lint` | Lance le linter Expo / ESLint |

---

## 📁 Architecture du projet

```text
user-list/
├── app/                            # Système de navigation Expo Router
│   ├── _layout.tsx                 # Root layout : Providers globaux (Settings, Theme, Users)
│   ├── +not-found.tsx              # Écran de secours pour les routes inconnues
│   └── (tabs)/                     # Navigation par onglets (Bottom Tab Navigation)
│       ├── _layout.tsx             # Configuration des onglets avec icônes et thème dynamique
│       ├── index.tsx               # Écran d'ajout avec formulaire et validation inline
│       ├── users.tsx               # Écran de liste : FlatList, recherche en direct, modale d'édition
│       └── settings.tsx            # Écran de réglages : Mode sombre, rotation d'écran, réinitialisations
├── assets/                         # Polices et images du projet
│   ├── fonts/                      # Polices personnalisées (ex: SpaceMono)
│   └── images/                     # Icônes de l'application et splash screen
├── components/                     # Composants UI partagés
│   ├── __tests__/                  # Tests unitaires Jest
│   │   ├── ThemedText-test.tsx     # Test de snapshot pour les textes thématisés
│   │   └── UsersContext-test.tsx   # Test d'intégration pour le CRUD et la persistance utilisateur
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx            # Composant de lien externe sécurisé avec typage Href
│   ├── ThemedText.tsx              # Texte réactif au thème actif
│   ├── ThemedView.tsx              # Vue avec fond dynamique selon le thème
│   └── ui/                         # Composants et primitives d'interface
│       └── IconSymbol.tsx          # Gestion des symboles natifs et MaterialIcons
├── constants/
│   └── Colors.ts                   # Tokens de design sémantiques (surfaces, texte, bordures, boutons)
├── context/
│   ├── SettingsContext.tsx         # Contexte global des préférences utilisateur et du thème
│   └── UsersContext.tsx            # Contexte global CRUD avec persistance AsyncStorage
├── hooks/
│   ├── useColorScheme.ts           # Hook réactif abonné au SettingsContext
│   ├── useColorScheme.web.ts       # Implémentation compatible hydration SSR pour le web
│   ├── useScreenOrientation.ts     # Hook d'écoute et de verrouillage de l'orientation
│   └── useThemeColor.ts            # Résolution automatique des couleurs par token
├── jest-setup.js                   # Mocks d'environnement Jest (AsyncStorage)
├── app.json                        # Métadonnées et configuration Expo
├── package.json                    # Dépendances et scripts du projet
├── tsconfig.json                   # Configuration TypeScript (chemins absolus @/*)
└── README.md                       # Documentation technique du projet
```

---

## 🎨 Design System & Thème

Les tokens de couleur sont centralisés dans [`constants/Colors.ts`](./constants/Colors.ts) et garantissent un contraste conforme aux recommandations **WCAG AA** (ratio ≥ 4.5:1 pour le texte) :

- **Couleurs primaires** : Bleu vibrant `#007AFF` (Light) et `#0A84FF` (Dark).
- **Surfaces** : Cartes isolées avec fond blanc (`#FFFFFF`) en mode clair et surface sombre contrastée (`#1D2939`) en mode sombre.
- **Rétroactions d'action** : États pressés avec micro-interactions d'opacité et d'échelle (`scale: 0.98`).
- **Cibles tactiles** : Tous les boutons d'action et icônes interactives respectent la zone minimale de 44x44pt.

---

## 🧪 Tests unitaires

Les tests unitaires sont configurés avec Jest et Jest-Expo.

Pour exécuter la suite de tests :
```bash
npm test -- --watchAll=false
```

Résultat actuel :
```text
PASS components/__tests__/UsersContext-test.tsx
PASS components/__tests__/ThemedText-test.tsx

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   1 passed, 1 total
```
