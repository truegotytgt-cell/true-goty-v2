export type Jogo = {
  slug: string;
  titulo: string;
  imagem: string;
};

export type Duelo = {
  jogo1: Jogo;
  jogo2: Jogo;
};

export type Voto = {
  vencedor: string;
  perdedor: string;
};

function embaralharLista<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// 1. Gera todos os duelos possíveis (Todos contra Todos)
export function gerarDuelos(jogos: Jogo[]): Duelo[] {
  const duelos: Duelo[] = [];

  for (let i = 0; i < jogos.length; i++) {
    for (let j = i + 1; j < jogos.length; j++) {
      if (Math.random() > 0.5) {
        duelos.push({ jogo1: jogos[i], jogo2: jogos[j] });
      } else {
        duelos.push({ jogo1: jogos[j], jogo2: jogos[i] });
      }
    }
  }

  return embaralharLista(duelos);
}

// 2. Calcula a pontuação de Condorcet com desempate direto e ordem determinística
export function calcularPlacar(jogos: Jogo[], votos: Voto[]) {
  const pontos = new Map<string, number>();
  const matrizVitorias = new Map<string, Set<string>>();

  jogos.forEach((jogo) => {
    pontos.set(jogo.titulo, 0);
    matrizVitorias.set(jogo.titulo, new Set());
  });

  votos.forEach((voto) => {
    pontos.set(voto.vencedor, (pontos.get(voto.vencedor) || 0) + 1);

    if (!matrizVitorias.has(voto.vencedor)) {
      matrizVitorias.set(voto.vencedor, new Set());
    }
    matrizVitorias.get(voto.vencedor)?.add(voto.perdedor);
  });

  return Array.from(pontos.entries())
    .map(([titulo, pontosTotais]) => ({ titulo, pontos: pontosTotais }))
    .sort((a, b) => {
      // 1º Critério: Maior pontuação
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;

      // 2º Critério: Confronto direto (Head-to-Head)
      const aVenceuB = matrizVitorias.get(a.titulo)?.has(b.titulo);
      const bVenceuA = matrizVitorias.get(b.titulo)?.has(a.titulo);

      if (aVenceuB && !bVenceuA) return -1;
      if (bVenceuA && !aVenceuB) return 1;

      // 3º Critério: Ordem alfabética determinística
      return a.titulo.localeCompare(b.titulo);
    });
}