import { MyBoardsMenu } from "./components/MyBoardsMenu"
import { Outlet } from "react-router-dom";

export function NeedNavbar() {
    return (
        <>
            <MyBoardsMenu />
            <main>
                <Outlet />
            </main>
        
        </>

    )    

}