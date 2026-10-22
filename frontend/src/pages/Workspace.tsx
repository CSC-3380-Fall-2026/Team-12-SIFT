
/*
 * SIFT-10: Media Folder
 *
 * This component displays the SIFT workspace and a basic media folder.
 * The folder lists media filenames and shows the number of media items.
 *
 * Currently, the media items are sample data stored in an array.
 * Future developers can connect this component to the backend
 * to display actual uploaded media.
 */

export function Workspace() {
    // Sample media filenames used to demonstrate the folder.
    // Each element in this array is a string representing a filename.
    const mediaItems: string[] = ['photo.jpg', 'video.mp4', 'document.png']

    return (
        <>
            {/* Main heading for the SIFT workspace. */}
            <h1>This is a workspace!</h1>

            {/* SIFT-10: Display the media folder. */}
            <section>
                <h2>Media Folder</h2>

                {/* Display the number of media items in the array. */}
                <p>Stored media: {mediaItems.length}</p>

                {/* Create a list entry for each media filename.
                    React uses the key to identify each list item. */}
                <ul>
                    {mediaItems.map((media) => (
                        <li key={media}>{media}</li>
                    ))}
                </ul>
            </section>
        </>
    )
}
