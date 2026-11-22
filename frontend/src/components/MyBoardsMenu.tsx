import { Link } from "react-router-dom"
import "./MyBoardsMenu.css"

export function MyBoardsMenu() {
    return (
        <div className="my-boards-menu">

            {/* Will need to be edited later when the features-
            -required are added.
            */}
            <Link to="/workspace">
                <p> Create New Board</p>
            </Link>

            <Link to="/workspace">
                <p> Open Board</p>
            </Link>

            {/* The unworking sections for now.*/}
            <p> Files</p>

            <p> Delete</p>

        </div>
    )
}