import { HomeFooter } from "./components/HomeFooter";
import { Outlet } from "react-router-dom";

export function NeedHomeFooter() {
    return (
        < div style={{ display: "flex:", flexDirection: "column", minHeight: "100vh" }}>
            
            <main>
                <Outlet />
            </main>
            <HomeFooter />
        </div>

    )    

}