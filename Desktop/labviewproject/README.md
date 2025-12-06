# Projet Arduino - LabVIEW 2015

## Description

Ce projet implémente une communication série bidirectionnelle entre Arduino Uno et LabVIEW 2015 pour le contrôle de LEDs et la lecture de capteurs.

## Prérequis

- **LabVIEW 2015** (version requise)
- **Arduino IDE** (dernière version)
- **Proteus 8.9** pour la simulation
- **Arduino Uno** ou carte compatible

## Structure du Projet

```
labviewproject/
├── Arduino/                    # Code Arduino
│   └── arduino_labview_communication/
│       └── arduino_labview_communication.ino
├── LabVIEW/                   # Fichiers et instructions LabVIEW
│   ├── INSTRUCTIONS_LABVIEW.md
│   └── BLOCK_DIAGRAM_TEMPLATE.md
├── Proteus/                   # Schémas de simulation
│   ├── INSTRUCTIONS_PROTEUS.md
│   └── COMPOSANTS_REFERENCE.md
├── Documentation/             # Documentation complète
│   ├── GUIDE_COMPLET.md
│   ├── PROTOCOLE_COMMUNICATION.md
│   ├── COMPILATION_HEX.md
│   └── TROUBLESHOOTING.md
└── bin/                       # Exécutables (arduino-cli)
```

## Démarrage Rapide

### 1. Installation

```bash
# Rendre les scripts exécutables
chmod +x *.sh

# Installer les dépendances
./install_dependencies.sh
```

### 2. Compiler le code Arduino

```bash
# Compilation et génération du fichier .hex
./run_project.sh
```

### 3. Simulation dans Proteus

1. Ouvrez Proteus 8.9
2. Créez un nouveau projet
3. Suivez les instructions dans `Proteus/INSTRUCTIONS_PROTEUS.md`
4. Chargez le fichier `.hex` généré

### 4. Créer l'interface LabVIEW 2015

1. Lancez LabVIEW 2015
2. Créez un nouveau VI
3. Suivez les instructions dans `LabVIEW/INSTRUCTIONS_LABVIEW.md`

## Protocole de Communication

### Commandes vers Arduino (PC → Arduino)

- `L1` : Allumer LED 1
- `L0` : Éteindre LED 1
- `R` : Lire capteur analogique
- `S` : Obtenir le statut complet

### Réponses de l'Arduino (Arduino → PC)

- `LED:ON` ou `LED:OFF` : État de la LED
- `SENSOR:xxxx` : Valeur du capteur (0-1023)
- `STATUS:LED=x,SENSOR=yyyy` : Statut complet

## Configuration du Port Série

- **Baud Rate** : 9600
- **Data Bits** : 8
- **Stop Bits** : 1
- **Parity** : None
- **Flow Control** : None

## Documentation

- [Guide Complet](Documentation/GUIDE_COMPLET.md)
- [Instructions LabVIEW](LabVIEW/INSTRUCTIONS_LABVIEW.md)
- [Instructions Proteus](Proteus/INSTRUCTIONS_PROTEUS.md)
- [Protocole de Communication](Documentation/PROTOCOLE_COMMUNICATION.md)
- [Dépannage](Documentation/TROUBLESHOOTING.md)

## Scripts Disponibles

- `install_dependencies.sh` : Installation des dépendances
- `run_project.sh` : Compilation du code Arduino
- `launch_simulation.sh` : Lancement de la simulation
- `check_system.sh` : Vérification du système

## Support

Consultez [TROUBLESHOOTING.md](Documentation/TROUBLESHOOTING.md) pour les problèmes courants.

## Licence

Projet éducatif - Libre d'utilisation pour l'enseignement.
