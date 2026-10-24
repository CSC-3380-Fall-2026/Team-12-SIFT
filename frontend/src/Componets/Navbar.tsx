import { Link } from "react-router-dom"


export function Navbar() {
    return (
        <>
        
        <Link to="/workspace">
            <button>Workspace</button>
        </Link>

        <Link to="/">
            <button>Home</button>
        </Link>

        </>
    )
}