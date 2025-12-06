#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de génération de template pour LabVIEW 2015
Ce script crée un fichier de configuration et des instructions
pour créer le VI Arduino_Communication.vi
"""

import json
import os
from datetime import datetime

def create_vi_template():
    """Crée un template de configuration pour le VI"""
    
    # Configuration du VI
    vi_config = {
        "project_name": "Arduino Communication LabVIEW 2015",
        "vi_name": "Arduino_Communication.vi",
        "version": "15.0",
        "author": "Student Project",
        "created_date": datetime.now().strftime("%Y-%m-%d"),
        
        "front_panel": {
            "controls": [
                {
                    "name": "Port COM",
                    "type": "String Control",
                    "default_value": "COM3",
                    "description": "Port série de communication"
                },
                {
                    "name": "Baud Rate",
                    "type": "Numeric Control (I32)",
                    "default_value": 9600,
                    "description": "Vitesse de communication"
                },
                {
                    "name": "LED ON",
                    "type": "Boolean Button",
                    "mechanical_action": "Latch When Released",
                    "description": "Bouton pour allumer la LED"
                },
                {
                    "name": "LED OFF",
                    "type": "Boolean Button",
                    "mechanical_action": "Latch When Released",
                    "description": "Bouton pour éteindre la LED"
                },
                {
                    "name": "Lire Capteur",
                    "type": "Boolean Button",
                    "mechanical_action": "Latch When Released",
                    "description": "Bouton pour lire le capteur"
                },
                {
                    "name": "Obtenir Statut",
                    "type": "Boolean Button",
                    "mechanical_action": "Latch When Released",
                    "description": "Bouton pour obtenir le statut complet"
                },
                {
                    "name": "Stop",
                    "type": "Stop Button",
                    "mechanical_action": "Latch When Released",
                    "description": "Arrêter le VI"
                }
            ],
            "indicators": [
                {
                    "name": "État LED",
                    "type": "String Indicator",
                    "description": "Affiche l'état de la LED"
                },
                {
                    "name": "Valeur Capteur",
                    "type": "Numeric Indicator (I32)",
                    "range": "0-1023",
                    "description": "Valeur du capteur analogique"
                },
                {
                    "name": "Graph Capteur",
                    "type": "Waveform Chart",
                    "history": 100,
                    "description": "Affichage temps réel du capteur"
                },
                {
                    "name": "Messages",
                    "type": "String Indicator",
                    "display_style": "Scrolling",
                    "description": "Log des communications"
                },
                {
                    "name": "Connecté",
                    "type": "LED (Boolean Indicator)",
                    "description": "Indicateur de connexion"
                },
                {
                    "name": "Error Out",
                    "type": "Error Cluster",
                    "description": "Affichage des erreurs"
                }
            ]
        },
        
        "block_diagram": {
            "initialization": [
                {
                    "function": "VISA Configure Serial Port",
                    "palette": "Instrument I/O → Serial",
                    "inputs": {
                        "VISA resource name": "Port COM control",
                        "baud rate": 9600,
                        "data bits": 8,
                        "parity": 0,
                        "stop bits": 10,
                        "flow control": 0,
                        "timeout": 1000
                    },
                    "outputs": ["VISA session out", "error out"]
                }
            ],
            
            "main_loop": {
                "type": "While Loop",
                "condition": "NOT Stop Button",
                "timeout": 100,
                
                "event_structure": [
                    {
                        "event": "LED ON - Value Change",
                        "actions": [
                            "Send 'L1\\n' via VISA Write",
                            "Wait 50ms",
                            "Read response via VISA Read (256 bytes)",
                            "Display in État LED indicator"
                        ]
                    },
                    {
                        "event": "LED OFF - Value Change",
                        "actions": [
                            "Send 'L0\\n' via VISA Write",
                            "Wait 50ms",
                            "Read response via VISA Read (256 bytes)",
                            "Display in État LED indicator"
                        ]
                    },
                    {
                        "event": "Lire Capteur - Value Change",
                        "actions": [
                            "Send 'R\\n' via VISA Write",
                            "Wait 50ms",
                            "Read response via VISA Read (256 bytes)",
                            "Match Pattern 'SENSOR:'",
                            "Scan From String '%d'",
                            "Display in Valeur Capteur indicator",
                            "Update Graph"
                        ]
                    },
                    {
                        "event": "Obtenir Statut - Value Change",
                        "actions": [
                            "Send 'S\\n' via VISA Write",
                            "Wait 50ms",
                            "Read response via VISA Read (256 bytes)",
                            "Parse STATUS message",
                            "Update all indicators"
                        ]
                    },
                    {
                        "event": "Timeout: 100ms",
                        "actions": ["Continue loop"]
                    }
                ]
            },
            
            "cleanup": [
                {
                    "function": "VISA Close",
                    "inputs": ["VISA session"],
                    "description": "Fermer la connexion série"
                },
                {
                    "function": "Simple Error Handler",
                    "inputs": ["error in"],
                    "description": "Gérer les erreurs"
                }
            ]
        },
        
        "communication_protocol": {
            "commands": {
                "L1": "Allumer LED",
                "L0": "Éteindre LED",
                "R": "Lire capteur",
                "S": "Obtenir statut"
            },
            "responses": {
                "LED:ON": "LED allumée",
                "LED:OFF": "LED éteinte",
                "SENSOR:xxx": "Valeur capteur (0-1023)",
                "STATUS:LED=x,SENSOR=yyy": "Statut complet"
            }
        },
        
        "serial_configuration": {
            "baud_rate": 9600,
            "data_bits": 8,
            "stop_bits": 1,
            "parity": "None",
            "flow_control": "None"
        }
    }
    
    return vi_config

def save_template(config, output_dir="LabVIEW/VIs"):
    """Sauvegarde le template en JSON"""
    
    # Créer le dossier si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    # Chemin du fichier
    template_file = os.path.join(output_dir, "Arduino_Communication_Template.json")
    
    # Sauvegarder
    with open(template_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Template sauvegardé : {template_file}")
    return template_file

def generate_creation_script(config, output_dir="LabVIEW/VIs"):
    """Génère un script de création pas à pas"""
    
    script_file = os.path.join(output_dir, "CREATE_VI_STEPS.txt")
    
    with open(script_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("  ÉTAPES DE CRÉATION DU VI ARDUINO_COMMUNICATION.VI\n")
        f.write("  LabVIEW 2015\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("📋 ÉTAPE 1 : CRÉER LE PROJET\n")
        f.write("-" * 80 + "\n")
        f.write("1. Lancez LabVIEW 2015\n")
        f.write("2. File → New VI (Ctrl+N)\n")
        f.write("3. File → Save As...\n")
        f.write(f"   - Nom : {config['vi_name']}\n")
        f.write(f"   - Emplacement : {output_dir}/\n\n")
        
        f.write("🎨 ÉTAPE 2 : FACE-AVANT (FRONT PANEL)\n")
        f.write("-" * 80 + "\n")
        f.write("A. CONTRÔLES :\n\n")
        
        for i, control in enumerate(config['front_panel']['controls'], 1):
            f.write(f"{i}. {control['name']}\n")
            f.write(f"   Type : {control['type']}\n")
            if 'default_value' in control:
                f.write(f"   Valeur par défaut : {control['default_value']}\n")
            if 'mechanical_action' in control:
                f.write(f"   Mechanical Action : {control['mechanical_action']}\n")
            f.write(f"   → {control['description']}\n\n")
        
        f.write("B. INDICATEURS :\n\n")
        
        for i, indicator in enumerate(config['front_panel']['indicators'], 1):
            f.write(f"{i}. {indicator['name']}\n")
            f.write(f"   Type : {indicator['type']}\n")
            if 'range' in indicator:
                f.write(f"   Range : {indicator['range']}\n")
            if 'history' in indicator:
                f.write(f"   History : {indicator['history']} points\n")
            f.write(f"   → {indicator['description']}\n\n")
        
        f.write("🔧 ÉTAPE 3 : DIAGRAMME DE BLOCS (BLOCK DIAGRAM)\n")
        f.write("-" * 80 + "\n\n")
        
        f.write("A. INITIALISATION (Avant la boucle) :\n\n")
        for init in config['block_diagram']['initialization']:
            f.write(f"📍 {init['function']}\n")
            f.write(f"   Palette : {init['palette']}\n")
            f.write("   Entrées :\n")
            for key, value in init['inputs'].items():
                f.write(f"     - {key} : {value}\n")
            f.write("   Sorties : " + ", ".join(init['outputs']) + "\n\n")
        
        f.write("B. BOUCLE PRINCIPALE (While Loop) :\n\n")
        f.write(f"   Type : {config['block_diagram']['main_loop']['type']}\n")
        f.write(f"   Condition : {config['block_diagram']['main_loop']['condition']}\n")
        f.write(f"   Timeout : {config['block_diagram']['main_loop']['timeout']} ms\n\n")
        
        f.write("   EVENT STRUCTURE :\n\n")
        for event in config['block_diagram']['main_loop']['event_structure']:
            f.write(f"   📌 {event['event']}\n")
            for action in event['actions']:
                f.write(f"      • {action}\n")
            f.write("\n")
        
        f.write("C. NETTOYAGE (Après la boucle) :\n\n")
        for cleanup in config['block_diagram']['cleanup']:
            f.write(f"📍 {cleanup['function']}\n")
            f.write(f"   Entrées : {', '.join(cleanup['inputs'])}\n")
            f.write(f"   → {cleanup['description']}\n\n")
        
        f.write("⚙️ ÉTAPE 4 : CONFIGURATION SÉRIE\n")
        f.write("-" * 80 + "\n")
        for key, value in config['serial_configuration'].items():
            f.write(f"  {key.replace('_', ' ').title()}: {value}\n")
        f.write("\n")
        
        f.write("📡 ÉTAPE 5 : PROTOCOLE DE COMMUNICATION\n")
        f.write("-" * 80 + "\n")
        f.write("COMMANDES :\n")
        for cmd, desc in config['communication_protocol']['commands'].items():
            f.write(f"  {cmd} → {desc}\n")
        f.write("\nRÉPONSES :\n")
        for resp, desc in config['communication_protocol']['responses'].items():
            f.write(f"  {resp} → {desc}\n")
        f.write("\n")
        
        f.write("✅ ÉTAPE 6 : TEST\n")
        f.write("-" * 80 + "\n")
        f.write("1. Connectez Arduino ou lancez Proteus\n")
        f.write("2. Sélectionnez le bon port COM\n")
        f.write("3. Exécutez le VI (Run)\n")
        f.write("4. Testez chaque bouton\n")
        f.write("5. Vérifiez les valeurs affichées\n\n")
        
        f.write("📸 ÉTAPE 7 : CAPTURES D'ÉCRAN\n")
        f.write("-" * 80 + "\n")
        f.write("1. File → Print Window (Ctrl+P)\n")
        f.write("2. Format : PNG\n")
        f.write("3. Sauvegarder :\n")
        f.write("   - Front Panel : Arduino_Communication_Front.png\n")
        f.write("   - Block Diagram : Arduino_Communication_Block.png\n\n")
        
        f.write("=" * 80 + "\n")
        f.write("  FIN DES INSTRUCTIONS\n")
        f.write("=" * 80 + "\n")
    
    print(f"✅ Script de création sauvegardé : {script_file}")
    return script_file

def generate_readme(output_dir="LabVIEW/VIs"):
    """Génère un README pour les fichiers générés"""
    
    readme_file = os.path.join(output_dir, "TEMPLATE_README.txt")
    
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write("FICHIERS GÉNÉRÉS POUR LABVIEW 2015\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("📄 Arduino_Communication_Template.json\n")
        f.write("   Configuration complète du VI en format JSON\n")
        f.write("   Utilisez ce fichier comme référence pour créer votre VI\n\n")
        
        f.write("📄 CREATE_VI_STEPS.txt\n")
        f.write("   Instructions étape par étape pour créer le VI\n")
        f.write("   Suivez ces étapes dans LabVIEW 2015\n\n")
        
        f.write("📄 VISUAL_GUIDE.md\n")
        f.write("   Guide visuel avec diagrammes ASCII\n")
        f.write("   Représentation visuelle de l'interface\n\n")
        
        f.write("⚠️ IMPORTANT :\n")
        f.write("-" * 80 + "\n")
        f.write("Les fichiers .vi sont des fichiers binaires propriétaires de LabVIEW.\n")
        f.write("Ils DOIVENT être créés dans l'application LabVIEW 2015.\n")
        f.write("Ces fichiers de template sont des guides pour vous aider.\n\n")
        
        f.write("🚀 POUR CRÉER VOTRE VI :\n")
        f.write("-" * 80 + "\n")
        f.write("1. Ouvrez LabVIEW 2015\n")
        f.write("2. Lisez CREATE_VI_STEPS.txt\n")
        f.write("3. Consultez Arduino_Communication_Template.json pour les détails\n")
        f.write("4. Consultez VISUAL_GUIDE.md pour la représentation visuelle\n")
        f.write("5. Créez le VI en suivant les instructions\n")
        f.write("6. Sauvegardez : Arduino_Communication.vi\n\n")
        
        f.write("📚 RESSOURCES SUPPLÉMENTAIRES :\n")
        f.write("-" * 80 + "\n")
        f.write("- ../INSTRUCTIONS_LABVIEW.md : Guide complet\n")
        f.write("- ../BLOCK_DIAGRAM_TEMPLATE.md : Template détaillé\n")
        f.write("- ../../Documentation/GUIDE_COMPLET.md : Documentation projet\n\n")
    
    print(f"✅ README sauvegardé : {readme_file}")
    return readme_file

def main():
    """Fonction principale"""
    print("\n" + "=" * 80)
    print("  GÉNÉRATEUR DE TEMPLATE LABVIEW 2015")
    print("  Projet Arduino Communication")
    print("=" * 80 + "\n")
    
    # Créer le template
    print("📝 Création du template de configuration...")
    config = create_vi_template()
    
    # Sauvegarder les fichiers
    print("\n💾 Sauvegarde des fichiers...\n")
    template_file = save_template(config)
    script_file = generate_creation_script(config)
    readme_file = generate_readme()
    
    print("\n" + "=" * 80)
    print("  ✅ GÉNÉRATION TERMINÉE")
    print("=" * 80)
    print("\n📁 Fichiers créés :")
    print(f"   • {template_file}")
    print(f"   • {script_file}")
    print(f"   • {readme_file}")
    
    print("\n🎯 PROCHAINES ÉTAPES :")
    print("   1. Ouvrez LabVIEW 2015")
    print("   2. Lisez CREATE_VI_STEPS.txt")
    print("   3. Créez le VI en suivant les instructions")
    print("   4. Sauvegardez dans : LabVIEW/VIs/Arduino_Communication.vi")
    
    print("\n⚠️  NOTE IMPORTANTE :")
    print("   Les fichiers .vi sont binaires et doivent être créés dans LabVIEW.")
    print("   Ces templates sont des guides pour vous aider à créer votre VI.\n")

if __name__ == "__main__":
    main()
