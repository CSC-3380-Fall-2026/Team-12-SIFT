import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom";

export function NeedNavbar() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        
        </>

    )    

}