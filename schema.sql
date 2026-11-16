-- schema.sql

DROP TABLE IF EXISTS battles;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS pairwise_results;

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  session_id TEXT NOT NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_results_category_game ON results(category, game_title);

-- NOVO: Adicionada a coluna 'year' (ano)
CREATE TABLE IF NOT EXISTS pairwise_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL, 
  category TEXT NOT NULL,
  winner_title TEXT NOT NULL,
  loser_title TEXT NOT NULL,
  year INTEGER NOT NULL, -- <-- NOVO AQUI
  created_at INTEGER NOT NULL 
);

CREATE INDEX IF NOT EXISTS idx_pairwise_category_pair 
  ON pairwise_results (category, winner_title, loser_title);

CREATE INDEX IF NOT EXISTS idx_pairwise_session_category 
  ON pairwise_results (session_id, category);

CREATE INDEX IF NOT EXISTS idx_pairwise_category_winner 
  ON pairwise_results (category, winner_title);

-- NOVO: Índice para buscar rápido por ano (Máquina do Tempo)
CREATE INDEX IF NOT EXISTS idx_pairwise_year_category 
  ON pairwise_results (year, category);