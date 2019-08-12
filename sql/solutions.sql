DROP TABLE IF EXISTS solutions;

CREATE TABLE solutions(
    solver INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    solution TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(solver, challenge)
  );
