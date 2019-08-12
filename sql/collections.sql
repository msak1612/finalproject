DROP TABLE IF EXISTS collectionitems;
DROP TABLE IF EXISTS collections CASCADE;

CREATE TABLE collections(
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    creator INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE collectionitems(
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE
);
