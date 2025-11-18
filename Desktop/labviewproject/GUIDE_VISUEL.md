# GUIDE VISUEL - Architecture du Projet

## Vue d'ensemble du système

```
┌──────────────────────────────────────────────────────────────────┐
│                     SYSTÈME COMPLET                              │
│                                                                  │
│  ┌────────────────┐         ┌────────────────┐                  │
│  │   PROTEUS      │         │   LabVIEW      │                  │
│  │  (Simulation)  │◄───────►│  (Interface)   │                  │
│  │                │  Série  │                │                  │
│  │  Arduino Uno   │  9600   │   VISA COM11   │                  │
│  │  + Capteurs    │  baud   │                │                  │
│  │  + Actionneurs │         │   Front Panel  │                  │
│  └────────────────┘         └────────────────┘                  │
│         │                            │                           │
│         │                            │                           │
│    COMPIM COM10                Port Virtuel                      │
│         │                            │                           │
│         └────────────┬───────────────┘                          │
│                      │                                          │
│              ┌───────▼────────┐                                 │
│              │ Virtual Ports  │                                 │
│              │  COM10↔COM11   │                                 │
│              │   (com0com)    │                                 │
│              └────────────────┘                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Architecture Arduino (Proteus)

```
                    ┌─────────────────────────────┐
                    │       ARDUINO UNO           │
                    │        ATmega328P           │
                    │                             │
    ENTRÉES         │                             │    SORTIES
                    │                             │
    [LM35]──────────┤A0                        D9 ├────►[LED R]
    Température     │                             │     (PWM)
                    │                             │
    [POT]───────────┤A1                       D10 ├────►[LED G]
    10kΩ            │                             │     (PWM)
                    │                             │
    [BUTTON]────────┤D2                       D11 ├────►[LED B]
    Poussoir        │                             │     (PWM)
                    │                             │
                    │                         D6  ├────►[SERVO]
                    │                             │
                    │                         D8  ├────►[BUZZER]
                    │                             │
    [COMPIM]────────┤RX/TX                        │
    COM10           │                             │
                    │                             │
                    │  5V ──── Alimentation       │
                    │  GND ─── Masse commune      │
                    │                             │
                    └─────────────────────────────┘
```

### Détail des connexions

```
CAPTEURS (Entrées Analogiques/Digitales)
════════════════════════════════════════

LM35 (Température)          Potentiomètre             Bouton
─────────────────          ──────────────             ──────
   ┌───┐                      ┌─┴─┐                   ┌───┐
5V─┤VCC├                   5V─┤   │                   │   │
   │OUT├─→A0                  │ W ├─→A1                │   ├─→D2
GND┤GND├                   GND┤   │                   └─┬─┘
   └───┘                      └───┘                     │
                                                       GND


ACTIONNEURS (Sorties PWM/Digitales)
═══════════════════════════════════

LED Rouge                 Servo Moteur              Buzzer
─────────                ─────────────              ──────
D9─→[220Ω]─→|▻|─→GND     D6─→[Signal]             D8─→(•))─→GND
    (R=220Ω) Rouge          5V─→[VCC]                  Buzzer
                            GND→[GND]

LED Verte
─────────
D10→[220Ω]─→|▻|─→GND
    (R=220Ω) Verte

LED Bleue
─────────
D11→[220Ω]─→|▻|─→GND
    (R=220Ω) Bleue


COMMUNICATION SÉRIE
═══════════════════

Arduino TX (D1) ────→ COMPIM RXD
Arduino RX (D0) ←──── COMPIM TXD
```

---

## Architecture LabVIEW

### Front Panel (Face-avant)

```
┌───────────────────────────────────────────────────────────────┐
│                    ARDUINO COMMUNICATION                      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─ CONFIGURATION ───────────────────────────────────────┐   │
│  │                                                        │   │
│  │  Port COM: [COM11 ▼]  [Connecter] [Déconnecter]      │   │
│  │  État: ●────────                                       │   │
│  │        Connecté                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ CAPTEURS (Lecture) ──────────────────────────────────┐   │
│  │                                                        │   │
│  │  Température (°C)        Potentiomètre       Bouton   │   │
│  │      ┌───┐                   1023            ●        │   │
│  │      │ 🌡│                    ║              OFF      │   │
│  │      │25°│                    ║                       │   │
│  │      │   │                    ║                       │   │
│  │      │ 0 │                    0                       │   │
│  │      └───┘                                            │   │
│  │                                                        │   │
│  │  Graphique Température                                │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ 30°C─                        ╱╲                │   │   │
│  │  │      │                      ╱  ╲               │   │   │
│  │  │ 25°C─┼─────────────────────╱    ╲──────────   │   │   │
│  │  │      │                                         │   │   │
│  │  │ 20°C─┴──────────────────────────────────────► │   │   │
│  │  │      0                                   Time  │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ ACTIONNEURS (Contrôle) ──────────────────────────────┐   │
│  │                                                        │   │
│  │  LED RGB                     Servo          Buzzer    │   │
│  │  ┌─────────────────┐         ┌───┐          ┌───┐    │   │
│  │  │  R  │ G  │ B   │         │ ◯ │          │   │    │   │
│  │  │ 255 │    │     │         │   │          │ ○ │    │   │
│  │  │  ║  │ ║  │ ║   │         │180│          │   │    │   │
│  │  │  ║  │ ║  │ ║   │         │ ◉ │          └───┘    │   │
│  │  │  ║  │ ║  │ ║   │         │   │           OFF     │   │
│  │  │  0  │ 0  │ 0   │         │ 0 │                   │   │
│  │  └─────────────────┘         └───┘                   │   │
│  │                                                        │   │
│  │  [Envoyer RGB]    [Déplacer Servo]                   │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ MONITORING ──────────────────────────────────────────┐   │
│  │                                                        │   │
│  │  Messages reçus:                  Erreurs:            │   │
│  │  ┌────────────────────┐          ┌────────────────┐  │   │
│  │  │T:25.5,P:512,B:0   │          │                │  │   │
│  │  │T:25.6,P:510,B:0   │          │                │  │   │
│  │  │ACK:LED            │          │                │  │   │
│  │  │T:25.7,P:508,B:1   │          │                │  │   │
│  │  └────────────────────┘          └────────────────┘  │   │
│  │                                                        │   │
│  │                                         [■ STOP]      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Block Diagram (Simplifié)

```
┌─────────────────────────── WHILE LOOP ───────────────────────────┐
│                                                                   │
│  ┌── INIT (First Call) ─────────────────────────────────────┐    │
│  │                                                           │    │
│  │  [Port COM] ──→ VISA Configure Serial Port               │    │
│  │                 (9600, 8, N, 1)                           │    │
│  │                     │                                     │    │
│  │                     ▼                                     │    │
│  │              [VISA Resource] ──→ Shift Register ───┐     │    │
│  └───────────────────────────────────────────────────┬─┘     │    │
│                                                      │       │    │
│  ┌── READ SECTION ─────────────────────────────────┬┘       │    │
│  │                                                  │        │    │
│  │  ┌─ Shift Register ──→ [VISA Resource]         │        │    │
│  │  │                            │                 │        │    │
│  │  │                            ▼                 │        │    │
│  │  │                     VISA Read                │        │    │
│  │  │                     (100 bytes, \n)          │        │    │
│  │  │                            │                 │        │    │
│  │  │                            ▼                 │        │    │
│  │  │                    "T:25.5,P:512,B:0\n"      │        │    │
│  │  │                            │                 │        │    │
│  │  │                            ▼                 │        │    │
│  │  │                  Scan From String            │        │    │
│  │  │                  "T:%f,P:%d,B:%d"            │        │    │
│  │  │                            │                 │        │    │
│  │  │                ┌───────────┼────────────┐    │        │    │
│  │  │                ▼           ▼            ▼    │        │    │
│  │  │            [Temp]       [Pot]       [Button] │        │    │
│  │  │                │           │            │    │        │    │
│  │  │                ▼           ▼            ▼    │        │    │
│  │  │          [Thermometer] [Slide]     [LED]     │        │    │
│  │  │                │                              │        │    │
│  │  │                └──→ [Chart] (append)         │        │    │
│  │  └──────────────────────────────────────────────┘        │    │
│  │                                                           │    │
│  ┌── WRITE SECTION (Event Structure) ──────────────────────┐│    │
│  │                                                          ││    │
│  │  Event: "Envoyer RGB" Value Change                      ││    │
│  │  ┌────────────────────────────────────────────┐         ││    │
│  │  │ [R][G][B] → Format: "LED:%d,%d,%d\n"       │         ││    │
│  │  │                │                            │         ││    │
│  │  │                └──→ VISA Write              │         ││    │
│  │  └────────────────────────────────────────────┘         ││    │
│  │                                                          ││    │
│  │  Event: "Déplacer Servo" Value Change                   ││    │
│  │  ┌────────────────────────────────────────────┐         ││    │
│  │  │ [Angle] → Format: "SERVO:%d\n"             │         ││    │
│  │  │               │                             │         ││    │
│  │  │               └──→ VISA Write               │         ││    │
│  │  └────────────────────────────────────────────┘         ││    │
│  │                                                          ││    │
│  │  Event: "Buzzer" Value Change                           ││    │
│  │  ┌────────────────────────────────────────────┐         ││    │
│  │  │ [State] → Format: "BUZZER:%d\n"            │         ││    │
│  │  │               │                             │         ││    │
│  │  │               └──→ VISA Write               │         ││    │
│  │  └────────────────────────────────────────────┘         ││    │
│  │                                                          ││    │
│  │  Event: Timeout (100ms) → Continue                      ││    │
│  └──────────────────────────────────────────────────────────┘│    │
│                                                               │    │
│  ┌── ERROR HANDLING ──────────────────────────────────────┐  │    │
│  │                                                         │  │    │
│  │  [Error In] ──→ Case Structure                         │  │    │
│  │                    │                                    │  │    │
│  │              ┌─────┴──────┐                            │  │    │
│  │              ▼            ▼                            │  │    │
│  │          [True]      [False]                           │  │    │
│  │       Display Error   Continue                         │  │    │
│  └─────────────────────────────────────────────────────────┘  │    │
│                                                               │    │
│  Wait (100ms)                                                 │    │
│                                                               │    │
│  Loop Condition: NOT [STOP]                                   │    │
│                                                               │    │
└───────────────────────────────────────────────────────────────┘

After Loop:
  [VISA Resource] ──→ VISA Close
```

---

## Protocole de Communication

### Format des messages

```
ARDUINO → LABVIEW (Données capteurs)
═══════════════════════════════════

Toutes les 100ms:

  "T:25.5,P:512,B:0\n"
   │   │   │    │   │
   │   │   │    │   └─ Terminateur (Line Feed)
   │   │   │    └───── Bouton (0=OFF, 1=ON)
   │   │   └────────── Potentiomètre (0-1023)
   │   └────────────── Température (0.0-100.0°C)
   └────────────────── Tag Température


LABVIEW → ARDUINO (Commandes)
═════════════════════════════

LED RGB:
  "LED:255,128,0\n"
   │    │   │  │
   │    │   │  └─ Bleu (0-255)
   │    │   └──── Vert (0-255)
   │    └──────── Rouge (0-255)
   └───────────── Tag LED

Servo:
  "SERVO:90\n"
   │     │
   │     └──────── Angle (0-180°)
   └────────────── Tag Servo

Buzzer:
  "BUZZER:1\n"
   │      │
   │      └──────── État (0=OFF, 1=ON)
   └─────────────── Tag Buzzer

Status:
  "STATUS\n"
   │
   └─────────────── Demande status complet


ARDUINO → LABVIEW (Réponses)
═══════════════════════════

Accusés de réception:
  "ACK:LED\n"
  "ACK:SERVO\n"
  "ACK:BUZZER\n"

Status complet:
  "STATUS:LED(255,128,0),SERVO(90),TEMP(25.5),POT(512),BTN(0)\n"
```

---

## Flux de données

```
┌─────────────────────────────────────────────────────────────┐
│                    CYCLE DE COMMUNICATION                   │
│                        (Toutes les 100ms)                   │
└─────────────────────────────────────────────────────────────┘

Temps    Arduino                           LabVIEW
────────────────────────────────────────────────────────────
0ms      Lecture capteurs:
         - LM35 → 25.5°C
         - POT → 512
         - Button → 0
         
5ms      Format message:
         "T:25.5,P:512,B:0\n"
         
10ms     Serial.println() ───────────────→ 
         
15ms                                       VISA Read receives
                                          "T:25.5,P:512,B:0\n"
                                          
20ms                                       Scan From String:
                                          - Temp = 25.5
                                          - Pot = 512
                                          - Button = 0
                                          
25ms                                       Update indicators:
                                          - Thermometer → 25.5
                                          - Slide → 512
                                          - LED → OFF
                                          - Chart → append 25.5
                                          
30ms                                       User clicks "Envoyer RGB"
                                          R=255, G=128, B=0
                                          
35ms                                       Format: "LED:255,128,0\n"
                                          VISA Write ─────────────→
                                          
40ms     Serial.available()
         receiveCommand()
         "LED:255,128,0\n"
         
45ms     Parse command:
         controlLED("255,128,0")
         R=255, G=128, B=0
         
50ms     analogWrite(RED, 255)
         analogWrite(GREEN, 128)
         analogWrite(BLUE, 0)
         
55ms     Serial.println("ACK:LED") ──────→
         
60ms                                       VISA Read receives
                                          "ACK:LED\n"
                                          Display in Messages
                                          
100ms    ← Next cycle begins ──────────────
```

---

## Hiérarchie des fichiers avec tailles typiques

```
labviewproject/                              (Dossier racine)
│
├── README.md                                (~15 KB)
├── CHECKLIST_SOUMISSION.md                  (~25 KB)
│
├── Arduino/                                 (Dossier)
│   ├── arduino_labview_communication.ino    (~8 KB)
│   └── arduino_labview_communication.hex    (~5-10 KB)
│
├── Proteus/                                 (Dossier)
│   ├── Arduino_LabVIEW_Communication.pdsprj (~100-500 KB)
│   ├── INSTRUCTIONS_PROTEUS.md              (~10 KB)
│   └── COMPOSANTS_REFERENCE.md              (~8 KB)
│
├── LabVIEW/                                 (Dossier)
│   ├── Arduino_Communication.vi             (~50-200 KB)
│   ├── INSTRUCTIONS_LABVIEW.md              (~20 KB)
│   └── BLOCK_DIAGRAM_TEMPLATE.md            (~15 KB)
│
└── Documentation/                           (Dossier)
    ├── GUIDE_COMPLET.md                     (~30 KB)
    ├── PROTOCOLE_COMMUNICATION.md           (~18 KB)
    ├── TROUBLESHOOTING.md                   (~25 KB)
    └── COMPILATION_HEX.md                   (~15 KB)

Taille totale estimée : ~300-800 KB (sans les fichiers binaires volumineux)
```

---

## Schéma de décision - Démarrage du système

```
                        ┌────────────┐
                        │   DÉBUT    │
                        └─────┬──────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Ports virtuels   │
                    │ créés ?          │
                    └────┬────────┬────┘
                         │NON     │OUI
                         ▼        │
                  [Créer ports]   │
                  com0com/socat   │
                         │        │
                         └────┬───┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Lancer Proteus   │
                    │ Charger projet   │
                    └─────┬────────────┘
                          │
                          ▼
                    ┌──────────────────┐
                    │ Fichier .hex     │
                    │ chargé ?         │
                    └────┬────────┬────┘
                         │NON     │OUI
                         ▼        │
                  [Charger .hex]  │
                  Double-clic     │
                  Arduino         │
                         │        │
                         └────┬───┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Play simulation  │
                    │ Proteus          │
                    └─────┬────────────┘
                          │
                          ▼
                    ┌──────────────────┐
                    │ LED 13 clignote ?│
                    └────┬────────┬────┘
                         │NON     │OUI
                         ▼        │
                    [ERREUR]      │
                    Voir docs     │
                         ▲        │
                         └────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Lancer LabVIEW   │
                    │ Charger VI       │
                    └─────┬────────────┘
                          │
                          ▼
                    ┌──────────────────┐
                    │ VI broken ?      │
                    └────┬────────┬────┘
                         │OUI     │NON
                         ▼        │
                    [ERREUR]      │
                    Vérifier      │
                    dépendances   │
                         ▲        │
                         └────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Run VI (▶)       │
                    └─────┬────────────┘
                          │
                          ▼
                    ┌──────────────────┐
                    │ Cliquer          │
                    │ "Connecter"      │
                    └─────┬────────────┘
                          │
                          ▼
                    ┌──────────────────┐
                    │ LED connexion    │
                    │ verte ?          │
                    └────┬────────┬────┘
                         │NON     │OUI
                         ▼        │
                    [ERREUR]      │
                    Port COM      │
                    incorrect     │
                         ▲        │
                         └────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Données affichées│
                    │ correctement ?   │
                    └────┬────────┬────┘
                         │NON     │OUI
                         ▼        │
                    [Vérifier]    │
                    protocole     │
                         ▲        │
                         └────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  SUCCÈS ! ✓      │
                    │  Système prêt    │
                    └──────────────────┘
```

---

**Ce guide visuel complète la documentation technique du projet.**  
**Utilisez-le comme référence rapide pour comprendre l'architecture globale.**

---

*Version : 1.0*  
*Date : 17 Novembre 2025*
