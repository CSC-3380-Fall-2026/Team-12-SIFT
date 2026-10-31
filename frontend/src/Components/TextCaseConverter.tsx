    
import { useState } from "react";

// This component lets users change the capitalization of their notes.
// It works on its own so the team can add it to the SIFT note editor later.
export default function TextCaseConverter() {
  // This keeps track of whatever the user types in the text box.
  // When the text changes, React updates what appears on the screen.
  const [text, setText] = useState("");

  // This changes all letters to uppercase.
  // For example: "hello world" becomes "HELLO WORLD".
  const makeUppercase = () => {
    setText(text.toUpperCase());
  };

  // This changes all letters to lowercase.
  // For example: "HELLO WORLD" becomes "hello world".
  const makeLowercase = () => {
    setText(text.toLowerCase());
  };

  // This capitalizes the first letter of each word.
  // For example: "hello world" becomes "Hello World".
  // We start with lowercase text so the rest of each word stays lowercase.
  const makeTitleCase = () => {
    const updatedText = text
      .toLowerCase()
      .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

    setText(updatedText);
  };

  // Everything below is what the user sees on the page.
  // The text box stores the note, and the buttons change its capitalization.
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Note Text Case Converter</h2>

      <p>Type or paste your note below, then choose how to capitalize it.</p>

      {/* This text box updates our saved text whenever the user types. */}
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Enter your note here..."
        rows={8}
        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
      />

      {/* Each button runs a different text conversion when clicked. */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
        <button type="button" onClick={makeUppercase}>
          UPPERCASE
        </button>

        <button type="button" onClick={makeLowercase}>
          lowercase
        </button>

        <button type="button" onClick={makeTitleCase}>
          Title Case
        </button>
      </div>
    </div>
  );
}
