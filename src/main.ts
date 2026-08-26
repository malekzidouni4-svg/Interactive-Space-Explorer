import "./styles/global.css";
import { App } from "./App";

const container = document.querySelector<HTMLElement>("#app");

if (!container) {
  throw new Error("App container was not found.");
}

const app = new App(container);
app.start();

window.addEventListener("beforeunload", () => {
  app.dispose();
});