// lib/condorcet.ts

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

// 1. Gera todos os duelos possíveis (Todos contra Todos)
export function gerarDuelos(jogos: Jogo[]): Duelo[] {
  const duelos: Duelo[] = [];
  // Loop para pegar o Jogo A e comparar com o Jogo B
  for (let i = 0; i < jogos.length; i++) {
    for (let j = i + 1; j < jogos.length; j++) {
      duelos.push({ jogo1: jogos[i], jogo2: jogos[j] });
    }
  }
  
  // Embaralha os duelos para não ser sempre a mesma sequência
  return duelos.sort(() => Math.random() - 0.5);
}

// 2. Calcula a pontuação baseada nos votos (+1 vitória, -1 derrota)
export function calcularPlacar(jogos: Jogo[], votos: Voto[]) {
  const placar: Record<string, number> = {};

  // Zera a pontuação de todo mundo
  jogos.forEach(jogo => {
    placar[jogo.titulo] = 0;
  });

  // Soma e subtrai os pontos
  votos.forEach(voto => {
    placar[voto.vencedor] += 1;
    placar[voto.perdedor] -= 1;
  });

  // Transforma em uma lista ordenada do maior para o menor
  return Object.keys(placar)
    .map(titulo => ({ titulo, pontos: placar[titulo] }))
    .sort((a, b) => b.pontos - a.pontos);
}