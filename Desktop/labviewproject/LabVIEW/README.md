# Dossier LabVIEW 2015

## 📊 Diagrammes Disponibles

### 🎯 Documentation LED + Capteur (Protocole Simplifié)

**Nouveau!** Documentation complète pour le protocole simplifié LED + Capteur (L1, L0, R, S):

- **[BLOCK_DIAGRAM_LED_SENSOR.md](BLOCK_DIAGRAM_LED_SENSOR.md)** - Diagramme de blocs détaillé en ASCII art
  - Architecture complète du VI
  - Section INIT avec configuration VISA
  - Event Structure avec 5 cas (LED ON, LED OFF, Read Sensor, Get Status, Timeout)
  - Exemples de parsing avec "Scan From String"
  - Gestion des erreurs
  - Flux des données

- **[diagrams/labview_block_diagram_led_sensor.svg](diagrams/labview_block_diagram_led_sensor.svg)** - Diagramme visuel professionnel
  - Style LabVIEW authentique avec couleurs standards
  - Représentation graphique de toute l'architecture
  - Légende avec les commandes et réponses

- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Guide d'implémentation pas-à-pas
  - Instructions détaillées pour créer le VI dans LabVIEW 2015
  - Configuration VISA complète
  - Création de l'Event Structure
  - Code de parsing pour chaque type de réponse
  - Tests et validation
  - Dépannage et optimisations

**📝 Note importante**: Cette documentation correspond **exactement** au protocole Arduino actuel:
- **Commandes**: L1 (LED ON), L0 (LED OFF), R (Read Sensor), S (Get Status)
- **Réponses**: LED:ON, LED:OFF, SENSOR:xxxx, STATUS:LED=x,SENSOR=yyyy
- **Configuration**: 9600 bauds, 8 data bits, 1 stop bit, no parity, termination \n
- **Pas de SERVO, pas de BUZZER** - uniquement LED + Capteur

### 🔗 Protocole de Communication

Pour les détails complets du protocole série, consultez:
- [../Documentation/PROTOCOLE_COMMUNICATION.md](../Documentation/PROTOCOLE_COMMUNICATION.md)

---

## 📁 Structure du Dossier

```
LabVIEW/
├── README.md                          # Ce fichier
├── INSTRUCTIONS_LABVIEW.md            # Guide de création du VI
├── BLOCK_DIAGRAM_TEMPLATE.md          # Template du diagramme
│
├── BLOCK_DIAGRAM_LED_SENSOR.md        # ✨ Diagramme LED+Capteur détaillé (ASCII art)
├── IMPLEMENTATION_GUIDE.md            # ✨ Guide d'implémentation pas-à-pas
│
├── diagrams/                          # ✨ Diagrammes visuels
│   └── labview_block_diagram_led_sensor.svg  # Diagramme SVG professionnel
│
├── VIs/                               # 👈 CRÉER CE DOSSIER et placer vos fichiers .vi ici
│   ├── Arduino_Communication.vi       # VI principal
│   ├── Arduino_Communication.vi.png   # Capture du VI (optionnel)
│   └── SubVIs/                        # Sous-VIs si nécessaire
│       ├── Parse_Sensor.vi
│       ├── Parse_Status.vi
│       └── Send_Command.vi
│
├── Examples/                          # 👈 Exemples (optionnel)
│   ├── Simple_LED_Control.vi
│   ├── Sensor_Reading.vi
│   └── Data_Logger.vi
│
└── Libraries/                         # 👈 Bibliothèques personnalisées (optionnel)
    └── Arduino_Serial.lvlib
```

## 📋 Où placer vos fichiers

### 1. VI Principal
**Emplacement** : `LabVIEW/VIs/Arduino_Communication.vi`

```bash
# Créer le dossier
mkdir -p LabVIEW/VIs

# Placer votre VI principal ici
# Fichier : Arduino_Communication.vi
```

### 2. Captures d'écran (recommandé)
**Emplacement** : `LabVIEW/VIs/`

Capturez votre interface :
- `Arduino_Communication_Front_Panel.png`
- `Arduino_Communication_Block_Diagram.png`

### 3. Sous-VIs (si utilisés)
**Emplacement** : `LabVIEW/VIs/SubVIs/`

```bash
mkdir -p LabVIEW/VIs/SubVIs
```

### 4. Exemples (optionnel)
**Emplacement** : `LabVIEW/Examples/`

```bash
mkdir -p LabVIEW/Examples
```

## 🎯 Fichiers à Créer dans LabVIEW 2015

### VI Principal : Arduino_Communication.vi

**Créer le VI** :
1. Ouvrez LabVIEW 2015
2. File → New VI (Ctrl+N)
3. Créez l'interface selon `INSTRUCTIONS_LABVIEW.md`
4. Sauvegardez dans : `LabVIEW/VIs/Arduino_Communication.vi`

**Front Panel (Face-Avant)** :
```
┌─────────────────────────────────────────────────────────┐
│        Arduino Communication - LabVIEW 2015             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Port COM: [COM3        ▼]   Baud: [9600 ]             │
│                                                          │
│  ┌──────────── Contrôles ────────────┐                 │
│  │  [LED ON]   [LED OFF]             │                 │
│  │  [Lire Capteur]  [Obtenir Statut] │                 │
│  └───────────────────────────────────┘                 │
│                                                          │
│  État LED: [LED:OFF               ]                     │
│                                                          │
│  Valeur Capteur: [512  ]                                │
│  ┌────────────────────────┐                            │
│  │   [Graph Temps Réel]   │                            │
│  │                        │                            │
│  └────────────────────────┘                            │
│                                                          │
│  Messages: [SENSOR:512\nLED:ON\n      ]                │
│                                                          │
│  [●] Connecté              [STOP]                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Sous-VIs Recommandés

#### 1. Parse_Sensor.vi
**Fonction** : Extraire la valeur numérique de "SENSOR:xxx"

**Entrées** :
- Response String (String)

**Sorties** :
- Sensor Value (I32)
- Error Out (Error Cluster)

**Emplacement** : `LabVIEW/VIs/SubVIs/Parse_Sensor.vi`

#### 2. Parse_Status.vi
**Fonction** : Analyser "STATUS:LED=x,SENSOR=yyy"

**Entrées** :
- Status String (String)

**Sorties** :
- LED State (Boolean)
- Sensor Value (I32)
- Error Out (Error Cluster)

**Emplacement** : `LabVIEW/VIs/SubVIs/Parse_Status.vi`

#### 3. Send_Command.vi
**Fonction** : Envoyer commande et recevoir réponse

**Entrées** :
- VISA Session (VISA Resource)
- Command (String)

**Sorties** :
- Response (String)
- Error Out (Error Cluster)

**Emplacement** : `LabVIEW/VIs/SubVIs/Send_Command.vi`

## 📸 Captures d'Écran à Générer

### Pour la Documentation

1. **Front Panel** (Face-Avant)
   - Fichier : `Arduino_Communication_Front_Panel.png`
   - Montrer tous les contrôles
   - Montrer des valeurs exemple

2. **Block Diagram** (Diagramme de Blocs)
   - Fichier : `Arduino_Communication_Block_Diagram.png`
   - Vue d'ensemble du diagramme
   - Highlight la structure While Loop

3. **VISA Configuration**
   - Fichier : `VISA_Configuration.png`
   - Montrer les paramètres VISA

4. **Event Structure**
   - Fichier : `Event_Structure.png`
   - Montrer les différents cas

### Comment Capturer

```
Dans LabVIEW :
1. Allez dans Edit → Make Current Values Default
2. File → Print Window (Ctrl+P)
3. Sélectionnez "Print to File"
4. Format : PNG
5. Sauvegardez dans LabVIEW/VIs/
```

## 🔄 Workflow de Développement

### Phase 1 : Création
```bash
cd /home/yessin/Desktop/labviewproject/LabVIEW

# Créer les dossiers
mkdir -p VIs/SubVIs
mkdir -p Examples
mkdir -p Libraries
```

### Phase 2 : Développement LabVIEW
1. Ouvrir LabVIEW 2015
2. Créer le VI selon `INSTRUCTIONS_LABVIEW.md`
3. Sauvegarder dans `VIs/Arduino_Communication.vi`
4. Tester avec Proteus ou Arduino

### Phase 3 : Documentation
1. Capturer Front Panel → `VIs/Front_Panel.png`
2. Capturer Block Diagram → `VIs/Block_Diagram.png`
3. Mettre à jour README si besoin

### Phase 4 : Validation
```bash
# Vérifier que tout est en place
ls -la VIs/

# Devrait afficher :
# Arduino_Communication.vi
# Front_Panel.png
# Block_Diagram.png
```

### Phase 5 : Git
```bash
# Ajouter les fichiers
git add LabVIEW/VIs/

# Commit
git commit -m "✨ Ajout du VI LabVIEW 2015 principal"

# Push
git push origin main
```

## ⚠️ Important - Fichiers .vi et Git

### Problème : Fichiers Binaires
Les fichiers `.vi` sont binaires, Git ne peut pas faire de diff/merge.

### Solution : LFS (Large File Storage) - Recommandé

```bash
# Installer Git LFS
sudo apt-get install git-lfs

# Initialiser
git lfs install

# Configurer pour .vi
git lfs track "*.vi"
git lfs track "*.lvproj"
git lfs track "*.lvlib"

# Ajouter .gitattributes
git add .gitattributes
git commit -m "📦 Configuration Git LFS pour fichiers LabVIEW"
```

### Alternative : Sans LFS

Si vous ne pouvez pas utiliser LFS :
```bash
# Ajoutez simplement les fichiers normalement
git add LabVIEW/VIs/*.vi
git commit -m "✨ Ajout VIs LabVIEW"
```

⚠️ **Attention** : Sans LFS, le repository grossira rapidement.

## 📊 Checklist Finale

### Avant de Pusher

- [ ] VI principal créé : `VIs/Arduino_Communication.vi`
- [ ] VI teste et fonctionne
- [ ] Captures d'écran ajoutées
- [ ] Code commenté dans le VI (description)
- [ ] Git LFS configuré (recommandé)
- [ ] Fichiers ajoutés au git

### Structure Minimale Requise
```
LabVIEW/
├── README.md                    ✅
├── INSTRUCTIONS_LABVIEW.md      ✅
├── BLOCK_DIAGRAM_TEMPLATE.md    ✅
└── VIs/
    ├── Arduino_Communication.vi ⬅️ VOTRE VI ICI
    ├── Front_Panel.png          ⬅️ CAPTURE
    └── Block_Diagram.png        ⬅️ CAPTURE
```

## 📝 Exemple de Commit

```bash
# Créer la structure
mkdir -p LabVIEW/VIs/SubVIs
mkdir -p LabVIEW/Examples

# Après avoir créé vos VIs dans LabVIEW 2015...

# Ajouter au git
git add LabVIEW/VIs/
git add LabVIEW/README.md

# Commit avec message descriptif
git commit -m "✨ Ajout VI principal Arduino Communication

- Interface complète avec contrôles LED
- Lecture capteur analogique
- Communication VISA configurée @ 9600 bauds
- Gestion erreurs implémentée
- Captures d'écran ajoutées"

# Push
git push origin main
```

## 🎓 Ressources

- [Instructions LabVIEW](INSTRUCTIONS_LABVIEW.md)
- [Template Diagramme](BLOCK_DIAGRAM_TEMPLATE.md)
- [Documentation Complète](../Documentation/GUIDE_COMPLET.md)
- [LabVIEW 2015 Help](http://zone.ni.com/reference/en-XX/help/371361M-01/)

## 💡 Conseils

1. **Sauvegardez souvent** : LabVIEW peut crasher
2. **Testez progressivement** : Validez chaque fonctionnalité
3. **Commentez votre code** : Description du VI, légendes, etc.
4. **Versioning** : Commit après chaque fonctionnalité majeure
5. **Captures** : Prenez des screenshots pour la doc

## 🚀 Prochaines Étapes

1. Créer les dossiers : `mkdir -p LabVIEW/VIs/SubVIs`
2. Ouvrir LabVIEW 2015
3. Suivre [INSTRUCTIONS_LABVIEW.md](INSTRUCTIONS_LABVIEW.md)
4. Créer et sauvegarder le VI
5. Tester avec Arduino/Proteus
6. Capturer les screenshots
7. Commiter et pusher

---

**Version** : LabVIEW 2015  
**Date** : Décembre 2025  
**Statut** : ✅ Prêt pour développement
