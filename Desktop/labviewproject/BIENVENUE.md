# 🎓 Bienvenue dans le Projet Arduino - LabVIEW 2015

## 📋 Aperçu du Projet

Ce projet éducatif vous permet d'apprendre la communication série entre Arduino et LabVIEW 2015 en créant un système de contrôle et de surveillance.

## 🎯 Objectifs Pédagogiques

- Comprendre la communication série UART
- Maîtriser l'interface LabVIEW 2015
- Utiliser Proteus 8.9 pour la simulation
- Développer un système embarqué complet

## 🚀 Par où commencer ?

### Option 1 : Démarrage Rapide (Recommandé)

Consultez [QUICK_START.md](QUICK_START.md) pour une mise en route rapide.

### Option 2 : Guide Complet

Suivez les étapes détaillées :

1. **Installation** → [INSTALL_PROTEUS.md](INSTALL_PROTEUS.md)
2. **Compilation Arduino** → [Documentation/COMPILATION_HEX.md](Documentation/COMPILATION_HEX.md)
3. **Simulation Proteus** → [Proteus/INSTRUCTIONS_PROTEUS.md](Proteus/INSTRUCTIONS_PROTEUS.md)
4. **Interface LabVIEW** → [LabVIEW/INSTRUCTIONS_LABVIEW.md](LabVIEW/INSTRUCTIONS_LABVIEW.md)

## 📦 Prérequis

### Logiciels Requis

- ✅ **LabVIEW 2015** (obligatoire)
- ✅ **Proteus 8.9** (pour simulation)
- ✅ **Arduino IDE** (pour compilation)
- ✅ **Git** (pour versioning)

### Connaissances Recommandées

- Bases en programmation C/C++
- Notions d'électronique numérique
- Familiarité avec les interfaces graphiques

## 📂 Structure du Projet

```
labviewproject/
├── 📁 Arduino/          → Code embarqué
├── 📁 LabVIEW/          → Interface utilisateur
├── 📁 Proteus/          → Simulation
├── 📁 Documentation/    → Guides détaillés
└── 📁 bin/              → Outils (arduino-cli)
```

## 🛠️ Installation Rapide

```bash
# 1. Rendre les scripts exécutables
chmod +x *.sh

# 2. Installer les dépendances
./install_dependencies.sh

# 3. Vérifier le système
./check_system.sh

# 4. Compiler le projet
./run_project.sh
```

## 📖 Documentation Disponible

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Vue d'ensemble du projet |
| [QUICK_START.md](QUICK_START.md) | Démarrage rapide |
| [RUN_GUIDE.md](RUN_GUIDE.md) | Guide d'exécution |
| [GUIDE_COMPLET.md](Documentation/GUIDE_COMPLET.md) | Documentation complète |
| [TROUBLESHOOTING.md](Documentation/TROUBLESHOOTING.md) | Dépannage |

## 🎥 Ressources Multimédias

- [Guide Visuel](GUIDE_VISUEL.md) - Captures d'écran étape par étape
- [Guide Vidéo](GUIDE_VIDEO.md) - Tutoriels vidéo

## ⚙️ Configuration Minimale

### Système d'Exploitation
- Linux (Ubuntu 20.04+)
- Windows 10/11
- macOS (avec Wine pour Proteus)

### Matériel
- 4 GB RAM minimum (8 GB recommandé)
- 10 GB espace disque
- Port USB disponible

## 🎓 Pour les Enseignants

Consultez [POUR_ENSEIGNANT.md](POUR_ENSEIGNANT.md) pour :
- Objectifs pédagogiques détaillés
- Grilles d'évaluation
- Variantes du projet
- Ressources supplémentaires

## 🐛 Problèmes Courants

### LabVIEW ne trouve pas le port série
→ Vérifiez les permissions : `sudo chmod 666 /dev/ttyUSB0`

### Proteus ne charge pas le fichier .hex
→ Vérifiez que le fichier existe dans `Arduino/arduino_labview_communication/`

### Erreurs de compilation Arduino
→ Exécutez : `./install_arduino_library.sh`

Pour plus de détails : [TROUBLESHOOTING.md](Documentation/TROUBLESHOOTING.md)

## 📝 Soumission du Projet

Avant de soumettre, consultez :
- [CHECKLIST_SOUMISSION.md](CHECKLIST_SOUMISSION.md) - Liste de vérification
- [GITHUB_PUSH_GUIDE.md](GITHUB_PUSH_GUIDE.md) - Guide de versioning

## 🤝 Support

Pour toute question :
1. Consultez la [documentation](Documentation/GUIDE_COMPLET.md)
2. Vérifiez le [dépannage](Documentation/TROUBLESHOOTING.md)
3. Contactez votre enseignant

## 📄 Licence

Projet éducatif - Libre d'utilisation pour l'enseignement et l'apprentissage.

---

**Bonne chance avec votre projet ! 🚀**

Commencez par [QUICK_START.md](QUICK_START.md) pour une mise en route rapide.
