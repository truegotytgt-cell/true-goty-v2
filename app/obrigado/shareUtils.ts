// app/obrigado/shareUtils.ts

export type RedeSocial = 'whatsapp' | 'x' | 'reddit' | 'instagram' | 'discord';

export type JogoTop3 = {
  titulo: string;
  pontos?: number;
  imagem: string;
};

export function isDispositivoMobile(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const telaTouch = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return uaMobile && telaTouch;
}

export function getUrlDinamica(): string {
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function getDominioVisual(): string {
  if (typeof window === 'undefined') return 'TRUEGOTY.COM';
  const host = window.location.host.replace(/^www\./, '');
  if (host.includes('localhost') || host.startsWith('127.0.0.1') || host.startsWith('192.168.')) {
    return 'TRUE GOTY • 2026';
  }
  return host.toUpperCase();
}

export function getTextoCompartilhamento(top3: JogoTop3[]): string {
  const url = getUrlDinamica();
  const primeiro = top3[0]?.titulo || 'meu favorito';
  const segundo = top3[1]?.titulo;
  const terceiro = top3[2]?.titulo;

  const linhasPodio = [
    `🥇 ${primeiro}`,
    segundo ? `🥈 ${segundo}` : null,
    terceiro ? `🥉 ${terceiro}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    '45 duelos frente a frente. Só um jogo sobreviveu. ⚔️🏆',
    '',
    'Meu True GOTY 2026:',
    linhasPodio,
    '',
    `Discorda? Prove nos 45 duelos e monte seu veredito oficial: ${url}`,
  ].join('\n');
}

export function getTituloReddit(top3: JogoTop3[]): string {
  const campeao = top3[0]?.titulo || 'Meu campeão';
  return `45 duelos frente a frente e meu True GOTY 2026 foi ${campeao} — qual foi o de vocês?`;
}

export function salvarBlobComoArquivo(blob: Blob, nomeArquivo = 'meu-true-goty-2026-story.png') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}