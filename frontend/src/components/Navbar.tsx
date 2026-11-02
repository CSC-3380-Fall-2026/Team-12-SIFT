import { Link } from "react-router-dom"
import "./Navbar.css"

export function Navbar() {
    return (
        <div className="Navbar">
        
        <Link to="/workspace">
            <button>Workspace</button>
        </Link>

        <Link to="/">
            <button>Home</button>
        </Link>

        </div>
    )
}