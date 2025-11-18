# Guide de Compilation et Export du fichier .HEX

## Pourquoi un fichier .HEX ?

Proteus ne peut pas directement charger des fichiers `.ino` (code source Arduino). Il a besoin du fichier **compilé** au format Intel HEX (`.hex`), qui contient le code machine pour le microcontrôleur ATmega328P.

---

## Méthode 1 : Export Compiled Binary (Arduino IDE 2.x) - RECOMMANDÉ

### Étapes

1. **Ouvrir le fichier .ino**
   ```
   Arduino IDE → File → Open
   Sélectionner : arduino_labview_communication.ino
   ```

2. **Vérifier la carte sélectionnée**
   ```
   Tools → Board → Arduino AVR Boards → Arduino Uno
   ```

3. **Compiler pour vérifier les erreurs**
   ```
   Cliquer sur l'icône ✓ (Verify)
   Ou : Sketch → Verify/Compile
   
   Attendre le message : "Done compiling."
   ```

4. **Exporter le binaire compilé**
   ```
   Sketch → Export Compiled Binary
   
   Ou raccourci : Ctrl + Alt + S
   ```

5. **Localiser le fichier .hex**
   ```
   Le fichier sera créé dans le même dossier que le .ino
   
   Nom du fichier :
     arduino_labview_communication.ino.hex
   Ou :
     arduino_labview_communication.ino.arduino_uno.hex
   ```

6. **Copier vers le dossier Proteus**
   ```
   Copier ce fichier dans :
     Proteus/arduino_labview_communication.hex
   ```

### Avantages
- ✅ Méthode la plus simple
- ✅ Pas de recherche manuelle
- ✅ Fichier au bon endroit

---

## Méthode 2 : Compilation verbale (Arduino IDE 1.x et 2.x)

### Étapes

1. **Activer la sortie détaillée**
   ```
   File → Preferences (ou Ctrl + ,)
   
   Dans "Show verbose output during:"
     ☑ compilation
     ☐ upload (optionnel)
   
   Cliquer OK
   ```

2. **Compiler le sketch**
   ```
   Cliquer sur l'icône ✓ (Verify)
   ```

3. **Lire la console de sortie**
   ```
   Dans la partie noire en bas de l'IDE, chercher une ligne comme :
   
   Sketch uses 5234 bytes (16%) of program storage space...
   ...
   C:\Users\[USER]\AppData\Local\Temp\arduino_build_123456\arduino_labview_communication.ino.hex
   ```

4. **Copier le chemin du .hex**
   ```
   Exemple de chemin :
   C:\Users\John\AppData\Local\Temp\arduino_build_123456\arduino_labview_communication.ino.hex
   ```

5. **Naviguer vers ce dossier**
   ```
   Windows :
     Windows + R → coller le chemin du dossier → Enter
   
   Linux :
     Nautilus ou gestionnaire de fichiers
     Ctrl + L → coller le chemin
   ```

6. **Copier le fichier .hex**
   ```
   Destination : Proteus/arduino_labview_communication.hex
   ```

### Avantages
- ✅ Fonctionne avec toutes les versions Arduino IDE
- ✅ Permet de voir les détails de compilation

### Inconvénients
- ⚠️ Dossier temporaire change à chaque compilation
- ⚠️ Plus de manipulation manuelle

---

## Méthode 3 : Via ligne de commande (Avancé)

### Prérequis
- Arduino CLI installé
- Terminal ou Command Prompt

### Installation Arduino CLI

**Windows :**
```cmd
# Télécharger depuis https://arduino.github.io/arduino-cli/
# Ou via Chocolatey :
choco install arduino-cli
```

**Linux :**
```bash
# Méthode 1 : Script d'installation
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Méthode 2 : Via package manager
sudo apt install arduino-cli   # Debian/Ubuntu

# Vérifier l'installation
arduino-cli version
```

### Configuration initiale

```bash
# Initialiser la configuration
arduino-cli config init

# Mettre à jour l'index des cartes
arduino-cli core update-index

# Installer la plateforme Arduino AVR
arduino-cli core install arduino:avr
```

### Compilation

```bash
# Se placer dans le dossier du projet
cd /home/yessin/Desktop/labviewproject/Arduino

# Compiler le sketch
arduino-cli compile --fqbn arduino:avr:uno arduino_labview_communication.ino

# Le fichier .hex sera dans :
# Arduino/build/arduino.avr.uno/arduino_labview_communication.ino.hex
```

### Copier vers Proteus

```bash
# Linux
cp build/arduino.avr.uno/arduino_labview_communication.ino.hex ../Proteus/

# Windows
copy build\arduino.avr.uno\arduino_labview_communication.ino.hex ..\Proteus\
```

### Automatisation avec script

**Linux (create_hex.sh) :**
```bash
#!/bin/bash
echo "Compilation du sketch Arduino..."

# Compiler
arduino-cli compile --fqbn arduino:avr:uno arduino_labview_communication.ino

# Vérifier succès
if [ $? -eq 0 ]; then
    echo "Compilation réussie !"
    
    # Copier vers Proteus
    cp build/arduino.avr.uno/arduino_labview_communication.ino.hex ../Proteus/
    echo "Fichier .hex copié vers Proteus/"
else
    echo "Erreur de compilation !"
    exit 1
fi
```

**Rendre exécutable :**
```bash
chmod +x create_hex.sh
./create_hex.sh
```

**Windows (create_hex.bat) :**
```batch
@echo off
echo Compilation du sketch Arduino...

arduino-cli compile --fqbn arduino:avr:uno arduino_labview_communication.ino

if %ERRORLEVEL% == 0 (
    echo Compilation reussie !
    copy build\arduino.avr.uno\arduino_labview_communication.ino.hex ..\Proteus\
    echo Fichier .hex copie vers Proteus\
) else (
    echo Erreur de compilation !
    exit /b 1
)
```

---

## Vérification du fichier .hex

### Caractéristiques d'un fichier .hex valide

```
Taille : 3-15 KB (selon le code)
Format : Texte ASCII
Extension : .hex
```

### Contenu typique

```
:100000000C945D000C9485000C9485000C9485007A
:100010000C9485000C9485000C9485000C94850038
:100020000C9485000C9485000C9485000C94850028
...
:00000001FF
```

**Structure :**
- Commence par `:` (deux-points)
- Lignes de caractères hexadécimaux
- Se termine par `:00000001FF`

### Vérifier avec un éditeur de texte

```
1. Ouvrir le .hex avec Notepad++ ou VS Code
2. Vérifier :
   - Commence par ":"
   - Lignes de longueur variable
   - Caractères 0-9 et A-F uniquement
   - Dernière ligne : :00000001FF
```

### Vérifier la taille

```
Taille typique selon les fonctionnalités :

Blink basique :          ~1 KB
Notre projet (Servo) :   ~5-8 KB
Projet complexe :        ~20-30 KB

Maximum ATmega328P :     32 KB
```

---

## Chargement dans Proteus

### Étapes détaillées

1. **Ouvrir le schéma Proteus**
   ```
   Proteus → File → Open Project
   Sélectionner : Arduino_LabVIEW_Communication.pdsprj
   ```

2. **Accéder aux propriétés de l'Arduino**
   ```
   Double-cliquer sur l'Arduino Uno dans le schéma
   Fenêtre "Edit Component" s'ouvre
   ```

3. **Charger le programme**
   ```
   Champ "Program File" :
     Cliquer sur l'icône de dossier (📁)
     
   Naviguer vers :
     Proteus/arduino_labview_communication.hex
     
   Sélectionner le fichier
   Cliquer "Open"
   ```

4. **Vérifier le chargement**
   ```
   Le chemin complet du .hex doit s'afficher dans "Program File"
   Exemple :
     C:\Users\...\labviewproject\Proteus\arduino_labview_communication.hex
   ```

5. **Valider**
   ```
   Cliquer "OK" pour fermer la fenêtre
   ```

6. **Tester**
   ```
   Lancer la simulation (Play ▶)
   Vérifier :
     - LED 13 clignote au démarrage
     - Pas de message d'erreur
     - Arduino indiqué comme "Running"
   ```

---

## Troubleshooting compilation

### Erreur : "Servo.h: No such file or directory"

**Solution :**
```
La bibliothèque Servo est normalement incluse.
Si erreur :
  1. Tools → Manage Libraries (Ctrl + Shift + I)
  2. Chercher : "Servo"
  3. Installer "Servo by Arduino"
```

### Erreur : "Sketch too big"

**Solution :**
```
Le code est trop volumineux (>32KB)
Actions :
  1. Supprimer les Serial.print() de debug
  2. Optimiser les strings
  3. Réduire les variables globales
```

### Erreur : "Board not selected"

**Solution :**
```
Tools → Board → Arduino AVR Boards → Arduino Uno
```

### Erreur : Compilation lente

**Solution :**
```
1. Fermer autres programmes
2. Désactiver antivirus temporairement
3. Nettoyer le dossier de cache :
   File → Preferences → More preferences... 
   → Browse → Supprimer les fichiers build
```

---

## Recompilation après modifications

### Workflow recommandé

```
1. Modifier le code Arduino (.ino)
2. Sauvegarder (Ctrl + S)
3. Compiler (✓)
4. Exporter .hex (Sketch → Export Compiled Binary)
5. Le fichier .hex est automatiquement mis à jour
6. Dans Proteus : Recharger le .hex
   (ou simplement relancer la simulation)
```

### Proteus détecte-t-il automatiquement les changements ?

**Non** - Il faut recharger manuellement ou relancer la simulation.

**Pour recharger :**
```
Option 1 : Relancer la simulation (Stop puis Play)
Option 2 : Double-clic Arduino → Recharger le .hex → OK
```

---

## Checklist avant utilisation dans Proteus

- [ ] Code Arduino compile sans erreur
- [ ] Bibliothèque Servo installée
- [ ] Fichier .hex généré (date récente)
- [ ] Fichier .hex copié dans dossier Proteus
- [ ] Taille du .hex cohérente (3-15 KB)
- [ ] Fichier .hex chargé dans Arduino (Proteus)
- [ ] Chemin complet visible dans propriétés Arduino
- [ ] Simulation démarre sans erreur
- [ ] LED 13 clignote au boot

---

## Ressources supplémentaires

### Documentation Arduino
- [Arduino HEX File Format](https://www.arduino.cc/en/Hacking/BuildProcess)
- [Arduino CLI Documentation](https://arduino.github.io/arduino-cli/)

### Intel HEX Format
- [Wikipedia: Intel HEX](https://en.wikipedia.org/wiki/Intel_HEX)

### Proteus
- [Loading Program Files](https://www.labcenter.com/help/)

---

**Avec ces méthodes, vous devriez pouvoir générer et utiliser le fichier .hex sans problème ! 🎯**
