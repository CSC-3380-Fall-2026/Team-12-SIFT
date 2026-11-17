import { Link } from "react-router-dom"
import "./HomeHeader.css"
import { LogIn} from 'lucide-react'


export function HomeHeader() {
    return (
        <div className="HomeHeader">


            <Link to="/register">Register</Link>

            <Link to="/login">Log In <LogIn size={20} /></Link>


        </div>
    ) 
}