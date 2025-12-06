# Instructions LabVIEW 2015

## Configuration Initiale

### 1. Vérification de la Version

Ce projet nécessite **LabVIEW 2015** (version 15.0 ou supérieure).

Pour vérifier votre version :
1. Ouvrez LabVIEW
2. Allez dans **Help → About LabVIEW**
3. Vérifiez que la version est 2015 ou ultérieure

### 2. Modules Requis

- **NI-VISA** : Pour la communication série
- **LabVIEW Runtime Engine 2015** (minimum)

## Création du VI Principal

### Étape 1 : Nouveau Projet

1. Lancez LabVIEW 2015
2. Fichier → **New VI** (Ctrl+N)
3. Sauvegardez le VI : `Arduino_Communication.vi`

### Étape 2 : Face-Avant (Front Panel)

Ajoutez les contrôles suivants :

#### Contrôles

1. **Port Série** (String Control)
   - Label : "Port COM"
   - Valeur par défaut : "COM3" (Windows) ou "/dev/ttyUSB0" (Linux)

2. **Baud Rate** (Numeric Control)
   - Type : I32
   - Valeur par défaut : 9600

3. **Boutons de Contrôle**
   - **LED ON** : Boolean Button
   - **LED OFF** : Boolean Button
   - **Lire Capteur** : Boolean Button
   - **Obtenir Statut** : Boolean Button

4. **Bouton Stop** (Boolean)
   - Type : Stop Button
   - Mechanical Action : Latch When Released

#### Indicateurs

1. **État LED** (String Indicator)
   - Label : "État de la LED"

2. **Valeur Capteur** (Numeric Indicator)
   - Type : I32
   - Label : "Valeur du Capteur"
   - Range : 0 à 1023

3. **Messages** (String Indicator)
   - Label : "Messages Reçus"
   - Display Style : Scrolling

4. **Indicateur d'Erreur** (Error Cluster)

### Étape 3 : Diagramme de Blocs (Block Diagram)

#### Structure Principale : While Loop

1. Créez une **While Loop** pour la boucle principale
2. Connectez le bouton **Stop** à la condition d'arrêt

#### Configuration VISA

##### 1. VISA Configure Serial Port

```
Palette : Instrument I/O → Serial → VISA Configure Serial Port
```

Configuration :
- **VISA resource name** : Port COM (depuis le contrôle)
- **baud rate** : 9600
- **data bits** : 8
- **parity** : 0 (none)
- **stop bits** : 10 (1 bit)
- **flow control** : 0 (none)

##### 2. Structure Case

Créez une **Case Structure** avec les cas suivants :

**Cas 1 : LED ON**
```
VISA Write → Envoyer "L1\n"
VISA Read → Lire la réponse
Afficher dans "État LED"
```

**Cas 2 : LED OFF**
```
VISA Write → Envoyer "L0\n"
VISA Read → Lire la réponse
Afficher dans "État LED"
```

**Cas 3 : Lire Capteur**
```
VISA Write → Envoyer "R\n"
VISA Read → Lire la réponse "SENSOR:xxxx"
Extraire la valeur numérique
Afficher dans "Valeur Capteur"
```

**Cas 4 : Obtenir Statut**
```
VISA Write → Envoyer "S\n"
VISA Read → Lire la réponse complète
Parser et afficher les données
```

#### Traitement des Données

##### Extraction de la Valeur du Capteur

1. Utilisez **Match Pattern** pour extraire les chiffres
   - Pattern : "SENSOR:"
   - Extraire la substring après le pattern

2. Convertissez avec **Scan From String**
   - Format : "%d"
   - Type de sortie : I32

##### Gestion des Erreurs

1. Ajoutez un **Simple Error Handler**
2. Connectez tous les clusters d'erreur VISA
3. Affichez les erreurs dans l'indicateur d'erreur

### Étape 4 : Temporisation

Ajoutez un **Wait (ms)** dans la boucle principale :
- Valeur : 100 ms (pour éviter une surcharge CPU)

### Étape 5 : Fermeture VISA

Après la While Loop :
1. Ajoutez **VISA Close**
2. Connectez la référence VISA

## Diagramme de Blocs Simplifié

```
┌─────────────────────────────────────────────────────────┐
│               WHILE LOOP (Until Stop)                   │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │    VISA Configure Serial Port               │        │
│  │    - Port: Port COM Control                 │        │
│  │    - Baud: 9600                             │        │
│  └────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌────────────────────────────────────────────┐        │
│  │         CASE STRUCTURE                      │        │
│  │  Case 0: LED ON  → VISA Write "L1"         │        │
│  │  Case 1: LED OFF → VISA Write "L0"         │        │
│  │  Case 2: Read    → VISA Write "R"          │        │
│  │  Case 3: Status  → VISA Write "S"          │        │
│  └────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌────────────────────────────────────────────┐        │
│  │         VISA Read (256 bytes)               │        │
│  └────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌────────────────────────────────────────────┐        │
│  │    Parse Response & Update Indicators       │        │
│  └────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌────────────────────────────────────────────┐        │
│  │         Wait 100 ms                         │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
                        ↓
           ┌────────────────────────┐
           │    VISA Close           │
           └────────────────────────┘
```

## Configuration du Port Série

### Windows

1. Ouvrez le **Gestionnaire de périphériques**
2. Trouvez le port COM de l'Arduino (ex: COM3, COM4)
3. Utilisez ce nom dans LabVIEW

### Linux

1. Terminal : `ls /dev/ttyUSB* /dev/ttyACM*`
2. Trouvez le port (ex: /dev/ttyUSB0)
3. Donnez les permissions : `sudo chmod 666 /dev/ttyUSB0`

## Test du VI

### 1. Connexion

1. Connectez l'Arduino ou lancez la simulation Proteus
2. Sélectionnez le bon port COM
3. Exécutez le VI (Run)

### 2. Test des Commandes

1. Cliquez sur **LED ON** → Vérifiez que l'indicateur affiche "LED:ON"
2. Cliquez sur **LED OFF** → Vérifiez que l'indicateur affiche "LED:OFF"
3. Cliquez sur **Lire Capteur** → Vérifiez la valeur (0-1023)
4. Cliquez sur **Obtenir Statut** → Vérifiez le statut complet

### 3. Arrêt

1. Cliquez sur le bouton **Stop**
2. Le VI ferme automatiquement la connexion VISA

## Améliorations Possibles

### Fonctionnalités Avancées

1. **Graph en Temps Réel**
   - Ajoutez un Waveform Chart
   - Affichez l'évolution du capteur

2. **Enregistrement des Données**
   - Utilisez "Write to Spreadsheet File"
   - Sauvegardez les valeurs dans un fichier CSV

3. **Alarmes**
   - Ajoutez des seuils pour le capteur
   - Déclenchez des alertes visuelles/sonores

4. **Interface Améliorée**
   - Utilisez des LEDs virtuelles
   - Ajoutez des gauges pour le capteur
   - Personnalisez les couleurs et le design

## Dépannage

### Problème : "Error -1073807339" (Port COM non trouvé)

**Solution** :
1. Vérifiez que l'Arduino est connecté
2. Vérifiez le numéro du port COM
3. Fermez les autres programmes utilisant le port

### Problème : Pas de réponse de l'Arduino

**Solution** :
1. Vérifiez le baud rate (doit être 9600)
2. Vérifiez que le code Arduino est téléversé
3. Ouvrez le moniteur série Arduino pour tester

### Problème : Données corrompues

**Solution** :
1. Ajoutez un délai après VISA Write (10-50 ms)
2. Augmentez le timeout de VISA Read
3. Videz le buffer avant chaque lecture

## Ressources

- [NI-VISA Documentation](http://www.ni.com/visa/)
- [LabVIEW 2015 Help](http://zone.ni.com/reference/en-XX/help/371361M-01/)
- Template du diagramme : `BLOCK_DIAGRAM_TEMPLATE.md`

## Notes Importantes

⚠️ **Compatibilité** : Ce VI est conçu pour LabVIEW 2015. Si vous utilisez une version plus récente, le VI fonctionnera, mais si vous utilisez une version antérieure, vous devrez recréer le VI.

⚠️ **Port Série** : Assurez-vous de fermer correctement la connexion VISA pour éviter de bloquer le port.

⚠️ **Permissions Linux** : Sur Linux, vous devez avoir les permissions pour accéder au port série.
