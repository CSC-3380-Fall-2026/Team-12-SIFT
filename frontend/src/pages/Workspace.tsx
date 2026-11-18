import { useState, useEffect, useRef} from 'react';
import type { 
    DragEvent as ReactDragEvent,
    PointerEvent as ReactPointerEvent,
} from 'react';
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

type Pin = {
    id: string;
    item_type: 'media' | 'note';
    x: number;
    y: number;
    media_id: string | null;
    note_content: string | null;
    placed: boolean;
};

//draggin pin info
type DragState = {
    id: string;
    offsetX: number;
    offsetY: number;
};

//keeps a min/max for the board
const clamp = (value:number, min:number, max:number) =>
    Math.min(Math.max(value, min), max);

const PIN_WIDTH_CONST = 185;
const PIN_HEIGHT_CONST = 130;

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

    //pins on the board vs menu, dragging process, board handle
    const [pins, setPins] = useState<Pin[]> ([]);
    const [dragging, setDragging] = useState<DragState | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLElement>(null);
    const [isOverMenu, setIsOverMenu] = useState<boolean>(false);

    const boardPins = pins.filter((pin) => pin.placed);
    const menuPins = pins.filter((pin) => !pin.placed);


    //adding a pin via menu
    const [newPinType, setNewPinType] = useState<'note' | 'media'>('note');
    const [newPinMediaId, setNewPinMediaId] = useState<string>('');
    const [newPinNote, setNewPinNote] = useState<string>('');

    const canAddPin = newPinType == 'note' ? newPinNote.trim() !== '' : newPinMediaId !== '';

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

    // creates a blank quick note and adds it to the array
    const addQuickNote = async () => {
        const response = await fetch('http://127.0.0.1:8000/quick-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: '' })
        });
        if (!response.ok) {
            console.log('Error: Unable to create Quick Note.');
            return;
        }
        const newNote: QuickNote = await response.json();
        setQuickNotes((previousNotes) => [...previousNotes, newNote]);
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
        const response = await fetch(`http://127.0.0.1:8000/quick-notes/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setQuickNotes((previousNotes) => 
                previousNotes.filter((note) => note.id !== id)
            );
        } else {
            console.log('Error: Failed to delete Quick Note.');
        }
    };

    const renderPinContent = (pin: Pin) => {
        if (pin.item_type === 'note') {
            return <p className="pin-note">{pin.note_content}</p>;
        }

            const mediaItem = mediaItems.find((item) => item.id === pin.media_id);
            return(
                <div className="pin-media">
                    {mediaItem ? (
                        <>
                            <strong>{mediaItem.filename}</strong>
                            <div>{mediaItem.media_type}</div>
                        </>
                    ) : (
                        <div>Media not found</div>
                    )}
                </div>
            );
    };

    //builds and adds pin with a temp id
    const handleAddPin = () => {
        const newPin: Pin = {
            id: crypto.randomUUID(),
            item_type: newPinType,
            x: 0,
            y: 0,
            media_id: newPinType === 'media' ? newPinMediaId: null,
            note_content: newPinType === 'note' ? newPinNote : null,
            placed: false,
        };

        setPins((previousPins) => [...previousPins, newPin]);
        setNewPinNote('');
        setNewPinMediaId('');
    };

    const isPointOverMenu = (clientX: number, clientY: number) => {
        const menuBox = menuRef.current?.getBoundingClientRect();
        if(!menuBox) return false;
        return(
            clientX >= menuBox.left && clientX <= menuBox.right &&
            clientY >= menuBox.top && clientY <= menuBox.bottom
        );
    };

    //dragging part 1: remembers pin and where inside we grabbed
    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, pinId: string) => {
        if(event.button !== 0) return; //left button starts a drag

        //pin's coords
        const pinBox = event.currentTarget.getBoundingClientRect();
        setDragging({
            id: pinId,
            offsetX: event.clientX - pinBox.left,
            offsetY: event.clientY - pinBox.top,
        });

        //keeps assigning the coords to the box, so that the cursor does not outrun it
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    //dragging pt 2: converts cursor pos into coords to update pin with
    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>, pinId: string) => {
        if (!dragging || dragging.id !== pinId || !boardRef.current) return;

        setIsOverMenu(isPointOverMenu(event.clientX, event.clientY));

        const boardBox = boardRef.current.getBoundingClientRect();
        const pinElement = event.currentTarget;

        //cursor position relative to board, subtracts grab offset
        //clamp is used to keep pins in board as previously mentioned
        const newX = clamp(
            event.clientX - boardBox.left -dragging.offsetX,
            0,
            boardBox.width - pinElement.offsetWidth
        );

        const newY = clamp(
            event.clientY - boardBox.top -dragging.offsetY,
            0,
            boardBox.height - pinElement.offsetHeight
        );

        //copies quicknote pattern for mapping
        setPins((previousPins)=>
            previousPins.map((pin) =>
                pin.id === pinId ? { ...pin, x:newX, y:newY} : pin
            )
        );
    };

    //drag pt 3: clear drag
    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>, pinId: string) => {
        if(dragging?.id === pinId && isPointOverMenu(event.clientX, event.clientY)){
            setPins((previousPins) =>
                previousPins.map((pin) =>
                    pin.id === pinId ? {...pin, placed: false} : pin
                )
            );
        }
        setDragging(null);
        setIsOverMenu(false);
    };

    const handlePointerCancel = () => {
        setDragging(null);
        setIsOverMenu(false);
    };

    //pin tile is dragged pt1
    const handleTileDragStart=(event: ReactDragEvent<HTMLDivElement>, pinId: string) => {
        event.dataTransfer.setData('text/plain', pinId);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleBoardDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    //places pin where dropped
    const handleBoardDrop = (event: ReactDragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const pinId = event.dataTransfer.getData('text/plain');
        if (!pinId || !boardRef.current) return;

        const boardBox = boardRef.current?.getBoundingClientRect();
        //keeps pin in board and on cursor
        const x = clamp(event.clientX - boardBox.left -PIN_WIDTH_CONST/2, 0, boardBox.width -PIN_WIDTH_CONST);
        const y = clamp(event.clientY - boardBox.top -PIN_HEIGHT_CONST/2, 0, boardBox.height - PIN_HEIGHT_CONST);
        
        setPins((previousPins) =>
            previousPins.map((pin) =>
                pin.id === pinId ? {...pin, placed: true, x, y} : pin
            )
        );
    };

    return (
        <div className="workspace">
            <div 
                className="board" 
                ref={boardRef} 
                onDragOver={handleBoardDragOver}
                onDrop={handleBoardDrop}
            >
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
                {/*pin*/}
                {boardPins.map((pin) => {
                    const mediaItem = 
                        pin.item_type == 'media'
                            ? mediaItems.find((item) => item.id === pin.media_id)
                            : undefined;
                    
                    return(
                        <div
                            key={pin.id}
                            className={dragging?.id === pin.id ? 'pin dragging' : 'pin'}
                            style={{left: pin.x, top:pin.y}}
                            onPointerDown={(event) => handlePointerDown(event, pin.id)}
                            onPointerMove={(event) => handlePointerMove(event, pin.id)}
                            onPointerUp={(event) => handlePointerUp(event, pin.id)}
                            //onPointerCancel={handlePointerCancel}
                        >
                            {renderPinContent(pin)}
                        </div>
                )
})}
                <WorkspaceNavbar />
            </div>
            
            <aside 
                ref={menuRef}
                className={`pin-menu${isPinMenuOpen ? ' pin-menu-open' : ''}${isOverMenu ? ' pin-menu-drop' : ''}`}
            >
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

                        <section className="add-pin">
                            <h2>Add Pin</h2>

                            <div className="add-pin-type">
                                <label>
                                    <input
                                        type="radio"
                                        name="pin-type"
                                        checked={newPinType === 'note'}
                                        onChange={() => setNewPinType('note')}
                                    />
                                    Note
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="pin-type"
                                        checked={newPinType === 'media'}
                                        onChange={() => setNewPinType('media')}
                                    />
                                    Media
                                </label>
                            </div>

                            {newPinType === 'note' ? (
                                <textarea
                                    value={newPinNote}
                                    onChange={(event) => setNewPinNote(event.target.value)}
                                    placeholder="Write Pin Note..."
                                    rows={3}
                                    aria-label="New Pin Note"
                                />
                            ) : (
                                <select
                                    value={newPinMediaId}
                                    onChange={(event) => setNewPinMediaId(event.target.value)}
                                    aria-label="Media for pin"
                                >
                                    <option value="">Choose a file...</option>
                                    {mediaItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.filename}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button type="button" onClick={handleAddPin}>
                                Add Pin
                            </button>
                        </section>

                        <h2>Pin Menu Tray</h2>
                        {menuPins.length === 0 ? (
                            <p>No Pins Found, add some above!</p>
                        ) : (
                            <div className="tray">
                                {menuPins.map((pin) => (
                                    <div 
                                    key={pin.id} 
                                    className="tray-tile"
                                    draggable
                                    onDragStart={(event) => handleTileDragStart(event, pin.id)}
                                    >
                                        {renderPinContent(pin)}
                                    </div>
                                ))}
                            </div>
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
                    </div>
                )}
            </aside>
        </div>
    );
}
    