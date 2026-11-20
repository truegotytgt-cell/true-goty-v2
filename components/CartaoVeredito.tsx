'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

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
  const { t } = useLanguage();
  const campeao = ranking[0];
  const segundo = ranking[1];
  const terceiro = ranking[2];
  const resto = ranking.slice(3);
  const totalDuelosConcluidos = ranking.length > 1 ? (ranking.length * (ranking.length - 1)) / 2 : 0;

  const CardPodio = ({
    jogo,
    posicao,
    corBorda,
    isCampeao = false,
  }: {
    jogo: JogoRanking;
    posicao: string;
    corBorda: string;
    isCampeao?: boolean;
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          color: isCampeao ? corBorda : '#E2E8F0',
          fontSize: isCampeao ? '0.9rem' : '0.8rem',
          fontWeight: 900,
          letterSpacing: '2px',
          marginBottom: '0.6rem',
          fontFamily: 'var(--font-teko)',
          textShadow: isCampeao ? `0 0 10px ${corBorda}80` : 'none',
        }}
      >
        {isCampeao ? t.veredito_campeao : posicao}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '0px',
          backgroundColor: '#111',
          border: `1px solid ${corBorda}80`,
          boxShadow: isCampeao
            ? '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 0 2px #FFD700'
            : `0 0 20px ${corBorda}30`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <img
          src={jogo.imagem}
          alt={jogo.titulo}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(5, 5, 8, 1) 0%, rgba(5, 5, 8, 0.95) 30%, transparent 75%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: isCampeao ? '1rem' : '0.8rem 0.5rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#FFF',
              fontSize: isCampeao ? '1.3rem' : '0.95rem',
              fontWeight: 900,
              margin: 0,
              fontFamily: 'var(--font-teko)',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0,0,0,1)',
            }}
          >
            {jogo.titulo}
          </h2>
          <div
            style={{
              color: isCampeao ? corBorda : '#A1A1AA',
              fontSize: isCampeao ? '0.85rem' : '0.75rem',
              fontWeight: 800,
              marginTop: '0.3rem',
              letterSpacing: '1px',
            }}
          >
            {jogo.pontos} {jogo.pontos === 1 ? t.veredito_ponto : t.veredito_pontos}
          </div>

          {isCampeao && (
            <div
              style={{
                color: '#FFF',
                fontSize: '0.55rem',
                fontWeight: 800,
                marginTop: '0.5rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              {t.veredito_previa_2026}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <main className="veredito-main">
      <style>{`
        .veredito-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100dvh;
          padding: 92px 1rem 2.5rem;
          background-color: transparent;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .veredito-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 700px;
        }
        .veredito-top-actions {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .veredito-back-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0px;
          color: #D1D5DB;
          padding: 0.5rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-teko);
          letter-spacing: 1.2px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        @media (hover: hover) and (pointer: fine) {
          .veredito-back-btn:hover {
            color: #FFF;
            border-color: #FFF;
          }
        }
        .veredito-draft-banner {
          width: 100%;
          background-color: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.5);
          border-left: 4px solid #D4AF37;
          color: #FDE68A;
          padding: 0.75rem 1rem;
          border-radius: 0px;
          font-size: 0.84rem;
          line-height: 1.45;
          text-align: center;
          margin-bottom: 1.25rem;
          box-sizing: border-box;
        }
        .veredito-campeao-wrap {
          width: 44%;
          min-width: 170px;
          margin-bottom: 1rem;
        }
        .veredito-vice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 88%;
          margin-bottom: 1.2rem;
        }
        @media (max-width: 600px) {
          .veredito-main {
            padding: 82px 0.85rem 2rem;
          }
          .veredito-campeao-wrap {
            width: 58%;
            min-width: 165px;
          }
          .veredito-vice-grid {
            width: 100%;
            gap: 0.75rem;
          }
        }
      `}</style>

      <div className="veredito-container">
        <div className="veredito-top-actions">
          <button type="button" onClick={onVoltar} disabled={enviando} className="veredito-back-btn">
            {t.veredito_rever}
          </button>
        </div>

        <div className="veredito-draft-banner" role="status">
          <strong>{t.veredito_aviso_prefixo}</strong> {t.veredito_aviso_meio}{' '}
          <strong>{t.veredito_btn_selar}</strong>.
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <div
            style={{
              color: 'var(--purple-neon)',
              fontSize: '0.82rem',
              fontWeight: 900,
              letterSpacing: '3px',
              marginBottom: '0.25rem',
              fontFamily: 'var(--font-teko)',
            }}
          >
            {t.veredito_apuracao} • {totalDuelosConcluidos} {t.veredito_duelos}
          </div>
          <h1
            style={{
              color: '#FFF',
              fontSize: 'clamp(1.9rem, 5vw, 2.7rem)',
              fontWeight: 900,
              margin: 0,
              fontFamily: 'var(--font-teko)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {t.veredito_titulo_1} <span className="title-shine">{t.veredito_titulo_2}</span>
          </h1>
        </div>

        {campeao && (
          <div className="veredito-campeao-wrap">
            <CardPodio jogo={campeao} posicao={t.veredito_campeao} corBorda="#FFD700" isCampeao={true} />
          </div>
        )}

        {(segundo || terceiro) && (
          <div className="veredito-vice-grid">
            {segundo && <CardPodio jogo={segundo} posicao={t.veredito_segundo} corBorda="#C0C0C0" />}
            {terceiro && <CardPodio jogo={terceiro} posicao={t.veredito_terceiro} corBorda="#D1D5DB" />}
          </div>
        )}

        <div style={{ width: '100%', textAlign: 'center', marginBottom: '0.8rem' }}>
          <p style={{ color: '#a1a1aa', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>
            {t.veredito_empate}
          </p>
        </div>

        {resto.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            {resto.map((jogo, index) => {
              const posicao = index + 4;
              return (
                <motion.div
                  key={jogo.titulo}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    backgroundColor: 'rgba(28, 28, 30, 0.8)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '0px',
                    padding: '0 1rem',
                    height: '38px',
                  }}
                >
                  <div
                    style={{
                      color: '#a1a1aa',
                      fontSize: '0.9rem',
                      fontWeight: 900,
                      fontFamily: 'var(--font-teko)',
                      width: '25px',
                    }}
                  >
                    {posicao}º
                  </div>
                  <img
                    src={jogo.imagem}
                    alt={jogo.titulo}
                    style={{ width: '20px', height: '28px', objectFit: 'cover', borderRadius: '0px' }}
                  />
                  <div
                    style={{
                      flex: 1,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#FFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {jogo.titulo}
                  </div>
                  <div style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                    {jogo.pontos} {jogo.pontos === 1 ? t.veredito_ponto : t.veredito_pontos}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div
          style={{
            width: '100%',
            marginTop: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              color: '#FDE68A',
              fontSize: '0.82rem',
              fontWeight: 700,
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {t.veredito_nao_computado}
          </p>

          <div className="cf-turnstile" style={{ backgroundColor: 'transparent' }}></div>

          <button
            type="button"
            onClick={onEnviar}
            disabled={enviando}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.25rem',
              background: enviando
                ? '#555'
                : 'linear-gradient(90deg, #4C1D95 0%, #9333EA 50%, #B45309 100%)',
              color: '#F4F4F0',
              fontWeight: 900,
              border: '1px solid rgba(212, 175, 55, 0.55)',
              borderRadius: '0px',
              cursor: enviando ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-teko)',
              letterSpacing: '1.2px',
              boxShadow: enviando
                ? 'none'
                : 'inset 0 0 10px rgba(255,255,255,0.2), 0 5px 18px rgba(0,0,0,0.55)',
              transition: 'all 0.2s',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {enviando ? t.veredito_btn_selando : t.veredito_btn_selar}
          </button>
        </div>
      </div>
    </main>
  );
}