DROP TABLE IF EXISTS challenges;

CREATE TABLE challenges (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT NOT NULL,
    template TEXT NOT NULL,
    test TEXT NOT NULL,
    level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
