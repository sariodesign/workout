<template>
  <div class="workout-view">
    <transition name="screen-fade" mode="out-in">
      <section
        v-if="screen === 'setup'"
        key="setup"
        class="screen-shell setup-view"
      >
        <header class="topbar">
          <div class="headline">
            <span class="eyebrow">Workout Timer</span>
            <h1>Workout Setup</h1>
            <p class="intro">
              Imposta solo il tempo di esecuzione, il recupero e il numero di
              serie. Il timer gestisce tutto da solo.
            </p>
          </div>

          <button
            type="button"
            class="icon-action"
            aria-label="Ripristina valori iniziali"
            @click="resetConfig"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 12a8 8 0 1 0 2.34-5.66L4 8.68"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M4 4v4.68h4.68"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </header>

        <div class="card-stack">
          <article
            v-for="control in controls"
            :key="control.key"
            class="config-card"
            :class="'config-card--' + control.key"
          >
            <div class="config-card__head">
              <span
                class="config-card__marker"
                :class="'config-card__marker--' + control.key"
                aria-hidden="true"
              ></span>
              <div>
                <p class="config-card__title">{{ control.label }}</p>
                <p class="config-card__hint">{{ control.hint }}</p>
              </div>
            </div>

            <div class="config-card__body">
              <button
                type="button"
                class="stepper"
                :disabled="config[control.key] <= limits[control.key].min"
                :aria-label="'Riduci ' + control.label"
                @click="adjustConfig(control.key, -1)"
              >
                -
              </button>

              <div class="config-value">
                <span class="config-value__number">
                  {{ formatValue(config[control.key]) }}
                </span>
                <span class="config-value__unit">{{ control.unit }}</span>
              </div>

              <button
                type="button"
                class="stepper"
                :disabled="config[control.key] >= limits[control.key].max"
                :aria-label="'Aumenta ' + control.label"
                @click="adjustConfig(control.key, 1)"
              >
                +
              </button>
            </div>

            <div class="config-meter" aria-hidden="true">
              <span :style="{ width: controlFill(control) + '%' }"></span>
            </div>
          </article>
        </div>

        <section class="summary-card">
          <article class="summary-card__item">
            <span class="summary-card__label">Durata totale</span>
            <strong>{{
              formatClock(Math.ceil(totalDurationMs / 1000))
            }}</strong>
          </article>
          <article class="summary-card__item">
            <span class="summary-card__label">Lavoro totale</span>
            <strong>{{ formatClock(Math.ceil(totalWorkMs / 1000)) }}</strong>
          </article>
          <article class="summary-card__item">
            <span class="summary-card__label">Recupero totale</span>
            <strong>{{ formatClock(Math.ceil(totalRestMs / 1000)) }}</strong>
          </article>
        </section>

        <section class="feedback-card">
          <div class="feedback-card__head">
            <span class="eyebrow">Feedback</span>
            <p class="feedback-card__copy">
              Gestisci gli avvisi quando termina una serie, parte il recupero o
              ricomincia il lavoro.
            </p>
          </div>

          <button
            type="button"
            class="feedback-toggle"
            :class="{ 'feedback-toggle--active': preferences.soundEnabled }"
            @click="togglePreference('soundEnabled')"
          >
            <span class="feedback-toggle__badge">SFX</span>
            <span class="feedback-toggle__body">
              <strong>Avvisi audio</strong>
              <small>
                Suoni distinti per recupero, nuova serie e fine workout
              </small>
            </span>
            <span class="feedback-toggle__state">
              {{ preferences.soundEnabled ? "On" : "Off" }}
            </span>
          </button>

          <button
            type="button"
            class="feedback-toggle"
            :class="{
              'feedback-toggle--active':
                preferences.vibrationEnabled && vibrationSupported,
              'feedback-toggle--disabled': !vibrationSupported,
            }"
            :disabled="!vibrationSupported"
            @click="togglePreference('vibrationEnabled')"
          >
            <span class="feedback-toggle__badge">HPT</span>
            <span class="feedback-toggle__body">
              <strong>Vibrazione</strong>
              <small>
                {{
                  vibrationSupported
                    ? "Pattern aptici sui cambi fase"
                    : "Non supportata su questo dispositivo"
                }}
              </small>
            </span>
            <span class="feedback-toggle__state">
              {{
                vibrationSupported
                  ? preferences.vibrationEnabled
                    ? "On"
                    : "Off"
                  : "N/A"
              }}
            </span>
          </button>
        </section>

        <button type="button" class="primary-action" @click="startWorkout">
          Start Workout
        </button>
      </section>

      <section
        v-else
        key="session"
        class="screen-shell session-view"
        :class="'session-view--' + session.phase"
      >
        <header class="session-topbar">
          <button
            type="button"
            class="icon-action"
            aria-label="Torna alla configurazione"
            @click="stopWorkout"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>

          <div class="session-title">
            <span class="eyebrow">Current Set</span>
            <strong>{{ currentSetLabel }} / {{ config.sets }}</strong>
          </div>

          <button
            type="button"
            class="icon-action"
            aria-label="Riavvia il workout"
            @click="startWorkout"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 12a8 8 0 1 0 2.34-5.66L4 8.68"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M4 4v4.68h4.68"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </header>

        <div class="session-copy">
          <span class="eyebrow">{{ sessionLabel }}</span>
          <h2>{{ sessionTitle }}</h2>
        </div>

        <div class="progress-ring">
          <svg
            class="progress-ring__svg"
            viewBox="0 0 320 320"
            aria-hidden="true"
          >
            <circle
              class="progress-ring__track"
              cx="160"
              cy="160"
              :r="ringRadius"
            />
            <circle
              class="progress-ring__value"
              cx="160"
              cy="160"
              :r="ringRadius"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset"
            />
          </svg>

          <div class="progress-ring__content">
            <strong class="progress-ring__time">{{ remainingClock }}</strong>
            <span class="progress-ring__caption">seconds left</span>
          </div>
        </div>

        <div class="phase-chip">
          <span class="phase-chip__dot" aria-hidden="true"></span>
          <span>{{ phaseChip }}</span>
        </div>

        <div class="feedback-status">
          <span
            class="feedback-status__item"
            :class="{ 'feedback-status__item--off': !preferences.soundEnabled }"
          >
            Audio {{ preferences.soundEnabled ? "On" : "Off" }}
          </span>
          <span
            class="feedback-status__item"
            :class="{
              'feedback-status__item--off':
                !vibrationSupported || !preferences.vibrationEnabled,
            }"
          >
            {{
              vibrationSupported
                ? "Vibrazione " + (preferences.vibrationEnabled ? "On" : "Off")
                : "Vibrazione N/A"
            }}
          </span>
        </div>

        <div class="session-progress">
          <div class="session-progress__head">
            <span>Next Interval</span>
            <strong>{{ nextIntervalLabel }}</strong>
          </div>
          <div class="session-progress__bar" aria-hidden="true">
            <span :style="{ width: overallProgress + '%' }"></span>
          </div>
          <div class="session-progress__foot">
            <span>{{ nextIntervalValue }}</span>
            <span>{{ totalRemainingClock }} rimasti</span>
          </div>
        </div>

        <div class="controls">
          <button
            type="button"
            class="control-button"
            :disabled="session.isCompleted"
            aria-label="Salta intervallo"
            @click="skipInterval"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l8 6-8 6V6zM18 6v12" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            class="control-button control-button--primary"
            :aria-label="primaryControlLabel"
            @click="togglePlayback"
          >
            <svg
              v-if="session.isCompleted"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7 6l10 6-10 6V6z" fill="currentColor" />
            </svg>
            <svg
              v-else-if="session.isRunning"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 6l10 6-10 6V6z" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            class="control-button"
            aria-label="Interrompi workout"
            @click="stopWorkout"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h10v10H7z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <article v-if="session.isCompleted" class="completion-card">
          <span class="eyebrow">Workout Completed</span>
          <h3>{{ config.sets }} serie completate</h3>
          <p>Puoi ripartire subito oppure tornare alla configurazione.</p>
        </article>
      </section>
    </transition>
  </div>
</template>

<script>
const DEFAULT_CONFIG = Object.freeze({
  work: 22,
  rest: 8,
  sets: 3,
});

const LIMITS = Object.freeze({
  work: {
    min: 5,
    max: 300,
    step: 1,
    visualMax: 60,
  },
  rest: {
    min: 0,
    max: 180,
    step: 1,
    visualMax: 30,
  },
  sets: {
    min: 1,
    max: 20,
    step: 1,
    visualMax: 10,
  },
});

const RING_RADIUS = 138;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const PREFERENCES_STORAGE_KEY = "workout-timer-feedback";
const FINISH_AUDIO_PATH = process.env.BASE_URL + "finish.mp3";
const NEXT_SET_CUE_DELAY = 320;

const REST_START_CUE = Object.freeze([
  {
    frequency: 660,
    duration: 0.12,
    offset: 0,
    gain: 0.045,
    type: "triangle",
  },
  {
    frequency: 520,
    duration: 0.18,
    offset: 0.15,
    gain: 0.06,
    type: "triangle",
  },
]);

const WORK_START_CUE = Object.freeze([
  {
    frequency: 540,
    duration: 0.08,
    offset: 0,
    gain: 0.04,
    type: "sine",
  },
  {
    frequency: 740,
    duration: 0.1,
    offset: 0.12,
    gain: 0.05,
    type: "sine",
  },
  {
    frequency: 920,
    duration: 0.18,
    offset: 0.24,
    gain: 0.07,
    type: "sine",
  },
]);

const WORKOUT_DONE_CUE = Object.freeze([
  {
    frequency: 620,
    duration: 0.12,
    offset: 0,
    gain: 0.05,
    type: "triangle",
  },
  {
    frequency: 780,
    duration: 0.14,
    offset: 0.14,
    gain: 0.055,
    type: "triangle",
  },
  {
    frequency: 980,
    duration: 0.22,
    offset: 0.3,
    gain: 0.07,
    type: "triangle",
  },
  {
    frequency: 1240,
    duration: 0.34,
    offset: 0.56,
    gain: 0.09,
    type: "triangle",
  },
]);

const REST_VIBRATION_PATTERN = Object.freeze([80, 50, 80]);
const WORK_VIBRATION_PATTERN = Object.freeze([140]);
const DONE_VIBRATION_PATTERN = Object.freeze([120, 60, 160, 60, 220]);

function getAudioContextCtor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || window.webkitAudioContext || null;
}

function canUseVibration() {
  return (
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
  );
}

function createDefaultPreferences() {
  return {
    soundEnabled: true,
    vibrationEnabled: true,
  };
}

function readStoredPreferences() {
  const defaults = createDefaultPreferences();

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const rawValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (!rawValue) {
      return defaults;
    }

    const parsedValue = JSON.parse(rawValue);

    return {
      soundEnabled:
        typeof parsedValue.soundEnabled === "boolean"
          ? parsedValue.soundEnabled
          : defaults.soundEnabled,
      vibrationEnabled:
        typeof parsedValue.vibrationEnabled === "boolean"
          ? parsedValue.vibrationEnabled
          : defaults.vibrationEnabled,
    };
  } catch (_error) {
    return defaults;
  }
}

function createIdleSession(config) {
  const safeConfig = config || DEFAULT_CONFIG;
  const workMs = safeConfig.work * 1000;

  return {
    currentSet: 1,
    phase: "work",
    remainingMs: workMs,
    phaseDurationMs: workMs,
    elapsedMs: 0,
    isRunning: false,
    isCompleted: false,
    lastTickAt: null,
  };
}

export default {
  name: "Exercise",
  data() {
    const config = { ...DEFAULT_CONFIG };
    const preferences = readStoredPreferences();

    return {
      screen: "setup",
      config,
      preferences,
      vibrationSupported: canUseVibration(),
      limits: LIMITS,
      session: createIdleSession(config),
      tickHandle: null,
      audioContext: null,
      finishAudio: null,
      pendingCueIds: [],
      ringRadius: RING_RADIUS,
      ringCircumference: RING_CIRCUMFERENCE,
    };
  },
  computed: {
    controls() {
      return [
        {
          key: "work",
          label: "Tempo esecuzione",
          hint: "Durata di ogni serie",
          unit: "s",
          visualMax: this.limits.work.visualMax,
        },
        {
          key: "rest",
          label: "Tempo riposo",
          hint: "Pausa tra una serie e l'altra",
          unit: "s",
          visualMax: this.limits.rest.visualMax,
        },
        {
          key: "sets",
          label: "Numero serie",
          hint: "Quante serie vuoi completare",
          unit: "x",
          visualMax: this.limits.sets.visualMax,
        },
      ];
    },
    totalWorkMs() {
      return this.config.work * this.config.sets * 1000;
    },
    totalRestMs() {
      return Math.max(this.config.sets - 1, 0) * this.config.rest * 1000;
    },
    totalDurationMs() {
      return this.totalWorkMs + this.totalRestMs;
    },
    currentSetLabel() {
      if (this.session.isCompleted) {
        return this.config.sets;
      }

      return this.session.currentSet;
    },
    intervalProgress() {
      if (this.session.isCompleted) {
        return 1;
      }

      if (this.session.phaseDurationMs <= 0) {
        return 0;
      }

      return 1 - this.session.remainingMs / this.session.phaseDurationMs;
    },
    ringOffset() {
      return this.ringCircumference * (1 - this.intervalProgress);
    },
    overallProgress() {
      if (this.totalDurationMs <= 0) {
        return 0;
      }

      return Math.min(
        100,
        (this.session.elapsedMs / this.totalDurationMs) * 100
      );
    },
    remainingClock() {
      return this.formatClock(Math.ceil(this.session.remainingMs / 1000));
    },
    totalRemainingClock() {
      const remaining = Math.max(
        this.totalDurationMs - this.session.elapsedMs,
        0
      );

      return this.formatClock(Math.ceil(remaining / 1000));
    },
    sessionLabel() {
      if (this.session.isCompleted) {
        return "Sessione finita";
      }

      return this.session.phase === "work" ? "Fase attiva" : "Recupero";
    },
    sessionTitle() {
      if (this.session.isCompleted) {
        return "Workout completato";
      }

      if (this.session.phase === "work") {
        return "Completa la serie corrente";
      }

      return "Respira e preparati alla prossima";
    },
    phaseChip() {
      if (this.session.isCompleted) {
        return "Done";
      }

      return this.session.phase === "work" ? "Work" : "Rest";
    },
    nextIntervalLabel() {
      if (this.session.isCompleted) {
        return "Nuova configurazione";
      }

      if (this.session.phase === "work") {
        if (this.session.currentSet >= this.config.sets) {
          return "Fine workout";
        }

        if (this.config.rest > 0) {
          return "Rest";
        }

        return "Set " + (this.session.currentSet + 1);
      }

      return "Set " + (this.session.currentSet + 1);
    },
    nextIntervalValue() {
      if (this.session.isCompleted) {
        return "Pronto a ripartire";
      }

      if (this.session.phase === "work") {
        if (this.session.currentSet >= this.config.sets) {
          return "Tutte le serie sono concluse";
        }

        if (this.config.rest > 0) {
          return "Rest: " + this.formatShort(this.config.rest);
        }

        return "Work: " + this.formatShort(this.config.work);
      }

      return "Work: " + this.formatShort(this.config.work);
    },
    primaryControlLabel() {
      if (this.session.isCompleted) {
        return "Riparti";
      }

      return this.session.isRunning ? "Pausa" : "Riprendi";
    },
  },
  methods: {
    formatClock(totalSeconds) {
      const safeSeconds = Math.max(totalSeconds, 0);
      const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
      const seconds = String(safeSeconds % 60).padStart(2, "0");

      return minutes + ":" + seconds;
    },
    formatValue(value) {
      return String(value).padStart(2, "0");
    },
    formatShort(value) {
      return this.formatValue(value) + "s";
    },
    controlFill(control) {
      const value = this.config[control.key];

      if (value <= 0) {
        return 8;
      }

      const ratio = Math.min(value, control.visualMax) / control.visualMax;

      return Math.max(14, ratio * 100);
    },
    adjustConfig(key, direction) {
      const limit = this.limits[key];
      const nextValue = this.config[key] + direction * limit.step;

      this.config[key] = Math.max(limit.min, Math.min(limit.max, nextValue));
      this.session = createIdleSession(this.config);
    },
    persistPreferences() {
      if (typeof window === "undefined") {
        return;
      }

      try {
        window.localStorage.setItem(
          PREFERENCES_STORAGE_KEY,
          JSON.stringify(this.preferences)
        );
      } catch (_error) {
        return;
      }
    },
    togglePreference(key) {
      if (key === "vibrationEnabled" && !this.vibrationSupported) {
        return;
      }

      const nextValue = !this.preferences[key];

      if (key === "soundEnabled" && nextValue) {
        this.ensureAudioContext();
        this.ensureFinishAudio();
      }

      this.preferences = {
        ...this.preferences,
        [key]: nextValue,
      };
      this.persistPreferences();

      if (key === "soundEnabled" && !nextValue) {
        this.stopFinishAudio();
      }

      if (key === "vibrationEnabled" && !nextValue) {
        this.cancelVibration();
      }

      if (key === "vibrationEnabled" && nextValue) {
        this.triggerVibration([40]);
      }
    },
    ensureAudioContext() {
      const AudioContextCtor = getAudioContextCtor();

      if (!AudioContextCtor) {
        return null;
      }

      if (!this.audioContext || this.audioContext.state === "closed") {
        this.audioContext = new AudioContextCtor();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume().catch(() => {});
      }

      return this.audioContext;
    },
    ensureFinishAudio() {
      if (typeof window === "undefined") {
        return null;
      }

      if (!this.finishAudio) {
        this.finishAudio = new Audio(FINISH_AUDIO_PATH);
        this.finishAudio.preload = "auto";
        this.finishAudio.volume = 0.9;
      }

      return this.finishAudio;
    },
    stopFinishAudio() {
      if (!this.finishAudio) {
        return;
      }

      this.finishAudio.pause();
      this.finishAudio.currentTime = 0;
    },
    playCue(steps) {
      if (!this.preferences.soundEnabled) {
        return;
      }

      const context = this.ensureAudioContext();

      if (!context) {
        return;
      }

      const cueStart = context.currentTime + 0.02;

      steps.forEach((step) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        const startAt = cueStart + step.offset;
        const peakAt = startAt + 0.02;
        const endAt = startAt + step.duration;

        oscillator.type = step.type;
        oscillator.frequency.setValueAtTime(step.frequency, startAt);

        gainNode.gain.setValueAtTime(0.0001, startAt);
        gainNode.gain.exponentialRampToValueAtTime(step.gain, peakAt);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(startAt);
        oscillator.stop(endAt + 0.03);
      });
    },
    triggerVibration(pattern) {
      if (!this.vibrationSupported || !this.preferences.vibrationEnabled) {
        return;
      }

      navigator.vibrate(pattern);
    },
    cancelVibration() {
      if (!this.vibrationSupported) {
        return;
      }

      navigator.vibrate(0);
    },
    playRestCue() {
      this.playCue(REST_START_CUE);
      this.triggerVibration(REST_VIBRATION_PATTERN);
    },
    playWorkStartCue() {
      this.playCue(WORK_START_CUE);
      this.triggerVibration(WORK_VIBRATION_PATTERN);
    },
    playFinishJingle() {
      if (!this.preferences.soundEnabled) {
        return false;
      }

      const audio = this.ensureFinishAudio();

      if (!audio) {
        return false;
      }

      this.stopFinishAudio();
      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          this.playCue(WORKOUT_DONE_CUE);
        });
      }

      return true;
    },
    playWorkoutDoneCue() {
      const jingleStarted = this.playFinishJingle();

      if (!jingleStarted) {
        this.playCue(WORKOUT_DONE_CUE);
      }

      this.triggerVibration(DONE_VIBRATION_PATTERN);
    },
    queueWorkStartCue(delayMs) {
      const cueId = window.setTimeout(() => {
        this.pendingCueIds = this.pendingCueIds.filter((id) => id !== cueId);
        this.playWorkStartCue();
      }, delayMs);

      this.pendingCueIds.push(cueId);
    },
    clearPendingCues() {
      this.pendingCueIds.forEach((cueId) => window.clearTimeout(cueId));
      this.pendingCueIds = [];
    },
    startTicker() {
      this.clearTicker();

      if (!this.session.isRunning || this.session.isCompleted) {
        return;
      }

      this.session.lastTickAt = Date.now();
      this.tickHandle = window.setInterval(this.tick, 100);
    },
    clearTicker() {
      if (this.tickHandle) {
        window.clearInterval(this.tickHandle);
        this.tickHandle = null;
      }
    },
    beginPhase(phase, durationMs) {
      this.session.phase = phase;
      this.session.phaseDurationMs = Math.max(durationMs, 1);
      this.session.remainingMs = Math.max(durationMs, 0);
      this.session.lastTickAt = Date.now();
    },
    finishWorkout() {
      this.clearTicker();
      this.clearPendingCues();
      this.session.isCompleted = true;
      this.session.isRunning = false;
      this.session.phase = "done";
      this.session.remainingMs = 0;
      this.session.phaseDurationMs = 1;
      this.session.elapsedMs = this.totalDurationMs;
      this.session.lastTickAt = null;
    },
    advancePhase(fromSkip) {
      if (this.session.isCompleted) {
        return;
      }

      if (fromSkip) {
        this.session.elapsedMs = Math.min(
          this.totalDurationMs,
          this.session.elapsedMs + this.session.remainingMs
        );
        this.session.remainingMs = 0;
      }

      if (this.session.phase === "work") {
        const isLastSet = this.session.currentSet >= this.config.sets;

        if (isLastSet) {
          this.playWorkoutDoneCue();
          this.finishWorkout();
          return;
        }

        this.playRestCue();

        if (this.config.rest > 0) {
          this.beginPhase("rest", this.config.rest * 1000);
          return;
        }

        this.session.currentSet += 1;
        this.beginPhase("work", this.config.work * 1000);
        this.queueWorkStartCue(NEXT_SET_CUE_DELAY);
        return;
      }

      this.session.currentSet += 1;
      this.beginPhase("work", this.config.work * 1000);
      this.playWorkStartCue();
    },
    tick() {
      if (!this.session.isRunning || this.session.isCompleted) {
        return;
      }

      const now = Date.now();
      const delta = now - this.session.lastTickAt;

      if (delta <= 0) {
        return;
      }

      this.session.lastTickAt = now;
      this.session.remainingMs = Math.max(this.session.remainingMs - delta, 0);
      this.session.elapsedMs = Math.min(
        this.totalDurationMs,
        this.session.elapsedMs + delta
      );

      if (this.session.remainingMs === 0) {
        this.advancePhase(false);
      }
    },
    startWorkout() {
      const workMs = this.config.work * 1000;

      this.ensureAudioContext();
      this.ensureFinishAudio();
      this.stopFinishAudio();
      this.clearPendingCues();
      this.cancelVibration();
      this.screen = "session";
      this.session = {
        currentSet: 1,
        phase: "work",
        remainingMs: workMs,
        phaseDurationMs: workMs,
        elapsedMs: 0,
        isRunning: true,
        isCompleted: false,
        lastTickAt: Date.now(),
      };
      this.startTicker();
    },
    togglePlayback() {
      if (this.session.isCompleted) {
        this.startWorkout();
        return;
      }

      if (this.session.isRunning) {
        this.session.isRunning = false;
        this.clearTicker();
        this.clearPendingCues();
        this.stopFinishAudio();
        this.cancelVibration();
        return;
      }

      this.ensureAudioContext();
      this.session.isRunning = true;
      this.startTicker();
    },
    skipInterval() {
      if (this.session.isCompleted) {
        return;
      }

      this.advancePhase(true);
    },
    stopWorkout() {
      this.clearTicker();
      this.clearPendingCues();
      this.stopFinishAudio();
      this.cancelVibration();
      this.screen = "setup";
      this.session = createIdleSession(this.config);
    },
    resetConfig() {
      this.clearTicker();
      this.clearPendingCues();
      this.stopFinishAudio();
      this.cancelVibration();
      this.screen = "setup";
      this.config = { ...DEFAULT_CONFIG };
      this.session = createIdleSession(this.config);
    },
  },
  beforeUnmount() {
    this.clearTicker();
    this.clearPendingCues();
    this.stopFinishAudio();
    this.cancelVibration();

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
    }
  },
};
</script>

<style scoped>
.workout-view {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.workout-view::before,
.workout-view::after {
  content: "";
  position: absolute;
  inset: auto;
  border-radius: 50%;
  pointer-events: none;
}

.workout-view::before {
  width: 26rem;
  height: 26rem;
  top: -10rem;
  right: -9rem;
  background: radial-gradient(circle, rgba(31, 242, 95, 0.16), transparent 68%);
}

.workout-view::after {
  width: 22rem;
  height: 22rem;
  bottom: -9rem;
  left: -10rem;
  background: radial-gradient(
    circle,
    rgba(99, 139, 255, 0.12),
    transparent 68%
  );
}

.screen-shell {
  min-height: 100vh;
  max-width: 28rem;
  margin: 0 auto;
  padding: max(1.5rem, env(safe-area-inset-top)) 1.35rem
    max(1.5rem, env(safe-area-inset-bottom));
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.setup-view {
  gap: 1.5rem;
}

.topbar,
.session-topbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.headline {
  max-width: 18rem;
}

.eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.headline h1,
.session-copy h2,
.completion-card h3 {
  margin: 0;
  line-height: 0.96;
}

.headline h1 {
  margin-top: 0.75rem;
  font-size: clamp(2.6rem, 10vw, 4rem);
  font-weight: 700;
}

.intro {
  margin: 1rem 0 0;
  color: var(--app-muted);
  line-height: 1.6;
}

.icon-action {
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 999px;
  background: rgba(7, 24, 15, 0.72);
  color: var(--app-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.26);
}

.icon-action svg {
  width: 1.35rem;
  height: 1.35rem;
}

.card-stack {
  display: grid;
  gap: 1rem;
}

.config-card {
  --card-accent: var(--app-accent);
  background: linear-gradient(
    135deg,
    rgba(20, 55, 35, 0.92),
    rgba(10, 31, 20, 0.96)
  );
  border: 1px solid rgba(72, 255, 142, 0.12);
  border-radius: 2rem;
  padding: 1.25rem;
  box-shadow: var(--app-shadow);
  backdrop-filter: blur(18px);
}

.config-card--rest {
  --card-accent: var(--app-rest);
}

.config-card--sets {
  --card-accent: #91a39a;
}

.config-card__head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.config-card__marker {
  width: 1.1rem;
  height: 1.1rem;
  position: relative;
  flex: 0 0 auto;
  color: var(--card-accent);
}

.config-card__marker::before,
.config-card__marker::after {
  content: "";
  position: absolute;
}

.config-card__marker--work::before,
.config-card__marker--work::after {
  width: 1.15rem;
  height: 0.18rem;
  top: 0.46rem;
  left: 0;
  border-radius: 999px;
  background: currentColor;
}

.config-card__marker--work::before {
  transform: rotate(45deg);
}

.config-card__marker--work::after {
  transform: rotate(-45deg);
}

.config-card__marker--rest {
  border: 0.16rem solid currentColor;
  border-radius: 50%;
}

.config-card__marker--rest::before {
  width: 0.16rem;
  height: 0.36rem;
  top: 0.2rem;
  left: 0.45rem;
  border-radius: 999px;
  background: currentColor;
}

.config-card__marker--rest::after {
  width: 0.34rem;
  height: 0.16rem;
  top: 0.52rem;
  left: 0.45rem;
  border-radius: 999px;
  background: currentColor;
}

.config-card__marker--sets::before,
.config-card__marker--sets::after {
  left: 0.12rem;
  width: 0.86rem;
  height: 0.14rem;
  border-radius: 999px;
  background: currentColor;
}

.config-card__marker--sets::before {
  top: 0.28rem;
  box-shadow: 0 0.28rem 0 currentColor, 0 0.56rem 0 currentColor;
}

.config-card__title {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--card-accent);
}

.config-card__hint {
  margin: 0.3rem 0 0;
  font-size: 0.92rem;
  color: var(--app-muted);
}

.config-card__body {
  margin-top: 1.3rem;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr) 4.5rem;
  gap: 1rem;
  align-items: center;
}

.stepper {
  width: 4.5rem;
  height: 4.5rem;
  border: 0;
  border-radius: 50%;
  background: rgba(4, 18, 10, 0.5);
  color: var(--app-text);
  font-size: 2rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stepper:disabled {
  opacity: 0.34;
}

.config-value {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0.25rem;
}

.config-value__number {
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(4.8rem, 18vw, 6.4rem);
  line-height: 0.82;
  letter-spacing: 0.04em;
}

.config-value__unit {
  margin-top: 0.45rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--card-accent);
  opacity: 0.9;
}

.config-meter {
  height: 0.95rem;
  margin-top: 1.2rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.config-meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--card-accent),
    rgba(255, 255, 255, 0.18)
  );
}

.summary-card {
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1.6rem;
  background: rgba(8, 28, 18, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-card__item {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.summary-card__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--app-muted);
}

.summary-card strong {
  font-size: 1.1rem;
}

.feedback-card {
  display: grid;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 1.6rem;
  background: rgba(8, 28, 18, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.feedback-card__copy {
  margin: 0.55rem 0 0;
  color: var(--app-muted);
  line-height: 1.55;
}

.feedback-toggle {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.3rem;
  background: rgba(4, 19, 12, 0.52);
  color: var(--app-text);
  padding: 0.9rem 1rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  text-align: left;
}

.feedback-toggle--active {
  border-color: rgba(31, 242, 95, 0.32);
  box-shadow: inset 0 0 0 1px rgba(31, 242, 95, 0.12);
}

.feedback-toggle--disabled {
  opacity: 0.55;
}

.feedback-toggle__badge {
  min-width: 3rem;
  padding: 0.45rem 0.6rem;
  border-radius: 999px;
  background: rgba(20, 43, 31, 0.92);
  color: var(--app-accent);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-align: center;
}

.feedback-toggle__body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.feedback-toggle__body strong {
  font-size: 1rem;
}

.feedback-toggle__body small {
  color: var(--app-muted);
  line-height: 1.45;
}

.feedback-toggle__state {
  min-width: 3.4rem;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.primary-action {
  margin-top: 1rem;
  width: 100%;
  border: 0;
  border-radius: 1.75rem;
  padding: 1.35rem 1.5rem;
  background: var(--app-accent);
  color: #03130b;
  font-size: 1.3rem;
  font-weight: 700;
  box-shadow: 0 18px 40px rgba(31, 242, 95, 0.28);
}

.session-view {
  --phase-accent: var(--app-accent);
  --phase-glow: rgba(31, 242, 95, 0.28);
  justify-content: flex-start;
}

.session-view--rest {
  --phase-accent: var(--app-rest);
  --phase-glow: rgba(140, 160, 201, 0.26);
}

.session-view--done {
  --phase-accent: #eff7f0;
  --phase-glow: rgba(239, 247, 240, 0.18);
}

.session-topbar {
  align-items: center;
}

.session-title {
  text-align: center;
}

.session-title strong {
  display: block;
  margin-top: 0.65rem;
  font-family: "Bebas Neue", sans-serif;
  font-size: 3.35rem;
  line-height: 0.85;
  letter-spacing: 0.08em;
}

.session-copy {
  margin-top: 2rem;
  text-align: center;
}

.session-copy h2 {
  margin-top: 0.9rem;
  font-size: clamp(1.9rem, 7vw, 2.8rem);
  font-weight: 700;
}

.progress-ring {
  width: min(82vw, 23rem);
  aspect-ratio: 1;
  margin: 2.5rem auto 0;
  position: relative;
  display: grid;
  place-items: center;
}

.progress-ring__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  overflow: visible;
}

.progress-ring__track,
.progress-ring__value {
  fill: none;
  stroke-width: 16;
}

.progress-ring__track {
  stroke: rgba(19, 36, 66, 0.9);
}

.progress-ring__value {
  stroke: var(--phase-accent);
  stroke-linecap: round;
  filter: drop-shadow(0 0 0.9rem var(--phase-glow));
  transition: stroke-dashoffset 0.14s linear, stroke 0.2s ease;
}

.progress-ring__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.progress-ring__time {
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(5.5rem, 22vw, 7.8rem);
  line-height: 0.82;
  letter-spacing: 0.04em;
  color: var(--phase-accent);
  text-shadow: 0 0 2rem var(--phase-glow);
}

.progress-ring__caption {
  margin-top: 0.9rem;
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--app-muted);
}

.phase-chip {
  margin: 2rem auto 0;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.95rem 1.55rem;
  border-radius: 999px;
  background: rgba(9, 36, 18, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--phase-accent);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.phase-chip__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 1.2rem var(--phase-glow);
}

.feedback-status {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.feedback-status__item {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(11, 33, 21, 0.86);
  border: 1px solid rgba(31, 242, 95, 0.18);
  color: var(--app-text);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.feedback-status__item--off {
  border-color: rgba(141, 162, 148, 0.16);
  color: var(--app-muted);
}

.session-progress {
  margin-top: 2.4rem;
}

.session-progress__head,
.session-progress__foot {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
}

.session-progress__head {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--app-muted);
}

.session-progress__head strong {
  color: var(--app-text);
  letter-spacing: normal;
  text-transform: none;
}

.session-progress__bar {
  margin-top: 0.8rem;
  height: 1rem;
  border-radius: 999px;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(18, 34, 25, 0.96),
    rgba(18, 35, 63, 0.96)
  );
}

.session-progress__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--app-accent),
    rgba(110, 147, 255, 0.66)
  );
}

.session-progress__foot {
  margin-top: 0.8rem;
  color: var(--app-muted);
}

.controls {
  margin-top: auto;
  padding-top: 2.2rem;
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr) 5rem;
  align-items: end;
  gap: 1.4rem;
}

.control-button {
  width: 5rem;
  height: 5rem;
  border: 0;
  border-radius: 50%;
  background: rgba(21, 34, 63, 0.92);
  color: var(--app-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.3);
}

.control-button:disabled {
  opacity: 0.35;
}

.control-button svg {
  width: 1.8rem;
  height: 1.8rem;
}

.control-button--primary {
  width: 7rem;
  height: 7rem;
  margin: 0 auto;
  background: var(--app-accent);
  color: #04160d;
  box-shadow: 0 18px 35px rgba(31, 242, 95, 0.28);
}

.completion-card {
  margin-top: 1.8rem;
  padding: 1.25rem;
  border-radius: 1.6rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.completion-card h3 {
  margin-top: 0.9rem;
  font-size: 1.7rem;
}

.completion-card p {
  margin: 0.85rem 0 0;
  color: var(--app-muted);
  line-height: 1.55;
}

.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.screen-fade-enter-from,
.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(0.8rem);
}

@media (max-width: 28rem) {
  .screen-shell {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .config-card__body {
    grid-template-columns: 4rem minmax(0, 1fr) 4rem;
    gap: 0.7rem;
  }

  .stepper {
    width: 4rem;
    height: 4rem;
  }

  .summary-card {
    grid-template-columns: 1fr;
  }

  .feedback-toggle {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .feedback-toggle__state {
    min-width: 0;
    text-align: left;
  }

  .controls {
    grid-template-columns: 4.6rem minmax(0, 1fr) 4.6rem;
    gap: 1rem;
  }

  .control-button {
    width: 4.6rem;
    height: 4.6rem;
  }

  .control-button--primary {
    width: 6.4rem;
    height: 6.4rem;
  }
}
</style>
