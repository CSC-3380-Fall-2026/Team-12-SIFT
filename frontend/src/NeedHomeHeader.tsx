import { HomeHeader } from "./components/HomeHeader";
import { Outlet } from "react-router-dom";

export function NeedHomeHeader() {
    return (
        <div style={{ display: "flex:", flexDirection: "column", minHeight: "100vh" }}>
            <HomeHeader />
            <main>
                <Outlet />
            </main>
        
        </div>

    )    

}