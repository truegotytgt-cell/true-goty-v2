export type VotoDB = {
  game_title: string;
  score: number;
  category: string;
};

export type PairwiseVotoDB = {
  winner_title: string;
  loser_title: string;
  category: string;
};

type D1PreparedStatementLike = {
  bind: (...values: unknown[]) => unknown;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
};

type CloudflareEnvLike = {
  true_goty_db?: D1DatabaseLike;
};

export function getDB(env: unknown): D1DatabaseLike {
  const cfEnv = env as CloudflareEnvLike | undefined;
  if (!cfEnv?.true_goty_db) {
    throw new Error('O banco de dados D1 não está configurado no Cloudflare.');
  }
  return cfEnv.true_goty_db;
}

export function prepararVotosStatements(db: D1DatabaseLike, votos: VotoDB[], session_id: string) {
  return votos.map((voto) => {
    return db
      .prepare('INSERT OR IGNORE INTO results (game_title, score, category, session_id) VALUES (?, ?, ?, ?)')
      .bind(voto.game_title, voto.score, voto.category, session_id);
  });
}

export function prepararPairwiseStatements(
  db: D1DatabaseLike,
  pairwise: PairwiseVotoDB[],
  session_id: string
) {
  const timestamp = Date.now();
  const anoAtual = new Date().getFullYear();
  return pairwise.map((p) => {
    return db
      .prepare(
        'INSERT OR IGNORE INTO pairwise_results (session_id, category, winner_title, loser_title, year, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(session_id, p.category, p.winner_title, p.loser_title, anoAtual, timestamp);
  });
}