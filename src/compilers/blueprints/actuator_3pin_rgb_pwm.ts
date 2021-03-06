/**
 * Actuator blueprint for a RGB PWM pin.
 * The code that uses this file must replace:
 * - $pin1 = R (pin) $pin2 = G $pin3 = B
 * - $var1 = r (value), $var2 = g, $var3 = b
 * - $array_values with a concatenated string of $id_TYPE struct elements
 * - $size with the generated array size
 */
export default {
  definition:`
  // actuator: $id
  #define $id_PIN1 $pin1
  #define $id_PIN2 $pin2
  #define $id_PIN3 $pin3
  #define $id_SIZE $size
  typedef struct $id_TYPE {
    int start, end;
    byte r, g, b;
  } $id_TYPE;
  const $id_TYPE $id[$id_SIZE] = {$array_values};
  byte $id_currFrameIndex = 0;
  `,
  setup: `
  // actuator: $id
  pinMode($id_PIN1, OUTPUT);
  pinMode($id_PIN2, OUTPUT);
  pinMode($id_PIN3, OUTPUT);
  `,
  loop: `
  // actuator: $id
  if ($id_currFrameIndex < $id_SIZE) {
    if (currentFrame == $id[$id_currFrameIndex].end + 1) {
      analogWrite($id_PIN1, 0);
      analogWrite($id_PIN2, 0);
      analogWrite($id_PIN3, 0);
      $id_currFrameIndex++;
    }
    if (currentFrame == $id[$id_currFrameIndex].start) {
      analogWrite($id_PIN1, $id[$id_currFrameIndex].r);
      analogWrite($id_PIN2, $id[$id_currFrameIndex].g);
      analogWrite($id_PIN3, $id[$id_currFrameIndex].b);
    }
  }
  `,
  item: `{$start, $end, $var1, $var2, $var3}`
}