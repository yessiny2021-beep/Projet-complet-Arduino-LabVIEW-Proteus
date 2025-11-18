# Guide de Dépannage
## Résolution des problèmes courants

---

## 🔴 Catégorie : Problèmes de Communication Série

### Problème 1 : Aucune communication entre Proteus et LabVIEW

#### Symptômes
- LabVIEW ne reçoit aucune donnée
- Timeout constant dans VISA Read
- LED de connexion reste éteinte

#### Causes possibles
1. Ports virtuels non créés ou mal configurés
2. Proteus et LabVIEW sur le même port
3. Port série déjà utilisé par une autre application
4. Mauvaise configuration du COMPIM dans Proteus

#### Solutions

**Étape 1 : Vérifier les ports virtuels**

**Windows (com0com) :**
```
1. Ouvrir "Setup Command Prompt" de com0com (en tant qu'administrateur)
2. Lister les paires : command> list
3. Si aucune paire, créer : command> install PortName=COM10 PortName=COM11
4. Vérifier dans le Gestionnaire de périphériques
```

**Linux (socat) :**
```bash
# Terminal 1 : Créer les ports virtuels
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1

# Laisser cette fenêtre ouverte pendant la simulation

# Terminal 2 : Vérifier les ports
ls -l /tmp/ttyV*
```

**Étape 2 : Vérifier la configuration Proteus**
```
1. Double-cliquer sur COMPIM dans le schéma
2. Paramètres :
   - Physical Port: COM10 (Windows) ou /tmp/ttyV0 (Linux)
   - Baud Rate: 9600
   - Data Bits: 8
   - Parity: None
   - Stop Bits: 1
3. Cliquer OK
4. Relancer la simulation
```

**Étape 3 : Vérifier la configuration LabVIEW**
```
1. Control "Port COM" : COM11 (Windows) ou /tmp/ttyV1 (Linux)
2. VISA Configure Serial Port :
   - Baud Rate: 9600
   - Data Bits: 8
   - Parity: 0 (None)
   - Stop Bits: 10 (1 stop bit)
3. Vérifier que le port n'est pas déjà ouvert ailleurs
```

**Étape 4 : Test avec un terminal série**

**Windows (PuTTY) :**
```
1. Télécharger PuTTY
2. Configuration :
   - Connection Type: Serial
   - Serial Line: COM11
   - Speed: 9600
3. Ouvrir
4. Lancer simulation Proteus
5. Vérifier réception des messages "T:...,P:...,B:..."
```

**Linux (minicom) :**
```bash
# Installer minicom
sudo apt install minicom

# Configurer et lancer
minicom -D /tmp/ttyV1 -b 9600

# Vous devriez voir les messages Arduino
```

---

### Problème 2 : Données corrompues ou illisibles

#### Symptômes
- Messages reçus incomplets : "T:25.╗P:512"
- Caractères étranges : "T:25.5,╛╛╛╛"
- Parsing échoue dans LabVIEW

#### Causes possibles
1. Baud Rate différent entre Arduino, Proteus et LabVIEW
2. Mauvaise configuration du COMPIM
3. Buffer overflow
4. Noise dans la simulation

#### Solutions

**Vérifier la cohérence du Baud Rate :**
```
Arduino Code:      Serial.begin(9600);
Proteus COMPIM:    Baud Rate = 9600
LabVIEW VISA:      Baud Rate = 9600

Tous doivent être identiques !
```

**Vider le buffer avant lecture (LabVIEW) :**
```
Avant VISA Read:
  1. Ajouter VISA Flush I/O Buffer
  2. Option: Discard Input and Output Buffers
  3. Puis VISA Read
```

**Ajouter un délai après ouverture du port :**
```
LabVIEW sequence:
  1. VISA Configure Serial Port
  2. Wait (500ms)  ← Important
  3. VISA Flush I/O Buffer
  4. Démarrer boucle de lecture
```

---

### Problème 3 : Communication intermittente

#### Symptômes
- Données reçues par intermittence
- Alternance entre connexion et déconnexion
- Messages manquants

#### Causes possibles
1. Timeout trop court
2. Simulation Proteus trop lente
3. Ordinateur surchargé
4. Conflits de timing

#### Solutions

**Augmenter le timeout VISA :**
```
VISA Read:
  - Timeout: 1000ms → 3000ms
```

**Optimiser la simulation Proteus :**
```
1. Debug → Set Animation Options
2. Réduire la vitesse d'animation
3. Désactiver l'affichage des valeurs temps réel
4. Fermer autres applications lourdes
```

**Réduire la fréquence d'envoi Arduino :**
```cpp
// Dans le code Arduino
const long interval = 100;  // 100ms
// Changer en :
const long interval = 200;  // 200ms (moins de charge)
```

---

## 🟠 Catégorie : Problèmes Proteus

### Problème 4 : Arduino ne démarre pas dans Proteus

#### Symptômes
- LED 13 ne clignote pas au démarrage
- Aucune activité sur l'Arduino
- Message d'erreur dans Proteus

#### Causes possibles
1. Fichier .hex invalide ou corrompu
2. Fichier .hex non chargé
3. Arduino mal alimenté dans le schéma
4. Problème de bootloader

#### Solutions

**Étape 1 : Vérifier le fichier .hex**
```
1. Arduino IDE → File → Preferences
2. Cocher "Show verbose output during compilation"
3. Compiler le sketch (Vérifier)
4. Chercher dans la sortie :
   "... .hex"
5. Copier ce fichier dans votre dossier projet
```

**Alternative - Export Compiled Binary :**
```
Arduino IDE 2.x:
  Sketch → Export Compiled Binary
  
Arduino IDE 1.x:
  Sketch → Export Compiled Binary
  
Le fichier .hex sera dans le dossier du sketch
```

**Étape 2 : Charger dans Proteus**
```
1. Double-cliquer sur l'Arduino Uno
2. Cliquer sur l'icône de dossier (Program File)
3. Naviguer vers le fichier .hex
4. Cliquer Open
5. Vérifier que le chemin s'affiche
6. Cliquer OK
```

**Étape 3 : Vérifier l'alimentation**
```
Dans le schéma Proteus :
  - Arduino pin VIN ou 5V doit être alimenté
  - Arduino pin GND doit être connecté à la masse
  - Vérifier avec le mode Debug (point vert sur 5V)
```

---

### Problème 5 : Composants ne réagissent pas

#### Symptômes
- LEDs ne s'allument pas
- Servo ne bouge pas
- Buzzer ne sonne pas

#### Causes possibles
1. Mauvais câblage dans Proteus
2. Pins incorrectes
3. Résistances manquantes ou mauvaise valeur
4. Composants mal orientés

#### Solutions

**Vérifier le câblage des LEDs :**
```
Arduino D9 → Résistance 220Ω → LED Rouge (Anode) → GND (Cathode)
                                     ─┐
                                     └─── Orientation importante !
                                          Anode (+) : tige longue
                                          Cathode (-) : tige courte
```

**Vérifier le servo :**
```
Servo Signal → Arduino D6
Servo VCC → 5V (ou alimentation externe si puissant)
Servo GND → GND commun
```

**Vérifier le buzzer :**
```
Buzzer + → Arduino D8
Buzzer - → GND

Si passif : peut nécessiter un signal PWM
Si actif : ON/OFF suffit
```

**Test individuel des composants :**
```
1. Mode Debug (F12)
2. Clic droit sur un pin Arduino → "Digital Override"
3. Forcer HIGH/LOW manuellement
4. Vérifier réaction du composant
```

---

### Problème 6 : Simulation très lente

#### Symptômes
- Proteus lag important
- Simulation pas en temps réel
- Ordinateur ralenti

#### Solutions

**Optimiser le schéma :**
```
1. Supprimer les composants inutiles
2. Désactiver les oscilloscopes/analyseurs
3. Réduire le nombre de Virtual Terminals
4. Simplifier les affichages
```

**Optimiser les paramètres :**
```
Debug → Set Animation Options :
  - Animation Quality: Medium
  - Single Step Time: Increase
  
System → Set Simulation Speed :
  - Reduce animation speed
```

**Fermer les autres applications :**
```
- Fermer navigateurs web
- Fermer applications lourdes
- Augmenter la priorité de Proteus dans le gestionnaire de tâches
```

---

## 🟡 Catégorie : Problèmes LabVIEW

### Problème 7 : Erreur VISA au démarrage

#### Symptômes
- Message d'erreur rouge dans LabVIEW
- Code erreur VISA -1073807339
- Impossible d'ouvrir le port

#### Causes possibles
1. Port série déjà ouvert par une autre application
2. Port série inexistant
3. Permissions insuffisantes (Linux)
4. Driver VISA non installé

#### Solutions

**Windows - Vérifier les applications utilisant le port :**
```
1. Gestionnaire de périphériques
2. Ports (COM & LPT)
3. Vérifier quel programme utilise COM11
4. Fermer cette application
5. Relancer LabVIEW
```

**Linux - Permissions :**
```bash
# Ajouter l'utilisateur au groupe dialout
sudo usermod -a -G dialout $USER

# Se déconnecter et reconnecter

# Vérifier les permissions
ls -l /tmp/ttyV1
# Doit être accessible en lecture/écriture
```

**Réinstaller les drivers VISA :**
```
1. Désinstaller NI-VISA
2. Redémarrer
3. Télécharger la dernière version depuis ni.com
4. Installer
5. Redémarrer
6. Relancer LabVIEW
```

---

### Problème 8 : Parsing échoue dans LabVIEW

#### Symptômes
- Indicateurs restent à 0
- Erreur dans Scan From String
- Données brutes visibles mais pas parsées

#### Causes possibles
1. Format string incorrect
2. Message Arduino modifié
3. Caractères supplémentaires

#### Solutions

**Vérifier le format dans Scan From String :**
```
Message Arduino: "T:25.5,P:512,B:1\n"
Format String:   "T:%f,P:%d,B:%d"

Correspondance:
  %f → float (température)
  %d → integer (potentiomètre)
  %d → integer (bouton)
```

**Méthode alternative - Match Pattern :**
```
1. VISA Read → String
2. Match Pattern "T:" → reste = "25.5,P:512,B:1\n"
3. Match Pattern "P:" → reste = "512,B:1\n"
4. Match Pattern "B:" → reste = "1\n"
5. String To Number pour chaque valeur
```

**Debug du parsing :**
```
1. Afficher la string brute reçue
2. Vérifier les caractères invisibles (\r, \n, espaces)
3. Ajouter String Length pour vérifier la taille
4. Utiliser Format & Append pour construire le format correct
```

---

### Problème 9 : VI ne s'ouvre pas dans LabVIEW 2021

#### Symptômes
- Erreur "VI was saved in a later version"
- Impossible d'ouvrir le .vi
- Message de compatibilité

#### Cause
VI sauvegardé dans une version plus récente que 2021

#### Solution

**Si vous avez créé le VI dans une version récente :**
```
1. Ouvrir LabVIEW version récente
2. File → Save As...
3. Choisir "Previous Version..."
4. Sélectionner "21.0" ou antérieur
5. Sauvegarder
6. Tester dans LabVIEW 2021
```

**Si vous n'avez pas accès à la version récente :**
```
Recréer le VI from scratch dans LabVIEW 2021
(en suivant les instructions fournies)
```

---

### Problème 10 : Commandes ne sont pas envoyées

#### Symptômes
- Boutons "Envoyer" ne font rien
- Actionneurs ne réagissent pas
- Pas d'erreur affichée

#### Causes possibles
1. Event Structure mal configurée
2. VISA Write non connecté
3. Format de commande incorrect
4. Bouton pas en mode "Latch"

#### Solutions

**Vérifier l'Event Structure :**
```
1. Right-click Event Structure → Edit Events
2. Vérifier les événements "Value Change"
3. S'assurer que chaque bouton a son événement
4. Vérifier que VISA Write est dans chaque case
```

**Vérifier les Mechanical Actions des boutons :**
```
1. Right-click sur le bouton → Properties
2. Onglet Operation
3. Mechanical Action: "Latch When Released"
4. Apply → OK
```

**Debug de l'envoi :**
```
1. Ajouter un String Indicator après Format String
2. Vérifier le contenu avant VISA Write
3. Exemple attendu : "LED:255,128,0\n"
4. Vérifier présence du \n final
```

---

## 🟢 Catégorie : Problèmes Système

### Problème 11 : Ports virtuels disparaissent après redémarrage

#### Windows (com0com)

**Solution temporaire :**
```
1. Relancer Setup Command Prompt (admin)
2. Recréer la paire : install PortName=COM10 PortName=COM11
```

**Solution permanente :**
```
1. Vérifier que com0com est en service
2. Services → com0com → Type de démarrage: Automatique
3. Redémarrer le service si nécessaire
```

#### Linux (socat)

**Créer un script de démarrage :**
```bash
# Créer le fichier /home/user/start_virtual_ports.sh
#!/bin/bash
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1 &
echo "Ports virtuels créés : /tmp/ttyV0 et /tmp/ttyV1"

# Rendre exécutable
chmod +x /home/user/start_virtual_ports.sh

# Lancer au démarrage (ajouter à .bashrc ou créer service systemd)
```

---

### Problème 12 : Conflit entre plusieurs applications

#### Symptômes
- "Port already in use"
- Impossible d'ouvrir le port dans LabVIEW
- Proteus ne peut pas démarrer COMPIM

#### Solutions

**Identifier le processus utilisant le port :**

**Windows :**
```cmd
# Mode Monitor (télécharger depuis ProcessMonitor Sysinternals)
# Filtrer sur le nom du port COM11

Ou utiliser PowerShell:
Get-WmiObject Win32_SerialPort | Select Name, DeviceID
```

**Linux :**
```bash
# Voir les processus utilisant le port
lsof | grep ttyV1

# Tuer le processus si nécessaire
kill -9 <PID>
```

**Ordre de démarrage recommandé :**
```
1. Créer les ports virtuels
2. Démarrer Proteus et charger le projet
3. Lancer la simulation Proteus
4. Lancer LabVIEW et ouvrir le VI
5. Connecter dans LabVIEW
```

---

## 🔵 Catégorie : Problèmes Spécifiques

### Problème 13 : Température toujours à 0 ou valeur fixe

#### Causes
1. LM35 mal câblé dans Proteus
2. Pin A0 non connecté
3. LM35 en mode "static temperature"

#### Solutions

**Vérifier le câblage LM35 :**
```
LM35 Pin 1 (VCC) → 5V
LM35 Pin 2 (OUT) → Arduino A0
LM35 Pin 3 (GND) → GND
```

**Modifier la température dans Proteus :**
```
1. Double-cliquer sur le LM35
2. Changer "Temperature" (par défaut 27°C)
3. Tester différentes valeurs
4. Vérifier changement dans LabVIEW
```

**Tester avec une valeur fixe dans le code :**
```cpp
// Test temporaire
temperature = 25.5;  // Valeur fixe pour test
// Commenter la lecture analogRead temporairement
```

---

### Problème 14 : Servo tremble ou position incorrecte

#### Causes
1. Alimentation insuffisante
2. Signal PWM bruité
3. Bibliothèque Servo mal configurée

#### Solutions

**Ajouter capacité de découplage :**
```
Proteus :
  - Ajouter condensateur 100µF entre VCC et GND du servo
  - Filtre passe-bas sur le signal
```

**Vérifier l'alimentation :**
```
Si servo puissant :
  - Ne pas alimenter depuis Arduino 5V
  - Utiliser source externe dans Proteus
  - Connecter GND commun
```

**Ajuster le code :**
```cpp
// Ajouter un délai après écriture
myServo.write(servoPosition);
delay(15);  // Stabilisation
```

---

### Problème 15 : Graphique LabVIEW ne met pas à jour

#### Causes
1. Chart History Length trop petite
2. Données non connectées correctement
3. Chart en mode "Scope" au lieu de "Strip"

#### Solutions

**Configurer le Chart :**
```
1. Right-click sur Chart → Properties
2. Onglet Display Format:
   - Update Mode: Strip Chart
3. Onglet Scales:
   - Y-Axis: 0 à 100 (pour température)
4. Onglet History:
   - Chart History Length: 100 ou plus
5. Apply → OK
```

**Vérifier la connexion :**
```
Block Diagram:
  [Temperature] → Wire → [Chart]
  
Attention: Chart attend un scalaire, pas un array
```

---

## 📋 Checklist de dépannage générale

Lorsque rien ne fonctionne, suivre cette checklist :

### Arduino
- [ ] Code compile sans erreur
- [ ] Fichier .hex généré et récent
- [ ] Bibliothèque Servo installée
- [ ] Baud rate = 9600 dans Serial.begin()

### Proteus
- [ ] Fichier .hex chargé dans Arduino
- [ ] Tous les composants câblés correctement
- [ ] COMPIM ajouté et configuré (9600 baud)
- [ ] Port COM configuré (COM10)
- [ ] Simulation démarre sans erreur
- [ ] LED 13 clignote au boot

### Ports virtuels
- [ ] Paire de ports créée (COM10 ↔ COM11)
- [ ] Ports visibles dans gestionnaire de périphériques
- [ ] Aucune autre application n'utilise ces ports
- [ ] Permissions correctes (Linux)

### LabVIEW
- [ ] VISA Configure Serial Port correct (9600, 8, N, 1)
- [ ] Port COM correct (COM11)
- [ ] VISA Read avec timeout suffisant (1000ms)
- [ ] Format String correct pour parsing
- [ ] Event Structure configurée pour commandes
- [ ] VISA Close appelé à la fermeture

### Test de base
- [ ] Test avec terminal série (PuTTY/minicom) réussi
- [ ] Messages Arduino visibles dans le terminal
- [ ] Commandes manuelles fonctionnent depuis terminal

---

## 🆘 Dernier recours

Si rien ne fonctionne après avoir tout essayé :

1. **Redémarrer l'ordinateur**
2. **Réinstaller com0com/socat**
3. **Créer un nouveau projet from scratch**
4. **Tester sur un autre ordinateur**
5. **Contacter votre enseignant avec :**
   - Captures d'écran des erreurs
   - Configuration exacte utilisée
   - Liste des étapes déjà tentées

---

## 📞 Ressources supplémentaires

### Forums et communautés
- [Arduino Forum](https://forum.arduino.cc/)
- [LabVIEW Community](https://forums.ni.com/t5/LabVIEW/ct-p/7013)
- [Proteus Forum](https://www.labcenter.com/forum/)

### Documentation officielle
- [Arduino Serial Reference](https://www.arduino.cc/reference/en/language/functions/communication/serial/)
- [LabVIEW VISA Help](https://www.ni.com/docs/en-US/bundle/labview/page/lv help/visa.html)
- [Proteus Help](https://www.labcenter.com/help/)

---

**N'hésitez pas à consulter les autres fichiers de documentation pour plus d'informations !**
