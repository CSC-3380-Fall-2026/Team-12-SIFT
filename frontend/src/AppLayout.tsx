

import{ Outlet, useLocation } from "react-router-dom";
import { SiteNavbar } from "./components/Navbar new/NewNav";
import { HomeFooter } from "./components/HomeFooter";
import {MyBoardsMenu} from "./components/MyBoardsMenu";

//this contains the logic for site navbar
export function AppLayout(){
    //allows for location useto see what page
    const location = useLocation();

    //the different pages a person can be
    const isMyBoardsHome = location.pathname === "/";
    const isMainHome = location.pathname === "/mainhome";
    const isWorkspace = location.pathname === "/workspace";

    return(
        <>
            <SiteNavbar
                showAuth={isMainHome} //login/register links
                showMyBoards={isWorkspace} //the my boards button
                showWelcome={isMyBoardsHome} //the welcome user message
                showProfile={isMyBoardsHome || isWorkspace} //the profile bit
            />

            <div className="app-body">
                {isMyBoardsHome && <MyBoardsMenu />}

                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            {isMainHome && <HomeFooter />}
        </>
    );
}
