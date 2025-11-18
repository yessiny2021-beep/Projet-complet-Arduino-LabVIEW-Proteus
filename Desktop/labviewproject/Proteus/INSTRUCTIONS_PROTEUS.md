# Instructions pour créer le schéma Proteus

## Composants nécessaires dans Proteus

### Microcontrôleur
- **Arduino Uno** (ou ATMEGA328P avec bootloader Arduino)

### Capteurs (Entrées)
1. **LM35** - Capteur de température
   - Pin OUT → Arduino A0
   - VCC → 5V
   - GND → GND

2. **Potentiomètre (POT-HG)** - 10kΩ
   - Pin central → Arduino A1
   - Autres pins → 5V et GND

3. **Bouton poussoir (BUTTON)** avec résistance
   - Un côté → Arduino D2
   - Autre côté → GND
   - (Pas besoin de résistance externe, INPUT_PULLUP activé dans le code)

### Actionneurs (Sorties)
1. **LED RGB** (ou 3 LEDs séparées)
   - LED Rouge → Arduino D9 (PWM) avec résistance 220Ω → GND
   - LED Verte → Arduino D10 (PWM) avec résistance 220Ω → GND
   - LED Bleue → Arduino D11 (PWM) avec résistance 220Ω → GND

2. **Servo moteur (SERVO)**
   - Signal → Arduino D6
   - VCC → 5V
   - GND → GND

3. **Buzzer (BUZZER)**
   - Pin + → Arduino D8
   - Pin - → GND

### Composants supplémentaires
- **Résistances** : 3x 220Ω pour les LEDs
- **Source d'alimentation** : 5V (intégrée dans Arduino)
- **Ground** : Masse commune

## Étapes de création du schéma dans Proteus

### 1. Ouvrir Proteus Design Suite
   - Créer un nouveau projet
   - Nom: "Arduino_LabVIEW_Communication"

### 2. Placer les composants
   a. Cliquer sur "Pick from Libraries" (bouton P)
   b. Rechercher et placer chaque composant:
      - ARDUINO UNO
      - LM35
      - POT-HG (potentiomètre)
      - BUTTON (bouton)
      - LED-RED, LED-GREEN, LED-BLUE
      - SERVO (ou MOTOR-SERVO)
      - BUZZER
      - RES (résistances 220Ω)

### 3. Câbler le circuit selon le schéma suivant

```
Arduino A0 ←→ LM35 (OUT)
Arduino A1 ←→ Potentiomètre (pin central)
Arduino D2 ←→ Bouton (un côté, autre côté à GND)

Arduino D9 (PWM)  ←→ Résistance 220Ω ←→ LED Rouge (anode) ─→ GND (cathode)
Arduino D10 (PWM) ←→ Résistance 220Ω ←→ LED Verte (anode) ─→ GND (cathode)
Arduino D11 (PWM) ←→ Résistance 220Ω ←→ LED Bleue (anode) ─→ GND (cathode)

Arduino D6 ←→ Servo (Signal), Servo VCC → 5V, Servo GND → GND
Arduino D8 ←→ Buzzer (+), Buzzer (-) → GND

Alimentation:
- LM35 VCC → 5V, LM35 GND → GND
- Potentiomètre → 5V et GND aux extrémités
```

### 4. Charger le code Arduino dans Proteus
   a. Double-cliquer sur l'Arduino Uno
   b. Cliquer sur le bouton de dossier à côté de "Program File"
   c. Sélectionner le fichier .hex compilé depuis Arduino IDE
   
   **Pour générer le fichier .hex:**
   - Ouvrir arduino_labview_communication.ino dans Arduino IDE
   - Aller dans Fichier → Préférences
   - Cocher "Afficher la sortie détaillée pendant : compilation"
   - Compiler le sketch (Vérifier)
   - Trouver le fichier .hex dans le dossier temporaire indiqué dans la console
   - Copier ce fichier dans le dossier Proteus du projet

### 5. Configuration de la communication série virtuelle

#### Option A : Virtual Serial Port (COMPIM)
   a. Ajouter le composant "COMPIM" dans le schéma
   b. Connecter COMPIM RXD → Arduino TX (pin 1)
   c. Connecter COMPIM TXD → Arduino RX (pin 0)
   d. Double-cliquer sur COMPIM et configurer:
      - Physical Port: (laisser vide pour port virtuel)
      - Baud Rate: 9600
      
#### Option B : Virtual Serial Ports Driver
   - Installer "Virtual Serial Port Driver" (VSPD) ou "com0com"
   - Créer une paire de ports virtuels (ex: COM10 ↔ COM11)
   - Configurer COMPIM dans Proteus sur COM10
   - Configurer LabVIEW pour se connecter sur COM11

### 6. Configuration du Virtual Terminal (optionnel pour tests)
   - Ajouter le composant "VIRTUAL TERMINAL"
   - Connecter au TX/RX de l'Arduino pour voir les messages

### 7. Sauvegarder le projet
   - Fichier → Save Project
   - Nommer: Arduino_LabVIEW_Communication.pdsprj

### 8. Tester la simulation
   - Cliquer sur le bouton "Play" (triangle)
   - Vérifier que l'Arduino démarre correctement
   - Observer les LEDs et composants

## Configuration de la communication série

### Pour Windows:
1. Installer "com0com" ou "Virtual Serial Port Driver"
2. Créer une paire de ports: COM10 ↔ COM11
3. Proteus COMPIM → COM10
4. LabVIEW VISA → COM11

### Pour Linux (avec Wine):
1. Utiliser socat pour créer des ports virtuels:
   ```bash
   socat -d -d pty,raw,echo=0 pty,raw,echo=0
   ```
2. Noter les ports créés (ex: /dev/pts/X et /dev/pts/Y)
3. Configurer Proteus et LabVIEW en conséquence

## Paramètres de communication série
- **Baud Rate**: 9600
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None
- **Flow Control**: None

## Notes importantes
- Assurez-vous que les ports virtuels sont créés AVANT de lancer la simulation Proteus
- Vérifiez que le même port n'est pas utilisé par une autre application
- La LED intégrée de l'Arduino (pin 13) clignote généralement au démarrage

## Dépannage
- **Pas de communication**: Vérifier les ports COM configurés
- **Arduino ne démarre pas**: Vérifier que le fichier .hex est correct
- **Composants ne réagissent pas**: Vérifier les connexions dans le schéma
- **Erreur de compilation**: Installer la bibliothèque Servo dans Arduino IDE
