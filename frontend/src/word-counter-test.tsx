
import React from "react";
import ReactDOM from "react-dom/client";
import WordCounter from "./Components/WordCounter";

// Find the HTML element where our Word Counter will appear.
const rootElement = document.getElementById("word-counter-root");

// Render our reusable Word Counter component independently.
// This avoids loading the main SIFT application or Navbar.
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WordCounter />
    </React.StrictMode>
  );
}
