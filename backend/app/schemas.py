#possibly to restrict media types
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, model_validator

#a class for media that is either an image or file of text
class Media(BaseModel):
    id: UUID
    media_type: Literal["image", "textfile"]
    location: str

#a class for pins consisting of media or a typed note
class Pin(BaseModel):
    id: UUID
    item_type: Literal["media", "note"]
    x: float
    y: float
    media_id: UUID | None = None
    note_content: str | None = None

#this checks for correct info for different pins
    @model_validator(mode="after")
    def check_item_type(self):
        if self.item_type == "media":
            if self.media_id is None:
                raise ValueError("media id needed")
            if self.note_content is not None:
                raise ValueError("media pins cannot have note content")
        elif self.item_type == "note":
            if not self.note_content or not self.note_content.strip():
                raise ValueError("note content needed")
            if self.media_id is not None:
                raise ValueError("note pins cannot have media ids")
        return self

#a class for a workspace that has a name, id, and consists of pins
class Workspace(BaseModel):
    id:UUID
    name: str
    pins: list[Pin] = Field(default_factory=list)
