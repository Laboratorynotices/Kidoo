import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import i18n, { setLocale, DEFAULT_LOCALE } from "./i18n";

const savedLocale = localStorage.getItem("locale") || DEFAULT_LOCALE;

const app = createApp(App);
app.use(i18n);

setLocale(savedLocale as any).then(() => {
  app.mount("#app");
});
