// lib/db.ts

// 1. Definimos o formato dos dados que vão para o banco
export type VotoDB = {
  game_title: string;
  score: number;
  category: string;
};

// 2. Essa é a "ponte" que o Cloudflare nos dá para acessar o banco
export function getDB(env: any) {
  if (!env.true_goty_db) {
    throw new Error("O banco de dados D1 não está configurado no Cloudflare.");
  }
  return env.true_goty_db;
}

// 3. Função para salvar vários votos de uma vez (Batching)
// O roadmap do Gemini falou sobre isso: agrupar os votos para não travar o banco.
export async function salvarVotosNoBanco(db: any, votos: VotoDB[]) {
  // Preparamos os comandos SQL
  const statements = votos.map((voto) => {
    return db
      .prepare("INSERT INTO results (game_title, score, category) VALUES (?, ?, ?)")
      .bind(voto.game_title, voto.score, voto.category);
  });

  // Executamos todos de uma vez só
  return await db.batch(statements);
}