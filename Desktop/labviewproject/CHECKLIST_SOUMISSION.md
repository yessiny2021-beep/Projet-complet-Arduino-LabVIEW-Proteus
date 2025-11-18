# CHECKLIST DE SOUMISSION DU PROJET
## Mini-projet LabVIEW - Communication Arduino-LabVIEW

---

## ✅ PHASE 1 : CODE ARDUINO

### Fichiers Arduino
- [ ] Fichier `arduino_labview_communication.ino` présent
- [ ] Code compile sans erreur dans Arduino IDE
- [ ] Bibliothèque `Servo.h` incluse
- [ ] Configuration série à 9600 baud
- [ ] Toutes les pins correctement définies (A0, A1, D2, D6, D8, D9, D10, D11)
- [ ] Fonctions de lecture des capteurs implémentées
- [ ] Fonctions de contrôle des actionneurs implémentées
- [ ] Format de communication respecté ("T:...,P:...,B:...")

### Fichier .HEX
- [ ] Fichier `.hex` généré (Export Compiled Binary)
- [ ] Fichier `.hex` copié dans le dossier Proteus
- [ ] Taille du fichier cohérente (3-15 KB)
- [ ] Date de modification récente (après dernière modification du code)

---

## ✅ PHASE 2 : SIMULATION PROTEUS

### Schéma Proteus
- [ ] Fichier `.pdsprj` créé et sauvegardé
- [ ] Arduino Uno R3 placé dans le schéma
- [ ] Tous les composants présents (voir liste ci-dessous)
- [ ] Composants correctement câblés
- [ ] Pas de fils non connectés (loose wires)
- [ ] Ground commun à tous les composants
- [ ] Alimentation 5V correctement distribuée

### Liste des composants (Vérification)
- [ ] **LM35** (capteur température) → connecté à A0
- [ ] **Potentiomètre** (10kΩ) → connecté à A1
- [ ] **Bouton poussoir** → connecté à D2
- [ ] **3x LEDs** (Rouge, Verte, Bleue) → connectées à D9, D10, D11
- [ ] **3x Résistances** (220Ω) pour les LEDs
- [ ] **Servo moteur** → connecté à D6
- [ ] **Buzzer** → connecté à D8
- [ ] **COMPIM** (communication série) → connecté à TX/RX

### Configuration COMPIM
- [ ] COMPIM ajouté au schéma
- [ ] TXD → Arduino RX (D0)
- [ ] RXD → Arduino TX (D1)
- [ ] Baud Rate : 9600
- [ ] Port COM configuré (ex: COM10)
- [ ] Data Bits : 8
- [ ] Parity : None
- [ ] Stop Bits : 1

### Programme Arduino dans Proteus
- [ ] Fichier `.hex` chargé dans l'Arduino Uno (propriétés)
- [ ] Chemin du fichier visible et correct
- [ ] Pas d'erreur au chargement du programme

### Test de simulation
- [ ] Simulation démarre sans erreur (Play ▶)
- [ ] LED 13 de l'Arduino clignote au démarrage
- [ ] Pas de composants en erreur (rouge)
- [ ] Virtual Terminal affiche les messages Arduino (test optionnel)

---

## ✅ PHASE 3 : INTERFACE LABVIEW

### Fichier LabVIEW
- [ ] Fichier `.vi` créé et sauvegardé
- [ ] Compatible avec LabVIEW 2021 ou antérieur
- [ ] Pas de VIs cassés (broken)
- [ ] VI s'ouvre sans erreur

### Front Panel (Face-avant)

#### Section Configuration
- [ ] **Control** : Sélecteur de port COM (Ring ou Combo Box)
- [ ] **Button** : "Connecter"
- [ ] **Button** : "Déconnecter"
- [ ] **Indicator** : LED "État Connexion"

#### Section Capteurs (Affichage)
- [ ] **Indicator** : Thermomètre ou jauge pour température (°C)
- [ ] **Indicator** : Slide ou jauge pour potentiomètre (0-1023)
- [ ] **Indicator** : LED pour état du bouton
- [ ] **Chart** : Graphique température temps réel

#### Section Actionneurs (Contrôles)
- [ ] **Control** : Slider "LED Rouge" (0-255)
- [ ] **Control** : Slider "LED Verte" (0-255)
- [ ] **Control** : Slider "LED Bleue" (0-255)
- [ ] **Button** : "Envoyer RGB"
- [ ] **Control** : Knob ou Dial "Position Servo" (0-180°)
- [ ] **Button** : "Déplacer Servo"
- [ ] **Control** : Switch "Buzzer ON/OFF"

#### Section Monitoring
- [ ] **Indicator** : Zone de texte "Messages reçus"
- [ ] **Indicator** : Zone de texte "Erreurs"
- [ ] **Button** : "STOP" (arrêt du VI)

#### Présentation
- [ ] Interface organisée et claire
- [ ] Labels descriptifs sur tous les contrôles
- [ ] Couleurs et groupes visuels
- [ ] Taille des éléments cohérente

### Block Diagram (Diagramme)

#### Structure générale
- [ ] **While Loop** principale présente
- [ ] **Shift Register** pour VISA Resource
- [ ] **VISA Configure Serial Port** (initialisation)
- [ ] **VISA Read** (lecture périodique)
- [ ] **VISA Write** (envoi commandes)
- [ ] **VISA Close** (fermeture propre)
- [ ] Bouton **STOP** connecté à la condition de boucle

#### Réception des données
- [ ] **VISA Read** configuré (100 bytes, Term Char \n, Timeout 1000ms)
- [ ] **Scan From String** ou **Match Pattern** pour parsing
- [ ] Format : "T:%f,P:%d,B:%d"
- [ ] Valeurs extraites connectées aux indicateurs
- [ ] Température → Thermomètre et Chart

#### Envoi des commandes
- [ ] **Event Structure** pour gérer les boutons
- [ ] Event "Envoyer RGB" → Format "LED:R,G,B\n" → VISA Write
- [ ] Event "Déplacer Servo" → Format "SERVO:angle\n" → VISA Write
- [ ] Event "Buzzer" → Format "BUZZER:state\n" → VISA Write
- [ ] Timeout Event (100ms) pour lecture continue

#### Gestion des erreurs
- [ ] **Error clusters** câblés partout
- [ ] **Case Structure** pour affichage des erreurs
- [ ] Messages d'erreur affichés dans l'indicateur
- [ ] Pas d'erreurs non gérées

#### Timing
- [ ] **Wait (ms)** dans la boucle (100ms recommandé)
- [ ] Pas de boucle infinie sans Wait

### Configuration VISA dans LabVIEW
- [ ] **Baud Rate** : 9600
- [ ] **Data Bits** : 8
- [ ] **Parity** : 0 (None)
- [ ] **Stop Bits** : 10 (1 stop bit)
- [ ] **Flow Control** : 0 (None)
- [ ] **Port** : COM11 ou équivalent (complémentaire à Proteus)

### Test fonctionnel
- [ ] VI s'exécute sans erreur (Run ▶)
- [ ] Connexion au port série réussie
- [ ] Données des capteurs reçues et affichées
- [ ] Graphique température se met à jour
- [ ] Commandes LED envoyées et appliquées
- [ ] Commande Servo envoyée et appliquée
- [ ] Commande Buzzer envoyée et appliquée
- [ ] VI se ferme proprement avec STOP

---

## ✅ PHASE 4 : COMMUNICATION SÉRIE

### Ports virtuels

#### Windows (com0com)
- [ ] com0com installé
- [ ] Paire de ports créée (ex: COM10 ↔ COM11)
- [ ] Ports visibles dans Gestionnaire de périphériques
- [ ] Aucun conflit avec d'autres applications

#### Linux (socat)
- [ ] socat installé
- [ ] Ports virtuels créés (`/tmp/ttyV0` ↔ `/tmp/ttyV1`)
- [ ] Permissions correctes (lecture/écriture)
- [ ] Ports actifs pendant les tests

### Test de communication
- [ ] Test avec terminal série réussi (PuTTY/minicom)
- [ ] Messages Arduino visibles : "T:25.5,P:512,B:0"
- [ ] Commandes manuelles fonctionnent depuis terminal
- [ ] Pas de données corrompues
- [ ] Communication stable (>5 minutes)

---

## ✅ PHASE 5 : TESTS D'INTÉGRATION

### Test capteurs
- [ ] **Température** : Varier dans Proteus → Affichage LabVIEW change
- [ ] **Potentiomètre** : Tourner dans Proteus → Jauge LabVIEW suit
- [ ] **Bouton** : Cliquer dans Proteus → LED LabVIEW change
- [ ] Valeurs cohérentes (pas de 0 ou valeurs fixes)
- [ ] Mise à jour en temps réel (~100ms)

### Test actionneurs
- [ ] **LED RGB** : Envoyer couleur → LEDs Proteus changent
- [ ] **Servo** : Changer position → Servo Proteus bouge
- [ ] **Buzzer** : Activer → Buzzer Proteus "SOUNDING"
- [ ] Réponse immédiate (<1 seconde)
- [ ] ACK reçus (optionnel)

### Test de robustesse
- [ ] Déconnexion/reconnexion fonctionne
- [ ] Gestion d'erreur de communication
- [ ] Pas de freeze ou crash
- [ ] Fermeture propre de tous les programmes

---

## ✅ PHASE 6 : DOCUMENTATION

### Fichiers de documentation
- [ ] **README.md** présent et complet
- [ ] Instructions Proteus (`INSTRUCTIONS_PROTEUS.md`)
- [ ] Instructions LabVIEW (`INSTRUCTIONS_LABVIEW.md`)
- [ ] Protocole de communication (`PROTOCOLE_COMMUNICATION.md`)
- [ ] Guide de dépannage (`TROUBLESHOOTING.md`)
- [ ] Guide complet (`GUIDE_COMPLET.md`)
- [ ] Guide compilation HEX (`COMPILATION_HEX.md`)

### Captures d'écran (Recommandé)
- [ ] Schéma Proteus complet
- [ ] Simulation Proteus en cours
- [ ] Front Panel LabVIEW complet
- [ ] Block Diagram LabVIEW (vue d'ensemble)
- [ ] Communication en action (données qui passent)

### Commentaires et explications
- [ ] Code Arduino commenté (lignes importantes)
- [ ] Block Diagram LabVIEW commenté
- [ ] Descriptions des contrôles/indicateurs (properties)
- [ ] README contient vue d'ensemble du projet

---

## ✅ PHASE 7 : ORGANISATION DES FICHIERS

### Structure des dossiers
```
labviewproject/
├── Arduino/
│   ├── arduino_labview_communication.ino     ✓
│   └── arduino_labview_communication.hex     ✓
├── Proteus/
│   ├── Arduino_LabVIEW_Communication.pdsprj  ✓
│   ├── INSTRUCTIONS_PROTEUS.md               ✓
│   └── COMPOSANTS_REFERENCE.md               ✓
├── LabVIEW/
│   ├── Arduino_Communication.vi              ✓
│   ├── INSTRUCTIONS_LABVIEW.md               ✓
│   └── BLOCK_DIAGRAM_TEMPLATE.md             ✓
├── Documentation/
│   ├── GUIDE_COMPLET.md                      ✓
│   ├── PROTOCOLE_COMMUNICATION.md            ✓
│   ├── TROUBLESHOOTING.md                    ✓
│   └── COMPILATION_HEX.md                    ✓
└── README.md                                  ✓
```

### Vérifications
- [ ] Tous les dossiers présents
- [ ] Pas de fichiers temporaires (.tmp, .bak, ~)
- [ ] Pas de fichiers inutiles (build/, .DS_Store, Thumbs.db)
- [ ] Noms de fichiers cohérents et descriptifs

---

## ✅ PHASE 8 : PRÉPARATION DE LA SOUMISSION

### Informations personnelles
- [ ] Nom et prénom sur le README
- [ ] Groupe ou binôme mentionné
- [ ] Date de remise vérifiée
- [ ] Section/Classe indiquée (2GII)

### Fichier compressé (ZIP)
- [ ] Projet complet compressé en ZIP
- [ ] Nom du ZIP : `NOM_Prenom_LabVIEW_Arduino.zip`
- [ ] Taille raisonnable (<50 MB)
- [ ] Test d'extraction : ZIP s'ouvre sans erreur
- [ ] Structure des dossiers préservée

### Vérification finale
- [ ] Tester sur un autre ordinateur (si possible)
- [ ] Toutes les dépendances incluses
- [ ] Instructions claires pour utilisation
- [ ] Aucun chemin absolu dans les fichiers (ex: C:\Users\...)

---

## ✅ CRITÈRES D'ÉVALUATION (Anticipation)

### Fonctionnalités (40%)
- [ ] Communication bidirectionnelle opérationnelle
- [ ] Tous les capteurs fonctionnent
- [ ] Tous les actionneurs fonctionnent
- [ ] Gestion des erreurs implémentée
- [ ] Interface utilisateur complète

### Qualité technique (30%)
- [ ] Code Arduino propre et commenté
- [ ] Schéma Proteus organisé et lisible
- [ ] VI LabVIEW structuré et optimisé
- [ ] Protocole de communication respecté
- [ ] Pas d'erreurs ou warnings

### Documentation (20%)
- [ ] README complet et clair
- [ ] Instructions détaillées
- [ ] Captures d'écran pertinentes
- [ ] Commentaires dans le code
- [ ] Explications techniques

### Présentation (10%)
- [ ] Projet organisé
- [ ] Fichiers nommés correctement
- [ ] Interface LabVIEW ergonomique
- [ ] Démarche professionnelle

---

## 🎯 TESTS AVANT SOUMISSION (ESSENTIELS)

### Test 1 : Démarrage complet
```
1. Créer les ports virtuels
2. Lancer Proteus → Charger le projet → Play
3. Lancer LabVIEW → Charger le VI → Run
4. Connecter dans LabVIEW
5. ✓ Tout fonctionne ?
```

### Test 2 : Capteurs
```
1. Changer température dans Proteus
2. ✓ LabVIEW affiche la nouvelle valeur ?
3. Tourner le potentiomètre
4. ✓ Jauge suit en temps réel ?
5. Cliquer sur le bouton
6. ✓ LED change d'état ?
```

### Test 3 : Actionneurs
```
1. Envoyer une couleur RGB
2. ✓ LEDs Proteus changent ?
3. Déplacer le servo à 45°
4. ✓ Servo Proteus bouge à 45° ?
5. Activer le buzzer
6. ✓ Buzzer Proteus actif ?
```

### Test 4 : Robustesse
```
1. Laisser tourner 5 minutes
2. ✓ Pas de crash ?
3. ✓ Pas de freeze ?
4. ✓ Communication stable ?
5. Arrêter avec STOP
6. ✓ Fermeture propre ?
```

---

## 📋 RÉCAPITULATIF RAPIDE

**Fichiers essentiels à remettre :**
1. ✅ arduino_labview_communication.ino
2. ✅ arduino_labview_communication.hex
3. ✅ Arduino_LabVIEW_Communication.pdsprj (Proteus)
4. ✅ Arduino_Communication.vi (LabVIEW, compatible 2021)
5. ✅ README.md
6. ✅ Documentation complète

**Configuration critique :**
- Baud Rate : **9600** partout
- Ports virtuels : **COM10** (Proteus) ↔ **COM11** (LabVIEW)
- LabVIEW version : **≤ 2021**
- Format messages : **"T:X.X,P:XXX,B:X\n"**

---

## ✅ VALIDATION FINALE

**Avant de soumettre, confirmer :**

- [ ] J'ai testé l'ensemble du système de bout en bout
- [ ] Tous les éléments de cette checklist sont cochés
- [ ] Le projet fonctionne sur mon ordinateur
- [ ] La documentation est complète et claire
- [ ] Les fichiers sont correctement nommés et organisés
- [ ] Le ZIP est créé et testé
- [ ] Je respecte la date limite de remise
- [ ] Je peux expliquer/défendre mon travail

---

## 🎓 CONSEILS POUR LA PRÉSENTATION/DÉFENSE

Si vous devez présenter ou défendre votre projet :

### À préparer
- [ ] Démo en direct (prévoir backup vidéo si problème technique)
- [ ] Explication du protocole de communication
- [ ] Choix techniques justifiés
- [ ] Difficultés rencontrées et solutions
- [ ] Améliorations possibles

### Questions fréquentes à anticiper
- "Pourquoi ce Baud Rate ?"
- "Comment gérez-vous les erreurs de communication ?"
- "Que se passe-t-il si un message est perdu ?"
- "Comment avez-vous testé la robustesse ?"
- "Quelles améliorations proposeriez-vous ?"

---

## 📞 EN CAS DE PROBLÈME

**Si un élément de cette checklist n'est pas coché :**

1. Consulter la documentation correspondante
2. Voir `Documentation/TROUBLESHOOTING.md`
3. Revenir aux instructions de base
4. Contacter votre enseignant si bloqué

---

**BONNE CHANCE POUR VOTRE PROJET ! 🚀**

---

*Date de création de cette checklist : 17 Novembre 2025*  
*Version : 1.0*
