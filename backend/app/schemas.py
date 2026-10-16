#this is the fastapi/python model side, once postgresql is set up completely a sql file will handle 
#actual database table creation and saving. more research needed on that end, but from my current research 
#and understadning this should be an ok starting point to begin the database stuff in sql next week

#restrict different types to be used in dif cases
from typing import Literal
#unique id gen (MORE RESEARCH NEEDED)
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, model_validator

#a class for media with an id that is either an image or file of text to be added in a pin
class Media(BaseModel):
    id: UUID
    media_type: Literal["image", "textfile"]
    location: str

#a class for pins consisting of media or a typed note to be added into a workspace 
#with a location (x,y) on the board and id
#text files are uploadable media, notes will be made and edited in site, therefore they r different
class Pin(BaseModel):
    id: UUID
    item_type: Literal["media", "note"]
    x: float
    y: float
    media_id: UUID | None = None
    note_content: str | None = None

#this checks for correct info for different pin types, 
#media cannot have note content and notes cant have media ids ()
#this type of validation is a little lost on me so this may be wrong, might need updates 
#and more implementations for other checks elsewhere but i want to start with this
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

#a class for a workspace that has a name, id, and consists of pins in a list
class Workspace(BaseModel):
    id:UUID
    name: str
    pins: list[Pin] = Field(default_factory=list)
