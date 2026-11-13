-- schema.sql
DROP TABLE IF EXISTS battles;
DROP TABLE IF EXISTS results;

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICE DE PERFORMANCE (Sugestão do PM para não estourar o D1)
CREATE INDEX IF NOT EXISTS idx_results_category_game ON results(category, game_title);