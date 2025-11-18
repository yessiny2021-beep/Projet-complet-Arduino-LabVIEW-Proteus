# Guide Complet d'Utilisation
## Projet Communication Arduino-LabVIEW

---

## Table des matières

1. [Introduction](#introduction)
2. [Installation et configuration](#installation-et-configuration)
3. [Utilisation du système](#utilisation-du-système)
4. [Exemples d'utilisation](#exemples-dutilisation)
5. [Maintenance et optimisation](#maintenance-et-optimisation)

---

## Introduction

Ce guide vous accompagne pas à pas dans l'utilisation du système de communication Arduino-LabVIEW. Que vous soyez débutant ou expérimenté, vous trouverez ici toutes les informations nécessaires.

### Prérequis

**Connaissances recommandées :**
- Bases d'Arduino
- Notions de communication série
- Utilisation de LabVIEW (niveau débutant)
- Simulation avec Proteus

**Matériel requis :**
- Ordinateur avec Windows ou Linux
- 4GB RAM minimum (8GB recommandé)
- Espace disque : 5GB

---

## Installation et configuration

### Phase 1 : Installation des logiciels

#### 1.1 Arduino IDE

**Téléchargement :**
```
Site : https://www.arduino.cc/en/software
Version : 1.8.19 ou 2.x
```

**Installation Windows :**
1. Télécharger le fichier .exe
2. Exécuter l'installateur
3. Accepter l'installation des drivers
4. Lancer Arduino IDE

**Installation Linux :**
```bash
# Télécharger le package
wget https://downloads.arduino.cc/arduino-1.8.19-linux64.tar.xz

# Extraire
tar -xvf arduino-1.8.19-linux64.tar.xz

# Installer
cd arduino-1.8.19
sudo ./install.sh

# Ajouter l'utilisateur au groupe dialout
sudo usermod -a -G dialout $USER
```

**Test :**
```
1. Ouvrir Arduino IDE
2. File → Examples → 01.Basics → Blink
3. Vérifier que le code s'affiche
```

#### 1.2 Proteus Design Suite

**Téléchargement :**
```
Site : https://www.labcenter.com/
Version : 8.9 ou supérieure
Licence : Requise (académique ou commerciale)
```

**Installation :**
1. Exécuter l'installateur
2. Suivre l'assistant d'installation
3. Entrer la licence
4. Installer les bibliothèques Arduino
5. Redémarrer l'ordinateur

**Bibliothèques Arduino pour Proteus :**
```
Si Arduino n'est pas disponible dans Proteus :
1. Télécharger Arduino Library for Proteus
2. Copier les fichiers dans :
   C:\ProgramData\Labcenter Electronics\Proteus 8 Professional\LIBRARY
3. Relancer Proteus
```

#### 1.3 LabVIEW

**Téléchargement :**
```
Site : https://www.ni.com/en-us/support/downloads/software-products/download.labview.html
Version : 2021 ou antérieure
Licence : Requise (académique ou trial)
```

**Installation :**
1. Créer un compte NI
2. Télécharger LabVIEW 2021
3. Lancer l'installateur
4. Installer NI-VISA (inclus)
5. Activer la licence

**Composants à installer :**
- [ ] LabVIEW Base ou Full
- [ ] NI-VISA
- [ ] LabVIEW Real-Time Module (optionnel)

#### 1.4 Virtual Serial Ports

**Windows - com0com :**
```
1. Télécharger : https://sourceforge.net/projects/com0com/
2. Exécuter setup_com0com_W7_x64_signed.exe
3. Installation par défaut
4. Redémarrer si demandé
```

**Configuration com0com :**
```
1. Ouvrir "Setup Command Prompt" (admin)
2. Taper : install PortName=COM10 PortName=COM11
3. Vérifier : list
4. Quitter : quit
```

**Linux - socat :**
```bash
# Installer socat
sudo apt update
sudo apt install socat

# Test
socat -V
```

---

### Phase 2 : Configuration du projet

#### 2.1 Préparer le code Arduino

**Étapes :**

1. **Ouvrir le fichier Arduino**
   ```
   Fichier : Arduino/arduino_labview_communication.ino
   ```

2. **Vérifier le code**
   ```
   Arduino IDE → Sketch → Verify/Compile (✓)
   ```

3. **Exporter le fichier .hex**
   ```
   Méthode 1 (Arduino IDE 2.x) :
     Sketch → Export Compiled Binary
     Le fichier .hex sera dans le dossier du sketch
   
   Méthode 2 (Arduino IDE 1.x) :
     1. File → Preferences
     2. Cocher "Show verbose output during compilation"
     3. Compiler
     4. Chercher dans la console : "... .hex"
     5. Copier le chemin du fichier
     6. Aller dans ce dossier et copier le .hex
   ```

4. **Placer le fichier .hex**
   ```
   Copier vers : Proteus/arduino_labview_communication.hex
   ```

#### 2.2 Créer le schéma Proteus

**Étape 1 : Nouveau projet**
```
1. Proteus → File → New Project
2. Nom : Arduino_LabVIEW_Communication
3. Next → Next → ... → Finish
4. Workspace vide s'ouvre
```

**Étape 2 : Ajouter les composants**

**Liste des composants à placer :**

| N° | Composant | Nom Proteus | Quantité |
|----|-----------|-------------|----------|
| 1  | Arduino   | ARDUINO UNO R3 | 1 |
| 2  | Temp sensor | LM35 | 1 |
| 3  | Potentiomètre | POT-HG | 1 |
| 4  | Bouton | BUTTON | 1 |
| 5  | LED Rouge | LED-RED | 1 |
| 6  | LED Verte | LED-GREEN | 1 |
| 7  | LED Bleue | LED-BLUE | 1 |
| 8  | Résistance | RES | 3x (220Ω) |
| 9  | Servo | MOTOR-SERVO | 1 |
| 10 | Buzzer | BUZZER | 1 |
| 11 | COMPIM | COMPIM | 1 |

**Ajouter un composant :**
```
1. Cliquer sur "P" (Pick from Libraries)
2. Chercher le nom (ex: "ARDUINO UNO")
3. Cliquer OK
4. Placer dans le schéma (clic gauche)
5. Répéter pour tous les composants
```

**Étape 3 : Câbler le circuit**

**Capteurs :**
```
LM35 :
  VCC → Arduino 5V
  OUT → Arduino A0
  GND → GND

Potentiomètre :
  Pin gauche → 5V
  Pin central → Arduino A1
  Pin droit → GND

Bouton :
  Un côté → Arduino D2
  Autre côté → GND
```

**LEDs (identique pour les 3) :**
```
Arduino D9  → Résistance 220Ω → LED Rouge Anode
Arduino D10 → Résistance 220Ω → LED Verte Anode
Arduino D11 → Résistance 220Ω → LED Bleue Anode

Toutes les cathodes → GND
```

**Servo et Buzzer :**
```
Servo :
  Signal → Arduino D6
  VCC → 5V
  GND → GND

Buzzer :
  + → Arduino D8
  - → GND
```

**COMPIM (Communication série) :**
```
COMPIM TXD → Arduino RX (D0)
COMPIM RXD → Arduino TX (D1)
```

**Conseil :** Utiliser les labels pour nommer les fils importants (clic droit sur fil → Place Wire Label)

**Étape 4 : Charger le programme**
```
1. Double-cliquer sur Arduino Uno
2. Program File : Cliquer sur dossier
3. Sélectionner arduino_labview_communication.hex
4. OK
```

**Étape 5 : Configurer COMPIM**
```
1. Double-cliquer sur COMPIM
2. Configuration :
   - Physical Port : COM10
   - Baud Rate : 9600
   - Data Bits : 8
   - Parity : None
   - Stop Bits : 1
   - Flow Control : None
3. OK
```

**Étape 6 : Sauvegarder**
```
File → Save Project
Nom : Arduino_LabVIEW_Communication.pdsprj
```

#### 2.3 Créer l'interface LabVIEW

**Voir le document détaillé :**
- `LabVIEW/INSTRUCTIONS_LABVIEW.md`
- `LabVIEW/BLOCK_DIAGRAM_TEMPLATE.md`

**Résumé des étapes :**

1. **Créer un nouveau VI**
   ```
   LabVIEW → File → New VI
   Sauvegarder : LabVIEW/Arduino_Communication.vi
   ```

2. **Front Panel (Face-avant)**
   - Ajouter contrôles : Port COM, boutons Connecter/Déconnecter
   - Ajouter indicateurs : Thermomètre, Jauge, LED, Chart
   - Ajouter contrôles actionneurs : Sliders RGB, Knob Servo, Switch Buzzer
   - Ajouter bouton STOP

3. **Block Diagram**
   - While Loop principale
   - VISA Configure Serial Port (initialisation)
   - VISA Read (lecture périodique)
   - Parsing avec Scan From String
   - Event Structure (pour les commandes)
   - VISA Write (envoi commandes)
   - VISA Close (fermeture)

4. **Sauvegarder pour LabVIEW 2021**
   ```
   File → Save As → Previous Version → 21.0
   ```

---

## Utilisation du système

### Séquence de démarrage

#### Étape 1 : Démarrer les ports virtuels

**Windows :**
```
Les ports COM10 et COM11 doivent déjà être créés
Vérifier dans : Gestionnaire de périphériques → Ports (COM & LPT)
```

**Linux :**
```bash
# Terminal 1 (laisser ouvert)
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1

# Noter les chemins affichés
```

#### Étape 2 : Lancer Proteus

```
1. Ouvrir Proteus Design Suite
2. File → Open Project
3. Sélectionner Arduino_LabVIEW_Communication.pdsprj
4. Vérifier que tous les composants sont présents
5. Cliquer sur Play (▶) pour démarrer la simulation
6. Observer :
   - LED 13 de l'Arduino clignote
   - Pas de message d'erreur
```

**Indicateurs de bon fonctionnement :**
- ✅ LED 13 clignote quelques fois au démarrage
- ✅ Message "Running" dans la barre d'état
- ✅ Composants sont actifs (pas grisés)

#### Étape 3 : Lancer LabVIEW

```
1. Ouvrir LabVIEW
2. File → Open
3. Sélectionner LabVIEW/Arduino_Communication.vi
4. Le Front Panel s'affiche
```

#### Étape 4 : Connecter

```
1. Dans le Front Panel :
   - Sélectionner le port : COM11 (Windows) ou /tmp/ttyV1 (Linux)
2. Cliquer sur "Run" (▶) en haut de la fenêtre
3. Cliquer sur le bouton "Connecter"
4. Observer :
   - LED "État Connexion" s'allume en vert
   - Données commencent à s'afficher
   - Thermomètre montre la température
   - Graphique commence à tracer
```

**Si connexion réussie :**
- ✅ LED connexion verte
- ✅ Température affichée (~27°C par défaut)
- ✅ Potentiomètre varie si vous changez sa valeur dans Proteus
- ✅ Bouton LED change si vous cliquez sur le bouton dans Proteus

---

### Utilisation des capteurs

#### Capteur de température (LM35)

**Dans Proteus :**
```
1. Double-cliquer sur le LM35
2. Changer "Temperature" : 20 à 40°C
3. OK
```

**Dans LabVIEW :**
```
- Observer le thermomètre changer
- Le graphique suit l'évolution
- Valeur numérique mise à jour
```

**Plage normale :** 0°C à 100°C  
**Précision :** 0.1°C  
**Mise à jour :** 10 fois par seconde

#### Potentiomètre

**Dans Proteus :**
```
1. Cliquer sur le potentiomètre
2. Tourner avec la molette de la souris
   Ou : Double-cliquer → Changer "Wiper Position"
```

**Dans LabVIEW :**
```
- Jauge verticale suit le mouvement
- Valeur entre 0 et 1023
- Temps réel (100ms de latence)
```

**Utilisations :**
- Réglage de seuil
- Contrôle de vitesse
- Niveau analogique

#### Bouton poussoir

**Dans Proteus :**
```
1. Cliquer sur le bouton (maintenir)
2. LED dans LabVIEW devient rouge
3. Relâcher : LED redevient verte ou éteinte
```

**Dans LabVIEW :**
```
- LED indicator change de couleur
- État : 0 (relâché) ou 1 (pressé)
```

**Utilisations :**
- Détection d'événement
- Trigger d'action
- Interface utilisateur simple

---

### Utilisation des actionneurs

#### LED RGB

**Dans LabVIEW :**
```
1. Ajuster les 3 curseurs :
   - Rouge : 0 à 255
   - Vert : 0 à 255
   - Bleu : 0 à 255
2. Cliquer sur "Envoyer RGB"
3. Observer les LEDs dans Proteus
```

**Exemples de couleurs :**
```
Rouge pur :     R=255, G=0,   B=0
Vert pur :      R=0,   G=255, B=0
Bleu pur :      R=0,   G=0,   B=255
Jaune :         R=255, G=255, B=0
Cyan :          R=0,   G=255, B=255
Magenta :       R=255, G=0,   B=255
Blanc :         R=255, G=255, B=255
Orange :        R=255, G=128, B=0
Rose :          R=255, G=128, B=128
```

**Dans Proteus :**
```
- Les 3 LEDs varient en intensité
- PWM simulé (luminosité variable)
```

#### Servo moteur

**Dans LabVIEW :**
```
1. Tourner le bouton rotatif (0° à 180°)
2. Cliquer sur "Déplacer Servo"
3. Observer le servo dans Proteus
```

**Positions typiques :**
```
0° :   Position gauche/minimale
45° :  Quart de tour
90° :  Position centrale
135° : Trois quarts
180° : Position droite/maximale
```

**Dans Proteus :**
```
- Le servo tourne vers la position
- Animation visible
- Angle affiché dans les propriétés
```

#### Buzzer

**Dans LabVIEW :**
```
1. Activer l'interrupteur "Buzzer ON/OFF"
2. État ON : Buzzer actif
3. État OFF : Buzzer éteint
```

**Dans Proteus :**
```
- ON : Buzzer affiche "SOUNDING"
- OFF : Buzzer silencieux
- Icône change de couleur
```

---

## Exemples d'utilisation

### Exemple 1 : Système d'alarme température

**Objectif :** Allumer une LED rouge si température > 30°C

**Procédure :**

1. **Dans Proteus :**
   ```
   LM35 → Temperature: 25°C
   Observer dans LabVIEW : ~25°C
   ```

2. **Augmenter la température :**
   ```
   LM35 → Temperature: 35°C
   ```

3. **Dans LabVIEW :**
   ```
   Si Température > 30°C :
     - Rouge = 255
     - Vert = 0
     - Bleu = 0
     - Cliquer "Envoyer RGB"
   
   Sinon :
     - Tout à 0 (éteint)
   ```

4. **Observer :**
   ```
   LED rouge allumée dans Proteus
   ```

**Extension :** Ajouter le buzzer comme alarme sonore

---

### Exemple 2 : Contrôle de LED par potentiomètre

**Objectif :** Varier l'intensité d'une LED selon le potentiomètre

**Procédure :**

1. **Observer la valeur du pot dans LabVIEW**
   ```
   Ex: Pot = 512 (milieu)
   ```

2. **Calculer l'intensité :**
   ```
   Formule : Intensité = (Pot / 1023) * 255
   Ex: (512 / 1023) * 255 ≈ 128
   ```

3. **Appliquer à une LED :**
   ```
   Bleu = 128
   Rouge = 0
   Vert = 0
   Cliquer "Envoyer RGB"
   ```

4. **Tester :**
   ```
   Pot au min (0) → LED éteinte
   Pot au milieu (512) → LED à 50%
   Pot au max (1023) → LED à 100%
   ```

**Extension :** Implémenter dans LabVIEW avec un calcul automatique

---

### Exemple 3 : Servo commandé par bouton

**Objectif :** Changer position servo à chaque pression du bouton

**Positions :**
```
État initial : 90° (centre)
1ère pression : 0° (gauche)
2ème pression : 180° (droite)
3ème pression : 90° (retour centre)
```

**Procédure :**

1. **Position initiale :**
   ```
   Servo : 90°
   Cliquer "Déplacer Servo"
   ```

2. **Presser le bouton dans Proteus**
   ```
   Observer dans LabVIEW : LED bouton change
   ```

3. **Changer position servo :**
   ```
   Servo : 0°
   Cliquer "Déplacer Servo"
   ```

4. **Répéter avec différentes positions**

**Extension :** Implémenter une machine d'états dans LabVIEW pour automatiser

---

### Exemple 4 : Datalogging (enregistrement)

**Objectif :** Enregistrer les données de température dans un fichier

**Dans LabVIEW (modification) :**

1. **Ajouter Write To File**
   ```
   Block Diagram:
   [Temperature] → Format Into String ("%f\n")
                → Write To Spreadsheet File
   ```

2. **Configuration :**
   ```
   File Path : "C:/data/temperature.txt"
   Append : True
   ```

3. **Exécution :**
   ```
   Lancer le VI
   Laisser tourner quelques minutes
   Stopper
   ```

4. **Vérification :**
   ```
   Ouvrir temperature.txt
   Contenu : liste des températures enregistrées
   ```

---

## Maintenance et optimisation

### Maintenance régulière

**Quotidien :**
- [ ] Vérifier que les ports virtuels fonctionnent
- [ ] Fermer proprement Proteus et LabVIEW
- [ ] Ne pas fermer brutalement pendant une simulation

**Hebdomadaire :**
- [ ] Backup du projet
- [ ] Vérifier les mises à jour des logiciels
- [ ] Nettoyer les fichiers temporaires

**Backup recommandé :**
```
Copier le dossier labviewproject/ vers :
  - Clé USB
  - Cloud (Google Drive, Dropbox)
  - Autre disque
```

### Optimisations possibles

#### LabVIEW

**Performance :**
```
1. Utiliser Producer-Consumer Pattern
2. Réduire la fréquence de mise à jour des graphiques
3. Utiliser des notifiers pour la communication
```

**Interface :**
```
1. Ajouter des couleurs et groupes visuels
2. Créer des sous-VIs pour modularité
3. Ajouter des tooltips descriptifs
```

#### Proteus

**Simulation :**
```
1. Réduire la fréquence d'animation
2. Désactiver les graphes non utilisés
3. Utiliser des modèles simplifiés
```

#### Arduino

**Code :**
```
1. Optimiser les calculs (éviter float si possible)
2. Utiliser interruptions pour le bouton
3. Implémenter un buffer circulaire
```

---

## Conclusion

Vous maîtrisez maintenant :
✅ Installation et configuration du système  
✅ Utilisation des capteurs et actionneurs  
✅ Communication bidirectionnelle  
✅ Dépannage de base  
✅ Exemples pratiques

**Pour aller plus loin :**
- Ajouter d'autres capteurs (DHT22, ultrason, etc.)
- Implémenter un contrôle PID
- Créer une interface web avec LabVIEW
- Utiliser des bases de données

**Bonne utilisation ! 🚀**
