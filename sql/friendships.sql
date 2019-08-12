DROP TABLE IF EXISTS friendships CASCADE;

CREATE TABLE friendships(
    id SERIAL PRIMARY key,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    accepted BOOLEAN DEFAULT false
);
