let auraLayer;
let emotion = { valence: 0.5, arousal: 0.5 };
let targetEmotion = { ...emotion };
let t = 0; // time for pulse

function setup() {
  createCanvas(windowWidth, windowHeight);
  auraLayer = createGraphics(width, height);
  auraLayer.colorMode(HSL, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(255);

  // Smooth transition
  emotion.valence = lerp(emotion.valence, targetEmotion.valence, 0.05);
  emotion.arousal = lerp(emotion.arousal, targetEmotion.arousal, 0.05);

  let hueVal = map(emotion.valence, 0, 1, 240, 0);
  let sat = map(emotion.arousal, 0, 1, 30, 100);
  let bri = map(emotion.arousal, 0, 1, 40, 80);
  let baseRadius = 150 + emotion.arousal * 50;

  // Pulse motion
  t += 0.01 + emotion.arousal * 0.1; // higher arousal = faster pulse
  let pulse = sin(t) * (5 + emotion.arousal * 2); // amplitude scales with arousal
  let radius = baseRadius + pulse;

  // Draw aura with pulsing size
  auraLayer.clear();
  for (let r = radius * 2; r > 0; r -= 5) {
    let alpha = map(r, 0, radius * 2, 0.2, 0);
    auraLayer.noStroke();
    auraLayer.fill(hueVal, sat, bri, alpha);
    auraLayer.ellipse(width / 2, height / 2, r);
  }

  image(auraLayer, 0, 0);

  // Label
  fill(0);
  textAlign(CENTER);
  textSize(18);
  text(`Valence: ${emotion.valence.toFixed(2)} | Arousal: ${emotion.arousal.toFixed(2)}`, width / 2, height - 40);
}

function mousePressed() {
  targetEmotion.valence = random();
  targetEmotion.arousal = random();
}
