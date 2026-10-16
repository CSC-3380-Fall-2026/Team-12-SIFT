export function Workspace() {
  const mediaItems: string[] = ['photo.jpg', 'video.mp4', 'document.png']

    return (
        <>
            <h1>This is a workspace!</h1>

            <section>
                <h2>Media Folder</h2>
                <p>Stored media: {mediaItems.length}</p>
                <ul>
    {mediaItems.map((media) => (
        <li key={media}>{media}</li>
    ))}
</ul>
            </section>
        </>
    )
}