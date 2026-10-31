import { useState } from 'react';
import './Workspace.css';

export function Workspace() {
    // Stores the text entered by the user in the note editor.
    // React updates the screen whenever this value changes.
    const [noteText, setNoteText] = useState<string>('');
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [showCharCount, setShowCharCount] = useState<boolean>(true);
    const [autoSave, setAutoSave] = useState<boolean>(true);

    //const mediaItems: string[] = ['photo.jpg', 'video.mp4', 'document.png']

    const handleMedia = () => {
        // Handle media logic here
        console.log('Media button clicked');
    };

    return (
        <>
            <h1>This is a workspace!</h1>
            <section className="settings-container">
                <button
                className="settings-button"
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-expanded={isSettingsOpen}
                >
                    Settings
                </button>
                {isSettingsOpen && (
                <div className="settings-dropdown">
                    <label>
                        <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={(event) => setIsDarkMode(event.target.checked)}
                        />
                        Dark Mode
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showCharCount}
                            onChange={(event) => setShowCharCount(event.target.checked)}
                        />
                        Show Character Count
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={autoSave}
                            onChange={(event) => setAutoSave(event.target.checked)}
                        />
                        Enable Auto-Save
                    </label>
                </div>
            )}
            </section>
            <section>
                <button
                    type="button"
                    className="media-button"
                    onClick={handleMedia}
                >
                    Open Media Folder
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
                {showCharCount && (
                    <p>Characters: {noteText.length}</p>
                )}
            </section>
        </>
    );
}