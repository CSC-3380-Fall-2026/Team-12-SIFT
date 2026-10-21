export function Workspace() {
  //const mediaItems: string[] = ['photo.jpg', 'video.mp4', 'document.png']
  

    const handleMedia = () => {
        // Handle media logic here
        console.log('Media button clicked');
    };

    return (
        <>
        <h1>This is a workspace!</h1>

        <section>

        <button type="button"
            className="media-button"
            onClick={handleMedia}
        >
            Open media folder
        </button>


{/*                <h2>Media Folder</h2>
                <p>Stored media: {mediaItems.length}</p>
                <ul>
    {mediaItems.map((media) => (
        <li key={media}>{media}</li>
    ))}
</ul>*/}
        </section>
        </>
    )
}