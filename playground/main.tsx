import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PlaygroundApp from "./App";
import "../src/styles/index.css";

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    "%cSerayu UI Playground%c\nTry every component and mobile-first pattern, live.",
    "background:#0064f0;color:#fff;padding:2px 6px;border-radius:4px;font-weight:700",
    "color:#52525b"
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlaygroundApp />
  </StrictMode>
);
