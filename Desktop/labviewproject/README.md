# Mini-projet LabVIEW 2GII
## Communication Arduino Uno simulé sur Proteus avec LabVIEW

---

## 📋 Description du projet

Ce projet établit une **communication bidirectionnelle** entre un Arduino Uno simulé dans Proteus et une interface développée dans LabVIEW. L'objectif est de permettre à LabVIEW de :

✅ Récupérer les données des capteurs simulés dans Proteus  
✅ Afficher ces données en temps réel  
✅ Envoyer des commandes pour contrôler les actionneurs simulés via l'Arduino

---

## 🎯 Objectifs pédagogiques

- Maîtriser la communication série (UART/USB) entre systèmes
- Comprendre la simulation de systèmes embarqués avec Proteus
- Développer des interfaces homme-machine (IHM) avec LabVIEW
- Intégrer des capteurs et actionneurs dans un système complet
- Appliquer les concepts de communication bidirectionnelle

---

## 📁 Structure du projet

```
labviewproject/
│
├── Arduino/
│   └── arduino_labview_communication.ino    # Code Arduino
│
├── Proteus/
│   ├── INSTRUCTIONS_PROTEUS.md              # Guide Proteus
│   ├── COMPOSANTS_REFERENCE.md              # Liste des composants
│   └── [Votre fichier .pdsprj ici]          # Schéma Proteus
│
├── LabVIEW/
│   ├── INSTRUCTIONS_LABVIEW.md              # Guide LabVIEW
│   ├── BLOCK_DIAGRAM_TEMPLATE.md            # Template diagramme
│   └── [Votre fichier .vi ici]              # VI LabVIEW
│
├── Documentation/
│   ├── GUIDE_COMPLET.md                     # Guide utilisateur
│   ├── PROTOCOLE_COMMUNICATION.md           # Protocole série
│   └── TROUBLESHOOTING.md                   # Dépannage
│
└── README.md                                 # Ce fichier
```

---

## 🔧 Matériel et logiciels requis

### Logiciels
- **Arduino IDE** (version 1.8.x ou 2.x)
- **Proteus Design Suite** (version 8.x ou supérieure)
- **LabVIEW** (version ≤ 2021)
- **Virtual Serial Port Driver** (com0com pour Windows ou socat pour Linux)

### Bibliothèques Arduino
- Servo.h (incluse par défaut)

### Matériel simulé dans Proteus
- Arduino Uno (ATmega328P)
- Capteur de température LM35
- Potentiomètre 10kΩ
- Bouton poussoir
- LED RGB (ou 3 LEDs séparées)
- Servo moteur
- Buzzer

---

## 🚀 Guide de démarrage rapide

### Étape 1 : Préparer le code Arduino
1. Ouvrir `Arduino/arduino_labview_communication.ino` dans Arduino IDE
2. Compiler le sketch (Vérifier ✓)
3. Exporter le fichier .hex :
   - Sketch → Export Compiled Binary
   - Ou récupérer dans le dossier temporaire après compilation

### Étape 2 : Créer le schéma Proteus
1. Suivre les instructions dans `Proteus/INSTRUCTIONS_PROTEUS.md`
2. Placer tous les composants selon `Proteus/COMPOSANTS_REFERENCE.md`
3. Câbler le circuit
4. Charger le fichier .hex dans l'Arduino
5. Ajouter et configurer le composant COMPIM

### Étape 3 : Configurer les ports virtuels

#### Windows
1. Installer **com0com** (https://sourceforge.net/projects/com0com/)
2. Créer une paire de ports : COM10 ↔ COM11
3. Configurer Proteus COMPIM sur COM10

#### Linux
```bash
# Créer des ports virtuels avec socat
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1
```

### Étape 4 : Créer l'interface LabVIEW
1. Suivre les instructions dans `LabVIEW/INSTRUCTIONS_LABVIEW.md`
2. Utiliser le template dans `LabVIEW/BLOCK_DIAGRAM_TEMPLATE.md`
3. Configurer le port COM11 (ou selon votre configuration)
4. Sauvegarder en version LabVIEW 2021 ou antérieure

### Étape 5 : Lancer le système
1. **Démarrer la simulation Proteus** (bouton Play ▶)
2. **Exécuter le VI LabVIEW** (bouton Run ou Ctrl+R)
3. **Connecter dans LabVIEW** (bouton "Connecter")
4. **Observer les données** des capteurs en temps réel
5. **Tester les actionneurs** avec les contrôles LabVIEW

---

## 📊 Fonctionnalités

### Capteurs (Arduino → LabVIEW)
| Capteur | Pin Arduino | Description | Plage |
|---------|-------------|-------------|-------|
| **LM35** | A0 | Température ambiante | 0-100°C |
| **Potentiomètre** | A1 | Valeur analogique | 0-1023 |
| **Bouton** | D2 | État digital | 0 (relâché) / 1 (pressé) |

### Actionneurs (LabVIEW → Arduino)
| Actionneur | Pin Arduino | Description | Plage |
|------------|-------------|-------------|-------|
| **LED Rouge** | D9 (PWM) | Intensité lumineuse | 0-255 |
| **LED Verte** | D10 (PWM) | Intensité lumineuse | 0-255 |
| **LED Bleue** | D11 (PWM) | Intensité lumineuse | 0-255 |
| **Servo** | D6 | Position angulaire | 0-180° |
| **Buzzer** | D8 | État ON/OFF | 0 (OFF) / 1 (ON) |

---

## 📡 Protocole de communication

### Configuration série
- **Baud Rate** : 9600
- **Data Bits** : 8
- **Parity** : None
- **Stop Bits** : 1
- **Flow Control** : None

### Format des messages

#### Données envoyées par Arduino (100ms)
```
T:25.5,P:512,B:1\n
```
- **T** : Température (°C)
- **P** : Potentiomètre (0-1023)
- **B** : Bouton (0/1)

#### Commandes envoyées par LabVIEW
```
LED:255,128,0\n      # Contrôle LED RGB
SERVO:90\n           # Position servo (degrés)
BUZZER:1\n           # Buzzer ON/OFF
STATUS\n             # Demande de status complet
```

#### Réponses de l'Arduino
```
ACK:LED\n            # Confirmation LED
ACK:SERVO\n          # Confirmation Servo
ACK:BUZZER\n         # Confirmation Buzzer
```

Plus de détails dans `Documentation/PROTOCOLE_COMMUNICATION.md`

---

## 🎨 Interface LabVIEW

### Face-avant (Front Panel)

#### Section Configuration
- Sélecteur de port COM
- Boutons Connecter/Déconnecter
- LED d'état de connexion

#### Section Capteurs
- Thermomètre pour température
- Jauge pour potentiomètre
- LED pour état du bouton
- Graphique temps réel

#### Section Actionneurs
- 3 curseurs pour RGB (0-255)
- Curseur rotatif pour servo (0-180°)
- Interrupteur pour buzzer
- Boutons d'envoi

#### Section Monitoring
- Zone de messages reçus
- Zone d'erreurs
- Bouton STOP

---

## 🔍 Tests et validation

### Checklist de validation

#### Arduino
- [ ] Code compile sans erreur
- [ ] Fichier .hex généré
- [ ] Bibliothèque Servo incluse

#### Proteus
- [ ] Tous les composants placés et câblés
- [ ] Fichier .hex chargé dans Arduino
- [ ] COMPIM configuré correctement
- [ ] Simulation démarre sans erreur
- [ ] LED 13 clignote au démarrage

#### LabVIEW
- [ ] VI s'ouvre dans LabVIEW 2021
- [ ] Connexion série établie
- [ ] Données reçues et affichées
- [ ] Commandes envoyées fonctionnent
- [ ] Gestion d'erreurs active

#### Système complet
- [ ] Communication bidirectionnelle stable
- [ ] Capteurs répondent en temps réel
- [ ] Actionneurs réagissent aux commandes
- [ ] Pas de perte de données
- [ ] Fermeture propre du système

---

## 🐛 Dépannage

### Problème : Pas de communication
**Solutions :**
- Vérifier que les ports virtuels sont créés
- Vérifier que Proteus utilise le bon port COM
- Vérifier que LabVIEW utilise le port complémentaire
- Redémarrer Proteus et LabVIEW

### Problème : Données corrompues
**Solutions :**
- Vérifier le Baud Rate (9600)
- Vérifier le caractère de terminaison (\n)
- Vérifier le format des messages

### Problème : Arduino ne démarre pas dans Proteus
**Solutions :**
- Vérifier que le fichier .hex est valide
- Vérifier les connexions d'alimentation
- Réinitialiser la simulation

Plus de solutions dans `Documentation/TROUBLESHOOTING.md`

---

## 📚 Documentation supplémentaire

- **`Proteus/INSTRUCTIONS_PROTEUS.md`** : Guide complet Proteus
- **`Proteus/COMPOSANTS_REFERENCE.md`** : Référence des composants
- **`LabVIEW/INSTRUCTIONS_LABVIEW.md`** : Guide complet LabVIEW
- **`LabVIEW/BLOCK_DIAGRAM_TEMPLATE.md`** : Template du diagramme
- **`Documentation/GUIDE_COMPLET.md`** : Guide utilisateur détaillé
- **`Documentation/PROTOCOLE_COMMUNICATION.md`** : Spécifications du protocole
- **`Documentation/TROUBLESHOOTING.md`** : Guide de dépannage

---

## 📝 Livrables du projet

Pour la soumission, fournir :

1. ✅ **Dossier Arduino**
   - arduino_labview_communication.ino
   - Fichier .hex compilé

2. ✅ **Dossier Proteus**
   - Fichier .pdsprj (projet complet)
   - Captures d'écran du schéma
   - Instructions de configuration

3. ✅ **Dossier LabVIEW**
   - Fichier .vi (version ≤ 2021)
   - Captures d'écran de l'interface
   - Instructions d'utilisation

4. ✅ **Documentation**
   - README.md
   - Rapport de projet (si demandé)
   - Guide d'utilisation

---

## 👥 Informations

**Matière** : LabVIEW  
**Niveau** : 2GII  
**Type** : Mini-projet  
**Date limite** : Selon votre professeur

---

## 💡 Améliorations possibles

### Extensions avancées
- Enregistrement des données dans un fichier (CSV/TDMS)
- Alarmes et notifications
- Contrôle PID de la température
- Interface graphique améliorée
- Communication sans fil (simulation WiFi/Bluetooth)
- Base de données pour historique
- Dashboard web

### Capteurs/Actionneurs supplémentaires
- Capteur d'humidité DHT11/DHT22
- Capteur de lumière (LDR)
- Moteur DC avec contrôle de vitesse
- Écran LCD pour affichage local
- Module RTC pour horodatage

---

## 📖 Références

### Arduino
- [Arduino Official Documentation](https://www.arduino.cc/reference/en/)
- [Serial Communication](https://www.arduino.cc/reference/en/language/functions/communication/serial/)
- [Servo Library](https://www.arduino.cc/reference/en/libraries/servo/)

### Proteus
- [Proteus Design Suite](https://www.labcenter.com/)
- [Arduino Simulation in Proteus](https://www.theengineeringprojects.com/2015/01/arduino-library-proteus-simulation.html)

### LabVIEW
- [LabVIEW Documentation](https://www.ni.com/documentation/en/labview/)
- [VISA Serial Communication](https://www.ni.com/en-us/support/documentation/supplemental/06/visa-overview.html)

---

## 🤝 Support

Pour toute question ou problème :
1. Consulter la documentation dans le dossier `Documentation/`
2. Vérifier la section Dépannage
3. Contacter votre enseignant
4. Consulter les forums Arduino/LabVIEW

---

## ✅ Checklist finale avant soumission

- [ ] Code Arduino compile sans erreur
- [ ] Simulation Proteus fonctionne correctement
- [ ] VI LabVIEW compatible avec version 2021
- [ ] Communication bidirectionnelle testée
- [ ] Tous les fichiers présents et organisés
- [ ] Documentation complète
- [ ] Captures d'écran incluses
- [ ] Fichiers nommés correctement
- [ ] Projet compressé (ZIP)
- [ ] Nom du groupe/étudiant sur tous les fichiers

---

**Bonne chance pour votre mini-projet ! 🚀**

---

*Ce projet a été conçu pour démontrer l'intégration de systèmes embarqués, simulation et interfaces graphiques dans un contexte industriel et pédagogique.*
