-- schema.sql
-- Estrutura do banco de dados do True GOTY.
--
-- Este arquivo é IDEMPOTENTE: pode ser executado várias vezes sem apagar dados.
-- Para RESETAR o banco (apagar tudo e recriar do zero), use o arquivo
-- `schema.reset.sql` — nunca este aqui.

-- =========================================================================
-- Tabela: results
-- Guarda o placar final de cada sessão (10 linhas por sessão, uma por jogo).
-- =========================================================================

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

-- PROTEÇÃO ANTI-DUPLO-VOTO:
-- Impede que a mesma sessão vote no mesmo jogo na mesma categoria.
-- Como a sessão vota em 10 jogos de uma vez, o "voto duplicado" é detectado
-- quando todos os 10 INSERTs são ignorados (meta.changes === 0 no batch).
-- NOTA: em uma fase futura (Fase 4), vamos adicionar a coluna `year` em
-- `results` e incluir ela neste índice, para permitir voto por ano.
CREATE UNIQUE INDEX IF NOT EXISTS idx_results_session_category_game 
  ON results(session_id, category, game_title);

-- =========================================================================
-- Tabela: pairwise_results
-- Guarda os 45 confrontos individuais de cada sessão (o coração do Condorcet).
-- =========================================================================

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

CREATE INDEX IF NOT EXISTS idx_pairwise_session_category 
  ON pairwise_results (session_id, category);

CREATE INDEX IF NOT EXISTS idx_pairwise_category_winner 
  ON pairwise_results (category, winner_title);

CREATE INDEX IF NOT EXISTS idx_pairwise_year_category 
  ON pairwise_results (year, category);

-- PROTEÇÃO ANTI-DUPLO-VOTO (lado dos confrontos):
-- Impede que o mesmo confronto seja salvo duas vezes pela mesma sessão.
-- Protege contra retry após falha parcial e contra condição de corrida.
-- NOTA: em uma fase futura (Fase 4), vamos incluir `year` neste índice também.
CREATE UNIQUE INDEX IF NOT EXISTS idx_pairwise_session_pair 
  ON pairwise_results (session_id, category, winner_title, loser_title);