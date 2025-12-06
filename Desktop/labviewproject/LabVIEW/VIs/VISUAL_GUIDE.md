# Guide Visuel - Interface LabVIEW 2015

## 📸 Aperçu du Projet Arduino Communication

Ce document contient des représentations visuelles de l'interface LabVIEW que vous devez créer.

---

## 🖥️ FACE-AVANT (Front Panel)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Arduino Communication - LabVIEW 2015                    [_][□][X] ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                     ┃
┃  ┌─ Configuration ──────────────────────────────────────────────┐ ┃
┃  │                                                               │ ┃
┃  │  Port COM:  [COM3           ▼]    Baud Rate: [9600    ]     │ ┃
┃  │                                                               │ ┃
┃  └───────────────────────────────────────────────────────────────┘ ┃
┃                                                                     ┃
┃  ┌─ Contrôle LED ─────────────────────────────────────────────┐   ┃
┃  │                                                             │   ┃
┃  │    ┌──────────┐      ┌──────────┐                          │   ┃
┃  │    │  LED ON  │      │ LED OFF  │                          │   ┃
┃  │    └──────────┘      └──────────┘                          │   ┃
┃  │                                                             │   ┃
┃  │    État LED:  [●] LED:ON                                   │   ┃
┃  │                                                             │   ┃
┃  └─────────────────────────────────────────────────────────────┘   ┃
┃                                                                     ┃
┃  ┌─ Lecture Capteur ──────────────────────────────────────────┐   ┃
┃  │                                                             │   ┃
┃  │    ┌───────────────┐      ┌────────────────┐              │   ┃
┃  │    │ Lire Capteur  │      │ Obtenir Statut │              │   ┃
┃  │    └───────────────┘      └────────────────┘              │   ┃
┃  │                                                             │   ┃
┃  │    Valeur Capteur:  ┌─────┐                               │   ┃
┃  │                     │ 512 │                               │   ┃
┃  │                     └─────┘                               │   ┃
┃  │                                                             │   ┃
┃  │    ┌────────────────────────────────────────────────────┐ │   ┃
┃  │    │        Graph Temps Réel du Capteur                 │ │   ┃
┃  │    │  1023 ┤                                             │ │   ┃
┃  │    │       ┤        ╱╲      ╱╲                          │ │   ┃
┃  │    │   512 ┤    ╱╲╱  ╲    ╱  ╲╱╲                        │ │   ┃
┃  │    │       ┤   ╱          ╱        ╲                     │ │   ┃
┃  │    │     0 ┤──┴────┴────┴────┴────┴──────────────────   │ │   ┃
┃  │    │       0    10   20   30   40   50 (secondes)       │ │   ┃
┃  │    └────────────────────────────────────────────────────┘ │   ┃
┃  │                                                             │   ┃
┃  └─────────────────────────────────────────────────────────────┘   ┃
┃                                                                     ┃
┃  ┌─ Messages Série ───────────────────────────────────────────┐   ┃
┃  │                                                             │   ┃
┃  │  [12:30:45] Envoi: L1                                      │   ┃
┃  │  [12:30:45] Reçu: LED:ON                                   │   ┃
┃  │  [12:30:50] Envoi: R                                       │   ┃
┃  │  [12:30:50] Reçu: SENSOR:512                               │   ┃
┃  │  [12:30:55] Envoi: S                                       │   ┃
┃  │  [12:30:55] Reçu: STATUS:LED=1,SENSOR=512                  │   ┃
┃  │                                                             │   ┃
┃  └─────────────────────────────────────────────────────────────┘   ┃
┃                                                                     ┃
┃  ┌─ Statut ────────────────────────────────────────────────────┐  ┃
┃  │                                                              │  ┃
┃  │  [●] Connecté    Temps écoulé: [00:05:23]                   │  ┃
┃  │                                                              │  ┃
┃  │  Erreurs: [Aucune erreur                                 ]  │  ┃
┃  │                                                              │  ┃
┃  └──────────────────────────────────────────────────────────────┘  ┃
┃                                                                     ┃
┃                           ┌────────┐                               ┃
┃                           │  STOP  │                               ┃
┃                           └────────┘                               ┃
┃                                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔧 DIAGRAMME DE BLOCS (Block Diagram)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Block Diagram - Arduino_Communication.vi                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                          ┃
┃  AVANT LA BOUCLE:                                                        ┃
┃  ┌────────────────────────────────────────────────────────────────┐    ┃
┃  │  Port COM ──┐                                                   │    ┃
┃  │             │                                                   │    ┃
┃  │  9600 ──────┤  [VISA Configure Serial Port]                    │    ┃
┃  │             │   • baud rate: 9600                               │    ┃
┃  │  8 ─────────┤   • data bits: 8                                 │    ┃
┃  │             │   • stop bits: 10 (1 bit)                         │    ┃
┃  │  10 ────────┤   • parity: 0 (none)                              │    ┃
┃  │             └──→ VISA session out ──┐                           │    ┃
┃  │                                      │                           │    ┃
┃  └──────────────────────────────────────┼───────────────────────────┘    ┃
┃                                         │                                ┃
┃  ╔═══════════════════════════════════════╧════════════════════════════╗ ┃
┃  ║                    WHILE LOOP (Until Stop)                         ║ ┃
┃  ╠════════════════════════════════════════════════════════════════════╣ ┃
┃  ║                                                                    ║ ┃
┃  ║  VISA session ──┐                                                  ║ ┃
┃  ║                 │                                                  ║ ┃
┃  ║  ┌──────────────▼──────────────────────────────────────────────┐  ║ ┃
┃  ║  │               EVENT STRUCTURE                               │  ║ ┃
┃  ║  │  ┌──────────────────────────────────────────────────────┐   │  ║ ┃
┃  ║  │  │ Case 0: LED ON Button - Value Change                 │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  │  "L1\n" ──→ [VISA Write] ──→ [Wait 50ms] ──→         │   │  ║ ┃
┃  ║  │  │              [VISA Read (256)] ──→ État LED          │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  └───────────────────────────────────────────────────────┘   │  ║ ┃
┃  ║  │  ┌──────────────────────────────────────────────────────┐   │  ║ ┃
┃  ║  │  │ Case 1: LED OFF Button - Value Change                │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  │  "L0\n" ──→ [VISA Write] ──→ [Wait 50ms] ──→         │   │  ║ ┃
┃  ║  │  │              [VISA Read (256)] ──→ État LED          │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  └───────────────────────────────────────────────────────┘   │  ║ ┃
┃  ║  │  ┌──────────────────────────────────────────────────────┐   │  ║ ┃
┃  ║  │  │ Case 2: Lire Capteur - Value Change                  │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  │  "R\n" ──→ [VISA Write] ──→ [Wait 50ms] ──→          │   │  ║ ┃
┃  ║  │  │             [VISA Read (256)] ──┐                    │   │  ║ ┃
┃  ║  │  │                                 │                    │   │  ║ ┃
┃  ║  │  │                                 ▼                    │   │  ║ ┃
┃  ║  │  │         ┌────────────────────────────────────┐       │   │  ║ ┃
┃  ║  │  │         │ [Match Pattern: "SENSOR:"]         │       │   │  ║ ┃
┃  ║  │  │         │  after substring ──→               │       │   │  ║ ┃
┃  ║  │  │         │  [Scan From String: "%d"]          │       │   │  ║ ┃
┃  ║  │  │         │         │                          │       │   │  ║ ┃
┃  ║  │  │         └─────────┼──────────────────────────┘       │   │  ║ ┃
┃  ║  │  │                   └──→ Valeur Capteur (I32)          │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  └───────────────────────────────────────────────────────┘   │  ║ ┃
┃  ║  │  ┌──────────────────────────────────────────────────────┐   │  ║ ┃
┃  ║  │  │ Case 3: Obtenir Statut - Value Change                │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  │  "S\n" ──→ [VISA Write] ──→ [Wait 50ms] ──→          │   │  ║ ┃
┃  ║  │  │             [VISA Read (256)] ──→ Parser Status      │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  └───────────────────────────────────────────────────────┘   │  ║ ┃
┃  ║  │  ┌──────────────────────────────────────────────────────┐   │  ║ ┃
┃  ║  │  │ Timeout: 100 ms                                      │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  │  [No Action - Continue Loop]                         │   │  ║ ┃
┃  ║  │  │                                                       │   │  ║ ┃
┃  ║  │  └───────────────────────────────────────────────────────┘   │  ║ ┃
┃  ║  │                                                              │  ║ ┃
┃  ║  └──────────────────────────────────────────────────────────────┘  ║ ┃
┃  ║                                                                    ║ ┃
┃  ║  ┌──────────────────────────────────────────────────────────────┐ ║ ┃
┃  ║  │  [Wait 100 ms]  ←─ Éviter surcharge CPU                     │ ║ ┃
┃  ║  └──────────────────────────────────────────────────────────────┘ ║ ┃
┃  ║                                                                    ║ ┃
┃  ║  Stop Button ───→ [NOT] ───→ [Continue?] ──┐                     ║ ┃
┃  ║                                             │                     ║ ┃
┃  ╚═════════════════════════════════════════════╧═════════════════════╝ ┃
┃                                                │                       ┃
┃  APRÈS LA BOUCLE:                              │                       ┃
┃  ┌─────────────────────────────────────────────▼──────────────────┐   ┃
┃  │                                                                 │   ┃
┃  │  VISA session ──→ [VISA Close] ──→ [Simple Error Handler]      │   ┃
┃  │                                                                 │   ┃
┃  └─────────────────────────────────────────────────────────────────┘   ┃
┃                                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎨 DÉTAILS DES CONTRÔLES

### Contrôles (Front Panel)

| Élément | Type | Propriétés |
|---------|------|------------|
| **Port COM** | String Control | Default: "COM3" ou "/dev/ttyUSB0" |
| **Baud Rate** | Numeric (I32) | Default: 9600 |
| **LED ON** | Boolean Button | Mechanical Action: Latch When Released |
| **LED OFF** | Boolean Button | Mechanical Action: Latch When Released |
| **Lire Capteur** | Boolean Button | Mechanical Action: Latch When Released |
| **Obtenir Statut** | Boolean Button | Mechanical Action: Latch When Released |
| **Stop** | Stop Button | Mechanical Action: Latch When Released |

### Indicateurs (Front Panel)

| Élément | Type | Propriétés |
|---------|------|------------|
| **État LED** | String Indicator | Display Style: Normal |
| **Valeur Capteur** | Numeric (I32) | Range: 0-1023 |
| **Graph** | Waveform Chart | History: 100 points |
| **Messages** | String Indicator | Display Style: Scrolling |
| **Connecté** | LED (Boolean) | On: Vert, Off: Rouge |
| **Erreurs** | Error Cluster | - |

---

## 📊 PALETTE DES OUTILS UTILISÉS

### Instrument I/O → Serial
```
┌─────────────────────────────────────┐
│  VISA Configure Serial Port         │
│  VISA Write                         │
│  VISA Read                          │
│  VISA Close                         │
└─────────────────────────────────────┘
```

### Programming → String
```
┌─────────────────────────────────────┐
│  Match Pattern                      │
│  Scan From String                   │
│  Format Into String                 │
│  String Length                      │
└─────────────────────────────────────┘
```

### Programming → Structures
```
┌─────────────────────────────────────┐
│  While Loop                         │
│  Event Structure                    │
│  Case Structure                     │
└─────────────────────────────────────┘
```

### Programming → Timing
```
┌─────────────────────────────────────┐
│  Wait (ms)                          │
│  Elapsed Time                       │
└─────────────────────────────────────┘
```

### Programming → Numeric
```
┌─────────────────────────────────────┐
│  Increment                          │
│  Greater?                           │
│  Equal?                             │
└─────────────────────────────────────┘
```

---

## 🎯 FLUX DE DONNÉES

### Exemple: Commande LED ON

```
Utilisateur clique [LED ON]
         │
         ▼
Event Structure détecte l'événement
         │
         ▼
Envoie "L1\n" via VISA Write
         │
         ▼
Attend 50 ms (délai Arduino)
         │
         ▼
Lit la réponse via VISA Read
         │
         ▼
Reçoit "LED:ON\n"
         │
         ▼
Affiche dans l'indicateur "État LED"
         │
         ▼
Boucle continue (attend prochain événement)
```

### Exemple: Lecture Capteur

```
Utilisateur clique [Lire Capteur]
         │
         ▼
Envoie "R\n" via VISA Write
         │
         ▼
Attend 50 ms
         │
         ▼
Lit "SENSOR:512\n" via VISA Read
         │
         ▼
Match Pattern cherche "SENSOR:"
         │
         ▼
Extrait "512" (after substring)
         │
         ▼
Scan From String convertit "512" → 512 (I32)
         │
         ▼
Affiche 512 dans l'indicateur numérique
         │
         ▼
Ajoute au graph temps réel
```

---

## 🔍 CONFIGURATION VISA DÉTAILLÉE

```
┌─────────────────────────────────────────────────────────┐
│  VISA Configure Serial Port                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  VISA resource name:  [COM3          ▼]                 │
│                                                          │
│  baud rate:          [9600      ]                       │
│                                                          │
│  data bits:          [8]  ◉ 5  ○ 6  ○ 7  ◉ 8           │
│                                                          │
│  parity:             [0]  ◉ none  ○ odd  ○ even        │
│                                                          │
│  stop bits:          [10] ◉ 1  ○ 1.5  ○ 2              │
│                       (10 = 1 stop bit en LabVIEW)      │
│                                                          │
│  flow control:       [0]  ◉ none  ○ XON/XOFF  ○ RTS/CTS │
│                                                          │
│  timeout (ms):       [1000]                             │
│                                                          │
│  VISA session out:   ───────────────→                   │
│  error out:          ───────────────→                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 ÉTAPES DE CRÉATION

### Étape 1: Front Panel
1. ✅ Créer nouveau VI
2. ✅ Ajouter String Control "Port COM"
3. ✅ Ajouter Numeric Control "Baud Rate"
4. ✅ Ajouter 4 Boolean Buttons (LED ON, OFF, Read, Status)
5. ✅ Ajouter Stop Button
6. ✅ Ajouter String Indicator "État LED"
7. ✅ Ajouter Numeric Indicator "Valeur Capteur"
8. ✅ Ajouter Waveform Chart
9. ✅ Ajouter String Indicator "Messages"
10. ✅ Ajouter Error Cluster

### Étape 2: Block Diagram
1. ✅ Ajouter VISA Configure Serial Port (avant While Loop)
2. ✅ Créer While Loop
3. ✅ Ajouter Event Structure dans la boucle
4. ✅ Configurer événements pour chaque bouton
5. ✅ Ajouter VISA Write dans chaque cas
6. ✅ Ajouter Wait 50ms après chaque Write
7. ✅ Ajouter VISA Read
8. ✅ Ajouter parsing (Match Pattern + Scan From String)
9. ✅ Connecter aux indicateurs
10. ✅ Ajouter Wait 100ms dans la boucle
11. ✅ Ajouter VISA Close (après While Loop)
12. ✅ Ajouter Simple Error Handler

### Étape 3: Test
1. ✅ Connecter Arduino ou lancer Proteus
2. ✅ Exécuter le VI
3. ✅ Tester chaque bouton
4. ✅ Vérifier les valeurs affichées
5. ✅ Corriger les erreurs

---

## 💾 SAUVEGARDER VOTRE VI

```
File → Save As...

Save in: /home/yessin/Desktop/labviewproject/LabVIEW/VIs/
File name: Arduino_Communication.vi
Save
```

---

## 📸 PRENDRE DES CAPTURES D'ÉCRAN

### Capture du Front Panel
```
1. Window → Show Front Panel (Ctrl+E)
2. File → Print Window... (Ctrl+P)
3. Printer: "Print to File"
4. Format: PNG
5. File name: Arduino_Communication_Front_Panel.png
6. Save in: /home/yessin/Desktop/labviewproject/LabVIEW/VIs/
7. Print
```

### Capture du Block Diagram
```
1. Window → Show Block Diagram (Ctrl+E)
2. File → Print Window... (Ctrl+P)
3. Printer: "Print to File"
4. Format: PNG
5. File name: Arduino_Communication_Block_Diagram.png
6. Save in: /home/yessin/Desktop/labviewproject/LabVIEW/VIs/
7. Print
```

---

## ✅ CHECKLIST FINALE

- [ ] Front Panel créé avec tous les contrôles
- [ ] Block Diagram implémenté correctement
- [ ] VISA configuré @ 9600 bauds
- [ ] Event Structure avec tous les cas
- [ ] Parsing des réponses fonctionnel
- [ ] Gestion des erreurs ajoutée
- [ ] VI testé et fonctionnel
- [ ] Captures d'écran prises
- [ ] VI sauvegardé dans LabVIEW/VIs/
- [ ] Documentation à jour

---

**Note** : Ces diagrammes ASCII sont des représentations visuelles. Votre interface LabVIEW réelle aura un rendu graphique professionnel, mais devra suivre cette structure et ces principes.

Pour des captures d'écran réelles, vous devez :
1. Créer le VI dans LabVIEW 2015
2. Utiliser la fonction Print Window
3. Les sauvegarder dans le dossier VIs/
