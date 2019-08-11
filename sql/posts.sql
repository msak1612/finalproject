DROP TABLE if EXISTS posts;

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    post TEXT,
    image VARCHAR(1000),
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    parent_post_id INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
