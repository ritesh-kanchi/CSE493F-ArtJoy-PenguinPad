#include <ParallaxJoystick.hpp>;
#include <Mouse.h>
#include <Keyboard.h>

const int JOYSTICK_UPDOWN_PIN = A1;
const int JOYSTICK_LEFTRIGHT_PIN = A2;
const int MAX_ANALOG_VAL = 1023;
const int ANALOG_CENTER_VALUE = int(MAX_ANALOG_VAL / 2);
const enum JoystickYDirection JOYSTICK_Y_DIR = RIGHT;
const int MOUSE_MOVEMENT_THRESHOLD = 10;  // distance from rest position

// Sets the overall mouse sensitivity based on analog values
// a higher value will move the mouse more with
const int MAX_MOUSE_MOVE_VAL = 10;

ParallaxJoystick _analogJoystick(JOYSTICK_UPDOWN_PIN, JOYSTICK_LEFTRIGHT_PIN, MAX_ANALOG_VAL, JOYSTICK_Y_DIR);

const int BUTTON_MOUSE_CLICK_PIN = 4;


const int BUTTON_ONE_PIN = 10;
const int BUTTON_TWO_PIN = 11;
const int BUTTON_THREE_PIN = 12;
const int BUTTON_FOUR_PIN = 13;

int prevButtonOneVal = HIGH;
int prevButtonTwoVal = HIGH;
int prevButtonThreeVal = HIGH;
int prevButtonFourVal = HIGH;

const int VIBROMOTOR_OUTPUT_PIN = 5;
const int POT_PIN = A0;

int prevMouseToggleVal = HIGH;

void setup() {
  Keyboard.begin();
  // put your setup code here, to run once:
  pinMode(BUTTON_MOUSE_CLICK_PIN, INPUT_PULLUP);
  pinMode(POT_PIN, INPUT);

  pinMode(BUTTON_ONE_PIN, INPUT_PULLUP);
  pinMode(BUTTON_TWO_PIN, INPUT_PULLUP);
  pinMode(BUTTON_THREE_PIN, INPUT_PULLUP);
  pinMode(BUTTON_FOUR_PIN, INPUT_PULLUP);

  pinMode(VIBROMOTOR_OUTPUT_PIN, OUTPUT);

  Serial.begin(9600);
  Mouse.begin();
}

void loop() {
  int analogX = analogRead(JOYSTICK_LEFTRIGHT_PIN);
  int analogY = analogRead(JOYSTICK_UPDOWN_PIN);

  // There are many ways that you may want to convert the incoming
  // analog values to mouse movement. This is just one way
  int xDistFromCenter = analogX - ANALOG_CENTER_VALUE;
  int yDistFromCenter = analogY - ANALOG_CENTER_VALUE;
  int yMouse = 0, xMouse = 0;

  // Check the distance from the center position of the analog input
  // If it's beyond MOUSE_MOVEMENT_THRESHOLD, then calc mouse movement
  if (abs(xDistFromCenter) > MOUSE_MOVEMENT_THRESHOLD) {
    xMouse = map(analogX, 0, MAX_ANALOG_VAL, -MAX_MOUSE_MOVE_VAL, MAX_MOUSE_MOVE_VAL);
  }

  if (abs(yDistFromCenter) > MOUSE_MOVEMENT_THRESHOLD) {
    yMouse = map(analogY, 0, MAX_ANALOG_VAL, -MAX_MOUSE_MOVE_VAL, MAX_MOUSE_MOVE_VAL);
  }

  int mouseClickBtn = digitalRead(BUTTON_MOUSE_CLICK_PIN);


  // Mouse move is always relative
  Mouse.move(xMouse, yMouse, 0);

  if (!Mouse.isPressed() && mouseClickBtn == LOW) {  // pull-up input
    Mouse.press();
    vibrate(100);
  } else if (Mouse.isPressed() && mouseClickBtn == HIGH) {
    Mouse.release();
  }


  int buttonOneVal = digitalRead(BUTTON_ONE_PIN);
  int buttonTwoVal = digitalRead(BUTTON_TWO_PIN);
  int buttonThreeVal = digitalRead(BUTTON_THREE_PIN);
  int buttonFourVal = digitalRead(BUTTON_FOUR_PIN);

  if (prevButtonOneVal != buttonOneVal && buttonOneVal == LOW) {
    Keyboard.print("D");
    vibrate(100);
  }
  prevButtonOneVal = buttonOneVal;

  if (prevButtonTwoVal != buttonTwoVal && buttonTwoVal == LOW) {
    Keyboard.print("T");
    Mouse.press();
    vibrate(100);
  }
  prevButtonTwoVal = buttonTwoVal;

  if (prevButtonThreeVal != buttonThreeVal && buttonThreeVal == LOW) {
    Keyboard.print("W");
    vibrate(100);
  }
  prevButtonThreeVal = buttonThreeVal;

  if (prevButtonFourVal != buttonFourVal && buttonFourVal == LOW) {
    Keyboard.print("e8");
    vibrate(100);
  }
  prevButtonFourVal = buttonFourVal;

  int potValue = analogRead(POT_PIN);
  float valFrac = potValue / (float)MAX_ANALOG_VAL;
  Serial.println(valFrac, 4);

  delay(10);
}