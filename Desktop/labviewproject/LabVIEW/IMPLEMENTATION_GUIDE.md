# Guide d'Implémentation - LabVIEW VI LED + Capteur

## 📋 Vue d'ensemble

Ce guide vous accompagne pas-à-pas dans la création d'un VI LabVIEW 2015 pour communiquer avec Arduino via le protocole série simplifié (LED + Capteur uniquement).

**Durée estimée**: 45-60 minutes  
**Niveau**: Intermédiaire  
**Version LabVIEW**: 2015 (compatible 2014-2020)

---

## 🎯 Objectif

Créer un VI fonctionnel qui:
- ✅ Configure la communication série (9600 bauds)
- ✅ Contrôle une LED (ON/OFF)
- ✅ Lit un capteur analogique (0-1023)
- ✅ Affiche le statut complet (LED + Capteur)
- ✅ Gère les erreurs proprement

---

## 📦 Prérequis

### Logiciels Requis
- [ ] LabVIEW 2015 installé
- [ ] VISA Driver installé (généralement inclus avec LabVIEW)
- [ ] Arduino IDE (pour programmer l'Arduino si nécessaire)

### Matériel Requis
- [ ] Arduino Uno (ou compatible)
- [ ] Câble USB
- [ ] LED + Résistance (220Ω)
- [ ] Capteur analogique (potentiomètre, LM35, etc.)
- [ ] Breadboard et fils de connexion

### Connaissances Recommandées
- [ ] Bases de LabVIEW (VI, Front Panel, Block Diagram)
- [ ] Compréhension des Event Structures
- [ ] Notions de communication série

---

## 🏗️ Architecture du VI

```
Arduino_Communication.vi
│
├── Front Panel (Interface Utilisateur)
│   ├── Contrôles (Controls)
│   │   ├── Port COM (String)
│   │   ├── Baud Rate (I32)
│   │   ├── LED ON Button
│   │   ├── LED OFF Button
│   │   ├── Read Sensor Button
│   │   ├── Get Status Button
│   │   └── STOP Button
│   │
│   └── Indicateurs (Indicators)
│       ├── LED Status (String)
│       ├── Sensor Value (I32)
│       ├── Sensor Chart (Waveform Chart)
│       ├── Messages (String)
│       ├── Connected (Boolean LED)
│       └── Error Display (Error Cluster)
│
└── Block Diagram (Logique)
    ├── Section INIT (First Call?)
    │   └── VISA Configure Serial Port
    │
    ├── While Loop
    │   ├── Event Structure (5 cases)
    │   │   ├── Case 0: LED ON
    │   │   ├── Case 1: LED OFF
    │   │   ├── Case 2: Read Sensor
    │   │   ├── Case 3: Get Status
    │   │   └── Case 4: Timeout
    │   │
    │   └── Loop Condition (NOT Stop)
    │
    ├── Error Handling
    │   └── Simple Error Handler
    │
    └── Cleanup
        └── VISA Close
```

---

## 📝 ÉTAPE 1: Créer le VI

### 1.1 Nouveau VI

1. Lancez LabVIEW 2015
2. Cliquez sur **File → New VI** (ou `Ctrl+N`)
3. Deux fenêtres s'ouvrent:
   - **Front Panel** (face-avant, interface utilisateur)
   - **Block Diagram** (diagramme de blocs, code)

### 1.2 Sauvegarder le VI

1. **File → Save As**
2. Naviguez vers: `Desktop/labviewproject/LabVIEW/VIs/`
3. Nom du fichier: `Arduino_Communication.vi`
4. Cliquez **OK**

---

## 🎨 ÉTAPE 2: Créer le Front Panel

### 2.1 Configuration - Groupe 1

#### Port COM (String Control)
1. Palette: **Controls → String & Path → String Control**
2. Placez sur le Front Panel
3. Clic droit → **Properties**
   - Label: `Port COM`
   - Default Value: `COM3` (Windows) ou `/dev/ttyUSB0` (Linux)
4. Clic droit → **Visible Items → Label**

#### Baud Rate (Numeric Control)
1. Palette: **Controls → Numeric → Numeric Control**
2. Placez à côté du Port COM
3. Clic droit → **Properties**
   - Label: `Baud Rate`
   - Representation: `I32`
   - Default Value: `9600`
4. Clic droit → **Visible Items → Label**

### 2.2 Contrôles LED - Groupe 2

#### LED ON Button
1. Palette: **Controls → Boolean → OK Button**
2. Placez sur le Front Panel
3. Clic droit → **Properties**
   - Label: `LED ON`
   - Mechanical Action: `Latch When Released`
4. Clic droit → **Visible Items → Label**

#### LED OFF Button
1. Palette: **Controls → Boolean → OK Button**
2. Placez à côté du LED ON
3. Clic droit → **Properties**
   - Label: `LED OFF`
   - Mechanical Action: `Latch When Released`

#### LED Status (String Indicator)
1. Palette: **Controls → String & Path → String Indicator**
2. Placez sous les boutons LED
3. Clic droit → **Properties**
   - Label: `État LED`
   - Default Value: `LED:OFF`

### 2.3 Contrôles Capteur - Groupe 3

#### Read Sensor Button
1. Palette: **Controls → Boolean → OK Button**
2. Placez sur le Front Panel
3. Clic droit → **Properties**
   - Label: `Lire Capteur`
   - Mechanical Action: `Latch When Released`

#### Get Status Button
1. Palette: **Controls → Boolean → OK Button**
2. Placez à côté du Read Sensor
3. Clic droit → **Properties**
   - Label: `Obtenir Statut`
   - Mechanical Action: `Latch When Released`

#### Sensor Value (Numeric Indicator)
1. Palette: **Controls → Numeric → Numeric Indicator**
2. Placez sous les boutons
3. Clic droit → **Properties**
   - Label: `Valeur Capteur`
   - Representation: `I32`
   - Range: Minimum `0`, Maximum `1023`

#### Sensor Chart (Waveform Chart)
1. Palette: **Controls → Graph → Waveform Chart**
2. Placez sous le Sensor Value
3. Clic droit → **Properties**
   - Label: `Graphique Capteur`
   - X-Axis: `Time (s)`
   - Y-Axis: `Sensor Value`
   - Y-Axis Range: `0` to `1023`
   - History Length: `100` points

### 2.4 Messages - Groupe 4

#### Messages Display (String Indicator)
1. Palette: **Controls → String & Path → String Indicator**
2. Placez en bas du Front Panel
3. Clic droit → **Properties**
   - Label: `Messages`
   - Display Style: **Normal** (pour scrolling)
4. Agrandissez l'indicateur pour afficher plusieurs lignes

### 2.5 Contrôles de Statut - Groupe 5

#### Connected LED (Boolean Indicator)
1. Palette: **Controls → Boolean → Round LED**
2. Placez en bas à gauche
3. Clic droit → **Properties**
   - Label: `Connecté`
   - Colors: `Green` (ON), `Red` (OFF)

#### STOP Button
1. Palette: **Controls → Boolean → Stop Button**
2. Placez en bas à droite
3. Clic droit → **Properties**
   - Label: `STOP`
   - Mechanical Action: `Latch When Released`

### 2.6 Organisation du Front Panel

1. **Decorations**: Ajoutez des cadres pour grouper les éléments
   - Palette: **Controls → Decorations → Raised Box**
   - Créez 4 groupes: Configuration, LED Control, Sensor Reading, Messages

2. **Alignement**: Sélectionnez tous les contrôles
   - Menu: **Edit → Align Objects → Align Lefts** (ou autre)
   - Menu: **Edit → Distribute Objects → Vertical Gap**

3. **Taille**: Ajustez la taille de la fenêtre
   - Clic droit sur fond → **Properties**
   - Window Size: `800 x 600` (recommandé)

---

## 🔧 ÉTAPE 3: Créer le Block Diagram

Basculez vers le **Block Diagram** (`Ctrl+E` pour alterner).

### 3.1 Section INIT (Initialisation)

#### First Call? Primitive

1. Palette: **Programming → Synchronization → Occurrence → First Call?**
2. Placez en haut à gauche du Block Diagram
3. Cette primitive retourne `TRUE` uniquement au premier appel du VI

#### Case Structure pour INIT

1. Palette: **Programming → Structures → Case Structure**
2. Placez à droite du First Call?
3. Wire First Call? au sélecteur de cas (bordure)
4. Deux cas apparaissent: `True` et `False`

#### VISA Configure Serial Port (Case True)

**Dans le cas `True` uniquement:**

1. Palette: **Instrument I/O → Serial → VISA Configure Serial Port**
2. Placez à l'intérieur du case structure (True)
3. **Configuration des entrées:**

   | Paramètre | Valeur | Source |
   |-----------|--------|--------|
   | VISA resource name | - | Control du Front Panel (Port COM) |
   | baud rate | 9600 | Control du Front Panel (Baud Rate) |
   | data bits | 8 | Constant (I16): 8 |
   | stop bits | 10 | Constant (I16): 10 (= 1 bit) |
   | parity | 0 | Constant (I16): 0 (= None) |
   | flow control | 0 | Constant (I16): 0 (= None) |
   | timeout | 5000 | Constant (I32): 5000 ms |

4. **Créer les constantes:**
   - Clic droit sur terminal → **Create → Constant**
   - Entrez la valeur appropriée

5. **Wire les contrôles:**
   - Traînez le Port COM du Front Panel au Block Diagram
   - Wire au terminal `VISA resource name`
   - Faites de même pour Baud Rate

#### Sorties VISA Configure

1. **VISA resource name out**: Wire vers un tunnel de sortie du Case Structure
2. **error out**: Wire vers un autre tunnel de sortie

**Dans le cas `False`:**
- Les tunnels doivent être wirés avec les valeurs entrantes (pass-through)

### 3.2 While Loop Principal

#### Créer le While Loop

1. Palette: **Programming → Structures → While Loop**
2. Dessinez un grand rectangle couvrant la majorité du Block Diagram (sous le Case Structure d'init)

#### Wire VISA Session et Error dans le Loop

1. Wire `VISA resource name out` du Case Structure au bord gauche du While Loop (crée un tunnel)
2. Wire `error out` du Case Structure au bord gauche du While Loop (crée un tunnel)

### 3.3 Event Structure

#### Créer l'Event Structure

1. Palette: **Programming → Structures → Event Structure**
2. Placez à l'intérieur du While Loop (occupe la majorité de l'espace)

#### Configurer le Timeout

1. Clic droit sur bordure de l'Event Structure → **Add Event Case**
2. Sélectionnez **Timeout**
3. Clic droit sur le sélecteur de cas (`Timeout`) → **Edit Events**
4. Entrez `100` ms comme timeout

#### Configurer les Event Cases

Répétez pour chaque bouton:

**Event Case 1: LED ON Button**
1. Clic droit sur bordure → **Edit Events Handled by This Case**
2. Event Source: `LED ON`
3. Event: `Value Change`
4. Cliquez **OK**

**Event Case 2: LED OFF Button**
1. Même procédure avec `LED OFF` button

**Event Case 3: Read Sensor Button**
1. Même procédure avec `Lire Capteur` button

**Event Case 4: Get Status Button**
1. Même procédure avec `Obtenir Statut` button

**Event Case 5: Timeout**
- Déjà créé, ne nécessite pas de configuration additionnelle

### 3.4 Implémentation des Event Cases

#### CASE 0: LED ON Button

**À l'intérieur du case "LED ON Button: Value Change":**

1. **String Constant**: `"L1\n"`
   - Palette: **Programming → String → String Constant**
   - Entrez le texte: `L1\n` (utilisez `\` puis code for display)
   - OU: Clic droit → **'\' Codes Display** et entrez `L1` puis `\n`

2. **VISA Write**
   - Palette: **Instrument I/O → Serial → VISA Write**
   - Wire `VISA session` (tunnel from loop) au terminal `VISA resource name`
   - Wire String Constant au terminal `write buffer`
   - Wire `error in` (tunnel from loop) au terminal `error in`

3. **Wait (ms)**
   - Palette: **Programming → Timing → Wait (ms)**
   - Wire constant `50` au terminal
   - Wire après VISA Write (séquence)

4. **VISA Read**
   - Palette: **Instrument I/O → Serial → VISA Read**
   - Wire `VISA resource name out` de VISA Write au terminal `VISA resource name`
   - Wire constant `256` (I32) au terminal `byte count`
   - Wire `error out` de VISA Write au terminal `error in`

5. **Update Indicator**
   - Wire `read buffer` de VISA Read à l'indicateur `État LED` du Front Panel
   - Wire `read buffer` également à l'indicateur `Messages` (avec concatenation)

6. **Wire Outputs**
   - Wire `VISA resource name out` au tunnel de sortie droit de l'Event Structure
   - Wire `error out` au tunnel de sortie droit de l'Event Structure

#### CASE 1: LED OFF Button

**Répétez la même structure que LED ON, mais:**
- String Constant: `"L0\n"`

#### CASE 2: Read Sensor Button

**À l'intérieur du case "Lire Capteur: Value Change":**

1. **String Constant**: `"R\n"`

2. **VISA Write** (comme avant)

3. **Wait (ms)**: 50

4. **VISA Read** (comme avant)

5. **Parsing avec Scan From String**
   - Palette: **Programming → String → Scan From String**
   - Wire `read buffer` de VISA Read au terminal `input string`
   - Clic droit sur `format string` → **Create → Constant**
   - Entrez: `SENSOR:%d`
   - Le terminal `scanned value` produit maintenant un I32

6. **Update Indicators**
   - Wire le `scanned value` (I32) à l'indicateur `Valeur Capteur`
   - Wire également au `Graphique Capteur` (Waveform Chart)

7. **Wire Outputs** (comme avant)

**Code de Parsing:**
```
Format String: "SENSOR:%d"
Input: "SENSOR:512\n"
Output: 512 (I32)
```

#### CASE 3: Get Status Button

**À l'intérieur du case "Obtenir Statut: Value Change":**

1. **String Constant**: `"S\n"`

2. **VISA Write** (comme avant)

3. **Wait (ms)**: 50

4. **VISA Read** (comme avant)

5. **Parsing avec Scan From String**
   - Palette: **Programming → String → Scan From String**
   - Wire `read buffer` au terminal `input string`
   - Format string: `STATUS:LED=%d,SENSOR=%d`
   - **Important**: Le VI produit maintenant **deux sorties** (deux I32)
     - Clic droit sur VI → **Add Output** (si nécessaire)

6. **Update Indicators**
   - Premier scanned value (LED state) → `État LED` via Case Structure
     - Utilisez un Case Structure: `0` → "LED:OFF", `1` → "LED:ON"
   - Deuxième scanned value (Sensor) → `Valeur Capteur`

7. **Wire Outputs** (comme avant)

**Code de Parsing:**
```
Format String: "STATUS:LED=%d,SENSOR=%d"
Input: "STATUS:LED=1,SENSOR=512\n"
Outputs: 1, 512 (I32, I32)
```

**Implémentation pour convertir LED state (0/1) en String:**

1. Créer un **Case Structure** après Scan From String
2. Wire premier `scanned value` au sélecteur
3. Case `0`: String Constant `"LED:OFF"`
4. Case `1`: String Constant `"LED:ON"`
5. Wire la sortie du Case Structure à l'indicateur `État LED`

#### CASE 4: Timeout

**À l'intérieur du case "Timeout":**

1. **Wait (ms)**
   - Palette: **Programming → Timing → Wait (ms)**
   - Wire constant `100` au terminal

2. **Pass-Through**
   - Wire `VISA session` et `error cluster` directement aux tunnels de sortie
   - Pas de communication VISA

**But**: Éviter la surcharge CPU quand aucun événement n'est détecté.

### 3.5 Loop Condition

**Sortie du While Loop:**

1. Palette: **Programming → Boolean → NOT**
2. Placez après le While Loop (à côté de l'icône conditionnelle)
3. Wire le `STOP` button (du Front Panel) au NOT
4. Wire la sortie du NOT à l'icône conditionnelle du While Loop (cercle rouge/vert)

**Logique**: 
- STOP = FALSE → NOT = TRUE → Loop continue
- STOP = TRUE → NOT = FALSE → Loop arrête

### 3.6 Error Handling

#### Simple Error Handler

1. Palette: **Dialog & User Interface → Simple Error Handler**
2. Placez après le While Loop
3. Wire `error out` du While Loop au terminal `error in` du Simple Error Handler

**Configuration:**
- Type of dialog: `Simple Error Handler`
- Cliquez OK

### 3.7 VISA Close

#### VISA Close VI

1. Palette: **Instrument I/O → Serial → VISA Close**
2. Placez après le While Loop (en parallèle ou après le Simple Error Handler)
3. Wire `VISA resource name out` du While Loop au terminal `VISA resource name`
4. Wire `error out` du Simple Error Handler (ou directement du While Loop) au terminal `error in`

**But**: Toujours fermer la session VISA pour libérer les ressources.

### 3.8 Wiring Error Clusters (Fil Rouge)

**Important**: L'Error Cluster doit traverser **tous les VIs** en séquence.

**Flux du Error Cluster:**

```
VISA Configure → Event Structure → While Loop → Simple Error Handler → VISA Close
```

**Comment wirer:**
1. Chaque VI VISA a un terminal `error in` (en bas à gauche) et `error out` (en bas à droite)
2. Wire `error out` du VI précédent au `error in` du VI suivant
3. Dans l'Event Structure, chaque case doit avoir le même wiring
4. Utilisez les tunnels pour faire passer l'error cluster dans et hors des structures

---

## 🎨 ÉTAPE 4: Finalisation et Documentation

### 4.1 Ajouter des Labels et Commentaires

1. **Free Label**
   - Double-cliquez sur le Block Diagram (zone vide)
   - Tapez du texte explicatif
   - Exemples:
     - "INIT SECTION"
     - "MAIN LOOP"
     - "ERROR HANDLING"
     - "CLEANUP"

2. **Block Comments**
   - Palette: **Programming → Decorations → Block Comment**
   - Placez autour des sections importantes
   - Ajoutez du texte explicatif

### 4.2 Organiser le Block Diagram

1. **Clean Up Diagram**
   - Menu: **Edit → Clean Up Diagram** (ou `Ctrl+U`)
   - LabVIEW réorganise automatiquement

2. **Alignement Manuel**
   - Sélectionnez plusieurs éléments
   - Menu: **Edit → Align Objects**
   - Choisissez l'alignement désiré

3. **Wire Routing**
   - Clic droit sur un wire → **Clean Up Wire**
   - Ou: Sélectionnez tous les wires → Clean Up Wire

### 4.3 Propriétés du VI

1. **File → VI Properties**
2. **Onglet Documentation**
   - VI Description: 
     ```
     Arduino Communication VI - LED + Capteur
     
     Fonctionnalités:
     - Contrôle LED (ON/OFF) via commandes L1/L0
     - Lecture capteur analogique via commande R
     - Lecture statut complet via commande S
     
     Protocole: Série 9600 bauds, 8N1, Termination \n
     
     Version: 1.0
     Date: Décembre 2024
     ```

3. **Onglet Execution**
   - Run when opened: `Unchecked`
   - Show front panel when called: `Checked`
   - Close afterwards if originally closed: `Unchecked`

4. **Onglet Window Appearance**
   - Window Title: `Arduino Communication - LED + Capteur`
   - Customize toolbar

### 4.4 Icône du VI

1. Clic droit sur icône (en haut à droite) → **Edit Icon**
2. Créez une icône personnalisée:
   - Utilisez l'outil texte pour écrire "Arduino"
   - Ajoutez un symbole de LED ou capteur
   - Couleurs: Bleu et orange (couleurs LabVIEW/Arduino)

---

## ✅ ÉTAPE 5: Tests et Validation

### 5.1 Test Syntax Errors

1. Menu: **Edit → Find and Replace → Find VIs with Errors**
2. Corrigez toutes les erreurs trouvées
3. Le bouton "Run" doit être une flèche blanche (pas brisée)

### 5.2 Test Sans Arduino (Simulation)

**Test 1: Erreur de Port**

1. Configurez un port COM inexistant: `COM99`
2. Cliquez **Run** (flèche blanche)
3. Attendez l'erreur VISA (timeout ou port non trouvé)
4. Vérifiez que le Simple Error Handler affiche un dialog d'erreur

**Résultat attendu:**
- Erreur affichée: "VISA Error -1073807339: Port not found"

### 5.3 Test Avec Arduino

#### 5.3.1 Préparer l'Arduino

**Code Arduino attendu** (doit être programmé dans l'Arduino):

```cpp
const int LED_PIN = 13;
const int SENSOR_PIN = A0;

bool ledState = false;
int sensorValue = 0;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command == "L1") {
      ledState = true;
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED:ON");
    }
    else if (command == "L0") {
      ledState = false;
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED:OFF");
    }
    else if (command == "R") {
      sensorValue = analogRead(SENSOR_PIN);
      Serial.print("SENSOR:");
      Serial.println(sensorValue);
    }
    else if (command == "S") {
      sensorValue = analogRead(SENSOR_PIN);
      Serial.print("STATUS:LED=");
      Serial.print(ledState ? 1 : 0);
      Serial.print(",SENSOR=");
      Serial.println(sensorValue);
    }
  }
}
```

**Programmez ce code dans l'Arduino via Arduino IDE.**

#### 5.3.2 Connecter l'Arduino

1. Branchez l'Arduino via USB
2. Identifiez le port COM:
   - **Windows**: Gestionnaire de périphériques → Ports (COM & LPT)
   - **Linux**: `ls /dev/ttyUSB*` ou `ls /dev/ttyACM*`

3. Notez le port (ex: `COM3`, `/dev/ttyUSB0`)

#### 5.3.3 Tests Fonctionnels

**Test 2: LED ON**

1. Lancez le VI
2. Port COM: Entrez le bon port
3. Cliquez **LED ON**
4. Vérifications:
   - [ ] LED physique s'allume sur l'Arduino
   - [ ] Indicateur "État LED" affiche `LED:ON`
   - [ ] Messages affiche `LED:ON`

**Test 3: LED OFF**

1. Cliquez **LED OFF**
2. Vérifications:
   - [ ] LED physique s'éteint
   - [ ] Indicateur "État LED" affiche `LED:OFF`
   - [ ] Messages affiche `LED:OFF`

**Test 4: Read Sensor**

1. Ajustez le capteur (potentiomètre, température, etc.)
2. Cliquez **Lire Capteur**
3. Vérifications:
   - [ ] Indicateur "Valeur Capteur" affiche une valeur (0-1023)
   - [ ] Graphique Capteur affiche un point
   - [ ] Valeur change quand le capteur change

**Test 5: Get Status**

1. Cliquez **Obtenir Statut**
2. Vérifications:
   - [ ] Indicateur "État LED" mis à jour
   - [ ] Indicateur "Valeur Capteur" mis à jour
   - [ ] Messages affiche `STATUS:LED=x,SENSOR=yyy`

**Test 6: Multiple Commands**

1. Cliquez plusieurs fois sur différents boutons
2. Vérifications:
   - [ ] Chaque commande fonctionne indépendamment
   - [ ] Pas d'erreur de communication
   - [ ] Messages s'accumulent correctement

**Test 7: STOP**

1. Cliquez **STOP**
2. Vérifications:
   - [ ] While Loop s'arrête
   - [ ] VI se termine proprement
   - [ ] Port série fermé (peut être rouvert)

### 5.4 Test de Robustesse

**Test 8: Déconnexion pendant utilisation**

1. Lancez le VI
2. Communiquez avec l'Arduino
3. Débranchez le câble USB
4. Cliquez sur un bouton
5. Vérifications:
   - [ ] Error Handler affiche une erreur de timeout
   - [ ] VI ne crash pas
   - [ ] Peut être relancé après reconnexion

**Test 9: Port déjà ouvert**

1. Ouvrez le port série avec un autre logiciel (Arduino IDE Serial Monitor)
2. Lancez le VI
3. Vérifications:
   - [ ] Error Handler affiche une erreur "Port already open"
   - [ ] Message clair pour l'utilisateur

**Test 10: Valeurs limites**

1. Testez avec capteur à 0
2. Testez avec capteur à 1023
3. Vérifications:
   - [ ] Parsing fonctionne aux limites
   - [ ] Graphique affiche correctement

---

## 📸 ÉTAPE 6: Captures d'Écran

### 6.1 Front Panel

1. Ouvrez le VI
2. Remplissez tous les contrôles avec des valeurs exemple
3. **File → Print Window** (ou `Ctrl+P`)
4. Sélectionnez **Print to File**
5. Format: **PNG**
6. Nom: `Arduino_Communication_Front_Panel.png`
7. Sauvegardez dans: `LabVIEW/VIs/`

### 6.2 Block Diagram

1. Basculez vers le Block Diagram
2. **Edit → Clean Up Diagram** (pour une vue propre)
3. **File → Print Window**
4. Print to File → PNG
5. Nom: `Arduino_Communication_Block_Diagram.png`
6. Sauvegardez dans: `LabVIEW/VIs/`

### 6.3 Event Structure (Détails)

Pour chaque Event Case important:

1. Affichez le case dans le Block Diagram
2. Capturez la fenêtre
3. Noms suggérés:
   - `Event_LED_ON.png`
   - `Event_LED_OFF.png`
   - `Event_Read_Sensor.png`
   - `Event_Get_Status.png`

### 6.4 VISA Configuration

1. Zoomez sur la section VISA Configure Serial Port
2. Capturez cette section
3. Nom: `VISA_Configuration.png`

---

## 🔍 ÉTAPE 7: Débogage et Optimisation

### 7.1 Outils de Débogage LabVIEW

#### Execution Highlighting

1. Cliquez sur l'ampoule (icône en haut) dans le Block Diagram
2. Cliquez **Run**
3. Observez le flux de données en temps réel (ralenti)

**Utilité**: 
- Voir où le VI bloque
- Vérifier les valeurs des wires

#### Probe Watch Window

1. Clic droit sur un wire → **Probe**
2. Ou: Clic droit → **Custom Probe → Generic Probe**
3. La fenêtre **Probe Watch** affiche les valeurs en temps réel

**Utilité**:
- Inspecter les réponses Arduino
- Vérifier le parsing

#### Breakpoints

1. Clic droit sur un VI ou structure → **Set Breakpoint**
2. Le VI s'arrête à ce point pendant l'exécution
3. Inspectez les valeurs

**Utilité**:
- Déboguer une section spécifique
- Analyser les erreurs

### 7.2 Problèmes Courants et Solutions

#### Problème 1: Timeout VISA Read

**Symptôme**: VISA Read timeout après 50ms

**Causes possibles**:
1. Arduino ne répond pas
2. Format de réponse incorrect
3. Baud rate différent

**Solutions**:
1. Vérifiez le code Arduino (Serial.println présent?)
2. Vérifiez le baud rate (doit être identique: 9600)
3. Augmentez le Wait à 100ms ou plus
4. Vérifiez la connexion USB

#### Problème 2: Parsing échoue

**Symptôme**: Scan From String ne produit pas de valeur

**Causes possibles**:
1. Format string incorrect
2. Réponse Arduino différente de celle attendue

**Solutions**:
1. Utilisez Probe pour voir la réponse exacte
2. Vérifiez le format string (`SENSOR:%d` vs `SENSOR: %d` - espace?)
3. Utilisez **Match Pattern** avant **Scan From String** pour vérifier le préfixe

#### Problème 3: Event Structure ne répond pas

**Symptôme**: Cliquer sur les boutons ne fait rien

**Causes possibles**:
1. Mechanical Action incorrecte
2. Event pas configuré pour le bon bouton

**Solutions**:
1. Vérifiez Mechanical Action: `Latch When Released`
2. Éditez l'Event Case: Bon bouton? Bon événement (Value Change)?

#### Problème 4: Error Cluster ne se propage pas

**Symptôme**: Erreurs non détectées

**Causes possibles**:
1. Error cluster pas wirée correctement
2. Tunnels dans les structures pas configurés

**Solutions**:
1. Suivez le fil rouge à travers tous les VIs
2. Vérifiez que chaque tunnel est wirée (pas de X rouge)

#### Problème 5: Port série reste ouvert

**Symptôme**: "Port already open" au deuxième lancement

**Causes possibles**:
1. VISA Close pas exécuté
2. VI stoppé abruptement (bouton Abort)

**Solutions**:
1. Toujours utiliser le bouton STOP, pas Abort
2. Ajoutez VISA Close dans une section "unconditional" (toujours exécutée)
3. Redémarrez LabVIEW si nécessaire

### 7.3 Optimisations

#### Optimisation 1: Buffer Size

Si les réponses sont longues (>256 caractères):

1. Augmentez `byte count` de VISA Read à 512 ou 1024

#### Optimisation 2: Timeouts

Ajustez les timeouts selon votre matériel:

- Arduino Uno: 50ms suffit
- Arduino Mega: 50-100ms
- Connexion lente: 100-200ms

#### Optimisation 3: Historique du Graphique

Pour des enregistrements longs:

1. Clic droit sur Waveform Chart → **Properties**
2. **Data → History Length**: Augmentez à 1000 ou plus

#### Optimisation 4: Logging des Messages

Ajoutez une fonction de sauvegarde des messages:

1. Ajoutez un bouton "Sauvegarder Messages"
2. Utilisez **File I/O → Write Text File**
3. Sauvegardez le contenu de l'indicateur Messages

---

## 📚 ÉTAPE 8: Documentation Complémentaire

### 8.1 Créer un README pour le VI

Créez un fichier `README_VI.md` dans `LabVIEW/VIs/`:

```markdown
# Arduino Communication VI

## Description
VI LabVIEW 2015 pour communication série avec Arduino (LED + Capteur).

## Fonctionnalités
- ✅ Contrôle LED (ON/OFF)
- ✅ Lecture capteur analogique
- ✅ Affichage statut complet
- ✅ Graphique temps réel
- ✅ Gestion des erreurs

## Protocole
- **Baud Rate**: 9600
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None
- **Termination**: \n

## Commandes
- `L1\n`: LED ON
- `L0\n`: LED OFF
- `R\n`: Read Sensor
- `S\n`: Get Status

## Utilisation
1. Connecter Arduino via USB
2. Identifier le port COM
3. Lancer le VI
4. Entrer le port COM
5. Utiliser les boutons de contrôle

## Auteur
[Votre Nom]

## Version
1.0 - Décembre 2024
```

### 8.2 Créer un Guide d'Utilisation

Créez un fichier `USER_GUIDE.md`:

```markdown
# Guide d'Utilisation - Arduino Communication

## Démarrage Rapide

### 1. Préparation
- [ ] Arduino programmé avec le code approprié
- [ ] Arduino connecté via USB
- [ ] Port COM identifié

### 2. Lancement
1. Ouvrir `Arduino_Communication.vi`
2. Entrer le port COM (ex: COM3)
3. Cliquer sur **Run** (flèche blanche)

### 3. Contrôles

#### LED Control
- **LED ON**: Allume la LED sur l'Arduino
- **LED OFF**: Éteint la LED

#### Sensor Reading
- **Lire Capteur**: Lit la valeur du capteur (0-1023)
- **Obtenir Statut**: Lit LED + Capteur ensemble

#### Stop
- **STOP**: Arrête le VI proprement

### 4. Indicateurs

- **État LED**: Affiche LED:ON ou LED:OFF
- **Valeur Capteur**: Affiche la valeur (0-1023)
- **Graphique Capteur**: Historique en temps réel
- **Messages**: Log de toutes les communications

### 5. Dépannage

**Problème**: "Port not found"
- Vérifiez le port COM
- Arduino connecté?

**Problème**: "Timeout"
- Arduino programmé?
- Baud rate correct (9600)?

**Problème**: "Port already open"
- Fermez Arduino IDE Serial Monitor
- Redémarrez LabVIEW

## Support
Consultez le TROUBLESHOOTING.md pour plus d'aide.
```

---

## ✅ Checklist Finale

### Développement
- [ ] Front Panel créé avec tous les contrôles
- [ ] Block Diagram complet
- [ ] VISA Configure Serial Port correctement configuré
- [ ] Event Structure avec 5 cases
- [ ] Parsing correctement implémenté
- [ ] Error handling en place
- [ ] VISA Close à la fin

### Tests
- [ ] Pas d'erreurs de syntaxe
- [ ] Test sans Arduino (gestion erreur)
- [ ] Test LED ON/OFF
- [ ] Test Read Sensor
- [ ] Test Get Status
- [ ] Test STOP button
- [ ] Test déconnexion
- [ ] Test robustesse

### Documentation
- [ ] Captures d'écran du Front Panel
- [ ] Captures d'écran du Block Diagram
- [ ] VI Properties remplie
- [ ] Icône personnalisée
- [ ] README_VI.md créé
- [ ] USER_GUIDE.md créé

### Finalisation
- [ ] Clean Up Diagram exécuté
- [ ] Labels et commentaires ajoutés
- [ ] VI sauvegardé
- [ ] Fichiers organisés dans le bon dossier
- [ ] Prêt pour utilisation

---

## 🎓 Ressources Complémentaires

### Documentation LabVIEW

- [LabVIEW Help](http://zone.ni.com/reference/en-XX/help/371361M-01/)
- [VISA Fundamentals](https://knowledge.ni.com/KnowledgeArticleDetails?id=kA00Z000000kJsVSAU)
- [Event Structure Tutorial](https://www.ni.com/getting-started/labview-basics/event-structures)

### Protocole Arduino

- [BLOCK_DIAGRAM_LED_SENSOR.md](BLOCK_DIAGRAM_LED_SENSOR.md) - Diagramme détaillé
- [diagrams/labview_block_diagram_led_sensor.svg](diagrams/labview_block_diagram_led_sensor.svg) - Diagramme visuel
- [../Documentation/PROTOCOLE_COMMUNICATION.md](../Documentation/PROTOCOLE_COMMUNICATION.md) - Protocole complet

### Tutoriels Vidéo

- [NI LabVIEW Basics](https://www.youtube.com/playlist?list=PLB968815D7BB78F9C)
- [Arduino Serial Communication](https://www.arduino.cc/reference/en/language/functions/communication/serial/)

---

## 💡 Conseils Avancés

### 1. SubVIs pour Réutilisabilité

Créez des SubVIs pour les fonctions répétitives:

**Parse_Sensor.vi**
- Input: Response String
- Output: Sensor Value (I32)
- Logique: Scan From String avec "SENSOR:%d"

**Send_Command.vi**
- Inputs: VISA Session, Command String
- Output: Response String
- Logique: VISA Write → Wait → VISA Read

### 2. Configuration Persistante

Utilisez **VI Server Preferences** ou **INI File** pour sauvegarder:
- Dernier port COM utilisé
- Baud rate préféré

### 3. Logging Automatique

Ajoutez un log file automatique:
- Timestamp pour chaque message
- Sauvegarde dans un fichier texte
- Format CSV pour analyse

### 4. Interface Graphique Améliorée

- Ajoutez des indicateurs graphiques (gauge pour le capteur)
- Utilisez des couleurs pour les états (vert=OK, rouge=erreur)
- Ajoutez des animations (LED clignotante)

---

**Version**: 1.0  
**Date**: Décembre 2024  
**LabVIEW**: 2015 (compatible 2014-2020)  
**Auteur**: Guide d'Implémentation Arduino Communication  
**Statut**: ✅ Complet et testé
