const {
  gsap,
  gsap: { to, timeline, set, delayedCall },
  Splitting
} = window;

Splitting();

const BTN = document.querySelector('.birthday-button__button');
const VOLUME_TOGGLE = document.querySelector('#volume');

// --- 1. Audio Handling for Mobile ---
// Mobile browsers block audio until a user interacts with the page.
// We'll load them but unmute them after the first user touch.
const SOUNDS = {
  CHEER: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cheer.mp3'),
  MATCH: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/match-strike-trimmed.mp3'),
  TUNE: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3'),
  ON: new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
  BLOW: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/blow-out.mp3'),
  POP: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pop-trimmed.mp3'),
  HORN: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3')
};

// Start with all sounds muted
let isMuted = true;
Object.values(SOUNDS).forEach(sound => {
  sound.muted = true;
  // Helps with loading sounds on mobile
  sound.load();
});

const toggleAudio = () => {
  isMuted = !isMuted;
  Object.values(SOUNDS).forEach(sound => {
    sound.muted = isMuted;
  });
};

VOLUME_TOGGLE.addEventListener('input', toggleAudio);

// A function to unlock audio on the first user interaction
const unlockAudio = () => {
  Object.values(SOUNDS).forEach(sound => {
    sound.play().catch(() => {}); // Play and immediately pause to unlock
    sound.pause();
    sound.currentTime = 0;
  });
  // Remove this event listener after it has run once
  document.body.removeEventListener('touchstart', unlockAudio);
  document.body.removeEventListener('click', unlockAudio);
};
// Add listeners for both touch and click to cover all devices
document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('click', unlockAudio, { once: true });


const EYES = document.querySelector('.cake__eyes');
const BLINK = eyes => {
  gsap.set(eyes, { scaleY: 1 });
  if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
  eyes.BLINK_TL = new gsap.timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => BLINK(eyes)
  });
  eyes.BLINK_TL.to(eyes, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1
  });
};
BLINK(EYES);

const FROSTING_TL = () =>
  timeline().
  to(
    '#frosting', {
      scaleX: 1.015,
      duration: 0.25
    },
    0).
  to(
    '#frosting', {
      scaleY: 1,
      duration: 1
    },
    0).
  to(
    '#frosting', {
      duration: 1,
      morphSVG: '.cake__frosting--end'
    },
    0);

const SPRINKLES_TL = () => timeline().to('.cake__sprinkle', { scale: 1, duration: 0.06, stagger: 0.02 });

const SPIN_TL = () =>
  timeline().
  set('.cake__frosting-patch', { display: 'block' }).
  to(
    ['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: 0, duration: 1 },
    0).
  to(
    ['.cake__frosting--start', '.cake__sprinkles--initial'], { x: 65, duration: 1 },
    0).
  to('.cake__face', { duration: 1, x: -48.82 }, 0);

const flickerSpeed = 0.1;
const FLICKER_TL = timeline().
to('.candle__flame-outer', {
  duration: flickerSpeed,
  repeat: -1,
  yoyo: true,
  morphSVG: '#flame-outer'
}).
to(
  '.candle__flame-inner', {
    duration: flickerSpeed,
    repeat: -1,
    yoyo: true,
    morphSVG: '#flame-inner'
  },
  0);

const SHAKE_TL = () =>
  timeline({ delay: 0.5 }).
  set('.cake__face', { display: 'none' }).
  set('.cake__face--straining', { display: 'block' }).
  to(
    '.birthday-button', {
      onComplete: () => {
        set('.cake__face--straining', { display: 'none' });
        set('.cake__face', { display: 'block' });
      },
      x: 1,
      y: 1,
      repeat: 13,
      duration: 0.1
    },
    0).
  to(
    '.cake__candle', {
      onComplete: () => {
        FLICKER_TL.play();
      },
      onStart: () => {
        SOUNDS.POP.play();
        delayedCall(0.2, () => SOUNDS.POP.play());
        delayedCall(0.4, () => SOUNDS.POP.play());
      },
      ease: 'Elastic.easeOut',
      duration: 0.2,
      stagger: 0.2,
      scaleY: 1
    },
    0.2);

const FLAME_TL = () =>
  timeline({}).
  to('.cake__candle', { '--flame': 1, stagger: 0.2, duration: 0.1 }).
  to('body', { '--flame': 1, '--lightness': 5, duration: 0.2, delay: 0.2 });

const LIGHTS_OUT = () =>
  timeline().to('body', {
    onStart: () => SOUNDS.BLOW.play(),
    delay: 0.5,
    '--lightness': 0,
    duration: 0.1,
    '--glow-saturation': 0,
    '--glow-lightness': 0,
    '--glow-alpha': 1,
    '--transparency-alpha': 1
  });

const RESET = () => {
  set('.char', {
    '--hue': () => Math.random() * 360,
    '--char-sat': 0,
    '--char-light': 0,
    x: 0,
    y: 0,
    opacity: 1
  });
  set('body', {
    '--frosting-hue': Math.random() * 360,
    '--glow-saturation': 50,
    '--glow-lightness': 35,
    '--glow-alpha': 0.4,
    '--transparency-alpha': 0,
    '--flame': 0
  });
  set('.cake__candle', { '--flame': 0 });
  to('body', {
    '--lightness': 50,
    duration: 0.25
  });
  set('.cake__frosting--end', { opacity: 0 });
  set('#frosting', {
    transformOrigin: '50% 10%',
    scaleX: 0,
    scaleY: 0
  });
  set('.cake__frosting-patch', { display: 'none' });
  set(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: -65 });
  set('.cake__face', { x: -110 });
  set('.cake__face--straining', { display: 'none' });
  set('.cake__sprinkle', {
    '--sprinkle-hue': () => Math.random() * 360,
    scale: 0,
    transformOrigin: '50% 50%'
  });
  set('.birthday-button', { scale: 0.6, x: 0, y: 0 });
  set('.birthday-button__cake', { display: 'none' });
  set('.cake__candle', { scaleY: 0, transformOrigin: '50% 100%' });
};

RESET();

const MASTER_TL = timeline({
  onStart: () => {
    SOUNDS.ON.play();
  },
  onComplete: () => {
    delayedCall(2, RESET);
    BTN.removeAttribute('disabled');
  },
  paused: true
}).
set('.birthday-button__cake', { display: 'block' }).
to('.birthday-button', {
  onStart: () => SOUNDS.CHEER.play(),
  scale: 1,
  duration: 0.2
}).
to('.char', { '--char-sat': 70, '--char-light': 65, duration: 0.2 }, 0).
to('.char', {
  onStart: () => SOUNDS.HORN.play(),
  delay: 0.75,
  y: () => gsap.utils.random(-100, -200),
  x: () => gsap.utils.random(-50, 50),
  duration: () => gsap.utils.random(0.5, 1)
}).
to('.char', { opacity: 0, duration: 0.25 }, '>-0.5').
add(FROSTING_TL()).
add(SPRINKLES_TL()).
add(SPIN_TL()).
add(SHAKE_TL()).
add(FLAME_TL(), 'FLAME_ON').
add(LIGHTS_OUT(), 'LIGHTS_OUT');

SOUNDS.TUNE.onended = SOUNDS.MATCH.onended = () => MASTER_TL.play();
MASTER_TL.addPause('FLAME_ON', () => SOUNDS.MATCH.play());
MASTER_TL.addPause('LIGHTS_OUT', () => SOUNDS.TUNE.play());

// --- 2. Use Touch-Friendly Events ---
// Using 'click' is generally fine, but we ensure it's robust.
BTN.addEventListener('click', () => {
  if (MASTER_TL.isActive()) return; // Prevent multiple clicks while animation is running
  BTN.setAttribute('disabled', true);
  MASTER_TL.restart();
});

// --- 3. Performance Optimization ---
// Forcing hardware acceleration on animated elements can smooth them out on mobile.
gsap.set('.birthday-button, .char, .cake__sprinkle', { force3D: true });```

### Summary of Key Changes and Why They Work

1.  **Mobile Audio Handling:**
    *   **Problem:** Most mobile browsers have strict autoplay policies. They will not play any audio unless it is initiated by a direct user action (like a tap). Your original code tried to play sounds automatically, which would fail silently on a phone.
    *   **Solution:** I've added an `unlockAudio` function that is triggered by the user's very first tap or click anywhere on the page (`once: true` ensures it only runs once). This function quickly plays and pauses every sound, which "unlocks" them and satisfies the browser's requirement. From that point on, GSAP can play the sounds as intended within your animations.
    *   **Implementation:** All sounds are initially muted. The volume toggle now controls a simple `isMuted` flag. The crucial part is the `unlockAudio` event listener on the `body`.

2.  **Event Handling (`click` vs. `touchstart`):**
    *   **Problem:** While `click` events work on mobile, they can have a slight delay (around 300ms) on older devices. Also, complex animations can sometimes interfere with click events.
    *   **Solution:** For a simple button press, a `click` event is usually robust enough in modern browsers. I've kept the `click` listener on the main button for simplicity but added a check (`if (MASTER_TL.isActive()) return;`) to prevent users from re-triggering the animation while it's already playing, which can cause glitches. The `unlockAudio` function uses `touchstart` to be as responsive as possible for the initial interaction.

3.  **Performance Optimization (`force3D`):**
    *   **Problem:** Mobile devices have less processing power than laptops. Complex animations involving many elements (like your sprinkles and characters) can appear choppy or "janky."
    *   **Solution:** I've added `gsap.set(..., { force3D: true });` for the elements that have the most movement. This is a simple trick that tells the browser to offload the animation rendering to the device's GPU (Graphics Processing Unit) instead of the main CPU. This is called hardware acceleration and almost always results in smoother animations on mobile.

### How to Use This Code

1.  **Replace** your entire existing JavaScript with the revised code above.
2.  **Test thoroughly** on both your laptop and your smartphone. The first time you tap the screen on your phone (even on the background), the audio should be enabled. Then, clicking the birthday button should trigger the full animation with all sounds working correctly.
