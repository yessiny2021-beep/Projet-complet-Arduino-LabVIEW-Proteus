# 🚀 GUIDE D'EXÉCUTION RAPIDE
## Lancer le projet en temps réel

---

## ⚡ INSTALLATION RAPIDE (Une seule fois)

### Option 1: Installation automatique (RECOMMANDÉ)

```bash
# Dans le terminal, depuis le dossier labviewproject/
./install_dependencies.sh
```

Ce script installe:
- ✅ socat (ports virtuels)
- ✅ arduino-cli (compilation Arduino)
- ✅ Permissions dialout (ports série)

**⚠️ IMPORTANT:** Après l'installation, vous devez **vous déconnecter et reconnecter** pour que les permissions prennent effet.

---

### Option 2: Installation manuelle

```bash
# 1. Installer socat
sudo apt update
sudo apt install socat

# 2. Installer arduino-cli
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
export PATH=$PATH:$HOME/bin
arduino-cli config init
arduino-cli core update-index
arduino-cli core install arduino:avr

# 3. Ajouter au groupe dialout
sudo usermod -a -G dialout $USER

# 4. Se déconnecter et reconnecter
```

---

## 🎯 LANCEMENT DU PROJET

### Vérification préalable

```bash
./check_system.sh
```

Vous devez avoir **0 erreur** avant de continuer.

---

### MÉTHODE 1: Lancement automatique (Le plus simple)

#### Terminal 1: Lancer le script principal

```bash
./run_project.sh
```

Ce script va:
1. ✅ Compiler le code Arduino automatiquement
2. ✅ Générer le fichier .hex
3. ✅ Créer les ports virtuels /tmp/ttyV0 ↔ /tmp/ttyV1
4. ✅ Les maintenir actifs

**⚠️ Gardez ce terminal ouvert!** Il maintient les ports virtuels actifs.

---

#### Proteus (Interface graphique)

1. Ouvrir **Proteus Design Suite**
2. Créer un nouveau projet ou ouvrir le schéma
3. Placer les composants selon `Proteus/INSTRUCTIONS_PROTEUS.md`
4. Double-clic sur Arduino → **Program File**
5. Charger: `Arduino/arduino_labview_communication.ino.hex`
6. Double-clic sur **COMPIM** → Configuration:
   - **Port:** `/tmp/ttyV0`
   - **Baud Rate:** 9600
   - **Data Bits:** 8
   - **Stop Bits:** 1
7. Cliquer **Play ▶** pour démarrer la simulation

**✓ Vérification:** LED 13 clignote = Arduino démarre correctement

---

#### LabVIEW (Interface graphique)

1. Ouvrir **LabVIEW**
2. Créer un nouveau VI ou ouvrir le VI existant
3. Suivre `LabVIEW/INSTRUCTIONS_LABVIEW.md` pour créer l'interface
4. Configurer VISA:
   - **Port:** `/tmp/ttyV1`
   - **Baud Rate:** 9600
   - **Data Bits:** 8
   - **Parity:** None
   - **Stop Bits:** 1
5. Cliquer **Run ▶**
6. Cliquer **Connecter**

**✓ Vérification:** LED connexion verte = Communication établie

---

### MÉTHODE 2: Lancement manuel (Contrôle total)

#### Terminal 1: Compilation Arduino

```bash
# Compiler le code
arduino-cli compile --fqbn arduino:avr:uno Arduino/arduino_labview_communication.ino

# Générer le .hex
arduino-cli compile --fqbn arduino:avr:uno --output-dir Arduino/ Arduino/arduino_labview_communication.ino

# Vérifier que le .hex est créé
ls -lh Arduino/*.hex
```

---

#### Terminal 2: Ports virtuels

```bash
# Créer la paire de ports
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1
```

**⚠️ Ce terminal reste bloqué** - C'est normal! Il maintient les ports actifs.

Vous verrez:
```
2025/11/17 10:30:00 socat[12345] N PTY is /dev/pts/2
2025/11/17 10:30:00 socat[12345] N PTY is /dev/pts/3
2025/11/17 10:30:00 socat[12345] N starting data transfer loop with FDs [5,5] and [7,7]
```

---

#### Terminal 3: Vérifier les ports

```bash
# Vérifier que les ports existent
ls -l /tmp/ttyV*

# Devrait afficher:
# lrwxrwxrwx 1 yessin yessin 10 Nov 17 10:30 /tmp/ttyV0 -> /dev/pts/2
# lrwxrwxrwx 1 yessin yessin 10 Nov 17 10:30 /tmp/ttyV1 -> /dev/pts/3
```

---

#### Proteus et LabVIEW

Suivre les mêmes étapes que la Méthode 1.

---

## 🧪 TESTS DE COMMUNICATION

### Test 1: Lecture des capteurs

**Dans Proteus:**
1. Double-clic sur le **LM35**
2. Changer **Temperature:** 25 → 35°C

**Dans LabVIEW:**
- Le thermomètre monte à **35°C**
- Le graphique suit l'évolution

✅ **Communication Arduino → LabVIEW fonctionne!**

---

### Test 2: Contrôle du servo

**Dans LabVIEW:**
1. Ajuster le curseur **Servo:** 90°
2. Cliquer **Déplacer Servo**

**Dans Proteus:**
- Le servo tourne à **90°**

✅ **Communication LabVIEW → Arduino fonctionne!**

---

### Test 3: LED RGB

**Dans LabVIEW:**
1. Rouge: 255, Vert: 0, Bleu: 0
2. Cliquer **Envoyer RGB**

**Dans Proteus:**
- LED rouge s'allume

✅ **Contrôle des actionneurs fonctionne!**

---

## 🔍 MONITORING EN TEMPS RÉEL

### Terminal 4: Surveillance des données série (Optionnel)

```bash
# Installer minicom si nécessaire
sudo apt install minicom

# Surveiller le port LabVIEW (ce que reçoit LabVIEW)
minicom -D /tmp/ttyV1 -b 9600

# Vous verrez les données en direct:
# T:25.5,P:512,B:0
# T:25.6,P:513,B:0
# ...
```

**Pour quitter minicom:** Ctrl+A puis Q

---

### Alternative: Lecture avec cat

```bash
# Lire les données brutes
cat /tmp/ttyV1

# Vous verrez:
# T:25.5,P:512,B:0
# T:25.6,P:513,B:0
# ...
```

**Pour arrêter:** Ctrl+C

---

## 🛑 ARRÊT DU SYSTÈME

### Ordre d'arrêt (IMPORTANT):

1. **LabVIEW:** Cliquer **STOP** → Fermer le VI
2. **Proteus:** Cliquer **Stop** → Fermer Proteus
3. **Terminal socat:** Appuyer **Ctrl+C**

**⚠️ Toujours arrêter dans cet ordre** pour éviter les erreurs de port.

---

## ⚠️ DÉPANNAGE RAPIDE

### Problème: "Permission denied" sur les ports

```bash
# Vérifier le groupe
groups

# Si "dialout" n'apparaît pas:
sudo usermod -a -G dialout $USER

# Puis se déconnecter et reconnecter
```

---

### Problème: Ports virtuels n'existent pas

```bash
# Vérifier si socat tourne
ps aux | grep socat

# Vérifier les ports
ls -l /tmp/ttyV*

# Si manquants, relancer:
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1
```

---

### Problème: Pas de communication

```bash
# Test de bouclage (loopback)
# Terminal 1:
cat /tmp/ttyV1

# Terminal 2:
echo "TEST" > /tmp/ttyV0

# Si "TEST" apparaît dans Terminal 1 = Ports OK
```

---

### Problème: Arduino ne compile pas

```bash
# Vérifier arduino-cli
arduino-cli version

# Mettre à jour
arduino-cli core update-index
arduino-cli core upgrade

# Réinstaller AVR
arduino-cli core install arduino:avr
```

---

### Problème: Fichier .hex non chargé dans Proteus

```bash
# Vérifier que le .hex existe
ls -lh Arduino/*.hex

# Recompiler si nécessaire
arduino-cli compile --fqbn arduino:avr:uno --output-dir Arduino/ Arduino/arduino_labview_communication.ino

# Le fichier devrait être:
# Arduino/arduino_labview_communication.ino.hex
```

---

## 📊 ARCHITECTURE DU SYSTÈME

```
┌─────────────────────────────────────────────────────┐
│                   VOTRE SYSTÈME                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   PROTEUS    │         │   LABVIEW    │         │
│  │  (Graphique) │         │  (Graphique) │         │
│  └──────┬───────┘         └───────┬──────┘         │
│         │                         │                │
│         │ /tmp/ttyV0     /tmp/ttyV1                │
│         │                         │                │
│         └──────────┬──────────────┘                │
│                    │                                │
│              ┌─────▼─────┐                         │
│              │   SOCAT   │                         │
│              │ (Terminal) │                         │
│              └───────────┘                         │
│                                                     │
│  ┌──────────────────────────────────────────┐     │
│  │  Arduino Code                             │     │
│  │  arduino_labview_communication.ino.hex    │     │
│  └──────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📝 CHECKLIST D'EXÉCUTION

### Avant de commencer

- [ ] Arduino code présent
- [ ] socat installé
- [ ] arduino-cli installé
- [ ] Groupe dialout configuré
- [ ] Déconnexion/reconnexion effectuée

### Lancement

- [ ] Terminal 1: `./run_project.sh` lancé
- [ ] Fichier .hex généré
- [ ] Ports virtuels créés (/tmp/ttyV0, /tmp/ttyV1)
- [ ] Proteus ouvert et schéma créé
- [ ] .hex chargé dans Arduino
- [ ] COMPIM configuré (/tmp/ttyV0, 9600)
- [ ] Simulation Proteus lancée (Play ▶)
- [ ] LED 13 clignote
- [ ] LabVIEW VI ouvert
- [ ] Port configuré (/tmp/ttyV1, 9600)
- [ ] VI lancé (Run ▶)
- [ ] Connexion établie (LED verte)

### Tests

- [ ] Température change dans Proteus → LabVIEW l'affiche
- [ ] Potentiomètre tourne → Jauge suit
- [ ] Bouton pressé → LED change
- [ ] LED RGB contrôlée depuis LabVIEW → Proteus réagit
- [ ] Servo commandé → Position change
- [ ] Buzzer activé → Sonne dans Proteus

### Arrêt

- [ ] LabVIEW stoppé proprement
- [ ] Proteus arrêté
- [ ] Terminal socat fermé (Ctrl+C)
- [ ] Tous les terminaux fermés

---

## 💡 ASTUCES

### Astuce 1: Disposer les fenêtres côte à côte

```
┌──────────────┬──────────────┐
│   PROTEUS    │   LABVIEW    │
│              │              │
│              │              │
└──────────────┴──────────────┘
```

Permet de voir la communication en temps réel!

---

### Astuce 2: Terminal MultiPlex avec tmux

```bash
# Installer tmux
sudo apt install tmux

# Lancer
tmux

# Diviser horizontalement: Ctrl+b puis "
# Diviser verticalement: Ctrl+b puis %
# Naviguer: Ctrl+b puis flèches
```

Avoir tous les terminaux dans une seule fenêtre!

---

### Astuce 3: Alias pratiques

Ajouter dans `~/.bashrc`:

```bash
alias labview-start='cd ~/Desktop/labviewproject && ./run_project.sh'
alias labview-check='cd ~/Desktop/labviewproject && ./check_system.sh'
```

Puis:
```bash
source ~/.bashrc
```

Maintenant vous pouvez lancer depuis n'importe où:
```bash
labview-start
```

---

## 🎬 ENREGISTREMENT VIDÉO

Pour enregistrer une démonstration, voir: **GUIDE_VIDEO.md**

---

## 📞 SUPPORT

**Problèmes persistants?**

1. Consulter `Documentation/TROUBLESHOOTING.md`
2. Relancer `./check_system.sh`
3. Vérifier les logs de socat
4. Tester les ports avec `cat` et `echo`

---

## ✅ SUCCÈS!

Si vous voyez:
- ✅ LED 13 clignote dans Proteus
- ✅ Données s'affichent dans LabVIEW
- ✅ Actionneurs répondent aux commandes

**🎉 Félicitations! Votre système fonctionne en temps réel!**

---

*Guide d'exécution - Version 1.0*  
*Mise à jour: 17 Novembre 2025*
