// lib/db.ts

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

export function getDB(env: any) {
  if (!env.true_goty_db) {
    throw new Error("O banco de dados D1 não está configurado no Cloudflare.");
  }
  return env.true_goty_db;
}

// Em vez de salvar direto, agora preparamos as instruções para o lote (batch)
export function prepararVotosStatements(db: any, votos: VotoDB[], session_id: string) {
  return votos.map((voto) => {
    return db
      // OR IGNORE evita erro 500 se a constraint UNIQUE for acionada
      .prepare("INSERT OR IGNORE INTO results (game_title, score, category, session_id) VALUES (?, ?, ?, ?)")
      .bind(voto.game_title, voto.score, voto.category, session_id);
  });
}

export function prepararPairwiseStatements(db: any, pairwise: PairwiseVotoDB[], session_id: string) {
  const timestamp = Date.now();
  const anoAtual = new Date().getFullYear();
  
  return pairwise.map((p) => {
    return db
      .prepare("INSERT OR IGNORE INTO pairwise_results (session_id, category, winner_title, loser_title, year, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(session_id, p.category, p.winner_title, p.loser_title, anoAtual, timestamp);
  });
}