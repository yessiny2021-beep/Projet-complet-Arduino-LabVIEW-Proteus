# Template LabVIEW Block Diagram - Pseudocode

## Structure globale

```
┌─────────────────────────────────────────────────────────────────┐
│                     MAIN WHILE LOOP                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INITIALIZATION (First Iteration Only)                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ [Port COM Control] → VISA Configure Serial Port    │  │  │
│  │  │                      - Baud: 9600                   │  │  │
│  │  │                      - Data Bits: 8                 │  │  │
│  │  │                      - Parity: None                 │  │  │
│  │  │                      - Stop Bits: 1                 │  │  │
│  │  │ → [VISA Resource Out] → [Shift Register]           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  READ SECTION (Every Iteration)                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ [VISA Resource] → VISA Read                         │  │  │
│  │  │                   - Byte Count: 100                 │  │  │
│  │  │                   - Term Char: \n                   │  │  │
│  │  │                   - Timeout: 1000ms                 │  │  │
│  │  │                   ↓                                 │  │  │
│  │  │                [String Data]                        │  │  │
│  │  │                   ↓                                 │  │  │
│  │  │            Scan From String                         │  │  │
│  │  │            Format: "T:%f,P:%d,B:%d"                 │  │  │
│  │  │                   ↓                                 │  │  │
│  │  │         [Temp] [Pot] [Button]                       │  │  │
│  │  │           ↓      ↓      ↓                           │  │  │
│  │  │      [Thermo] [Slide] [LED]                        │  │  │
│  │  │           ↓                                         │  │  │
│  │  │      [Chart] (append)                              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WRITE SECTION (Event Driven)                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ EVENT STRUCTURE                                     │  │  │
│  │  │                                                     │  │  │
│  │  │ Event 1: [Envoyer RGB] Value Change                │  │  │
│  │  │   [LED R] [LED G] [LED B]                          │  │  │
│  │  │      ↓       ↓       ↓                             │  │  │
│  │  │   Format String "LED:%d,%d,%d\n"                   │  │  │
│  │  │      ↓                                             │  │  │
│  │  │   VISA Write → [VISA Resource]                     │  │  │
│  │  │                                                     │  │  │
│  │  │ Event 2: [Déplacer Servo] Value Change            │  │  │
│  │  │   [Servo Position]                                 │  │  │
│  │  │      ↓                                             │  │  │
│  │  │   Format String "SERVO:%d\n"                       │  │  │
│  │  │      ↓                                             │  │  │
│  │  │   VISA Write → [VISA Resource]                     │  │  │
│  │  │                                                     │  │  │
│  │  │ Event 3: [Buzzer] Value Change                     │  │  │
│  │  │   [Buzzer State]                                   │  │  │
│  │  │      ↓                                             │  │  │
│  │  │   Format String "BUZZER:%d\n"                      │  │  │
│  │  │      ↓                                             │  │  │
│  │  │   VISA Write → [VISA Resource]                     │  │  │
│  │  │                                                     │  │  │
│  │  │ Event 4: Timeout (100ms)                           │  │  │
│  │  │   No action - continue loop                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ERROR HANDLING                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ [Error In] → Case Structure                        │  │  │
│  │  │              - True: Display error in [Error Text] │  │  │
│  │  │              - False: Continue normal operation    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Wait (ms) [100]                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Loop Condition: NOT [STOP Button]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CLEANUP (After Loop)                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ [VISA Resource] → VISA Close                           │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Détails d'implémentation

### 1. Shift Register pour VISA Resource
```
Left Terminal (Loop Start):  VISA Resource Name
Inside Loop:                 VISA Resource (maintained)
Right Terminal (Loop End):   VISA Resource (to Close)
```

### 2. Parsing des données reçues

**Option A: Scan From String**
```
Input String: "T:25.5,P:512,B:1\n"
Format String: "T:%f,P:%d,B:%d"
Outputs: 
  - Temperature (float)
  - Potentiometer (integer)
  - Button (integer)
```

**Option B: Match Pattern (plus robuste)**
```
Step 1: Match "T:" → Extract number → Temperature
Step 2: Match "P:" → Extract number → Potentiometer  
Step 3: Match "B:" → Extract number → Button
```

### 3. Envoi de commandes

**Méthode recommandée: Event Structure**
```
Event Structure timeout: 100ms

Events:
1. "Envoyer RGB" → Value Change
   Concatenate: "LED:" + R + "," + G + "," + B + "\n"
   VISA Write
   
2. "Déplacer Servo" → Value Change
   Concatenate: "SERVO:" + angle + "\n"
   VISA Write
   
3. "Buzzer" → Value Change
   Concatenate: "BUZZER:" + state + "\n"
   VISA Write
   
4. Timeout → Continue reading
```

### 4. Gestion des erreurs

**Simple Error Handler**
```
Error In → Case Structure
  True Case:
    - Display error message
    - Log to "Erreur" indicator
    - Optionally stop loop
  False Case:
    - Normal operation
    - Pass error out
```

### 5. First Call Flag

Pour initialiser une seule fois:
```
[First Call?] Boolean (False constant)
              ↓
         Shift Register
              ↓
    [True Case]: Initialize VISA
    [False Case]: Skip initialization
              ↓
         NOT gate → to Shift Register
```

## Fonctions LabVIEW nécessaires

### Palette "Instrument I/O → Serial → VISA"
- VISA Configure Serial Port
- VISA Read
- VISA Write
- VISA Close

### Palette "Programming → String"
- Scan From String
- Format Into String
- Concatenate Strings
- Match Pattern

### Palette "Programming → Numeric"
- Number To String
- String To Number

### Palette "Programming → Boolean"
- NOT
- AND
- OR

### Palette "Programming → Structures"
- While Loop
- Case Structure
- Event Structure
- Sequence Structure (si nécessaire)

### Palette "Programming → Timing"
- Wait (ms)

### Palette "Programming → Array"
- Build Array (pour le chart)

## Ordre de connexion recommandé

1. **Créer la While Loop**
2. **Ajouter le Shift Register** (right-click sur bord gauche de la loop)
3. **Placer VISA Configure Serial Port** avant/dans la loop (avec First Call)
4. **Placer VISA Read** dans la loop
5. **Ajouter le parsing** (Scan From String)
6. **Connecter aux indicateurs**
7. **Ajouter Event Structure** pour les commandes
8. **Ajouter VISA Write** dans chaque event
9. **Ajouter Wait (100ms)** dans la loop
10. **Connecter STOP button** à loop condition (avec NOT)
11. **Ajouter VISA Close** après la loop
12. **Ajouter Error Handling** partout

## Tips pour le diagramme

1. **Utiliser des labels** sur les fils pour clarté
2. **Aligner les blocs** pour meilleure lisibilité
3. **Éviter les fils qui se croisent**
4. **Utiliser des couleurs** pour différencier les types de données
5. **Ajouter des commentaires** (double-clic dans l'espace vide)
6. **Grouper les sections** avec des cadres décoratifs

## Exemples de code LabVIEW (textuel)

### Parsing avec Scan From String
```
Input: "T:25.5,P:512,B:1"
Format: "T:%f,P:%d,B:%d"
→ Outputs: [25.5] [512] [1]
```

### Formatage LED Command
```
Inputs: R=255, G=128, B=0
Format String: "LED:%d,%d,%d\n"
→ Output: "LED:255,128,0\n"
```

### Formatage Servo Command
```
Input: angle=90
Format String: "SERVO:%d\n"
→ Output: "SERVO:90\n"
```

## Configuration VISA détaillée

```
VISA Resource Name: "COM11" (ou selon votre système)
Baud Rate: 9600
Data Bits: 8
Parity: 0 (None)
  - 0 = None
  - 1 = Odd
  - 2 = Even
Stop Bits: 10 (1 stop bit)
  - 10 = 1 stop bit
  - 15 = 1.5 stop bits
  - 20 = 2 stop bits
Flow Control: 0 (None)
  - 0 = None
  - 1 = XON/XOFF
  - 2 = RTS/CTS
  - 3 = DTR/DSR
```

## Test et Debug

### Étapes de test:
1. **Test de connexion**: Vérifier que VISA Configure ne retourne pas d'erreur
2. **Test de lecture**: Afficher la string brute reçue
3. **Test de parsing**: Vérifier les valeurs extraites
4. **Test d'écriture**: Envoyer une commande et vérifier réception
5. **Test complet**: Boucle complète avec tous les composants

### Outils de debug:
- **Probe**: Right-click sur fil → Probe
- **Highlight Execution**: Ampoule en haut du diagramme
- **Breakpoint**: Clic sur bord du bloc
- **VI Analyzer**: Tools → VI Analyzer
