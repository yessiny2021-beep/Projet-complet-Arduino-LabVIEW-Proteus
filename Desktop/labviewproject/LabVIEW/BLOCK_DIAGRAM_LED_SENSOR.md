# LabVIEW Block Diagram - LED + Capteur

## 📋 Vue d'ensemble

Ce document décrit le diagramme de blocs LabVIEW pour la communication série avec Arduino, contrôlant une LED et lisant un capteur analogique.

**Version**: LabVIEW 2015  
**Protocole**: LED + Capteur uniquement (simplifié)  
**Baudrate**: 9600 bauds  
**Terminaison**: `\n` (Line Feed)

---

## 🔌 Configuration Série

| Paramètre | Valeur |
|-----------|--------|
| Baud Rate | 9600 |
| Data Bits | 8 |
| Stop Bits | 1 |
| Parity | None |
| Flow Control | None |
| Termination Char | `\n` (0x0A) |

---

## 📊 Architecture Complète du VI

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    Arduino_Communication.vi                                ┃
┃                    Block Diagram (Diagramme de Blocs)                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔════════════════════════════════════════════════════════════════════════════╗
║                          SECTION 1: INITIALIZATION                         ║
║                          (First Call? = TRUE uniquement)                   ║
╚════════════════════════════════════════════════════════════════════════════╝

   ┌────────────────────────────────────────────────────────────────────┐
   │  [First Call?] ──┬──→ FALSE ──→ [Bypass VISA Configure]           │
   │                  │                                                 │
   │                  └──→ TRUE ───┐                                    │
   │                                ▼                                    │
   │                      ┌──────────────────────────────────┐          │
   │  Port COM ("COM3")──→│                                  │          │
   │                      │  VISA Configure Serial Port      │          │
   │  Baud (9600) ───────→│                                  │          │
   │                      │  Parameters:                     │          │
   │  Data Bits (8) ─────→│  • Baud Rate: 9600               │          │
   │                      │  • Data Bits: 8                  │          │
   │  Stop Bits (10) ────→│  • Stop Bits: 10 (1 bit)         │          │
   │                      │  • Parity: 0 (None)              │          │
   │  Parity (0) ────────→│  • Flow Control: 0 (None)        │          │
   │                      │  • Timeout: 5000 ms              │          │
   │                      │                                  │          │
   │  Error In ──────────→│  Error In                        │          │
   │                      └──────────────────┬───────────────┘          │
   │                                         │                           │
   │                                         ▼                           │
   │                                 VISA Session Out ──┐                │
   │                                                    │                │
   │                                 Error Out ────────→│                │
   └────────────────────────────────────────────────────┼────────────────┘
                                                        │
                                                        ▼

╔════════════════════════════════════════════════════════════════════════════╗
║                       SECTION 2: MAIN WHILE LOOP                           ║
║                       (Continue while STOP = FALSE)                        ║
╚════════════════════════════════════════════════════════════════════════════╝

   ╔═══════════════════════════════════════════════════════════════════════╗
   ║   WHILE LOOP                                              [i] ────────║
   ║                                                            │           ║
   ║   VISA Session ──┬─────────────────────────────────────────┐          ║
   ║                  │                                         │          ║
   ║   Error In ──────┼───────────────────────────┐             │          ║
   ║                  │                           │             │          ║
   ║   ╔══════════════▼═══════════════════════════▼═════════════▼════════╗ ║
   ║   ║                    EVENT STRUCTURE                             ║ ║
   ║   ║                    (Timeout: 100 ms)                           ║ ║
   ║   ╠════════════════════════════════════════════════════════════════╣ ║
   ║   ║                                                                ║ ║
   ║   ║  ┌──────────────────────────────────────────────────────────┐ ║ ║
   ║   ║  │ EVENT CASE 0: "LED ON Button" - Value Change             │ ║ ║
   ║   ║  ├──────────────────────────────────────────────────────────┤ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  String Constant: "L1\n" ──┐                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Error In ─────────────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Write     │                   │ ║ ║
   ║   ║  │                   │  write buffer   │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  Wait (ms)      │                   │ ║ ║
   ║   ║  │  50 ──────────────│  delay: 50ms    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Byte Count (256) ─────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Read      │                   │ ║ ║
   ║   ║  │                   │  read buffer    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                    Response String                      │ ║ ║
   ║   ║  │                    Expected: "LED:ON\n"                 │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ├──→ LED Status Indicator    │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            └──→ Messages String (append)│ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Error Out ────────────────────────────→                │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  └──────────────────────────────────────────────────────────┘ ║ ║
   ║   ║                                                                ║ ║
   ║   ║  ┌──────────────────────────────────────────────────────────┐ ║ ║
   ║   ║  │ EVENT CASE 1: "LED OFF Button" - Value Change            │ ║ ║
   ║   ║  ├──────────────────────────────────────────────────────────┤ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  String Constant: "L0\n" ──┐                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Error In ─────────────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Write     │                   │ ║ ║
   ║   ║  │                   │  write buffer   │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  Wait (ms)      │                   │ ║ ║
   ║   ║  │  50 ──────────────│  delay: 50ms    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Byte Count (256) ─────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Read      │                   │ ║ ║
   ║   ║  │                   │  read buffer    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                    Response String                      │ ║ ║
   ║   ║  │                    Expected: "LED:OFF\n"                │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ├──→ LED Status Indicator    │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            └──→ Messages String (append)│ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Error Out ────────────────────────────→                │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  └──────────────────────────────────────────────────────────┘ ║ ║
   ║   ║                                                                ║ ║
   ║   ║  ┌──────────────────────────────────────────────────────────┐ ║ ║
   ║   ║  │ EVENT CASE 2: "Read Sensor Button" - Value Change        │ ║ ║
   ║   ║  ├──────────────────────────────────────────────────────────┤ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  String Constant: "R\n" ───┐                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Error In ─────────────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Write     │                   │ ║ ║
   ║   ║  │                   │  write buffer   │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  Wait (ms)      │                   │ ║ ║
   ║   ║  │  50 ──────────────│  delay: 50ms    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Byte Count (256) ─────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Read      │                   │ ║ ║
   ║   ║  │                   │  read buffer    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                    Response String                      │ ║ ║
   ║   ║  │                    Expected: "SENSOR:512\n"             │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │          ┌─────────────────┴─────────────────┐          │ ║ ║
   ║   ║  │          │ PARSING SECTION                   │          │ ║ ║
   ║   ║  │          │                                   │          │ ║ ║
   ║   ║  │          │  ┌───────────────────────────┐   │          │ ║ ║
   ║   ║  │          │  │ Scan From String          │   │          │ ║ ║
   ║   ║  │          │  │ Format: "SENSOR:%d"       │   │          │ ║ ║
   ║   ║  │          │  │                           │   │          │ ║ ║
   ║   ║  │          │  │ Input: Response String    │   │          │ ║ ║
   ║   ║  │          │  │ Output: Sensor Value (I32)│   │          │ ║ ║
   ║   ║  │          │  └───────────┬───────────────┘   │          │ ║ ║
   ║   ║  │          │              │                   │          │ ║ ║
   ║   ║  │          └──────────────┼───────────────────┘          │ ║ ║
   ║   ║  │                         │                              │ ║ ║
   ║   ║  │                         ├──→ Sensor Value Indicator    │ ║ ║
   ║   ║  │                         │                              │ ║ ║
   ║   ║  │                         └──→ Waveform Chart (append)   │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Response String ──────────→ Messages (append)          │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Error Out ────────────────────────────→                │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  └──────────────────────────────────────────────────────────┘ ║ ║
   ║   ║                                                                ║ ║
   ║   ║  ┌──────────────────────────────────────────────────────────┐ ║ ║
   ║   ║  │ EVENT CASE 3: "Get Status Button" - Value Change         │ ║ ║
   ║   ║  ├──────────────────────────────────────────────────────────┤ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  String Constant: "S\n" ───┐                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Error In ─────────────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Write     │                   │ ║ ║
   ║   ║  │                   │  write buffer   │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  Wait (ms)      │                   │ ║ ║
   ║   ║  │  50 ──────────────│  delay: 50ms    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  VISA Session ─────────────┤                            │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │  Byte Count (256) ─────────┤                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                   ┌─────────────────┐                   │ ║ ║
   ║   ║  │                   │  VISA Read      │                   │ ║ ║
   ║   ║  │                   │  read buffer    │                   │ ║ ║
   ║   ║  │                   └────────┬────────┘                   │ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │                            ▼                            │ ║ ║
   ║   ║  │                    Response String                      │ ║ ║
   ║   ║  │                    Expected: "STATUS:LED=1,SENSOR=512\n"│ ║ ║
   ║   ║  │                            │                            │ ║ ║
   ║   ║  │          ┌─────────────────┴─────────────────┐          │ ║ ║
   ║   ║  │          │ PARSING SECTION                   │          │ ║ ║
   ║   ║  │          │                                   │          │ ║ ║
   ║   ║  │          │  ┌───────────────────────────┐   │          │ ║ ║
   ║   ║  │          │  │ Scan From String          │   │          │ ║ ║
   ║   ║  │          │  │ Format: "STATUS:LED=%d,   │   │          │ ║ ║
   ║   ║  │          │  │          SENSOR=%d"       │   │          │ ║ ║
   ║   ║  │          │  │                           │   │          │ ║ ║
   ║   ║  │          │  │ Outputs:                  │   │          │ ║ ║
   ║   ║  │          │  │  • LED State (I32)        │   │          │ ║ ║
   ║   ║  │          │  │  • Sensor Value (I32)     │   │          │ ║ ║
   ║   ║  │          │  └───────────┬───────────────┘   │          │ ║ ║
   ║   ║  │          │              │                   │          │ ║ ║
   ║   ║  │          └──────────────┼───────────────────┘          │ ║ ║
   ║   ║  │                         │                              │ ║ ║
   ║   ║  │                         ├──→ LED Status Indicator      │ ║ ║
   ║   ║  │                         │    (0=OFF, 1=ON)             │ ║ ║
   ║   ║  │                         │                              │ ║ ║
   ║   ║  │                         └──→ Sensor Value Indicator    │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Response String ──────────→ Messages (append)          │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Error Out ────────────────────────────→                │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  └──────────────────────────────────────────────────────────┘ ║ ║
   ║   ║                                                                ║ ║
   ║   ║  ┌──────────────────────────────────────────────────────────┐ ║ ║
   ║   ║  │ EVENT CASE 4: Timeout (Default case)                     │ ║ ║
   ║   ║  ├──────────────────────────────────────────────────────────┤ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  ┌───────────────────────────────────┐                  │ ║ ║
   ║   ║  │  │  Wait (ms)                        │                  │ ║ ║
   ║   ║  │  │  delay: 100ms                     │                  │ ║ ║
   ║   ║  │  │                                   │                  │ ║ ║
   ║   ║  │  │  (Prevents CPU overload)          │                  │ ║ ║
   ║   ║  │  └───────────────────────────────────┘                  │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  No VISA operations                                     │ ║ ║
   ║   ║  │  Error cluster passes through                           │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  │  Error Out ────────────────────────────→                │ ║ ║
   ║   ║  │                                                          │ ║ ║
   ║   ║  └──────────────────────────────────────────────────────────┘ ║ ║
   ║   ║                                                                ║ ║
   ║   ╚════════════════════════════════════════════════════════════════╝ ║
   ║                                                                       ║
   ║   VISA Session Out ──→ (tunnel right) ──┐                            ║
   ║                                         │                            ║
   ║   Error Out ────────→ (tunnel right) ───┤                            ║
   ║                                         │                            ║
   ║   ┌─────────────────────────────────────┼───────────────────┐        ║
   ║   │  Stop Button ──→ [NOT] ──→ Continue? (Boolean)          │        ║
   ║   └──────────────────────────────────────────────────────────┘        ║
   ║                                         │                            ║
   ╚═════════════════════════════════════════╧════════════════════════════╝
                                             │
                                             ▼

╔════════════════════════════════════════════════════════════════════════════╗
║                         SECTION 3: ERROR HANDLING                          ║
╚════════════════════════════════════════════════════════════════════════════╝

   ┌────────────────────────────────────────────────────────────────────┐
   │                                                                    │
   │  Error Out ────────→ ┌─────────────────────────────────┐          │
   │  (from While Loop)   │  Simple Error Handler            │          │
   │                      │                                  │          │
   │                      │  • Display error dialog if error │          │
   │                      │  • Show error code & message     │          │
   │                      │  • Continue to VISA Close        │          │
   │                      │                                  │          │
   │                      └──────────────┬──────────────────┘          │
   │                                     │                              │
   └─────────────────────────────────────┼──────────────────────────────┘
                                         │
                                         ▼

╔════════════════════════════════════════════════════════════════════════════╗
║                         SECTION 4: CLEANUP                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

   ┌────────────────────────────────────────────────────────────────────┐
   │                                                                    │
   │  VISA Session ──────→ ┌──────────────────────┐                    │
   │  (from While Loop)    │  VISA Close          │                    │
   │                       │                      │                    │
   │  Error In ───────────→│  Error In            │                    │
   │                       │                      │                    │
   │                       │  Closes serial port  │                    │
   │                       │  Releases resources  │                    │
   │                       │                      │                    │
   │                       └──────────┬───────────┘                    │
   │                                  │                                │
   │                                  ▼                                │
   │                          Error Out (final)                        │
   │                                  │                                │
   │                                  └──→ [END OF VI]                 │
   │                                                                    │
   └────────────────────────────────────────────────────────────────────┘
```

---

## 📡 Protocole de Communication

### Commandes (LabVIEW → Arduino)

| Commande | Description | Format |
|----------|-------------|--------|
| `L1\n` | Allumer la LED | String avec terminaison \n |
| `L0\n` | Éteindre la LED | String avec terminaison \n |
| `R\n` | Lire la valeur du capteur | String avec terminaison \n |
| `S\n` | Obtenir le statut complet | String avec terminaison \n |

### Réponses (Arduino → LabVIEW)

| Réponse | Description | Exemple |
|---------|-------------|---------|
| `LED:ON\n` | LED allumée | Après commande L1 |
| `LED:OFF\n` | LED éteinte | Après commande L0 |
| `SENSOR:xxxx\n` | Valeur capteur (0-1023) | `SENSOR:512\n` |
| `STATUS:LED=x,SENSOR=yyyy\n` | Statut complet | `STATUS:LED=1,SENSOR=512\n` |

**Notes importantes:**
- Toutes les commandes se terminent par `\n` (Line Feed, 0x0A)
- Toutes les réponses se terminent par `\n`
- LED=0 signifie OFF, LED=1 signifie ON
- SENSOR est une valeur de 0 à 1023 (ADC 10-bit)

---

## 🔍 Détails du Parsing

### Parse "SENSOR:xxxx"

```
Input String: "SENSOR:512\n"

┌─────────────────────────────────────┐
│  Scan From String                   │
│                                     │
│  Format String: "SENSOR:%d"         │
│  Input: Response String             │
│                                     │
│  Output:                            │
│  • Sensor Value (I32): 512          │
│  • Offset past scan: 10             │
│  • Error: No error                  │
│                                     │
└─────────────────────────────────────┘
```

**LabVIEW Implementation:**
- VI: `Scan From String`
- Format: `"SENSOR:%d"`
- Output Type: I32 (Integer 32-bit)

### Parse "STATUS:LED=x,SENSOR=yyyy"

```
Input String: "STATUS:LED=1,SENSOR=512\n"

┌─────────────────────────────────────┐
│  Scan From String                   │
│                                     │
│  Format String:                     │
│  "STATUS:LED=%d,SENSOR=%d"          │
│                                     │
│  Input: Response String             │
│                                     │
│  Outputs:                           │
│  • LED State (I32): 1               │
│  • Sensor Value (I32): 512          │
│  • Offset past scan: 26             │
│  • Error: No error                  │
│                                     │
└─────────────────────────────────────┘
```

**LabVIEW Implementation:**
- VI: `Scan From String`
- Format: `"STATUS:LED=%d,SENSOR=%d"`
- Output Types: I32, I32

---

## 🎯 Flux de Données (Data Flow)

### Exemple: Allumer la LED

```
┌──────────────┐
│ User clicks  │
│ "LED ON"     │
│ Button       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Event Structure      │
│ detects Value Change │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Create string "L1\n" │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ VISA Write           │
│ Send to Arduino      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Wait 50 ms           │
│ (Arduino processing) │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ VISA Read            │
│ Receive response     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Response: "LED:ON\n" │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update LED Status    │
│ Indicator            │
└──────────────────────┘
```

### Exemple: Lire le Capteur

```
┌──────────────┐
│ User clicks  │
│ "Read Sensor"│
│ Button       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Event Structure      │
│ detects Value Change │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Create string "R\n"  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ VISA Write           │
│ Send to Arduino      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Wait 50 ms           │
│ (Arduino reads ADC)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ VISA Read            │
│ Receive response     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│ Response: "SENSOR:512\n" │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────┐
│ Scan From String     │
│ Extract value: 512   │
└──────┬───────────────┘
       │
       ├──→ Update Numeric Indicator
       │
       └──→ Append to Waveform Chart
```

---

## ⚠️ Gestion des Erreurs

### Types d'Erreurs Possibles

| Code | Description | Solution |
|------|-------------|----------|
| -1073807339 | Port série non trouvé | Vérifier le port COM |
| -1073807346 | Port série déjà ouvert | Fermer autres applications |
| -1073807253 | Timeout de lecture | Vérifier Arduino connecté |
| -1073807202 | Erreur de parsing | Vérifier format de réponse |
| 5002 | Buffer overflow | Augmenter buffer size |

### Implémentation Error Handler

```
Error Cluster (red wire) flows through:

1. VISA Configure Serial Port
   └─→ Error Out ──→

2. Event Structure (all cases)
   └─→ Error Out ──→

3. While Loop iteration
   └─→ Error Out ──→

4. Simple Error Handler
   └─→ Displays error dialog if error occurred
   └─→ Shows error code and description

5. VISA Close
   └─→ Always executes to release resources
```

**Best Practice:**
- Always wire error clusters through all VIs
- Check for errors before VISA operations
- Display errors to user with Simple Error Handler
- Always close VISA session even if error occurred

---

## 🎨 Conventions LabVIEW

### Couleurs des Wires (Fils)

| Couleur | Type de Données | Utilisation |
|---------|-----------------|-------------|
| 🟧 Orange | String | Commandes et réponses série |
| 🔵 Bleu | Integer (I32) | Valeurs numériques du capteur |
| 🟢 Vert | Boolean | État LED, Stop button |
| 🔴 Rouge | Error Cluster | Gestion des erreurs |
| 🟣 Violet | VISA Resource | Session VISA |
| ⚪ Blanc | Variant/Dynamic | Données polymorphes |

### Structure des Blocs

| Élément | Couleur Fond | Description |
|---------|--------------|-------------|
| VISA VIs | Bleu clair | Communication série |
| Event Structure | Beige | Gestion des événements |
| While Loop | Gris/Beige | Boucle principale |
| Case Structure | Beige | Conditions |
| SubVIs | Blanc | Sous-programmes |

### Labels et Documentation

- **Libellés courts**: Description concise de chaque élément
- **Commentaires**: Boîtes de texte jaunes pour expliquer la logique
- **Free Labels**: Pour titre de sections (INIT, MAIN LOOP, etc.)

---

## 📦 VIs et Palettes Utilisés

### Instrument I/O → Serial

| VI | Palette | Description |
|----|---------|-------------|
| VISA Configure Serial Port | Instrument I/O → Serial | Configure le port série |
| VISA Write | Instrument I/O → Serial | Envoie des données |
| VISA Read | Instrument I/O → Serial | Reçoit des données |
| VISA Close | Instrument I/O → Serial | Ferme la session |

### Programming → String

| VI | Palette | Description |
|----|---------|-------------|
| Scan From String | String → Conversion | Parse format strings |
| Format Into String | String → Conversion | Crée des strings formatées |
| String Length | String → String Functions | Longueur de string |
| Concatenate Strings | String → String Functions | Concatène des strings |

### Programming → Structures

| Structure | Palette | Description |
|-----------|---------|-------------|
| While Loop | Structures | Boucle principale |
| Event Structure | Structures → Event | Gestion événements UI |
| Case Structure | Structures | Conditions |
| Sequence Structure | Structures | Séquences (si nécessaire) |

### Programming → Timing

| VI | Palette | Description |
|----|---------|-------------|
| Wait (ms) | Timing | Délai en millisecondes |
| Elapsed Time | Timing | Mesure de temps |

### Programming → Boolean

| VI | Palette | Description |
|----|---------|-------------|
| NOT | Boolean | Négation logique |
| AND | Boolean | ET logique |
| OR | Boolean | OU logique |

---

## ✅ Checklist d'Implémentation

### Phase 1: Front Panel
- [ ] Créer String Control: Port COM
- [ ] Créer Numeric Control: Baud Rate (9600)
- [ ] Créer 4 Boolean Buttons: LED ON, LED OFF, Read Sensor, Get Status
- [ ] Créer Stop Button
- [ ] Créer String Indicator: LED Status
- [ ] Créer Numeric Indicator: Sensor Value (I32)
- [ ] Créer Waveform Chart: Sensor Graph
- [ ] Créer String Indicator: Messages (avec scrolling)
- [ ] Créer Boolean LED: Connection Status
- [ ] Organiser en groupes avec decorations

### Phase 2: Block Diagram - Init
- [ ] Placer "First Call?" primitive
- [ ] Ajouter VISA Configure Serial Port
- [ ] Configurer les paramètres (9600, 8, 1, 0)
- [ ] Wire les contrôles de configuration

### Phase 3: Block Diagram - Main Loop
- [ ] Créer While Loop
- [ ] Ajouter Event Structure à l'intérieur
- [ ] Configurer Timeout: 100 ms
- [ ] Wire VISA session dans le loop

### Phase 4: Block Diagram - Event Cases
- [ ] Case 0: LED ON Button
  - [ ] String Constant: "L1\n"
  - [ ] VISA Write
  - [ ] Wait 50 ms
  - [ ] VISA Read
  - [ ] Update LED Status indicator
- [ ] Case 1: LED OFF Button
  - [ ] String Constant: "L0\n"
  - [ ] VISA Write
  - [ ] Wait 50 ms
  - [ ] VISA Read
  - [ ] Update LED Status indicator
- [ ] Case 2: Read Sensor Button
  - [ ] String Constant: "R\n"
  - [ ] VISA Write
  - [ ] Wait 50 ms
  - [ ] VISA Read
  - [ ] Scan From String: "SENSOR:%d"
  - [ ] Update Sensor Value indicator
  - [ ] Append to Waveform Chart
- [ ] Case 3: Get Status Button
  - [ ] String Constant: "S\n"
  - [ ] VISA Write
  - [ ] Wait 50 ms
  - [ ] VISA Read
  - [ ] Scan From String: "STATUS:LED=%d,SENSOR=%d"
  - [ ] Update both indicators
- [ ] Case 4: Timeout
  - [ ] Wait 100 ms
  - [ ] No VISA operations

### Phase 5: Block Diagram - Cleanup
- [ ] Wire Stop button avec NOT pour loop condition
- [ ] Ajouter Simple Error Handler après loop
- [ ] Ajouter VISA Close après loop
- [ ] Wire error cluster through all VIs

### Phase 6: Testing
- [ ] Test sans Arduino (doit détecter erreur de port)
- [ ] Test avec Arduino connecté
- [ ] Test commande L1 (LED ON)
- [ ] Test commande L0 (LED OFF)
- [ ] Test commande R (Read Sensor)
- [ ] Test commande S (Get Status)
- [ ] Test Stop button
- [ ] Test error handling (déconnecter pendant utilisation)

---

## 🚀 Prochaines Étapes

1. **Créer le VI** dans LabVIEW 2015 en suivant ce diagramme
2. **Tester** avec un Arduino utilisant le protocole L1/L0/R/S
3. **Capturer** des screenshots du Front Panel et Block Diagram
4. **Documenter** les résultats et problèmes rencontrés
5. **Optimiser** si nécessaire (buffer sizes, timeouts, etc.)

---

## 📚 Références

- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Guide détaillé d'implémentation
- [diagrams/labview_block_diagram_led_sensor.svg](diagrams/labview_block_diagram_led_sensor.svg) - Diagramme SVG
- [README.md](README.md) - Documentation générale LabVIEW
- [../Documentation/PROTOCOLE_COMMUNICATION.md](../Documentation/PROTOCOLE_COMMUNICATION.md) - Protocole complet

---

**Version**: 1.0  
**Date**: Décembre 2024  
**LabVIEW**: 2015 (compatible 2014-2020)  
**Statut**: ✅ Documentation complète
