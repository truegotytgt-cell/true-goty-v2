CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_results_category_game
  ON results(category, game_title);

CREATE UNIQUE INDEX IF NOT EXISTS idx_results_session_category_game
  ON results(session_id, category, game_title);

CREATE TABLE IF NOT EXISTS pairwise_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  category TEXT NOT NULL,
  winner_title TEXT NOT NULL,
  loser_title TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pairwise_category_pair
  ON pairwise_results (category, winner_title, loser_title);

CREATE INDEX IF NOT EXISTS idx_pairwise_year_category
  ON pairwise_results (year, category);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pairwise_session_pair
  ON pairwise_results (session_id, category, winner_title, loser_title);