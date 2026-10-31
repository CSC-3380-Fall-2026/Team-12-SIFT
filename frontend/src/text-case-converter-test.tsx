
import React from "react";
import ReactDOM from "react-dom/client";
import TextCaseConverter from "./Components/TextCaseConverter";

// This file is only used to test our Text Case Converter.
// It lets us see the component in a browser without changing
// the team's main SIFT application.

// This finds the empty "root" area in our HTML test page.
// React uses that area to display our Text Case Converter.
const root = document.getElementById("root");

// If the root area exists, show our Text Case Converter inside it.
// This keeps our test separate from the rest of the project.
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <TextCaseConverter />
    </React.StrictMode>
  );
}
