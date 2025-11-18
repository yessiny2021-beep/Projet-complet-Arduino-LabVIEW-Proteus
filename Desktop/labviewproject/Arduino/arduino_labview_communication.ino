/*
 * Projet: Communication Arduino Uno - LabVIEW
 * Description: Communication bidirectionnelle entre Arduino et LabVIEW
 * Capteurs: Température (LM35), Potentiomètre, Bouton poussoir
 * Actionneurs: LED RGB, Servo moteur, Buzzer
 * Date: 2024
 */

#include <Servo.h>

// Définition des pins
// Capteurs (Entrées analogiques/numériques)
const int TEMP_PIN = A0;        // Capteur de température LM35
const int POT_PIN = A1;         // Potentiomètre
const int BUTTON_PIN = 2;       // Bouton poussoir

// Actionneurs (Sorties)
const int LED_RED_PIN = 9;      // LED Rouge (PWM)
const int LED_GREEN_PIN = 10;   // LED Verte (PWM)
const int LED_BLUE_PIN = 11;    // LED Bleue (PWM)
const int SERVO_PIN = 6;        // Servo moteur
const int BUZZER_PIN = 8;       // Buzzer

// Variables globales
Servo myServo;
int servoPosition = 90;
bool ledState = false;
int redValue = 0;
int greenValue = 0;
int blueValue = 0;

// Variables pour la lecture des capteurs
float temperature = 0.0;
int potValue = 0;
int buttonState = 0;

// Timing
unsigned long previousMillis = 0;
const long interval = 100;  // Intervalle d'envoi des données (100ms)

void setup() {
  // Initialisation de la communication série
  Serial.begin(9600);
  
  // Configuration des pins
  pinMode(TEMP_PIN, INPUT);
  pinMode(POT_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Initialisation du servo
  myServo.attach(SERVO_PIN);
  myServo.write(servoPosition);
  
  // Attente de stabilisation
  delay(100);
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Lecture des capteurs et envoi des données à intervalle régulier
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    readSensorsAndSend();
  }
  
  // Réception et traitement des commandes de LabVIEW
  if (Serial.available() > 0) {
    receiveCommand();
  }
}

// Fonction pour lire les capteurs et envoyer les données
void readSensorsAndSend() {
  // Lecture du capteur de température (LM35: 10mV/°C)
  int tempReading = analogRead(TEMP_PIN);
  temperature = (tempReading * 5.0 * 100.0) / 1024.0;
  
  // Lecture du potentiomètre (0-1023)
  potValue = analogRead(POT_PIN);
  
  // Lecture du bouton (0 ou 1, inversé car INPUT_PULLUP)
  buttonState = !digitalRead(BUTTON_PIN);
  
  // Format du message: T:25.5,P:512,B:1
  Serial.print("T:");
  Serial.print(temperature, 1);
  Serial.print(",P:");
  Serial.print(potValue);
  Serial.print(",B:");
  Serial.println(buttonState);
}

// Fonction pour recevoir et traiter les commandes
void receiveCommand() {
  String command = Serial.readStringUntil('\n');
  command.trim();
  
  // Format des commandes:
  // LED:R,G,B     - Contrôle LED RGB (ex: LED:255,128,0)
  // SERVO:angle   - Contrôle servo (ex: SERVO:90)
  // BUZZER:state  - Contrôle buzzer (ex: BUZZER:1)
  
  if (command.startsWith("LED:")) {
    controlLED(command.substring(4));
  }
  else if (command.startsWith("SERVO:")) {
    controlServo(command.substring(6));
  }
  else if (command.startsWith("BUZZER:")) {
    controlBuzzer(command.substring(7));
  }
  else if (command == "STATUS") {
    sendStatus();
  }
}

// Contrôle de la LED RGB
void controlLED(String values) {
  int firstComma = values.indexOf(',');
  int secondComma = values.indexOf(',', firstComma + 1);
  
  if (firstComma > 0 && secondComma > 0) {
    redValue = values.substring(0, firstComma).toInt();
    greenValue = values.substring(firstComma + 1, secondComma).toInt();
    blueValue = values.substring(secondComma + 1).toInt();
    
    // Limitation des valeurs entre 0 et 255
    redValue = constrain(redValue, 0, 255);
    greenValue = constrain(greenValue, 0, 255);
    blueValue = constrain(blueValue, 0, 255);
    
    analogWrite(LED_RED_PIN, redValue);
    analogWrite(LED_GREEN_PIN, greenValue);
    analogWrite(LED_BLUE_PIN, blueValue);
    
    Serial.println("ACK:LED");
  }
}

// Contrôle du servo moteur
void controlServo(String angle) {
  servoPosition = angle.toInt();
  servoPosition = constrain(servoPosition, 0, 180);
  myServo.write(servoPosition);
  Serial.println("ACK:SERVO");
}

// Contrôle du buzzer
void controlBuzzer(String state) {
  int buzzerState = state.toInt();
  digitalWrite(BUZZER_PIN, buzzerState);
  Serial.println("ACK:BUZZER");
}

// Envoi du status complet
void sendStatus() {
  Serial.print("STATUS:LED(");
  Serial.print(redValue);
  Serial.print(",");
  Serial.print(greenValue);
  Serial.print(",");
  Serial.print(blueValue);
  Serial.print("),SERVO(");
  Serial.print(servoPosition);
  Serial.print("),TEMP(");
  Serial.print(temperature);
  Serial.print("),POT(");
  Serial.print(potValue);
  Serial.print("),BTN(");
  Serial.print(buttonState);
  Serial.println(")");
}
