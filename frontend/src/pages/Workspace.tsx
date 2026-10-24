
import { useState } from 'react';

export function Workspace() {
    // Stores the text entered by the user in the note editor.
    // React updates the screen whenever this value changes.
    const [noteText, setNoteText] = useState<string>('');

    //const mediaItems: string[] = ['photo.jpg', 'video.mp4', 'document.png']

    const handleMedia = () => {
        // Handle media logic here
        console.log('Media button clicked');
    };

    return (
        <>
            <h1>This is a workspace!</h1>

            <section>
                <button
                    type="button"
                    className="media-button"
                    onClick={handleMedia}
                >
                    Open media folder
                </button>

                {/* Existing media folder code is preserved for future development. */}
                {/* 
                <h2>Media Folder</h2>
                <p>Stored media: {mediaItems.length}</p>
                <ul>
                    {mediaItems.map((media) => (
                        <li key={media}>{media}</li>
                    ))}
                </ul>
                */}
            </section>

            {/* Note editor with a live character counter. */}
            <section>
                <h2>Note Editor</h2>

                {/* The text area updates noteText whenever the user types or deletes text. */}
                <textarea
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    placeholder="Write your note here..."
                    rows={6}
                    cols={45}
                    aria-label="Note text"
                />

                {/* The character count is calculated from the current note text.
                    Future developers can add a character limit or word counter here. */}
                <p>Characters: {noteText.length}</p>
            </section>
        </>
    );
}
