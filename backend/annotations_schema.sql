--RENAME FOR ALL TABLES NOT JUST ANNOTATIONS

CREATE TABLE IF NOT EXISTS annotations (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    media_id TEXT NOT NULL,
    text TEXT NOT NULL,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL
);

--media table
--validations/testing needed for image vs texts
CREATE TABLE IF NOT EXISTS media(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), --discuss if uuid or serial key
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'document')),
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    file_data BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--users table
CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)