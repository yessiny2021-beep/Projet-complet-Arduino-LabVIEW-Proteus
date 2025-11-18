# 🎥 GUIDE D'ENREGISTREMENT VIDÉO
## Démonstration du projet Arduino-LabVIEW

---

## 📹 Objectif de la vidéo

Créer une vidéo de 3-5 minutes montrant :
1. ✅ Le démarrage du système
2. ✅ La lecture des capteurs en temps réel
3. ✅ Le contrôle des actionneurs
4. ✅ La communication bidirectionnelle fonctionnelle

---

## 🛠️ OUTILS D'ENREGISTREMENT

### Windows

#### Option 1 : OBS Studio (RECOMMANDÉ)
**Téléchargement :** https://obsproject.com/

**Avantages :**
- ✅ Gratuit et open source
- ✅ Qualité professionnelle
- ✅ Facile à utiliser
- ✅ Support Windows/Linux/Mac

**Installation :**
```
1. Télécharger depuis obsproject.com
2. Installer (installation par défaut)
3. Lancer OBS Studio
```

#### Option 2 : Windows Game Bar (Intégré)
**Raccourci :** Win + G

**Avantages :**
- ✅ Déjà installé dans Windows 10/11
- ✅ Simple et rapide
- ✅ Pas d'installation

**Utilisation :**
```
1. Win + G pour ouvrir
2. Cliquer sur le bouton d'enregistrement (●)
3. Arrêter avec Win + Alt + R
```

#### Option 3 : ShareX (Avancé)
**Téléchargement :** https://getsharex.com/

**Avantages :**
- ✅ Gratuit
- ✅ Nombreuses options
- ✅ Capture d'écran + vidéo

---

### Linux

#### Option 1 : SimpleScreenRecorder (RECOMMANDÉ)
**Installation :**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install simplescreenrecorder

# Lancer
simplescreenrecorder
```

**Avantages :**
- ✅ Simple et efficace
- ✅ Bonne performance
- ✅ Interface claire

#### Option 2 : RecordMyDesktop
**Installation :**
```bash
sudo apt install gtk-recordmydesktop
```

#### Option 3 : Kazam
**Installation :**
```bash
sudo apt install kazam
```

#### Option 4 : OBS Studio (Linux)
```bash
sudo apt install obs-studio
```

---

## 🎬 CONFIGURATION OBS STUDIO (Recommandé)

### Première configuration

**Étape 1 : Sources**
```
1. Lancer OBS Studio
2. Dans "Sources", cliquer "+"
3. Sélectionner "Capture d'écran"
4. Nommer : "Écran principal"
5. OK → Sélectionner votre écran → OK
```

**Étape 2 : Paramètres**
```
Fichier → Paramètres

Sortie :
  - Mode de sortie : Simple
  - Qualité d'enregistrement : Haute qualité, taille moyenne
  - Format d'enregistrement : mp4
  - Encodeur : x264

Vidéo :
  - Résolution de base : 1920x1080 (ou votre résolution)
  - Résolution de sortie : 1280x720 (pour taille réduite)
  - FPS : 30

Audio :
  - Microphone : Activé (pour commentaires)
  - Bureau : Désactivé (pas de son système nécessaire)
```

**Étape 3 : Enregistrer**
```
1. Cliquer "Démarrer l'enregistrement"
2. Réaliser la démonstration
3. Cliquer "Arrêter l'enregistrement"
4. Vidéo sauvegardée dans : Documents/OBS
```

---

## 📝 SCRIPT DE LA VIDÉO

### Introduction (30 secondes)

**À montrer :**
```
1. Bureau avec les dossiers du projet ouverts
2. Proteus avec le schéma visible
3. LabVIEW avec le VI ouvert
```

**À dire :**
```
"Bonjour, je vais vous présenter mon projet de communication 
Arduino-LabVIEW. Ce projet établit une communication bidirectionnelle 
entre un Arduino Uno simulé dans Proteus et une interface LabVIEW."
```

---

### Partie 1 : Présentation du système (30 secondes)

**À montrer :**
```
1. Schéma Proteus (zoom sur les composants)
   - Arduino Uno
   - Capteurs (LM35, potentiomètre, bouton)
   - Actionneurs (LEDs, servo, buzzer)
   - COMPIM
```

**À dire :**
```
"Le système comprend 3 capteurs : un LM35 pour la température, 
un potentiomètre et un bouton. Les actionneurs sont : une LED RGB, 
un servo moteur et un buzzer."
```

**Actions à filmer :**
```
- Pointer les composants dans Proteus
- Montrer les connexions
```

---

### Partie 2 : Configuration et démarrage (45 secondes)

**À montrer :**
```
1. Configuration des ports virtuels
   - Gestionnaire de périphériques (COM10, COM11)
   Ou terminal Linux avec socat

2. Proteus COMPIM
   - Double-clic → Configuration visible (COM10, 9600)

3. LabVIEW
   - Front Panel avec configuration (COM11)
```

**À dire :**
```
"J'ai configuré les ports virtuels COM10 et COM11 pour la communication. 
Proteus utilise COM10, LabVIEW utilise COM11."
```

**Actions à filmer :**
```
1. Montrer Gestionnaire de périphériques ou terminal
2. Montrer config COMPIM dans Proteus
3. Montrer sélection port dans LabVIEW
```

---

### Partie 3 : Lancement du système (30 secondes)

**À montrer :**
```
1. Proteus : Cliquer Play ▶
   - Montrer LED 13 qui clignote
   - Zoom sur "Running" dans la barre d'état

2. LabVIEW : Cliquer Run ▶
   - Cliquer "Connecter"
   - LED connexion passe au vert
```

**À dire :**
```
"Je lance d'abord la simulation Proteus. L'Arduino démarre correctement, 
on voit la LED 13 clignoter. Puis je lance LabVIEW et je connecte. 
La connexion est établie."
```

**Actions à filmer :**
```
- Bien montrer LED 13 qui clignote
- Montrer LED connexion verte dans LabVIEW
```

---

### Partie 4 : Test des capteurs (1 minute)

**Test 1 : Température (20s)**

**À montrer :**
```
1. Proteus : Double-clic sur LM35
2. Changer Temperature : 25 → 35°C
3. LabVIEW : Thermomètre monte à 35°C
4. Graphique suit l'évolution
```

**À dire :**
```
"Je modifie la température dans Proteus de 25 à 35 degrés. 
On voit immédiatement le thermomètre dans LabVIEW qui suit 
le changement. Le graphique enregistre l'évolution."
```

**Test 2 : Potentiomètre (20s)**

**À montrer :**
```
1. Proteus : Cliquer sur le potentiomètre
2. Tourner (molette souris) : min → max
3. LabVIEW : Jauge suit en temps réel
```

**À dire :**
```
"Je tourne le potentiomètre dans Proteus. La jauge dans LabVIEW 
suit le mouvement en temps réel, de 0 à 1023."
```

**Test 3 : Bouton (20s)**

**À montrer :**
```
1. Proteus : Cliquer sur le bouton (maintenir)
2. LabVIEW : LED change de couleur (OFF → ON)
3. Relâcher : LED revient
```

**À dire :**
```
"Je presse le bouton dans Proteus. La LED dans LabVIEW 
change d'état immédiatement. La communication est instantanée."
```

---

### Partie 5 : Test des actionneurs (1 minute 30)

**Test 1 : LED RGB (30s)**

**À montrer :**
```
1. LabVIEW : Ajuster les sliders
   - Rouge : 255
   - Vert : 0
   - Bleu : 0
2. Cliquer "Envoyer RGB"
3. Proteus : LED rouge s'allume

4. Changer en vert (0, 255, 0)
5. Proteus : LED verte s'allume

6. Tester une couleur mixte (255, 255, 0) = Jaune
7. Montrer le résultat
```

**À dire :**
```
"Je contrôle maintenant les LEDs depuis LabVIEW. 
Je mets le rouge au maximum : la LED rouge s'allume dans Proteus.
Puis le vert : la LED verte s'allume. 
Je peux créer toutes les couleurs en mélangeant."
```

**Test 2 : Servo moteur (30s)**

**À montrer :**
```
1. LabVIEW : Position servo à 0°
2. Cliquer "Déplacer Servo"
3. Proteus : Servo se positionne à 0°

4. LabVIEW : Position à 90°
5. Proteus : Servo tourne à 90°

6. LabVIEW : Position à 180°
7. Proteus : Servo tourne à 180°
```

**À dire :**
```
"Je contrôle le servo moteur. Je l'envoie à 0 degré, puis 90, 
puis 180. Le servo dans Proteus suit exactement les commandes."
```

**Test 3 : Buzzer (30s)**

**À montrer :**
```
1. LabVIEW : Activer l'interrupteur Buzzer
2. Proteus : Buzzer affiche "SOUNDING"
3. LabVIEW : Désactiver
4. Proteus : Buzzer s'éteint
```

**À dire :**
```
"Enfin, je contrôle le buzzer. Quand j'active l'interrupteur, 
le buzzer sonne dans Proteus. Je peux l'allumer et l'éteindre 
à volonté."
```

---

### Partie 6 : Test intégré (30 secondes)

**À montrer :**
```
Démonstration simultanée :
1. Température varie dans Proteus
2. LabVIEW affiche les changements
3. En parallèle, contrôler les LEDs
4. Montrer que tout fonctionne en même temps
```

**À dire :**
```
"Tout fonctionne en même temps. Les capteurs envoient leurs données 
toutes les 100 millisecondes, et je peux envoyer des commandes 
aux actionneurs à tout moment. La communication est bidirectionnelle 
et stable."
```

---

### Conclusion (30 secondes)

**À montrer :**
```
1. Vue d'ensemble Proteus + LabVIEW côte à côte
2. Arrêt propre :
   - LabVIEW : STOP
   - Proteus : Stop
```

**À dire :**
```
"Ce projet démontre une communication série bidirectionnelle 
fonctionnelle entre Arduino et LabVIEW. Tous les capteurs et 
actionneurs répondent correctement. Le protocole de communication 
est stable et fiable. Merci de votre attention."
```

---

## 🎬 CONSEILS DE TOURNAGE

### Avant l'enregistrement

**Préparer le système :**
```
1. ✅ Tester que tout fonctionne
2. ✅ Fermer les applications inutiles
3. ✅ Nettoyer le bureau
4. ✅ Désactiver les notifications
5. ✅ Préparer les valeurs à tester
6. ✅ Répéter la démo 2-3 fois
```

**Configuration écran :**
```
1. Résolution : 1920x1080 recommandé
2. Disposer Proteus et LabVIEW côte à côte
3. Augmenter la taille des polices si nécessaire
4. Zoom sur les éléments importants
```

### Pendant l'enregistrement

**À faire :**
- ✅ Parler clairement et posément
- ✅ Montrer les actions avec la souris
- ✅ Laisser le temps de voir les résultats
- ✅ Zoom sur les détails importants
- ✅ Pause de 1-2 secondes entre les actions

**À éviter :**
- ❌ Parler trop vite
- ❌ Mouvements de souris trop rapides
- ❌ Changer de fenêtre brutalement
- ❌ Oublier de montrer les résultats
- ❌ Bruits de fond

### Après l'enregistrement

**Vérifier :**
```
1. ✅ Qualité vidéo correcte
2. ✅ Audio clair
3. ✅ Toutes les démonstrations présentes
4. ✅ Durée raisonnable (3-5 min)
5. ✅ Pas de moments vides
```

---

## ✂️ MONTAGE (Optionnel)

### Logiciels de montage

**Gratuits :**
- **DaVinci Resolve** (Windows/Linux/Mac) - Professionnel
- **OpenShot** (Windows/Linux/Mac) - Simple
- **Kdenlive** (Windows/Linux) - Complet
- **Windows Video Editor** (Windows 10/11) - Basique

**Installation DaVinci Resolve (Recommandé) :**
```
1. https://www.blackmagicdesign.com/products/davinciresolve
2. Télécharger version gratuite
3. Installer
```

### Éditions basiques

**Couper les parties inutiles :**
```
1. Importer la vidéo
2. Couper le début/fin si nécessaire
3. Supprimer les erreurs
4. Exporter en MP4
```

**Ajouter des éléments (optionnel) :**
```
- Titre au début
- Annotations/flèches pour pointer
- Transitions entre les parties
- Musique de fond (très faible)
```

---

## 📤 EXPORT ET SOUMISSION

### Paramètres d'export recommandés

**Format :** MP4 (H.264)

**Résolution :**
- 1920x1080 (Full HD) - Si taille OK
- 1280x720 (HD) - Si limite de taille

**Qualité :**
- Bitrate : 3000-5000 kbps
- FPS : 30
- Audio : AAC, 128 kbps

**Taille cible :**
- 3 minutes → ~50-80 MB
- 5 minutes → ~80-130 MB

### Compression (si nécessaire)

**HandBrake (Gratuit) :**
```
1. https://handbrake.fr/
2. Télécharger et installer
3. Ouvrir la vidéo
4. Preset : "Fast 720p30"
5. Démarrer
```

**En ligne (rapide) :**
```
https://www.freeconvert.com/video-compressor
- Upload vidéo
- Choisir qualité
- Télécharger
```

---

## 📋 CHECKLIST VIDÉO

### Contenu obligatoire

- [ ] **Introduction** : Présentation du projet
- [ ] **Système** : Vue du schéma Proteus et interface LabVIEW
- [ ] **Configuration** : Ports virtuels et connexion
- [ ] **Démarrage** : Lancement Proteus et LabVIEW
- [ ] **Capteur 1** : Test température (LM35)
- [ ] **Capteur 2** : Test potentiomètre
- [ ] **Capteur 3** : Test bouton
- [ ] **Actionneur 1** : Test LED RGB (plusieurs couleurs)
- [ ] **Actionneur 2** : Test servo (plusieurs positions)
- [ ] **Actionneur 3** : Test buzzer
- [ ] **Communication** : Montrer que c'est bidirectionnel
- [ ] **Conclusion** : Résumé et arrêt propre

### Qualité technique

- [ ] Vidéo claire et nette
- [ ] Audio audible (si commenté)
- [ ] Durée : 3-5 minutes
- [ ] Format : MP4
- [ ] Taille : < 200 MB
- [ ] Texte visible (si zoom nécessaire)

### Présentation

- [ ] Bureau propre (pas de fichiers inutiles)
- [ ] Notifications désactivées
- [ ] Fenêtres bien positionnées
- [ ] Actions visibles et compréhensibles
- [ ] Rythme adapté (ni trop rapide, ni trop lent)

---

## 💾 ORGANISATION DES FICHIERS

### Structure recommandée

```
labviewproject/
├── Video/
│   ├── raw/
│   │   └── demo_brute.mp4              # Enregistrement brut
│   ├── edited/
│   │   └── demo_montee.mp4             # Après montage
│   └── final/
│       └── NOM_Prenom_Demo_Arduino_LabVIEW.mp4  # Version finale
└── Screenshots/                         # Captures d'écran
    ├── proteus_schema.png
    ├── labview_interface.png
    ├── communication_test.png
    └── resultat_capteurs.png
```

### Nommage du fichier final

**Format :**
```
NOM_Prenom_Demo_Arduino_LabVIEW.mp4

Exemples :
- DUPONT_Jean_Demo_Arduino_LabVIEW.mp4
- MARTIN_Marie_Demo_Arduino_LabVIEW.mp4
```

---

## 🎯 EXEMPLE DE TIMELINE

```
00:00 - 00:30  Introduction et présentation
00:30 - 01:00  Présentation du système (schéma)
01:00 - 01:45  Configuration et démarrage
01:45 - 02:45  Test des 3 capteurs
02:45 - 04:15  Test des 3 actionneurs
04:15 - 04:45  Démonstration intégrée
04:45 - 05:15  Conclusion

Total : ~5 minutes
```

---

## 📞 AIDE ET SUPPORT

### Problèmes courants

**Problème : Vidéo trop grande**
```
Solution : Utiliser HandBrake pour compresser
Ou réduire la résolution à 720p
```

**Problème : Audio inaudible**
```
Solution : Vérifier le microphone avant d'enregistrer
Faire un test de 10 secondes
```

**Problème : Vidéo saccadée**
```
Solution : Fermer les applications lourdes
Réduire les FPS à 30
Enregistrer sur un SSD si possible
```

**Problème : Impossible d'enregistrer Proteus**
```
Solution : Vérifier que Proteus n'est pas en plein écran
Utiliser OBS avec "Capture d'écran" au lieu de "Capture de fenêtre"
```

---

## ✅ VALIDATION FINALE

Avant de soumettre, vérifier que :

- [ ] La vidéo s'ouvre correctement
- [ ] Audio et vidéo synchronisés
- [ ] Durée entre 3 et 5 minutes
- [ ] Format MP4
- [ ] Taille < 200 MB
- [ ] Nom du fichier correct
- [ ] Tous les tests sont montrés
- [ ] Communication bidirectionnelle démontrée
- [ ] Qualité suffisante pour voir les détails

---

## 🎬 BON TOURNAGE !

**Avec ce guide, vous avez tout pour créer une vidéo de démonstration professionnelle.**

**N'oubliez pas :**
- Préparer et tester avant d'enregistrer
- Parler clairement
- Montrer tous les aspects (capteurs + actionneurs)
- Prendre votre temps

**Bonne réussite ! 🚀**

---

*Guide d'enregistrement vidéo - Version 1.0*  
*Projet LabVIEW 2GII - 17 Novembre 2025*
