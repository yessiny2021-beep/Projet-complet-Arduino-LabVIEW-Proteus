# 🚀 DÉMARRAGE RAPIDE - 5 Minutes

## Pour les pressés ! ⚡

Ce guide vous permet de démarrer le projet en 5 minutes.  
**Prérequis** : Tous les logiciels installés (Arduino IDE, Proteus, LabVIEW, com0com/socat)

---

## ⏱️ ÉTAPE 1 : Ports Virtuels (30 secondes)

### Windows
```cmd
# Ouvrir "Setup Command Prompt" de com0com (en administrateur)
install PortName=COM10 PortName=COM11
quit
```

### Linux
```bash
# Terminal (laisser ouvert)
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1
```

✅ **Vérification** : Ports visibles dans Gestionnaire de périphériques (Windows) ou `ls /tmp/ttyV*` (Linux)

---

## ⏱️ ÉTAPE 2 : Compiler Arduino (1 minute)

```
1. Ouvrir Arduino IDE
2. File → Open → arduino_labview_communication.ino
3. Tools → Board → Arduino Uno
4. Sketch → Export Compiled Binary (Ctrl + Alt + S)
5. Attendre "Done compiling"
```

✅ **Fichier créé** : `arduino_labview_communication.ino.hex` (même dossier)

---

## ⏱️ ÉTAPE 3 : Proteus (2 minutes)

```
1. Ouvrir Proteus
2. File → Open Project → Arduino_LabVIEW_Communication.pdsprj
3. Double-clic sur Arduino Uno
4. Program File → 📁 → Sélectionner le .hex
5. OK
6. Double-clic sur COMPIM
7. Physical Port : COM10 (Windows) ou /tmp/ttyV0 (Linux)
8. Baud Rate : 9600
9. OK
10. Play ▶
```

✅ **Vérification** : LED 13 de l'Arduino clignote au démarrage

---

## ⏱️ ÉTAPE 4 : LabVIEW (1 minute 30)

```
1. Ouvrir LabVIEW
2. File → Open → Arduino_Communication.vi
3. Front Panel → Port COM : COM11 (Windows) ou /tmp/ttyV1 (Linux)
4. Run ▶ (flèche blanche)
5. Cliquer "Connecter"
```

✅ **Vérification** : LED "État Connexion" verte, données s'affichent

---

## ✅ TEST RAPIDE (30 secondes)

### Test Capteur
```
Proteus → Double-clic LM35 → Temperature: 35°C
LabVIEW → Thermomètre change → ✓
```

### Test Actionneur
```
LabVIEW → LED Rouge: 255 → Cliquer "Envoyer RGB"
Proteus → LED rouge s'allume → ✓
```

---

## 🎯 SI ÇA MARCHE

**Félicitations ! 🎉**

Vous pouvez maintenant :
- Modifier la température dans Proteus
- Tourner le potentiomètre
- Cliquer sur le bouton
- Changer les LEDs RGB
- Déplacer le servo
- Activer le buzzer

---

## ❌ SI ÇA NE MARCHE PAS

### Problème : Pas de connexion

**Solution rapide :**
```
1. Vérifier que Proteus est en mode "Running" (Play ▶)
2. Vérifier le port COM dans LabVIEW (COM11)
3. Redémarrer Proteus
4. Redémarrer LabVIEW
```

### Problème : Données corrompues

**Solution rapide :**
```
1. Vérifier Baud Rate = 9600 partout
2. Dans LabVIEW : VISA Configure → 9600
3. Dans Proteus COMPIM → 9600
```

### Problème : Arduino ne démarre pas

**Solution rapide :**
```
1. Vérifier que le .hex est bien chargé
2. Double-clic Arduino → Program File doit être rempli
3. Vérifier que la simulation est lancée (Play)
```

---

## 📚 POUR ALLER PLUS LOIN

**Documentation complète :**
- `README.md` - Vue d'ensemble
- `GUIDE_COMPLET.md` - Guide détaillé
- `TROUBLESHOOTING.md` - Dépannage complet
- `GUIDE_VISUEL.md` - Schémas et architecture

---

## 🎓 COMMANDES UTILES

### Tester la communication manuellement

**Windows (PuTTY) :**
```
1. Télécharger PuTTY
2. Serial / COM11 / 9600
3. Open
4. Vous devriez voir : T:25.5,P:512,B:0
```

**Linux (minicom) :**
```bash
minicom -D /tmp/ttyV1 -b 9600
# Vous devriez voir : T:25.5,P:512,B:0
```

### Envoyer une commande manuellement
```
Dans le terminal série, taper :
LED:255,0,0
(Entrée)

→ LED rouge doit s'allumer dans Proteus
```

---

## 📊 RÉSUMÉ DES PORTS

| Logiciel | Port | Rôle |
|----------|------|------|
| **Proteus COMPIM** | COM10 (ou /tmp/ttyV0) | Émulation Arduino |
| **LabVIEW VISA** | COM11 (ou /tmp/ttyV1) | Interface utilisateur |

**Important** : Les deux ports sont liés (com0com les relie virtuellement)

---

## 🔢 VALEURS PAR DÉFAUT

| Paramètre | Valeur |
|-----------|--------|
| Baud Rate | **9600** |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Température LM35 | 27°C (par défaut) |
| Potentiomètre | ~512 (milieu) |
| Servo position | 90° (centre) |

---

## 🎯 CHECKLIST ULTRA-RAPIDE

Avant de lancer :
- [ ] Ports virtuels créés (COM10 ↔ COM11)
- [ ] Fichier .hex compilé et récent
- [ ] Proteus ouvert et projet chargé
- [ ] .hex chargé dans Arduino (Proteus)
- [ ] COMPIM configuré (COM10, 9600)
- [ ] LabVIEW ouvert et VI chargé
- [ ] Port COM11 sélectionné dans LabVIEW

Lancer :
1. ▶ Proteus (Play)
2. ▶ LabVIEW (Run)
3. 🔗 Connecter

Tester :
- 🌡️ Température varie
- 🎚️ Potentiomètre réagit
- 🔘 Bouton fonctionne
- 💡 LEDs s'allument
- 🔧 Servo bouge
- 🔊 Buzzer sonne

---

## 💡 ASTUCES PRO

### Astuce 1 : Créer un script de démarrage

**Windows (start_project.bat) :**
```batch
@echo off
echo Demarrage du projet Arduino-LabVIEW...
echo.
echo 1. Verifier les ports virtuels (com0com)
echo 2. Lancer Proteus
echo 3. Lancer LabVIEW
pause
```

**Linux (start_project.sh) :**
```bash
#!/bin/bash
echo "Démarrage du projet Arduino-LabVIEW..."
echo ""
echo "1. Création des ports virtuels..."
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1 &
echo "2. Lancer Proteus manuellement"
echo "3. Lancer LabVIEW manuellement"
```

### Astuce 2 : Toujours dans cet ordre
```
1. Ports virtuels
2. Proteus (Play)
3. LabVIEW (Run + Connecter)
```

### Astuce 3 : En cas de doute
```
Tout fermer → Redémarrer dans l'ordre → 90% du temps ça marche !
```

---

## 🏁 RÉSUMÉ EN 5 COMMANDES

```bash
# 1. Ports virtuels (Terminal 1)
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1

# 2. Compiler Arduino (Terminal 2)
cd Arduino && arduino-cli compile --fqbn arduino:avr:uno arduino_labview_communication.ino

# 3. Copier .hex
cp build/arduino.avr.uno/*.hex ../Proteus/

# 4. Lancer Proteus (GUI)
# Charger projet → Charger .hex → Play

# 5. Lancer LabVIEW (GUI)
# Ouvrir VI → Run → Connecter
```

---

## 🎬 ORDRE DE FERMETURE

Quand vous avez fini :

```
1. LabVIEW : Cliquer STOP
2. LabVIEW : Fermer la fenêtre
3. Proteus : Stop (■)
4. Proteus : Fermer
5. Terminal socat : Ctrl+C (Linux)
```

---

## 📞 AIDE RAPIDE

**Un seul problème à la fois !**

| Symptôme | Solution |
|----------|----------|
| Pas de connexion | Vérifier les ports COM |
| Données bizarres | Vérifier Baud Rate (9600) |
| LED 13 ne clignote pas | Recharger le .hex dans Proteus |
| LabVIEW erreur VISA | Vérifier que le port n'est pas déjà utilisé |
| Simulation lente | Fermer autres applications |

**Tout le reste** → Voir `TROUBLESHOOTING.md`

---

## ✅ C'EST TOUT !

Vous êtes prêt à utiliser le système.  
**Bon travail ! 🚀**

---

*Pour la documentation complète, voir `README.md` et `GUIDE_COMPLET.md`*
