import { useState, useEffect } from 'react';
import { WorkspaceNavbar } from '../components/WorkspaceNavbar';
import profileIcon from '../assets/profile-icon.png';
import './Workspace.css';

export function Workspace() {
    // Stores the text entered by the user in the note editor.
    // React updates the screen whenever this value changes.
    const [noteText, setNoteText] = useState<string>('');
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [showCharCount, setShowCharCount] = useState<boolean>(true);
    const [autoSave, setAutoSave] = useState<boolean>(true);
    const [isMediaFolderOpen, setIsMediaFolderOpen] = useState<boolean>(false);

    // each quick note has an id from the database as well as its saved text
    type QuickNote = {
        id: number;
        text: string;
    };

    // create state variable storing an array of quick notes
    const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
    const [quickNotesLoading, setQuickNotesLoading] = useState<boolean>(false);
    const [quickNotesError, setQuickNotesError] = useState<string | null>(null);

    // load saved quick notes when workspace first opens
    useEffect(() => {
        // collect all quick notes currently stored in the psql db
        const fetchQuickNotes = async () => {
            setQuickNotesLoading(true);
            setQuickNotesError(null);
            try {
                const response = await fetch('http://127.0.0.1:8000/quick-notes');
                if (!response.ok) {
                    throw new Error('Error: Failed to fetch Quick Notes.');
                }
                const data: QuickNote[] = await response.json();
                // update page w/ notes obtained from the backend
                setQuickNotes(data);
            } catch (error) {
                setQuickNotesError('Error: Failed to load Quick Notes.');
            }
            setQuickNotesLoading(false);
        };
        fetchQuickNotes();
    }, []);

    // create empty mediaItems folder as JavaScript array
    // point to note: backend integration will populate this later on
    type MediaItem = {
        id: string;
        media_type: 'image' | 'document';
        filename: string;
        content_type: string;
        size_bytes: number;
    };

    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [mediaLoading, setMediaLoading] = useState<boolean>(false);
    const [mediaError, setMediaError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            setMediaLoading(true);
            setMediaError(null);
            try {
                const response = await fetch('http://127.0.0.1:8000/media');
                if (!response.ok) {
                    throw new Error('Failed to fetch media files.');
                }
                const data: MediaItem[] = await response.json();
                setMediaItems(data);
            } catch (error) {
                setMediaError(
                    error instanceof Error ? error.message : 'Something went wrong.'
                );
            } finally {
                setMediaLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const handleMedia = () => {
        setIsMediaFolderOpen(!isMediaFolderOpen);
    };

    // creates a blank quick note and adds it to the array
    const addQuickNote = async () => {
        const response = await fetch('http://127.0.0.1:8000/quick-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: '' })
        });
        const newNote: QuickNote = await response.json();
        setQuickNotes([...quickNotes, newNote]);
    };

    // updates note on the page as client types into the textarea
    const updateQuickNote = (id: number, newText: string) => {
        setQuickNotes((previousNotes) =>
            previousNotes.map((note) => {
                if (note.id === id) {
                    return { ...note, text: newText };
                }
                return note;
            })
        );
    };

    // saves the edited note to db after user leaves textarea
    const saveQuickNote = async (id: number, text: string) => {
        const response = await fetch(`http://127.0.0.1:8000/quick-notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        if (!response.ok) {
            console.log('Error: Failed to save Quick Note.');
        }
    };

    // deletes from both db and page the selected note
    const deleteQuickNote = async (id: number) => {
        await fetch(`http://127.0.0.1:8000/quick-notes/${id}`, {
            method: 'DELETE'
        });
        setQuickNotes(quickNotes.filter((note) => note.id !== id));
    };

    return (
        <>
            <section className="profile-container">
                <button
                    type="button"
                    className="profile-button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-label="Profile"
                    aria-expanded={isProfileOpen}
                >
                    <img
                        src={profileIcon}
                        alt=""
                        className="profile-icon"
                    />
                </button>
                {isProfileOpen && (
                    <div className="settings-dropdown profile-dropdown">
                        <div className="profile-menu-option">
                            Settings
                        </div>
                    </div>
                )}
            </section>

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
                    aria-expanded={isMediaFolderOpen}
                >
                    { isMediaFolderOpen ? 'Close Media Folder' : 'Open Media Folder'}
                </button>
                {isMediaFolderOpen && (
                    <div>
                        <h2>Media Folder</h2>
                        {mediaLoading ? (
                            <p>Loading media...</p>
                        ) : mediaError ? (
                            <p>{mediaError}</p>
                        ) : mediaItems.length === 0 ? (
                            <p>The media folder is currently empty.</p>
                        ) : (
                            <ul>
                                {mediaItems.map((item) => (
                                    <li key={item.id}>
                                        <strong>{item.filename}</strong>
                                        {' -- '}
                                        {item.media_type}
                                        {' -- '}
                                        {(item.size_bytes / 1024).toFixed(1)} KB
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </section>
            <WorkspaceNavbar />
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
            {/* Quick Notes panel goes here. */}
            <section>
                <h2>Quick Notes</h2>
                <button onClick={addQuickNote}>Add Note</button>
                {/* displays message while saved notes are loading */}
                {quickNotesLoading && (
                    <p>Loading Quick Notes...</p>
                )}
                {quickNotesError && (
                    <p>{quickNotesError}</p>
                )}
                {!quickNotesLoading && !quickNotesError && quickNotes.length === 0 && (
                    <p>No Quick Notes have been made yet.</p>
                )}
                {!quickNotesLoading && !quickNotesError && quickNotes.length > 0 && (
                    quickNotes.map((note) => (
                        <div key={note.id}>
                            <textarea
                                value={note.text}
                                onChange={(event) => updateQuickNote(note.id, event.target.value)}
                                onBlur={(event) => saveQuickNote(note.id, event.target.value)}
                                rows={3}
                                placeholder="Write your Quick Note here..."
                            />
                            <button type="button" onClick={() => deleteQuickNote(note.id)}>Delete</button>
                        </div>
                    ))
                )}
            </section>
        </>
    );
}