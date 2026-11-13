import { useState, useEffect } from 'react';
import { WorkspaceNavbar } from '../components/WorkspaceNavbar';
import profileIcon from '../assets/profile-icon.png';
import './Workspace.css';

// create empty mediaItems folder as JavaScript array
// point to note: backend integration will populate this later on
type MediaItem = {
    id: string;
    media_type: 'image' | 'document';
    filename: string;
    content_type: string;
    size_bytes: number;
};

export function Workspace() {
    // Stores the text entered by the user in the note editor.
    // React updates the screen whenever this value changes.
    const [noteText, setNoteText] = useState<string>('');
    //different menu bools
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isPinMenuOpen, setIsPinMenuOpen] = useState<boolean>(false);
    //darkmode bool
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const [showCharCount, setShowCharCount] = useState<boolean>(true);
    const [autoSave, setAutoSave] = useState<boolean>(true);
    //const [isMediaFolderOpen, setIsMediaFolderOpen] = useState<boolean>(false);

    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [mediaLoading, setMediaLoading] = useState<boolean>(false);
    const [mediaError, setMediaError] = useState<string | null>(null);

    //const handleMedia = () => {
    //    setIsMediaFolderOpen(!isMediaFolderOpen);
    //};

    type Pin={

    }

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

    return (
        <div className="workspace">
            <div className="board">
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
                            <button
                                type="button"
                                className="profile-menu-option"
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                aria-expanded={isSettingsOpen}
                            >
                                 Settings {isSettingsOpen ? '▾' : '▸'}
                            </button>

                            {isSettingsOpen && (
                                <>
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
                                </>
                            )}
                        </div>                  
                    )}
                </section>

                <WorkspaceNavbar />
            </div>
            
            <aside className={isPinMenuOpen ? 'pin-menu pin-menu-open': 'pin menu'}>
                <button
                    type="button"
                    className="pin-menu-toggle"
                    onClick={() => setIsPinMenuOpen(!isPinMenuOpen)}
                    aria-label={isPinMenuOpen ? 'Close menu' : 'Open Menu'}
                    aria-expanded={isPinMenuOpen}
                >
                    {isPinMenuOpen? '->' : '<-'}
                </button>

                {isPinMenuOpen &&(
                    <div className="pin-menu-content">
                        <h2>Media Folder</h2>
                            {mediaLoading ? (<p>Loading media...</p>) : mediaError ? 
                                (<p>{mediaError}</p>) : mediaItems.length === 0 ? 
                                (<p>The media folder is currently empty.</p>) : 
                                (
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
                    </div>
                )}
            </aside>
        </div>
    );
}