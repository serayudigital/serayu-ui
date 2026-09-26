import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

if (import.meta.env.DEV) {
  // Branding: shown in the DevTools console for Serayu Digital attribution.
  // Safe for production; static string with no sensitive info.
  // eslint-disable-next-line no-console
  console.info(
    "%cSerayu UI%c Â· Mobile-first React UI components\nby Serayu Digital Â· www.serayudigital.com",
    "background:#0064f0;color:#fff;padding:2px 6px;border-radius:4px;font-weight:700",
    "color:#52525b"
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
