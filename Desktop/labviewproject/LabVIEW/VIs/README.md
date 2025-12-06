# Dossier VIs

## 📍 Emplacement de Votre VI Principal

**Placez votre VI principal ici** : `Arduino_Communication.vi`

## 📋 Structure

```
VIs/
├── Arduino_Communication.vi           ⬅️ VOTRE VI PRINCIPAL ICI
├── Arduino_Communication_Front.png    ⬅️ Capture Face-Avant
├── Arduino_Communication_Block.png    ⬅️ Capture Diagramme
└── SubVIs/                            ⬅️ Sous-VIs optionnels
    ├── Parse_Sensor.vi
    ├── Parse_Status.vi
    └── Send_Command.vi
```

## 🎯 Instructions

1. Ouvrez LabVIEW 2015
2. Créez votre VI selon [INSTRUCTIONS_LABVIEW.md](../INSTRUCTIONS_LABVIEW.md)
3. Sauvegardez-le dans ce dossier : `Arduino_Communication.vi`
4. Prenez des captures d'écran
5. Ajoutez au Git et commitez

## 📸 Captures Recommandées

- Front Panel (Face-Avant)
- Block Diagram (Diagramme de Blocs)
- VISA Configuration
- Event Structure

## 🔄 Ajouter au Git

```bash
# Depuis la racine du projet
cd /home/yessin/Desktop/labviewproject

# Ajouter vos VIs
git add LabVIEW/VIs/*.vi
git add LabVIEW/VIs/*.png

# Commit
git commit -m "✨ Ajout VI LabVIEW 2015"

# Push
git push origin main
```

## 📝 Notes

- Les fichiers .vi sont binaires
- Considérez Git LFS pour les fichiers volumineux
- Sauvegardez régulièrement
- Testez avant de commiter
