import './MainHome.css'
import { Link } from 'react-router-dom';
import ropeSign from '../assets/hanging_corkboard.webp';
import greenCheck from '../assets/green_check.webp';
import notepad from '../assets/notepad.png';
import corkboard from '../assets/paper_cork.png';
import stickyNote from '../assets/sticky_note.avif';



export const MainHome = () => {

    return (

        <div className="mainhome-container">


        {/* This is the sift board at the top. */}
        <div className="first-part">
            <div className="first-sign-wrapper">

                <img src={ropeSign} alt="Rope Sign" className="rope-sign" />

                <div className="main-text">
                    <h1 className="main-text-appear">SIFT</h1>
                </div>
            </div>

        </div>

        {/* Literally everything else. */} 
        <div className="second-part">
            <div className="notepad-part">
                <div className="written1">
                    <img src={corkboard} alt="Corkboard" className="corkboard" />
                    <div className="board">
                        <h3>What is SIFT?</h3>
                        <p className="small-text"> SIFT is a web-based note-taking application that brings text and images together in a single organized workspace.</p>
                    </div>
                </div>
                <img src={notepad} alt="Notepad" className="notepad" />
                

            </div>

            <div className="sticky-note-part">
                <div className="written1">
                    <img src={corkboard} alt="Corkboard" className="corkboard" />
                    <div className="board">
                        <h3>What does SIFT do?</h3>
                        <p className="small-text2"> Users can create and edit notes, upload and annotate images, extract text data, and connect related content to make their information easier to search, organize, and navigate.</p>
                    </div>
                </div>
                    <img src={stickyNote} alt="Sticky Note" className="sticky-note" />
                </div>

                <div className="green-check-part">

                    <div className="written1">
                        <img src={corkboard} alt="Corkboard" className="corkboard" />
                        <div className="board">
                            <h3>The goal of SIFT</h3>
                            <p className="small-text2">Our ultimate goal is to make note-taking a more visual, connected, and efficient experience rather as opposed to a painful and mundane activity.</p>
                        </div>
                    </div>
                    <img src={greenCheck} alt="Green Check" className="green-check" />
                </div>

        </div>


        </div>
    )
}