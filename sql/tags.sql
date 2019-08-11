DROP TABLE if EXISTS tags;

CREATE TABLE tags(
    tag TEXT,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    PRIMARY KEY(tag, challenge_id)
  )
