import { HomeHeader } from "./components/HomeHeader";
import { Outlet } from "react-router-dom";

export function NeedHomeHeader() {
    return (
        <>
            <HomeHeader />
            <main>
                <Outlet />
            </main>
        
        </>

    )    

}