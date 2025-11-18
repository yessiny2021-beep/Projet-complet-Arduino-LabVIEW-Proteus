# Protocole de Communication Série
## Arduino ↔ LabVIEW

---

## Configuration Matérielle

### Paramètres UART
| Paramètre | Valeur |
|-----------|--------|
| **Baud Rate** | 9600 bps |
| **Data Bits** | 8 bits |
| **Stop Bits** | 1 bit |
| **Parity** | None |
| **Flow Control** | None (Aucun) |
| **Termination** | Line Feed (\n, 0x0A) |

### Configuration LabVIEW VISA
```
VISA Configure Serial Port:
  - Baud Rate: 9600
  - Data Bits: 8
  - Parity: 0 (None)
  - Stop Bits: 10 (1 stop bit)
  - Flow Control: 0 (None)
```

### Configuration Arduino Serial
```cpp
Serial.begin(9600);
```

---

## Direction 1 : Arduino → LabVIEW (Télémétrie)

### Format général
```
T:<temp>,P:<pot>,B:<btn>\n
```

### Description des champs
| Champ | Type | Description | Plage | Unité |
|-------|------|-------------|-------|-------|
| **T** | Float | Température du LM35 | 0.0 - 100.0 | °C |
| **P** | Integer | Valeur du potentiomètre | 0 - 1023 | ADC |
| **B** | Integer | État du bouton | 0 ou 1 | Boolean |

### Exemples de messages
```
T:25.5,P:512,B:0\n     # Température 25.5°C, Pot à 50%, Bouton relâché
T:30.2,P:1023,B:1\n    # Température 30.2°C, Pot au max, Bouton pressé
T:18.0,P:0,B:0\n       # Température 18.0°C, Pot au min, Bouton relâché
```

### Fréquence d'envoi
- **Intervalle** : 100 ms (10 messages/seconde)
- **Timing** : Contrôlé par `millis()` dans Arduino

### Code Arduino (Envoi)
```cpp
void readSensorsAndSend() {
  // Lecture température LM35 (10mV/°C)
  int tempReading = analogRead(TEMP_PIN);
  temperature = (tempReading * 5.0 * 100.0) / 1024.0;
  
  // Lecture potentiomètre
  potValue = analogRead(POT_PIN);
  
  // Lecture bouton (inversé car INPUT_PULLUP)
  buttonState = !digitalRead(BUTTON_PIN);
  
  // Envoi formaté
  Serial.print("T:");
  Serial.print(temperature, 1);  // 1 décimale
  Serial.print(",P:");
  Serial.print(potValue);
  Serial.print(",B:");
  Serial.println(buttonState);   // println ajoute \n
}
```

### Code LabVIEW (Réception)
```
VISA Read (100 bytes, Term Char \n)
  ↓
Scan From String ("T:%f,P:%d,B:%d")
  ↓
[Temperature] [Potentiometer] [Button]
  ↓
Update Indicators
```

---

## Direction 2 : LabVIEW → Arduino (Commandes)

### 2.1 Commande LED RGB

#### Format
```
LED:<R>,<G>,<B>\n
```

#### Description
| Paramètre | Type | Description | Plage |
|-----------|------|-------------|-------|
| **R** | Integer | Intensité rouge | 0 - 255 |
| **G** | Integer | Intensité verte | 0 - 255 |
| **B** | Integer | Intensité bleue | 0 - 255 |

#### Exemples
```
LED:255,0,0\n      # Rouge pur (100%)
LED:0,255,0\n      # Vert pur (100%)
LED:0,0,255\n      # Bleu pur (100%)
LED:255,255,0\n    # Jaune (Rouge + Vert)
LED:255,0,255\n    # Magenta (Rouge + Bleu)
LED:0,255,255\n    # Cyan (Vert + Bleu)
LED:255,255,255\n  # Blanc (toutes les couleurs)
LED:128,128,128\n  # Gris (50%)
LED:0,0,0\n        # Éteint
```

#### Code Arduino (Réception)
```cpp
void controlLED(String values) {
  int firstComma = values.indexOf(',');
  int secondComma = values.indexOf(',', firstComma + 1);
  
  if (firstComma > 0 && secondComma > 0) {
    redValue = values.substring(0, firstComma).toInt();
    greenValue = values.substring(firstComma + 1, secondComma).toInt();
    blueValue = values.substring(secondComma + 1).toInt();
    
    // Limitation 0-255
    redValue = constrain(redValue, 0, 255);
    greenValue = constrain(greenValue, 0, 255);
    blueValue = constrain(blueValue, 0, 255);
    
    // Application PWM
    analogWrite(LED_RED_PIN, redValue);
    analogWrite(LED_GREEN_PIN, greenValue);
    analogWrite(LED_BLUE_PIN, blueValue);
    
    Serial.println("ACK:LED");
  }
}
```

#### Code LabVIEW (Envoi)
```
[LED R] [LED G] [LED B]
  ↓       ↓       ↓
Format String ("LED:%d,%d,%d\n")
  ↓
VISA Write
```

---

### 2.2 Commande Servo Moteur

#### Format
```
SERVO:<angle>\n
```

#### Description
| Paramètre | Type | Description | Plage |
|-----------|------|-------------|-------|
| **angle** | Integer | Position angulaire | 0 - 180 |

#### Exemples
```
SERVO:0\n      # Position minimale (0°)
SERVO:90\n     # Position centrale (90°)
SERVO:180\n    # Position maximale (180°)
SERVO:45\n     # Position à 45°
SERVO:135\n    # Position à 135°
```

#### Code Arduino (Réception)
```cpp
void controlServo(String angle) {
  servoPosition = angle.toInt();
  servoPosition = constrain(servoPosition, 0, 180);
  myServo.write(servoPosition);
  Serial.println("ACK:SERVO");
}
```

#### Code LabVIEW (Envoi)
```
[Servo Position]
  ↓
Format String ("SERVO:%d\n")
  ↓
VISA Write
```

---

### 2.3 Commande Buzzer

#### Format
```
BUZZER:<state>\n
```

#### Description
| Paramètre | Type | Description | Valeurs |
|-----------|------|-------------|---------|
| **state** | Integer | État du buzzer | 0 (OFF) ou 1 (ON) |

#### Exemples
```
BUZZER:0\n     # Éteindre le buzzer
BUZZER:1\n     # Allumer le buzzer
```

#### Code Arduino (Réception)
```cpp
void controlBuzzer(String state) {
  int buzzerState = state.toInt();
  digitalWrite(BUZZER_PIN, buzzerState);
  Serial.println("ACK:BUZZER");
}
```

#### Code LabVIEW (Envoi)
```
[Buzzer Switch]
  ↓
Format String ("BUZZER:%d\n")
  ↓
VISA Write
```

---

### 2.4 Commande Status

#### Format
```
STATUS\n
```

#### Description
Demande le status complet de l'Arduino (tous les capteurs et actionneurs).

#### Réponse Arduino
```
STATUS:LED(R,G,B),SERVO(angle),TEMP(temp),POT(pot),BTN(btn)\n
```

#### Exemple
```
Commande: STATUS\n
Réponse: STATUS:LED(255,128,0),SERVO(90),TEMP(25.5),POT(512),BTN(0)\n
```

#### Code Arduino (Réception)
```cpp
void sendStatus() {
  Serial.print("STATUS:LED(");
  Serial.print(redValue);
  Serial.print(",");
  Serial.print(greenValue);
  Serial.print(",");
  Serial.print(blueValue);
  Serial.print("),SERVO(");
  Serial.print(servoPosition);
  Serial.print("),TEMP(");
  Serial.print(temperature);
  Serial.print("),POT(");
  Serial.print(potValue);
  Serial.print("),BTN(");
  Serial.print(buttonState);
  Serial.println(")");
}
```

---

## Réponses Arduino (Accusés de réception)

### Format général
```
ACK:<command>\n
```

### Types d'ACK
| Commande | Réponse | Signification |
|----------|---------|---------------|
| LED:... | ACK:LED\n | LED mise à jour |
| SERVO:... | ACK:SERVO\n | Servo déplacé |
| BUZZER:... | ACK:BUZZER\n | Buzzer modifié |

### Utilisation dans LabVIEW
Les ACK peuvent être lus pour confirmer la bonne réception des commandes.

```
VISA Write ("LED:255,0,0\n")
  ↓
Wait (50ms)
  ↓
VISA Read
  ↓
Verify: "ACK:LED\n"
```

---

## Gestion des erreurs

### Timeout
- **LabVIEW VISA Read** : 1000ms
- **Action** : Si timeout, afficher erreur et continuer

### Messages corrompus
- **Vérification** : Parser le format attendu
- **Action** : Ignorer et attendre le prochain message

### Buffer overflow
- **Prevention** : Vider le buffer avant lecture
- **Code LabVIEW** : VISA Flush I/O Buffer

### Déconnexion
- **Détection** : Erreur VISA ou timeout répétés
- **Action** : Afficher erreur, fermer VISA, permettre reconnexion

---

## Séquence de communication typique

### Initialisation
```
1. LabVIEW ouvre le port série
2. Arduino envoie données périodiques (100ms)
3. LabVIEW commence à recevoir
```

### Fonctionnement normal
```
Cycle répété toutes les 100ms:

Arduino → LabVIEW:  "T:25.5,P:512,B:0\n"
  ↓
LabVIEW mise à jour l'affichage
  ↓
Si commande utilisateur:
  LabVIEW → Arduino: "LED:255,128,0\n"
  ↓
  Arduino → LabVIEW: "ACK:LED\n"
```

### Fermeture
```
1. LabVIEW envoie éventuellement commandes de repos
2. LabVIEW ferme le port série (VISA Close)
3. Arduino continue d'envoyer (mais personne n'écoute)
```

---

## Timing et synchronisation

### Diagramme temporel

```
Temps (ms)    Arduino                    LabVIEW
─────────────────────────────────────────────────────
0             Envoi données
              "T:25.5,P:512,B:0"
10                                       Réception
                                         Parsing
                                         Affichage
50                                       Commande user
                                         Envoi "LED:..."
60            Réception "LED:..."
              Traitement
              Envoi "ACK:LED"
70                                       Réception ACK
100           Envoi données
              "T:25.6,P:510,B:0"
110                                      Réception
...
```

---

## Optimisations possibles

### 1. Compression des données
```
Actuel:  "T:25.5,P:512,B:0\n"  (19 bytes)
Binaire: [0x19][0xFF][0x02][0x00]  (4 bytes)
```

### 2. Checksum
```
Format: "T:25.5,P:512,B:0*C7\n"
où C7 est le checksum XOR de tous les bytes
```

### 3. Message ID
```
Format: "#123:T:25.5,P:512,B:0\n"
où 123 est un numéro de séquence
```

### 4. Protocole binaire
```
[STX][ID][LEN][DATA...][CHECKSUM][ETX]
0x02  0x01 0x06 25.5,512,0  0xXX   0x03
```

---

## Tests et validation

### Test 1 : Communication unidirectionnelle (Arduino → LabVIEW)
```
1. Lancer simulation Proteus
2. Ouvrir Virtual Terminal dans Proteus
3. Vérifier format des messages reçus
4. Vérifier fréquence (100ms entre messages)
```

### Test 2 : Communication unidirectionnelle (LabVIEW → Arduino)
```
1. Depuis Virtual Terminal, envoyer: "LED:255,0,0\n"
2. Vérifier LED rouge dans Proteus
3. Vérifier réception "ACK:LED\n"
```

### Test 3 : Communication bidirectionnelle
```
1. Lancer LabVIEW
2. Connecter au port série
3. Vérifier affichage des capteurs
4. Tester chaque commande d'actionneur
5. Vérifier stabilité sur 5 minutes
```

### Test 4 : Robustesse
```
1. Envoyer commandes invalides
2. Déconnecter/reconnecter
3. Saturer le buffer
4. Vérifier gestion d'erreurs
```

---

## Référence rapide

### Messages Arduino → LabVIEW
| Message | Fréquence | Description |
|---------|-----------|-------------|
| `T:25.5,P:512,B:0\n` | 100ms | Données capteurs |
| `ACK:LED\n` | Sur commande | Confirmation LED |
| `ACK:SERVO\n` | Sur commande | Confirmation Servo |
| `ACK:BUZZER\n` | Sur commande | Confirmation Buzzer |
| `STATUS:...\n` | Sur demande | Status complet |

### Messages LabVIEW → Arduino
| Message | Déclencheur | Description |
|---------|-------------|-------------|
| `LED:R,G,B\n` | Bouton user | Contrôle RGB |
| `SERVO:angle\n` | Bouton user | Position servo |
| `BUZZER:state\n` | Switch user | Buzzer ON/OFF |
| `STATUS\n` | Bouton user | Demande status |

---

**Ce protocole garantit une communication fiable et extensible entre Arduino et LabVIEW.**
