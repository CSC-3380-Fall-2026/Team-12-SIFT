
import { useState } from "react";

/**
 * WordCounter is a reusable React component for counting words in notes.
 *
 * How it works:
 * - React useState stores the text entered by the user.
 * - The word count is calculated whenever the component renders.
 * - The count updates automatically when the user types or deletes text.
 *
 * How teammates can expand it:
 * - Add a word limit or warning when notes become too long.
 * - Reuse the counting logic in another note-editing component.
 */
function WordCounter() {
  // Store the current text entered in the note editor.
  const [noteText, setNoteText] = useState<string>("");

  /**
   * Count the words in the note.
   *
   * trim() removes whitespace from the beginning and end.
   * split(/\s+/) separates words using spaces, tabs, or line breaks.
   * An empty note returns 0 instead of incorrectly returning 1.
   */
  const countWords = (text: string): number => {
    const trimmedText = text.trim();

    if (trimmedText === "") {
      return 0;
    }

    return trimmedText.split(/\s+/).length;
  };

  // Recalculate the word count whenever the note text changes.
  const wordCount = countWords(noteText);

  return (
    <div>
      <h2>Note Word Counter</h2>

      {/* Text area where users can type or edit their notes. */}
      <textarea
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
        placeholder="Start typing your note here..."
        rows={8}
        cols={50}
        aria-label="Note text"
      />

      {/* Display the live word count beneath the note editor. */}
      <p>Words: {wordCount}</p>
    </div>
  );
}

export default WordCounter;
