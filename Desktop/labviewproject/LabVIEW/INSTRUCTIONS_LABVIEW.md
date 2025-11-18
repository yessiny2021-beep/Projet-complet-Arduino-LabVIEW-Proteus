# Instructions LabVIEW - Interface de Communication Arduino

## Description du VI (Virtual Instrument)

Ce VI LabVIEW permet de :
- Se connecter au port série (Arduino via Proteus)
- Recevoir les données des capteurs en temps réel
- Afficher les données dans des indicateurs graphiques
- Envoyer des commandes pour contrôler les actionneurs
- Gérer l'état de la communication

## Architecture du VI

### Face-avant (Front Panel)

#### Section 1 : Configuration de la communication
- **Control: "Port COM"** - Ring/Combo Box pour sélectionner le port
  - Type: Ring
  - Valeurs: COM1, COM2, COM3, ..., COM20
  
- **Button: "Connecter"** - Bouton pour établir la connexion
  - Type: Boolean Button
  
- **Button: "Déconnecter"** - Bouton pour fermer la connexion
  - Type: Boolean Button
  
- **Indicator: "État Connexion"** - LED indiquant l'état de connexion
  - Type: LED Boolean Indicator
  - Vert: Connecté, Éteint: Déconnecté

#### Section 2 : Affichage des capteurs (Données reçues)
- **Indicator: "Température (°C)"** - Thermomètre ou jauge
  - Type: Meter ou Thermometer
  - Range: 0 à 100°C
  
- **Indicator: "Potentiomètre"** - Jauge ou slide
  - Type: Vertical Slide Indicator
  - Range: 0 à 1023
  
- **Indicator: "Bouton"** - LED
  - Type: Round LED
  - Rouge: Pressé, Vert: Relâché
  
- **Chart: "Graphique Température"** - Graphique temps réel
  - Type: Waveform Chart
  - Points: 100 dernières valeurs

#### Section 3 : Contrôle des actionneurs (Commandes envoyées)
- **Control: "LED Rouge"** - Curseur
  - Type: Vertical Slider
  - Range: 0 à 255
  
- **Control: "LED Verte"** - Curseur
  - Type: Vertical Slider
  - Range: 0 à 255
  
- **Control: "LED Bleue"** - Curseur
  - Type: Vertical Slider
  - Range: 0 à 255
  
- **Button: "Envoyer RGB"** - Bouton d'envoi
  - Type: Boolean Button
  
- **Control: "Position Servo"** - Curseur rotatif
  - Type: Knob ou Dial
  - Range: 0 à 180°
  
- **Button: "Déplacer Servo"** - Bouton d'envoi
  - Type: Boolean Button
  
- **Control: "Buzzer ON/OFF"** - Interrupteur
  - Type: Toggle Switch
  
#### Section 4 : Monitoring
- **Indicator: "Messages reçus"** - Zone de texte
  - Type: String Indicator
  - Scrollbar: Oui
  
- **Indicator: "Erreurs"** - Zone de texte
  - Type: String Indicator
  - Couleur: Rouge

- **Button: "STOP"** - Bouton d'arrêt principal
  - Type: Stop Button (icône)
  - Couleur: Rouge

### Diagramme (Block Diagram)

#### Structure principale : While Loop
La boucle principale contient toute la logique du programme.

#### Séquence d'initialisation

**1. Configuration VISA**
```
Blocs nécessaires:
- VISA Configure Serial Port
  - Port: (depuis control "Port COM")
  - Baud Rate: 9600
  - Data Bits: 8
  - Parity: None (0)
  - Stop Bits: 10 (1 stop bit)
  - Flow Control: None (0)
  
- Error Handler (case structure)
  - Si erreur: afficher message
  - Si OK: activer LED "État Connexion"
```

**2. Boucle principale de lecture**
```
Condition: Bouton STOP non pressé

À chaque itération (Wait: 100ms):
  
  A. Lecture des données série (VISA Read)
     - Bytes to Read: 100
     - Termination Char: \n (0x0A)
     - Timeout: 1000ms
  
  B. Parsing des données reçues
     - Format attendu: "T:25.5,P:512,B:1\n"
     - Utiliser "Scan From String" ou "Match Pattern"
     - Extraire: température, potValue, buttonState
  
  C. Mise à jour des indicateurs
     - Température → Thermomètre + Chart
     - Potentiomètre → Slide Indicator
     - Bouton → LED
  
  D. Vérification des commandes à envoyer
     - Détection changement sur contrôles
     - Event Structure ou Property Nodes
  
  E. Envoi des commandes (VISA Write)
     - Si "Envoyer RGB" pressé:
       Format: "LED:R,G,B\n"
       Exemple: "LED:255,128,0\n"
     
     - Si "Déplacer Servo" pressé:
       Format: "SERVO:angle\n"
       Exemple: "SERVO:90\n"
     
     - Si "Buzzer" changé:
       Format: "BUZZER:state\n"
       Exemple: "BUZZER:1\n"
  
  F. Gestion des erreurs
     - Case structure sur error cluster
     - Log des erreurs dans indicator
```

**3. Séquence de fermeture**
```
Après sortie de la boucle:
- VISA Close (fermer la ressource série)
- Clear Error
- Message de confirmation
```

## Guide de création pas à pas

### Étape 1 : Créer un nouveau VI
1. Ouvrir LabVIEW
2. File → New VI
3. Sauvegarder comme "Arduino_Communication.vi"

### Étape 2 : Créer la face-avant
1. Passer en mode Front Panel (Ctrl+E pour basculer)
2. Ajouter les contrôles et indicateurs selon la liste ci-dessus
3. Organiser visuellement par sections
4. Ajouter des labels descriptifs

### Étape 3 : Programmer le diagramme

#### A. Structure While Loop
1. Block Diagram → Structures → While Loop
2. Tracer une grande boucle englobant tout
3. Connecter le bouton STOP à la condition d'arrêt

#### B. Initialisation VISA
```
Blocs à placer (dans l'ordre):
1. VISA Resource Name (constant) ou Control
2. VISA Configure Serial Port
   - Configuration: 9600, 8, N, 1
3. Case Structure pour gestion erreur
```

#### C. Lecture série
```
Dans la boucle While:
1. VISA Read
   - Byte Count: 100
   - Termination Char Enabled: True (\n)
2. String To Number (ou Scan From String)
   - Format: "%f,%d,%d"
3. Unbundle pour séparer les valeurs
4. Connecter aux indicateurs
```

#### D. Envoi de commandes
```
Event Structure (recommandé) ou Property Nodes:
1. Event: "Envoyer RGB" - Value Change
   - Concatenate Strings: "LED:", R, ",", G, ",", B, "\n"
   - VISA Write
   
2. Event: "Déplacer Servo" - Value Change
   - Concatenate Strings: "SERVO:", angle, "\n"
   - VISA Write
   
3. Event: "Buzzer" - Value Change
   - Concatenate Strings: "BUZZER:", state, "\n"
   - VISA Write
```

#### E. Fermeture
```
Après la boucle:
1. VISA Close
2. Simple Error Handler
```

### Étape 4 : Configuration des propriétés

#### Pour les graphiques
- Waveform Chart:
  - Right-click → Properties
  - Scales: X-Axis (temps), Y-Axis (0-100)
  - History Length: 100
  - Update Mode: Strip Chart

#### Pour les contrôles
- Sliders:
  - Range: 0-255 (RGB) ou 0-180 (Servo)
  - Mechanical Action: Switch When Released

#### Pour les boutons
- Connecter/Déconnecter:
  - Mechanical Action: Latch When Released
  
### Étape 5 : Test et debug
1. Connecter au port virtuel (ex: COM11)
2. Lancer la simulation Proteus
3. Exécuter le VI (Run button ou Ctrl+R)
4. Vérifier la réception des données
5. Tester l'envoi de commandes

## Fonctions VISA à utiliser

### Configuration
- **VISA Configure Serial Port.vi**
  - Palette: Instrument I/O → Serial → VISA

### Lecture/Écriture
- **VISA Read.vi**
  - Palette: Instrument I/O → Serial → VISA
  
- **VISA Write.vi**
  - Palette: Instrument I/O → Serial → VISA

### Gestion
- **VISA Close.vi**
  - Palette: Instrument I/O → Serial → VISA

### String Processing
- **Scan From String.vi**
  - Palette: Programming → String
  
- **Match Pattern.vi**
  - Palette: Programming → String

- **Concatenate Strings.vi**
  - Palette: Programming → String

### Conversion
- **Number To String.vi**
  - Palette: Programming → String

- **String To Number.vi**
  - Palette: Programming → String

## Format des messages

### Données reçues de l'Arduino
```
Format: "T:25.5,P:512,B:1\n"

Où:
- T: Température en °C (float)
- P: Valeur potentiomètre (0-1023)
- B: État bouton (0 ou 1)
```

### Commandes envoyées à l'Arduino
```
LED RGB:     "LED:255,128,0\n"    (R,G,B entre 0-255)
Servo:       "SERVO:90\n"         (angle entre 0-180)
Buzzer:      "BUZZER:1\n"         (0=OFF, 1=ON)
Status:      "STATUS\n"           (demande status complet)
```

### Réponses de l'Arduino
```
Accusé de réception:
"ACK:LED\n"
"ACK:SERVO\n"
"ACK:BUZZER\n"

Status complet:
"STATUS:LED(255,128,0),SERVO(90),TEMP(25.5),POT(512),BTN(1)\n"
```

## Amélioration avancées (optionnelles)

### 1. Event Structure complète
- Gérer les événements UI de manière asynchrone
- Producer-Consumer pattern

### 2. Queue Message Pattern
- Séparer la lecture série de l'envoi de commandes
- Files d'attente pour les commandes

### 3. State Machine
- États: Idle, Connected, Reading, Writing, Error
- Transitions entre états

### 4. Logging
- Enregistrer les données dans un fichier
- TDMS file ou CSV

### 5. Graphiques multiples
- XY Graph pour corrélations
- Intensity Graph pour heatmap

## Compatibilité LabVIEW 2021

Assurez-vous de :
- Utiliser les VIs natifs (pas de VIs tiers)
- Éviter les fonctions récentes (post-2021)
- Sauvegarder en version 2021 ou antérieure
- Tester sur LabVIEW 2021 avant soumission

## Checklist avant soumission

- [ ] VI s'ouvre correctement dans LabVIEW 2021
- [ ] Tous les contrôles et indicateurs sont visibles
- [ ] La connexion série fonctionne
- [ ] Les données sont reçues et affichées correctement
- [ ] Les commandes sont envoyées correctement
- [ ] Gestion des erreurs implémentée
- [ ] Bouton STOP fonctionne
- [ ] VI se ferme proprement
- [ ] Documentation intégrée (descriptions des contrôles)
- [ ] VI organisé et commenté
