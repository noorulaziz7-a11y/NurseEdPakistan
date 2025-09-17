import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  // Fail fast with a clear message if the root node is missing
  throw new Error("#root element not found. Make sure client/index.html has <div id=\"root\"></div>");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
