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

export type D1BoundStatement = {
  all: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<{ meta?: { changes?: number } }>;
};

export type D1PreparedStatementLike = D1BoundStatement & {
  bind: (...values: unknown[]) => D1BoundStatement;
};

export type D1BatchResult = {
  meta?: { changes?: number };
  results?: Record<string, unknown>[];
};

export type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
  batch: (statements: D1BoundStatement[]) => Promise<D1BatchResult[]>;
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

export function prepararVotosStatements(
  db: D1DatabaseLike,
  votos: VotoDB[],
  session_id: string
): D1BoundStatement[] {
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
): D1BoundStatement[] {
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