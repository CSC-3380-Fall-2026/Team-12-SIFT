from uuid import UUID

import pytest
from pydantic import ValidationError

from app.schemas import Media, Pin, Workspace

#we need to discuss specifics of media file types and some 
#details on the project in general. these are very basic
#tests that i used to mainly learn how they work. more
#will be added/altered here when i get more info

#fixed UUID for testing
MEDIA_ID = UUID("11111111-1111-4111-8111-111111111111")
PIN_ID = UUID("22222222-2222-4222-8222-222222222222")
WORKSPACE_ID = UUID("33333333-3333-4333-8333-333333333333")


#makes sure media takes the correct file type (generic for now)
def test_media_accepts_valid_data():
    media = Media(
        id=MEDIA_ID,
        media_type="image",
        location="uploads/photo.jpg"
    )
    assert media.media_type == "image"


#checks to make sure that a media pin cant be made without a media id attached to it
def test_media_pin_requires_media_id():
    with pytest.raises(ValidationError):
        Pin(
            id=PIN_ID,
            item_type="media",
            x=0,
            y=0,
        )


#makes the test use these note contents in the test
@pytest.mark.parametrize("content", [None, "", " "])
#makes sure that note pins cant be made with empty or blank notes
def test_note_pin_requires_nonempty_content(content):
    with pytest.raises(ValidationError):
        Pin(
            id=PIN_ID,
            item_type="note",
            x=0,
            y=0,
            note_content=content,
        )

#checks what happens when there is an empty workspace with no pins to pick from
#(default behavior)
def test_workspace_without_pins():
    workspace = Workspace(
        id=WORKSPACE_ID,
        name="My workspace",
    )
    assert workspace.pins == []

