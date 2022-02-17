import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");

// Service Worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
};