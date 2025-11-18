#!/bin/bash
# Script de vérification du système avant exécution
# Mini-projet LabVIEW 2GII

echo "========================================"
echo "  VÉRIFICATION DU SYSTÈME"
echo "  Projet Arduino-LabVIEW-Proteus"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
WARNINGS=0
ERRORS=0

# Fonction de vérification
check_item() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "=== 1. STRUCTURE DU PROJET ==="
echo ""

# Vérifier les dossiers
[ -d "Arduino" ] && check_item 0 "Dossier Arduino/ existe" || check_item 1 "Dossier Arduino/ manquant"
[ -d "Proteus" ] && check_item 0 "Dossier Proteus/ existe" || check_item 1 "Dossier Proteus/ manquant"
[ -d "LabVIEW" ] && check_item 0 "Dossier LabVIEW/ existe" || check_item 1 "Dossier LabVIEW/ manquant"
[ -d "Documentation" ] && check_item 0 "Dossier Documentation/ existe" || check_item 1 "Dossier Documentation/ manquant"

echo ""
echo "=== 2. FICHIERS ARDUINO ==="
echo ""

# Vérifier le fichier Arduino
if [ -f "Arduino/arduino_labview_communication.ino" ]; then
    check_item 0 "Fichier .ino présent"
    
    # Vérifier la taille
    SIZE=$(stat -f%z "Arduino/arduino_labview_communication.ino" 2>/dev/null || stat -c%s "Arduino/arduino_labview_communication.ino" 2>/dev/null)
    if [ $SIZE -gt 1000 ]; then
        check_item 0 "Taille fichier .ino correcte ($SIZE bytes)"
    else
        check_item 1 "Fichier .ino trop petit ($SIZE bytes)"
    fi
    
    # Vérifier les includes
    if grep -q "#include <Servo.h>" "Arduino/arduino_labview_communication.ino"; then
        check_item 0 "Bibliothèque Servo incluse"
    else
        check_item 1 "Bibliothèque Servo manquante"
    fi
    
    # Vérifier Serial.begin
    if grep -q "Serial.begin(9600)" "Arduino/arduino_labview_communication.ino"; then
        check_item 0 "Serial.begin(9600) présent"
    else
        check_item 1 "Serial.begin(9600) manquant"
    fi
else
    check_item 1 "Fichier .ino manquant"
fi

# Vérifier si .hex existe
if [ -f "Arduino/"*.hex ]; then
    check_item 0 "Fichier .hex trouvé"
else
    check_warning "Fichier .hex non trouvé (à compiler)"
fi

echo ""
echo "=== 3. LOGICIELS REQUIS ==="
echo ""

# Arduino IDE
if command -v arduino &> /dev/null || command -v arduino-cli &> /dev/null; then
    check_item 0 "Arduino IDE/CLI installé"
else
    check_item 1 "Arduino IDE/CLI non trouvé"
fi

# Proteus (difficile à vérifier sous Linux)
if [ -f "/usr/bin/proteus" ] || [ -d "/opt/proteus" ] || [ -d "$HOME/.wine/drive_c/Program Files/Labcenter Electronics/Proteus 8 Professional" ]; then
    check_item 0 "Proteus détecté"
else
    check_warning "Proteus non détecté (peut être installé ailleurs)"
fi

# LabVIEW (difficile à vérifier)
if [ -d "/usr/local/natinst/LabVIEW"* ] || [ -d "$HOME/.wine/drive_c/Program Files/National Instruments/LabVIEW"* ]; then
    check_item 0 "LabVIEW détecté"
else
    check_warning "LabVIEW non détecté (peut être installé ailleurs)"
fi

echo ""
echo "=== 4. PORTS VIRTUELS (LINUX) ==="
echo ""

# Vérifier socat
if command -v socat &> /dev/null; then
    check_item 0 "socat installé"
    
    # Vérifier si des ports virtuels existent
    if [ -e "/tmp/ttyV0" ] && [ -e "/tmp/ttyV1" ]; then
        check_item 0 "Ports virtuels /tmp/ttyV0 et /tmp/ttyV1 existent"
    else
        check_warning "Ports virtuels non créés (utiliser socat)"
    fi
else
    check_item 1 "socat non installé"
    echo "   Installation: sudo apt install socat"
fi

echo ""
echo "=== 5. DOCUMENTATION ==="
echo ""

# Vérifier les fichiers de documentation
DOCS=(
    "README.md"
    "GUIDE_VIDEO.md"
    "Proteus/INSTRUCTIONS_PROTEUS.md"
    "LabVIEW/INSTRUCTIONS_LABVIEW.md"
    "Documentation/GUIDE_COMPLET.md"
    "Documentation/PROTOCOLE_COMMUNICATION.md"
    "Documentation/TROUBLESHOOTING.md"
)

for doc in "${DOCS[@]}"; do
    [ -f "$doc" ] && check_item 0 "$(basename $doc)" || check_item 1 "$(basename $doc) manquant"
done

echo ""
echo "=== 6. PERMISSIONS ==="
echo ""

# Vérifier les permissions de l'utilisateur pour les ports série
if groups | grep -q "dialout\|uucp"; then
    check_item 0 "Utilisateur dans groupe dialout/uucp"
else
    check_warning "Utilisateur pas dans groupe dialout (ports série)"
    echo "   Solution: sudo usermod -a -G dialout $USER"
fi

echo ""
echo "========================================"
echo "  RÉSUMÉ"
echo "========================================"
echo -e "${GREEN}Succès: $SUCCESS${NC}"
echo -e "${YELLOW}Avertissements: $WARNINGS${NC}"
echo -e "${RED}Erreurs: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Système prêt pour l'exécution !${NC}"
    echo ""
    echo "=== PROCHAINES ÉTAPES ==="
    echo ""
    echo "1. CRÉER LES PORTS VIRTUELS (Terminal 1):"
    echo "   socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1"
    echo ""
    echo "2. COMPILER LE CODE ARDUINO:"
    echo "   arduino-cli compile --fqbn arduino:avr:uno Arduino/arduino_labview_communication.ino"
    echo "   arduino-cli compile --fqbn arduino:avr:uno --output-dir Arduino/ Arduino/arduino_labview_communication.ino"
    echo ""
    echo "3. LANCER PROTEUS:"
    echo "   - Ouvrir Proteus Design Suite"
    echo "   - Créer le schéma selon Proteus/INSTRUCTIONS_PROTEUS.md"
    echo "   - Charger le fichier .hex"
    echo "   - Configurer COMPIM sur /tmp/ttyV0"
    echo "   - Lancer la simulation (Play ▶)"
    echo ""
    echo "4. LANCER LABVIEW:"
    echo "   - Ouvrir LabVIEW"
    echo "   - Créer le VI selon LabVIEW/INSTRUCTIONS_LABVIEW.md"
    echo "   - Configurer le port /tmp/ttyV1"
    echo "   - Lancer le VI (Run)"
    echo ""
else
    echo -e "${RED}✗ Système non prêt. Corriger les erreurs ci-dessus.${NC}"
fi

echo ""
echo "Pour plus d'aide: cat Documentation/TROUBLESHOOTING.md"
echo ""
