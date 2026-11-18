import { useState, useEffect, useRef} from 'react';
import type { DragEvent as ReactDragEvent, PointerEvent as ReactPointerEvent} from 'react';
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
    const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
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
    const [isAddPinOpen, setIsAddPinOpen] = useState(false);

    const[selectedPinId, setSelectedPinId] = useState<string | null>(null);
    const[pinActionMode, setPinActionMode] = useState<'edit' | 'delete' | null>(null);

    const [isEditingPin, setIsEditingPin] = useState(false);


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

    //shows the tiny previews of the pin within the tray
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

    //open and close pin menu
    const openAddPin = () => {
        setIsEditingPin(false);
        setSelectedPinId(null);

        setNewPinType('note');
        setNewPinNote('');
        setNewPinMediaId('');

        setIsAddPinOpen(true);
    };

    const closePinMenu = () => {
        setIsAddPinOpen(false);
        setIsEditingPin(false);

        setNewPinNote('');
        setNewPinMediaId('');
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
        
        closePinMenu();
    };

    //loads the pin you want to edit into the window
    const handleEditPin = () => {
        const pin = pins.find(
            (item) => item.id === selectedPinId
        );

        if(!pin) return;

        setNewPinType(pin.item_type);
        setNewPinNote(pin.note_content ?? '');
        setNewPinMediaId(pin.media_id ?? '');

        setIsEditingPin(true);
        setIsAddPinOpen(true);
    };

    const handleSavePin = () => {
        if (!selectedPinId || !canAddPin) return;

        setPins((previousPins) =>
            previousPins.map((pin) =>
                pin.id === selectedPinId
                ? {...pin,
                    item_type: newPinType,
                    note_content: newPinType === 'note' ? newPinNote : null,
                    media_id: newPinType === 'media' ? newPinMediaId : null,
                }
                :pin
            )
        );
        closePinMenu();
        setSelectedPinId(null);
    };

    //deletes a pin
    const handleDeletePin = () => {
        if(!selectedPinId) return;}
//fix

    //determines whether to edit or delete after clicking and the logic that follows each
    const handlePinClick = (pinId: string) => {
        const pin = pins.find((item) => item.id === pinId)

        //nothing equals null
        if(!pin) return;

        //edit
        if(pinActionMode === 'edit'){
            setSelectedPinId(pinId);

            setNewPinType(pin.item_type);
            setNewPinNote(pin.note_content ?? '');
            setNewPinMediaId(pin.media_id ?? '');

            setIsEditingPin(true);
            setIsAddPinOpen(true);

            setPinActionMode(null);
            return;
        }

        //delete
        if(pinActionMode === 'delete'){
            const confirmed = window.confirm('Are you sure?');

            if(confirmed){
                setPins((previousPins) =>
                    previousPins.filter(
                        (item) => item.id !== pinId
                    )
                );
            }

            setSelectedPinId(null);
            setPinActionMode(null);
            return;
        }

        //default
        setSelectedPinId(pinId);
    };

    //checks if the cursor is over the menu for pin movement
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

    //cancel logic
    const handlePointerCancel = () => {
        setDragging(null);
        setIsOverMenu(false);
    };

    //pin tile is dragged pt1
    //pin tile refers to pins within the tray
    const handleTileDragStart=(event: ReactDragEvent<HTMLDivElement>, pinId: string) => {
        event.dataTransfer.setData('text/plain', pinId);
        event.dataTransfer.effectAllowed = 'move';
    };

    //handles when pin is dragged to board so it knows how to place accordingly
    const handleBoardDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    //places pin where dropped (when let go of mouse)
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
                {/*pin logic for on the board*/}
                {boardPins.map((pin) => {
                    const mediaItem = 
                        pin.item_type == 'media'
                            ? mediaItems.find((item) => item.id === pin.media_id)
                            : undefined;
                    
                    return(
                        <div
                            key={pin.id}
                            className={`pin ${dragging?.id === pin.id ? 'pin dragging' : ''}
                                ${selectedPinId === pin.id ? 'selected' : ''}
                            }`}
                            style={{left: pin.x, top:pin.y}}
                            onClick={() => handlePinClick(pin.id)}
                            onPointerDown={(event) => handlePointerDown(event, pin.id)}
                            onPointerMove={(event) => handlePointerMove(event, pin.id)}
                            onPointerUp={(event) => handlePointerUp(event, pin.id)}
                            //onPointerCancel={handlePointerCancel}
                        >
                            {renderPinContent(pin)}
                        </div>
                )
            })}
                {/*navbar obv*/}
                <WorkspaceNavbar />
            </div>
            
            {/*sliding menu*/}
            <aside 
                ref={menuRef}
                className={`side-menu${isSideMenuOpen ? ' side-menu-open' : ''}${isOverMenu ? ' side-menu-drop' : ''}`}
            >
                {/*sliding menu toggle*/}
                <button
                    type="button"
                    className="side-menu-toggle"
                    onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                    aria-label={isSideMenuOpen ? 'Close menu' : 'Open Menu'}
                    aria-expanded={isSideMenuOpen}
                >
                    {isSideMenuOpen? '->' : '<-'}
                </button>

                {/*content in the sliding menu*/}
                {isSideMenuOpen &&(
                    <div className="side-menu-content">
                        <section className="profile-container">
                    {/*profile and settings*/}
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

                        {/*pin management, add edit delete*/}
                        <section className="pin-management">
                            <h2>Manage Pin</h2>

                            {/*add*/}
                            <button
                                type="button"
                                className="add-pin-button"
                                onClick={openAddPin}
                            >
                                + Add Pin
                            </button>

                            {/*edit with logic to press button then choose pin to edit*/}
                            <button
                                type="button"
                                className={`add-pin-button ${ 
                                    pinActionMode === 'edit' ? 'active' : ''
                                }`}
                                onClick={() =>
                                    setPinActionMode(
                                        pinActionMode === 'edit' ? null : 'edit'
                                    )
                                }
                            >
                                Edit Pin
                            </button>

                            {/*delete with logic same as edit*/}
                            <button
                                type="button"
                                className={`add-pin-button ${ 
                                    pinActionMode === 'delete' ? 'active' : ''
                                }`}
                                onClick={() =>
                                    setPinActionMode(
                                        pinActionMode === 'delete' ? null : 'delete'
                                    )
                                }
                            >
                                Delete Pin
                            </button>

                            {/*I THINK THIS IS WHERE TO HILIGHT*/}
                            {selectedPinId && (
                                <p className="pin-selection-info">
                                    Pin Selected
                                </p>
                            )}
                        </section>

                        {/*tray for unused pins*/}
                        <h2>Available Pins</h2>
                        {menuPins.length === 0 ? (
                            <p>No Pins Found, add some above!</p>
                        ) : (
                            <div className="tray">
                                {menuPins.map((pin) => (
                                    <div 
                                    key={pin.id} 
                                    className={`tray-tile ${
                                        selectedPinId === pin.id ? 'selected' : ''
                                    }`}
                                    draggable
                                    onClick={() => handlePinClick(pin.id)}
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
            {/*add pin window*/}
            {isAddPinOpen && (
                <div className="pin-menu-overlay">
                    <div className="pin-menu">
                        <h2>
                            {isEditingPin ? 'Edit Pin' : 'Add Pin'}
                        </h2>

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
                                onChange={(event) =>
                                    setNewPinNote(event.target.value)
                                }
                                placeholder="write pin note"
                                rows={4}
                                aria-label="Pin Note"
                            />
                        ):(
                            <select
                                value={newPinMediaId}
                                onChange={(event) =>
                                    setNewPinMediaId(event.target.value)
                                }
                                aria-label="Media Pin"
                            >
                                <option value="">
                                    Choose a file
                                </option>

                                {mediaItems.map((item) =>
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.filename}
                                    </option>
                                )}
                            </select>
                        )}

                        {/*look into pin sizing*/}

                        {/*save and cancel buttons within add/edit windows*/}
                        <div className="pin-menu-buttons">
                            <button
                                type="button"
                                onClick={
                                    isEditingPin ? handleSavePin : handleAddPin
                                }
                                disabled={!canAddPin}
                            >
                                {isEditingPin ? 'Save Cahnges' : 'Add Pin'}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={closePinMenu}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
    );
}