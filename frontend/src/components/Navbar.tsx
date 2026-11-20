import { Link } from "react-router-dom"
import "./Navbar.css"

export function Navbar() {
    return (
        <div className="Navbar">

        {/* Will need to be edited later when the features-
        -required are added.
        */}
        <Link to="/workspace">
            <p> Create New Board</p>
        </Link>

        <Link to="/workspace">
            <p> Open Board</p>
        </Link>
        
         <Link to="/">
            <p>Home</p>
        </Link>

        {/* The unworking sections for now.
        */}

        <p> Files</p>

        <p> Delete</p>


       

        </div>
    )
}