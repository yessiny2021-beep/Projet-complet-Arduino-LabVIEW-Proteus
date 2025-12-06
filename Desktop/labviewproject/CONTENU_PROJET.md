# Contenu du Projet Arduino - LabVIEW 2015

## 📁 Structure Complète

```
labviewproject/
│
├── 📄 README.md                           # Vue d'ensemble du projet
├── 📄 BIENVENUE.md                        # Guide de bienvenue
├── 📄 QUICK_START.md                      # Démarrage rapide
├── 📄 RUN_GUIDE.md                        # Guide d'exécution
├── 📄 START_HERE.md                       # Point de départ
├── 📄 INDEX.md                            # Index de navigation
│
├── 🔧 Scripts d'Installation
│   ├── install_dependencies.sh            # Installation des dépendances
│   ├── install_arduino_library.sh         # Bibliothèques Arduino
│   ├── install_wine_proteus.sh            # Wine pour Proteus
│   ├── telecharger_proteus.sh             # Téléchargement Proteus
│   └── check_system.sh                    # Vérification système
│
├── 🚀 Scripts d'Exécution
│   ├── run_project.sh                     # Compilation Arduino
│   ├── start_project.sh                   # Lancement complet
│   ├── launch_proteus.sh                  # Lancement Proteus
│   ├── launch_simulation.sh               # Lancement simulation
│   ├── choisir_simulateur.sh              # Choix du simulateur
│   └── monitor_install.sh                 # Monitoring installation
│
├── 📚 Documentation Guides
│   ├── INSTALL_PROTEUS.md                 # Installation Proteus
│   ├── GUIDE_INSTALLATION_PROTEUS_8.9.md  # Guide Proteus 8.9
│   ├── GUIDE_INSTALLATION_VISUEL.txt      # Installation visuelle
│   ├── TELECHARGEMENT_PROTEUS.md          # Téléchargement Proteus
│   ├── GUIDE_VISUEL.md                    # Guide avec images
│   ├── GUIDE_VIDEO.md                     # Guides vidéo
│   ├── GITHUB_PUSH_GUIDE.md               # Guide Git
│   ├── push_to_github.sh                  # Script push Git
│   ├── CHECKLIST_SOUMISSION.md            # Checklist finale
│   └── POUR_ENSEIGNANT.md                 # Documentation enseignant
│
├── 🔌 Arduino/
│   ├── arduino_labview_communication.ino.eep
│   └── arduino_labview_communication/
│       └── arduino_labview_communication.ino  # Code Arduino principal
│
├── 🖥️ LabVIEW/
│   ├── INSTRUCTIONS_LABVIEW.md            # Guide LabVIEW 2015
│   └── BLOCK_DIAGRAM_TEMPLATE.md          # Template diagramme
│
├── 🔬 Proteus/
│   ├── INSTRUCTIONS_PROTEUS.md            # Instructions Proteus
│   └── COMPOSANTS_REFERENCE.md            # Référence composants
│
├── 📖 Documentation/
│   ├── GUIDE_COMPLET.md                   # Documentation complète
│   ├── PROTOCOLE_COMMUNICATION.md         # Protocole série
│   ├── COMPILATION_HEX.md                 # Compilation Arduino
│   └── TROUBLESHOOTING.md                 # Dépannage
│
└── 🛠️ bin/
    └── arduino-cli                        # Outil de compilation
```

## 📋 Description des Composants

### 1. Code Arduino

**Fichier** : `Arduino/arduino_labview_communication/arduino_labview_communication.ino`

**Fonctionnalités** :
- Communication série @ 9600 bauds
- Contrôle de LED (pin 13)
- Lecture capteur analogique (pin A0)
- Protocole de commandes textuelles
- Réponses formatées

**Commandes supportées** :
- `L1` → Allumer LED
- `L0` → Éteindre LED
- `R` → Lire capteur
- `S` → Statut complet

### 2. Interface LabVIEW 2015

**Dossier** : `LabVIEW/`

**Contenu** :
- Guide de création du VI principal
- Template du diagramme de blocs
- Instructions VISA Serial
- Exemples de parsing
- Gestion des erreurs

**Fonctionnalités à implémenter** :
- Configuration port série
- Envoi de commandes
- Réception et affichage
- Graph temps réel (optionnel)
- Enregistrement données (optionnel)

### 3. Simulation Proteus

**Dossier** : `Proteus/`

**Contenu** :
- Instructions montage circuit
- Liste des composants
- Configuration Arduino Uno
- Chargement fichier .hex
- Tests de simulation

**Composants requis** :
- Arduino Uno
- LED + résistance 220Ω
- Potentiomètre 10kΩ
- Connexions série virtuelles

### 4. Documentation

**Dossier** : `Documentation/`

#### GUIDE_COMPLET.md
- Vue d'ensemble complète
- Architecture système
- Flux de données
- Diagrammes

#### PROTOCOLE_COMMUNICATION.md
- Format des messages
- Spécifications UART
- Codes d'erreur
- Exemples de trames

#### COMPILATION_HEX.md
- Utilisation arduino-cli
- Options de compilation
- Génération fichier .hex
- Debugging

#### TROUBLESHOOTING.md
- Problèmes courants
- Solutions détaillées
- FAQ
- Contacts support

## 🔧 Scripts Utilitaires

### Installation

#### `install_dependencies.sh`
```bash
# Installe :
- arduino-cli
- Bibliothèques requises
- Outils de développement
```

#### `install_arduino_library.sh`
```bash
# Configure :
- Cores Arduino
- Bibliothèques standard
- Permissions USB
```

#### `install_wine_proteus.sh`
```bash
# Installe Wine pour Proteus sur Linux
# Configure l'environnement Windows
```

### Exécution

#### `run_project.sh`
```bash
# Compile le code Arduino
# Génère le fichier .hex
# Affiche les informations
```

#### `start_project.sh`
```bash
# Lance tout le workflow :
1. Vérification système
2. Compilation
3. Simulation (optionnel)
```

#### `launch_proteus.sh`
```bash
# Lance Proteus 8.9
# Configure l'environnement
```

### Utilitaires

#### `check_system.sh`
```bash
# Vérifie :
- Logiciels installés
- Versions
- Permissions
- Connectivité
```

#### `choisir_simulateur.sh`
```bash
# Menu interactif :
- Proteus
- Tinkercad
- Wokwi
- Hardware réel
```

## 📊 Flux de Travail

### Phase 1 : Préparation
1. ✅ Lire `BIENVENUE.md`
2. ✅ Exécuter `check_system.sh`
3. ✅ Installer dépendances : `./install_dependencies.sh`

### Phase 2 : Développement Arduino
1. ✅ Ouvrir `Arduino/arduino_labview_communication.ino`
2. ✅ Comprendre le code
3. ✅ Compiler : `./run_project.sh`
4. ✅ Vérifier le fichier .hex généré

### Phase 3 : Simulation Proteus
1. ✅ Lire `Proteus/INSTRUCTIONS_PROTEUS.md`
2. ✅ Créer le schéma
3. ✅ Charger le .hex
4. ✅ Tester les commandes série

### Phase 4 : Interface LabVIEW 2015
1. ✅ Lire `LabVIEW/INSTRUCTIONS_LABVIEW.md`
2. ✅ Créer le VI
3. ✅ Configurer VISA
4. ✅ Tester avec Proteus/Arduino

### Phase 5 : Validation
1. ✅ Tests unitaires
2. ✅ Tests d'intégration
3. ✅ Documentation
4. ✅ `CHECKLIST_SOUMISSION.md`

## 🎓 Objectifs Pédagogiques

### Compétences Techniques
- ✓ Programmation Arduino (C/C++)
- ✓ Interface graphique LabVIEW
- ✓ Communication série UART
- ✓ Simulation électronique
- ✓ Debugging et tests

### Compétences Transversales
- ✓ Documentation technique
- ✓ Gestion de projet
- ✓ Résolution de problèmes
- ✓ Travail méthodique
- ✓ Versioning (Git)

## 📝 Livrables Attendus

### Minimum (Note de passage)
1. Code Arduino fonctionnel
2. Fichier .hex généré
3. Schéma Proteus complet
4. VI LabVIEW basique
5. Documentation minimale

### Standard (Bonne note)
- Tout le minimum +
6. Tests validés
7. Documentation complète
8. Code commenté
9. Gestion d'erreurs

### Excellence (Note maximale)
- Tout le standard +
10. Fonctionnalités avancées (graphes, logs)
11. Interface LabVIEW professionnelle
12. Tests exhaustifs
13. Documentation détaillée
14. Code optimisé

## 🔍 Points de Contrôle

### Checkpoint 1 : Arduino
- [ ] Code compile sans erreur
- [ ] Fichier .hex généré
- [ ] Commentaires dans le code

### Checkpoint 2 : Proteus
- [ ] Circuit monté correctement
- [ ] Simulation fonctionne
- [ ] LED contrôlable

### Checkpoint 3 : LabVIEW
- [ ] VI créé dans LabVIEW 2015
- [ ] Communication série établie
- [ ] Commandes fonctionnent

### Checkpoint 4 : Intégration
- [ ] Système complet testé
- [ ] Tous les cas testés
- [ ] Documentation à jour

## 📚 Références

### Arduino
- [Arduino Language Reference](https://www.arduino.cc/reference/)
- [Serial Communication](https://www.arduino.cc/reference/en/language/functions/communication/serial/)

### LabVIEW 2015
- [NI LabVIEW 2015 Help](http://zone.ni.com/reference/en-XX/help/371361M-01/)
- [VISA Documentation](http://www.ni.com/visa/)

### Proteus
- [Proteus Help](https://www.labcenter.com/support/)
- [Arduino Simulation](https://www.labcenter.com/arduino/)

## ⚠️ Notes Importantes

### Version LabVIEW
**Ce projet nécessite LabVIEW 2015** (version 15.0 ou supérieure)
- Versions antérieures : incompatibles
- Versions ultérieures : compatibles

### Proteus
Version recommandée : **Proteus 8.9**
- Versions 8.x généralement compatibles
- Version 7.x peut avoir des limitations

### Système d'Exploitation
- **Linux** : Recommandé, scripts optimisés
- **Windows** : Compatible, chemins à adapter
- **macOS** : Wine requis pour Proteus

## 🎯 Critères d'Évaluation

| Critère | Points | Description |
|---------|--------|-------------|
| Code Arduino | 20% | Qualité, commentaires, fonctionnalité |
| Simulation Proteus | 20% | Circuit, tests, validation |
| Interface LabVIEW | 30% | Fonctionnalité, ergonomie, robustesse |
| Documentation | 20% | Clarté, complétude, exemples |
| Tests & Validation | 10% | Couverture, résultats |

## 📞 Support

En cas de problème :
1. Consultez `TROUBLESHOOTING.md`
2. Vérifiez les logs
3. Testez avec `check_system.sh`
4. Contactez votre enseignant

---

**Version du projet** : 2015.1  
**Dernière mise à jour** : Décembre 2025  
**Compatible avec** : LabVIEW 2015+, Proteus 8.9, Arduino IDE 1.8+
