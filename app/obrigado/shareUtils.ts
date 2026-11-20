// app/obrigado/shareUtils.ts

export type IdiomaCompartilhamento = 'pt' | 'en' | 'es';

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

export function getTextoCompartilhamento(
  top3: JogoTop3[],
  categoria = 'tgt',
  lang: IdiomaCompartilhamento = 'pt'
): string {
  const url = getUrlDinamica();
  const isTgt = categoria !== 'mercado';
  const primeiro =
    top3[0]?.titulo ||
    (lang === 'en' ? 'my favorite' : lang === 'es' ? 'mi favorito' : 'meu favorito');
  const segundo = top3[1]?.titulo;
  const terceiro = top3[2]?.titulo;

  const linhasPodio = [
    `🥇 ${primeiro}`,
    segundo ? `🥈 ${segundo}` : null,
    terceiro ? `🥉 ${terceiro}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (lang === 'en') {
    if (!isTgt) {
      return [
        'I put the TGA nominees head-to-head in 15 direct duels. Only one survived. ⚔️🏆',
        '',
        'My Podium in Market Nominees (TGA 2026):',
        linhasPodio,
        '',
        `Disagree? Take the 15-duel community test on True GOTY: ${url}`,
      ].join('\n');
    }

    return [
      '45 head-to-head duels. Only one game survived. ⚔️🏆',
      '',
      'My True GOTY 2026:',
      linhasPodio,
      '',
      `Disagree? Prove it in the 45 duels and build your official verdict: ${url}`,
    ].join('\n');
  }

  if (lang === 'es') {
    if (!isTgt) {
      return [
        'Enfrenté a los nominados de TGA en 15 duelos directos. Solo uno sobrevivió. ⚔️🏆',
        '',
        'Mi Podio en Nominados del Mercado (TGA 2026):',
        linhasPodio,
        '',
        `¿No estás de acuerdo? Haz la prueba de 15 duelos de la comunidad en True GOTY: ${url}`,
      ].join('\n');
    }

    return [
      '45 duelos cara a cara. Solo un juego sobrevivió. ⚔️🏆',
      '',
      'Mi True GOTY 2026:',
      linhasPodio,
      '',
      `¿No estás de acuerdo? Demuéstralo en los 45 duelos y arma tu veredicto oficial: ${url}`,
    ].join('\n');
  }

  if (!isTgt) {
    return [
      'Coloquei os indicados do TGA frente a frente em 15 duelos diretos. Só um sobreviveu. ⚔️🏆',
      '',
      'Meu Pódio nos Indicados do Mercado (TGA 2026):',
      linhasPodio,
      '',
      `Discorda? Faça o teste nos 15 duelos da comunidade no True GOTY: ${url}`,
    ].join('\n');
  }

  return [
    '45 duelos frente a frente. Só um jogo sobreviveu. ⚔️🏆',
    '',
    'Meu True GOTY 2026:',
    linhasPodio,
    '',
    `Discorda? Prove nos 45 duelos e monte seu veredito oficial: ${url}`,
  ].join('\n');
}

export function getTituloReddit(
  top3: JogoTop3[],
  categoria = 'tgt',
  lang: IdiomaCompartilhamento = 'pt'
): string {
  const campeao =
    top3[0]?.titulo ||
    (lang === 'en' ? 'My champion' : lang === 'es' ? 'Mi campeón' : 'Meu campeão');

  if (lang === 'en') {
    if (categoria === 'mercado') {
      return `15 head-to-head duels with TGA 2026 nominees and my champion was ${campeao} — who was yours?`;
    }
    return `45 head-to-head duels and my True GOTY 2026 was ${campeao} — who was yours?`;
  }

  if (lang === 'es') {
    if (categoria === 'mercado') {
      return `15 duelos directos con nominados de TGA 2026 y mi campeón fue ${campeao} — ¿cuál fue el suyo?`;
    }
    return `45 duelos cara a cara y mi True GOTY 2026 fue ${campeao} — ¿cuál fue el suyo?`;
  }

  if (categoria === 'mercado') {
    return `15 duelos frente a frente nos indicados do TGA 2026 e meu campeão foi ${campeao} — qual foi o de vocês?`;
  }
  return `45 duelos frente a frente e meu True GOTY 2026 foi ${campeao} — qual foi o de vocês?`;
}

export function getNomeArquivoStory(categoria = 'tgt'): string {
  return categoria === 'mercado'
    ? 'meu-veredito-tga-2026-story.png'
    : 'meu-true-goty-2026-story.png';
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