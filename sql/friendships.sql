DROP TABLE if EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY key,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    accepted BOOLEAN DEFAULT false
);
