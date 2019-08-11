DROP TABLE IF EXISTS challenges;

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT NOT NULL,
    template TEXT NOT NULL,
    test TEXT NOT NULL,
    solution TEXT NOT NULL,
    level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
