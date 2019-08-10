DROP TABLE IF EXISTS challenges;

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    participant_id INT NOT NULL,
    question VARCHAR(2000),
    score INT NOT NULL DEFAULT 0,
    level VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
