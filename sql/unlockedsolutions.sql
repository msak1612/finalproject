DROP TABLE IF EXISTS unlockedsolutions;

CREATE TABLE unlockedsolutions(
    viewer INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(viewer, challenge)
  );
