#!/bin/bash
# Script de lancement automatique du projet
# Mini-projet LabVIEW 2GII

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo "  LANCEMENT DU PROJET"
echo "  Arduino ↔ LabVIEW (Proteus)"
echo "========================================="
echo ""

# Vérifier les prérequis
echo "=== Vérification des prérequis ==="
echo ""

# Vérifier socat
if ! command -v socat &> /dev/null; then
    echo -e "${RED}✗ socat non installé${NC}"
    echo "  Installation: sudo apt install socat"
    exit 1
fi

# Vérifier arduino-cli
if ! command -v arduino-cli &> /dev/null; then
    echo -e "${RED}✗ arduino-cli non installé${NC}"
    echo "  Lancer: ./install_dependencies.sh"
    exit 1
fi

echo -e "${GREEN}✓ Tous les prérequis sont installés${NC}"
echo ""

# Compiler le code Arduino
echo "=== ÉTAPE 1: Compilation du code Arduino ==="
echo ""

if [ -f "Arduino/arduino_labview_communication.ino" ]; then
    echo "Compilation en cours..."
    
    arduino-cli compile --fqbn arduino:avr:uno Arduino/arduino_labview_communication.ino
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Compilation réussie${NC}"
        
        # Exporter le .hex
        arduino-cli compile --fqbn arduino:avr:uno --output-dir Arduino/ Arduino/arduino_labview_communication.ino
        
        if [ -f "Arduino/arduino_labview_communication.ino.hex" ]; then
            echo -e "${GREEN}✓ Fichier .hex généré: Arduino/arduino_labview_communication.ino.hex${NC}"
        fi
    else
        echo -e "${RED}✗ Erreur de compilation${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Fichier Arduino/arduino_labview_communication.ino non trouvé${NC}"
    exit 1
fi

echo ""
echo "=== ÉTAPE 2: Création des ports virtuels ==="
echo ""

# Nettoyer les anciens ports
rm -f /tmp/ttyV0 /tmp/ttyV1

echo "Création de la paire de ports virtuels..."
echo "  /tmp/ttyV0 ↔ /tmp/ttyV1"
echo ""
echo -e "${YELLOW}Ce terminal va rester occupé par socat${NC}"
echo -e "${YELLOW}Gardez-le ouvert pendant l'utilisation du projet${NC}"
echo ""
echo "Dans d'autres terminaux/fenêtres:"
echo ""
echo "  • Proteus: Utiliser /tmp/ttyV0 dans COMPIM"
echo "  • LabVIEW: Utiliser /tmp/ttyV1 dans VISA"
echo ""
echo "Pour arrêter: Ctrl+C dans ce terminal"
echo ""
echo "========================================="
echo "  PORTS VIRTUELS ACTIFS"
echo "========================================="
echo ""

# Lancer socat (bloquant)
socat -d -d pty,raw,echo=0,link=/tmp/ttyV0 pty,raw,echo=0,link=/tmp/ttyV1
