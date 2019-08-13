DROP TABLE IF EXISTS challenges CASCADE;

CREATE TABLE challenges (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    preview TEXT NOT NULL,
    description TEXT NOT NULL,
    template TEXT NOT NULL,
    test TEXT NOT NULL,
    solution TEXT NOT NULL,
    tags TEXT[],
    level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
