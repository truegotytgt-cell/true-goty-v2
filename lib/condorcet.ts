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
  
  for (let i = 0; i < jogos.length; i++) {
    for (let j = i + 1; j < jogos.length; j++) {
      // Jogamos uma moeda para decidir quem fica na esquerda ou direita
      if (Math.random() > 0.5) {
        duelos.push({ jogo1: jogos[i], jogo2: jogos[j] });
      } else {
        duelos.push({ jogo1: jogos[j], jogo2: jogos[i] });
      }
    }
  }
  
  return duelos.sort(() => Math.random() - 0.5);
}

// 2. Calcula a pontuação real de Condorcet com desempate direto
export function calcularPlacar(jogos: Jogo[], votos: Voto[]) {
  const pontos = new Map<string, number>(); // Pontuação de 0 a 9
  const matrizVitorias = new Map<string, Set<string>>(); // Quem venceu quem

  // Zera a pontuação e a matriz para todos os jogos
  jogos.forEach(jogo => {
    pontos.set(jogo.titulo, 0);
    matrizVitorias.set(jogo.titulo, new Set());
  });

  // Preenche os dados com base nos votos
  votos.forEach(voto => {
    // Soma 1 ponto para o vencedor
    pontos.set(voto.vencedor, (pontos.get(voto.vencedor) || 0) + 1);
    
    // Registra na matriz que o vencedor bateu o perdedor
    if (!matrizVitorias.has(voto.vencedor)) matrizVitorias.set(voto.vencedor, new Set());
    matrizVitorias.get(voto.vencedor)?.add(voto.perdedor);
  });

  // Transforma em lista e ordena
  return Array.from(pontos.entries())
    .map(([titulo, pontosTotais]) => ({ titulo, pontos: pontosTotais }))
    .sort((a, b) => {
      // 1º Critério: Quem tem mais pontos (venceu mais jogos)
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      
      // 2º Critério (Desempate): Confronto direto
      const aVenceuB = matrizVitorias.get(a.titulo)?.has(b.titulo);
      const bVenceuA = matrizVitorias.get(b.titulo)?.has(a.titulo);

      if (aVenceuB) return -1; // A fica na frente
      if (bVenceuA) return 1;  // B fica na frente
      
      return 0; // Empate técnico absoluto
    });
}