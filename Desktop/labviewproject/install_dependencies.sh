#!/bin/bash
# Installation des dépendances pour le projet
# Mini-projet LabVIEW 2GII

echo "========================================="
echo "  INSTALLATION DES DÉPENDANCES"
echo "========================================="
echo ""

# Vérifier si on est sur Ubuntu/Debian
if ! command -v apt &> /dev/null; then
    echo "❌ Ce script est conçu pour Ubuntu/Debian"
    exit 1
fi

echo "=== 1. Installation de socat (ports virtuels) ==="
echo ""
sudo apt update
sudo apt install -y socat

echo ""
echo "=== 2. Installation de Arduino CLI ==="
echo ""

# Télécharger et installer Arduino CLI
if ! command -v arduino-cli &> /dev/null; then
    echo "Installation de arduino-cli..."
    curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
    
    # Ajouter au PATH
    echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc
    export PATH=$PATH:$HOME/bin
    
    # Initialiser
    arduino-cli config init
    arduino-cli core update-index
    arduino-cli core install arduino:avr
else
    echo "✓ arduino-cli déjà installé"
fi

echo ""
echo "=== 3. Ajouter l'utilisateur au groupe dialout ==="
echo ""
sudo usermod -a -G dialout $USER

echo ""
echo "========================================="
echo "  INSTALLATION TERMINÉE"
echo "========================================="
echo ""
echo "⚠️  IMPORTANT: Vous devez vous déconnecter et reconnecter"
echo "    pour que le groupe dialout prenne effet."
echo ""
echo "Après reconnexion, lancez:"
echo "  ./check_system.sh"
echo ""
