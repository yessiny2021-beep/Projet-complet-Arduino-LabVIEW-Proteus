# Liste des composants Proteus - Référence rapide

## Noms exacts des composants dans la bibliothèque Proteus

### Microcontrôleur
- **ARDUINO UNO R3** (ou ATMEGA328P-PU)

### Capteurs
| Composant | Nom dans Proteus | Bibliothèque |
|-----------|------------------|--------------|
| Capteur température | LM35 | Analog & Mixed ICs |
| Potentiomètre | POT-HG ou RV | Passive Components |
| Bouton | BUTTON ou SW-SPST | Switches & Relays |

### Actionneurs
| Composant | Nom dans Proteus | Bibliothèque |
|-----------|------------------|--------------|
| LED Rouge | LED-RED | Optoelectronics |
| LED Verte | LED-GREEN | Optoelectronics |
| LED Bleue | LED-BLUE | Optoelectronics |
| Servo moteur | MOTOR-SERVO ou SERVO | Motors & Drivers |
| Buzzer | BUZZER | Misc Devices |

### Composants passifs
| Composant | Nom dans Proteus | Valeur |
|-----------|------------------|--------|
| Résistance | RES | 220Ω (pour LEDs) |
| Résistance | RES | 10kΩ (si nécessaire) |

### Communication
| Composant | Nom dans Proteus | Usage |
|-----------|------------------|-------|
| COMPIM | COMPIM | Communication série virtuelle |
| VIRTUAL TERMINAL | VIRTUAL TERMINAL | Test de communication |

## Schéma de connexion détaillé

### Connexions Arduino (Entrées Analogiques)
```
A0  → LM35 (pin OUT)
A1  → Potentiomètre (pin central/wiper)
```

### Connexions Arduino (Entrées Numériques)
```
D2  → Bouton poussoir (avec pull-up interne)
```

### Connexions Arduino (Sorties PWM)
```
D9  → Résistance 220Ω → LED Rouge (Anode)
D10 → Résistance 220Ω → LED Verte (Anode)
D11 → Résistance 220Ω → LED Bleue (Anode)
```

### Connexions Arduino (Sorties Numériques)
```
D6  → Servo moteur (Signal)
D8  → Buzzer (pin +)
```

### Connexions Communication Série
```
TX (D1) → COMPIM (RXD)
RX (D0) → COMPIM (TXD)
```

### Alimentations
```
Arduino 5V → LM35 (VCC), Potentiomètre (extrémité 1), Servo (VCC)
Arduino GND → Tous les GND, LEDs (Cathode), Potentiomètre (extrémité 2)
```

## Valeurs des composants

### LM35 (Capteur de température)
- **Type**: Analog Temperature Sensor
- **Output**: 10mV/°C
- **Range**: 0°C à 100°C
- **Alimentation**: 4V à 30V
- **Sortie pour simulation**: Peut être modifiée dans les propriétés

### Potentiomètre
- **Valeur**: 10kΩ (ou 5kΩ)
- **Type**: Linéaire
- **Position initiale**: 50%

### Servo moteur
- **Type**: Standard (0° à 180°)
- **Signal**: PWM
- **Alimentation**: 5V

### LEDs
- **Tension forward**: ~2V (Rouge), ~3V (Verte/Bleue)
- **Courant**: 20mA max
- **Résistance série**: 220Ω (calcul: (5V - 2V) / 20mA ≈ 150Ω, on prend 220Ω pour sécurité)

### Buzzer
- **Type**: Active ou Passive
- **Tension**: 5V
- **Fréquence**: Variable (si passif)

## Configuration du COMPIM

### Paramètres
```
Baud Rate: 9600
Data Bits: 8
Parity: None
Stop Bits: 1
```

### Ports virtuels recommandés
- **Windows**: COM10 (Proteus) ↔ COM11 (LabVIEW)
- **Port physique**: (laisser vide pour utiliser un port virtuel)

## Positionnement recommandé dans le schéma

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [LM35]     [POT]      [BUTTON]                │
│    │         │            │                     │
│    A0       A1           D2                     │
│              ┌─────────────┐                    │
│              │             │                    │
│         ┌────┤  ARDUINO    ├────┐               │
│         │    │    UNO      │    │               │
│         TX   │             │   RX               │
│         │    └─────────────┘    │               │
│      [COMPIM]      D6  D8 D9 D10 D11            │
│                    │   │  │  │   │              │
│                 [SERVO] │ LED LED LED            │
│                      [BUZZER] R  G  B            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Checklist avant simulation

- [ ] Arduino Uno placé et configuré
- [ ] Tous les capteurs connectés aux bonnes pins
- [ ] Tous les actionneurs connectés aux bonnes pins
- [ ] Résistances ajoutées pour les LEDs
- [ ] COMPIM ajouté et configuré
- [ ] Fichier .hex chargé dans l'Arduino
- [ ] Ports virtuels créés et testés
- [ ] Ground commun à tous les composants
- [ ] Alimentation 5V distribuée correctement

## Simulation step-by-step

1. **Vérifier le câblage** : Mode Debug, vérifier toutes les connexions
2. **Charger le programme** : Double-clic Arduino → Program File → .hex
3. **Configurer COMPIM** : Port virtuel + Baud 9600
4. **Lancer simulation** : Bouton Play (▶)
5. **Vérifier bootloader** : LED 13 clignote au démarrage
6. **Tester communication** : Ouvrir Virtual Terminal ou LabVIEW
7. **Observer capteurs** : Modifier valeurs dans Proteus
8. **Tester actionneurs** : Envoyer commandes depuis LabVIEW
