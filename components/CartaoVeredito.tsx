// components/CartaoVeredito.tsx
'use client';

import { motion } from 'framer-motion';

type JogoRanking = {
  titulo: string;
  pontos: number;
  imagem: string;
};

type Props = {
  ranking: JogoRanking[];
  enviando: boolean;
  onEnviar: () => void;
  onVoltar: () => void;
};

export default function CartaoVeredito({ ranking, enviando, onEnviar, onVoltar }: Props) {
  const campeao = ranking[0];
  const segundo = ranking[1];
  const terceiro = ranking[2];
  const resto = ranking.slice(3);

  // Componente interno para os cards do Pódio (1º, 2º e 3º)
  const CardPodio = ({ jogo, posicao, corBorda, isCampeao = false }: { jogo: JogoRanking, posicao: string, corBorda: string, isCampeao?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Etiqueta Fora da Imagem com mesmo estilo para 2º e 3º */}
      <div style={{ color: isCampeao ? corBorda : '#E2E8F0', fontSize: isCampeao ? '0.9rem' : '0.8rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.6rem', fontFamily: 'var(--font-teko)', textShadow: isCampeao ? `0 0 10px ${corBorda}80` : 'none' }}>
        {isCampeao ? '★ CAMPEÃO ★' : posicao}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '3 / 4',
          // Cantos retos de precisão (90 graus) conforme briefing
          borderRadius: '0px', 
          backgroundColor: '#111',
          // Borda sutil e brilho externo (Halo)
          border: `1px solid ${corBorda}80`,
          boxShadow: isCampeao 
            ? '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 0 2px #FFD700' 
            : `0 0 20px ${corBorda}30`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <img src={jogo.imagem} alt={jogo.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        
        {/* Degradê escuro muito forte na base para garantir a leitura */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5, 5, 8, 1) 0%, rgba(5, 5, 8, 0.95) 30%, transparent 75%)' }} />

        <div style={{ position: 'relative', zIndex: 2, padding: isCampeao ? '1rem' : '0.8rem 0.5rem', textAlign: 'center' }}>
          <h2 style={{ color: '#FFF', fontSize: isCampeao ? '1.3rem' : '0.95rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-teko)', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,1)' }}>
            {jogo.titulo}
          </h2>
          <div style={{ color: isCampeao ? corBorda : '#A1A1AA', fontSize: isCampeao ? '0.85rem' : '0.75rem', fontWeight: 800, marginTop: '0.3rem', letterSpacing: '1px' }}>
            {jogo.pontos} PONTOS
          </div>
          
          {isCampeao && (
            <div style={{ color: '#FFF', fontSize: '0.55rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>
              VEREDITO OFICIAL • 2026
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '100px 1rem 2rem', backgroundColor: 'transparent' }}>
      
      {/* HEADER ALINHADO E COM MAIS RESPIRO */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        
        {/* Botão REVER alinhado à borda esquerda da pirâmide */}
        <button onClick={onVoltar} style={{ position: 'absolute', left: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#D1D5DB', padding: '0.5rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-teko)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
          ← REVER ÚLTIMO DUELO
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-neon)', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '0.2rem', fontFamily: 'var(--font-teko)' }}>
            APURAÇÃO CONCLUÍDA • 45 DUELOS
          </div>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: 0, fontFamily: 'var(--font-teko)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SEU PÓDIO <span className="title-shine">TRUE GOTY</span>
          </h1>
        </div>
      </div>

      {/* ARQUITETURA EM PIRÂMIDE (Compacta para caber no Desktop) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '700px' }}>
        
        {/* 1º LUGAR (Reduzido para caber na dobra) */}
        <div style={{ width: '40%', marginBottom: '1rem' }}>
          <CardPodio jogo={campeao} posicao="1º LUGAR" corBorda="#FFD700" isCampeao={true} />
        </div>

        {/* 2º E 3º LUGARES (Tamanhos idênticos e sem laranja) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '85%', marginBottom: '1.2rem' }}>
          <CardPodio jogo={segundo} posicao="2º LUGAR" corBorda="#C0C0C0" />
          <CardPodio jogo={terceiro} posicao="3º LUGAR" corBorda="#D1D5DB" /> {/* Cinza metálico em vez de laranja */}
        </div>

        {/* NOTA DE EMPATE */}
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '0.8rem' }}>
          <p style={{ color: '#a1a1aa', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>
            * Em caso de empate na pontuação, prevalece quem venceu o confronto direto.
          </p>
        </div>

        {/* PELOTÃO (4º AO 10º) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
          {resto.map((jogo, index) => {
            const posicao = index + 4;
            return (
              <motion.div 
                key={jogo.titulo}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 * index }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'rgba(28, 28, 30, 0.8)',
                  border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0 1rem', height: '38px'
                }}
              >
                <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 900, fontFamily: 'var(--font-teko)', width: '25px' }}>
                  {posicao}º
                </div>
                <img src={jogo.imagem} alt={jogo.titulo} style={{ width: '20px', height: '28px', objectFit: 'cover', borderRadius: '2px' }} />
                <div style={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {jogo.titulo}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {jogo.pontos} {jogo.pontos === 1 ? 'PONTO' : 'PONTOS'}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AÇÃO FINAL COM DEGRADÊ ROXO -> DOURADO */}
        <div style={{ width: '100%', marginTop: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          
          <div className="cf-turnstile" style={{ backgroundColor: 'transparent' }}></div>
          
          <button 
            onClick={onEnviar} 
            disabled={enviando} 
            style={{ 
              width: '100%', padding: '1rem', fontSize: '1.2rem',
              // DEGRADÊ ROXO PARA DOURADO
              background: enviando ? '#555' : 'linear-gradient(90deg, #4C1D95 0%, #9333EA 50%, #B45309 100%)',
              color: '#F4F4F0', fontWeight: 900, border: 'none', borderRadius: '0px', // Canto Reto
              cursor: enviando ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-teko)', letterSpacing: '1px',
              // Sombra interna para simular luz vindo de dentro
              boxShadow: enviando ? 'none' : 'inset 0 0 10px rgba(255,255,255,0.2), 0 5px 15px rgba(0,0,0,0.5)',
              transition: 'all 0.2s',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
            onMouseOver={(e) => { if(!enviando) { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.filter = 'brightness(1.1)'; } }}
            onMouseOut={(e) => { if(!enviando) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; } }}
          >
            {enviando ? 'ENVIANDO...' : 'SELAR MEU GAME OF THE YEAR'}
          </button>
        </div>

      </div>
    </main>
  );
}