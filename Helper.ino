void vibrate(int ms) {
  digitalWrite(VIBROMOTOR_OUTPUT_PIN, HIGH);
  delay(ms);
  digitalWrite(VIBROMOTOR_OUTPUT_PIN, LOW);
}