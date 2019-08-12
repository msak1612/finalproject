DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    post TEXT,
    image VARCHAR(1000),
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    parent_post_id INTEGER DEFAULT 0,
    has_spoilers BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
