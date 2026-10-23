
-- SIFT-17: Annotations Backend Database Schema
--
-- This file creates the PostgreSQL table used to store
-- annotations associated with media items in SIFT.
--
-- Each annotation contains a unique ID, user ID, media ID,
-- written text, and x/y position coordinates.
--
-- Setup:
-- Run this SQL against the SIFT PostgreSQL database before
-- using the annotation API endpoints.
--
-- IF NOT EXISTS prevents an error if the table already exists.
-- It does not modify an existing table's structure.

CREATE TABLE IF NOT EXISTS annotations (

    -- Unique identifier assigned to each annotation.
    -- SERIAL automatically generates an integer value.
    -- PRIMARY KEY ensures each record has a unique ID.
    id SERIAL PRIMARY KEY,

    -- Identifies the user associated with the annotation.
    -- NOT NULL requires this field to contain a value.
    user_id TEXT NOT NULL,

    -- Identifies the media item that the annotation belongs to.
    -- The backend uses this field to retrieve annotations
    -- associated with a particular media item.
    media_id TEXT NOT NULL,

    -- Stores the annotation's written content.
    -- NOT NULL prevents NULL values but does not prevent
    -- empty strings. Pydantic handles additional validation.
    text TEXT NOT NULL,

    -- Stores the annotation's horizontal position.
    -- DOUBLE PRECISION allows floating-point coordinates.
    x DOUBLE PRECISION NOT NULL,

    -- Stores the annotation's vertical position.
    -- DOUBLE PRECISION allows floating-point coordinates.
    y DOUBLE PRECISION NOT NULL

);
