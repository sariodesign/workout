<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;700&display=swap");

:root {
  --app-bg: #04170e;
  --app-panel: rgba(13, 39, 25, 0.9);
  --app-panel-strong: rgba(10, 31, 20, 0.94);
  --app-border: rgba(72, 255, 142, 0.16);
  --app-text: #eff7f0;
  --app-muted: #8da294;
  --app-accent: #1ff25f;
  --app-accent-soft: rgba(31, 242, 95, 0.3);
  --app-rest: #8ca0c9;
  --app-track: #142d20;
  --app-track-dark: #12233f;
  --app-shadow: 0 22px 60px rgba(0, 0, 0, 0.34);
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  background: radial-gradient(
      circle at top,
      rgba(24, 109, 57, 0.22),
      transparent 30%
    ),
    linear-gradient(180deg, #04150d 0%, #021108 100%);
  color: var(--app-text);
  font-family: "Space Grotesk", "Kanit", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input,
textarea,
select {
  font: inherit;
}
</style>
