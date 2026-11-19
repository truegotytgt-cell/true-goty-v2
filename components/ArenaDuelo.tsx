// components/ArenaDuelo.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardDuelo from './CardDuelo';
import { Jogo } from '../lib/condorcet';

type Props = {
  duelo: { jogo1: Jogo; jogo2: Jogo };
  animacao: { jogo1: 'idle' | 'winner' | 'loser'; jogo2: 'idle' | 'winner' | 'loser' };
  dueloAtual: number;
  totalDuelos: number;
  categoria: string;
  progressoPorcentagem: number;
  enviando: boolean;
  onVoto: (vencedor: Jogo, perdedor: Jogo, jogo1Venceu: boolean) => void;
  onDesfazer: () => void;
  onTrocarArena: () => void;
};

export default function ArenaDuelo({
  duelo,
  animacao,
  dueloAtual,
  totalDuelos,
  categoria,
  progressoPorcentagem,
  enviando,
  onVoto,
  onDesfazer,
  onTrocarArena,
}: Props) {
  const [hoveredCard, setHoveredCard] = useState<'jogo1' | 'jogo2' | null>(null);
  const isVoting = animacao.jogo1 !== 'idle' || animacao.jogo2 !== 'idle';
  const isTgt = categoria === 'tgt';

  const corTema = isTgt ? '#B026FF' : '#D4AF37';
  const corTemaClaro = isTgt ? '#C084FC' : '#F4D06F';
  const gradienteBarra = isTgt
    ? 'linear-gradient(90deg, #7e22ce, #B026FF, #D4AF37)'
    : 'linear-gradient(90deg, #8B6508, #D4AF37, #FFF3C4)';
  const glowBarra = isTgt
    ? '0 0 15px rgba(176, 38, 255, 0.75)'
    : '0 0 15px rgba(212, 175, 55, 0.75)';

  return (
    <main className="arena-duelo-main">
      <style>{`
        .arena-duelo-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: 100dvh;
          padding: 86px 1.5rem 1.5rem;
          background-color: transparent;
          box-sizing: border-box;
          width: 100%;
          gap: 0.75rem;
        }

        .arena-topbar {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          z-index: 20;
        }

        .arena-topbar-btn {
          background-color: rgba(255, 255, 255, 0.03);
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 0px;
          padding: 0.45rem 0.9rem;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: var(--font-teko), sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .arena-topbar-btn:hover:not(:disabled) {
          color: #FFFFFF;
          border-color: ${corTema};
        }

        .arena-topbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .arena-header {
          width: 100%;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .arena-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr);
          align-items: center;
          width: 100%;
          max-width: 1120px;
          flex: 1;
          min-height: 0;
          gap: 1rem;
          position: relative;
        }

        .arena-slot-left {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .arena-slot-right {
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }

        .arena-card-wrap {
          width: 100%;
          max-width: 350px;
        }

        .arena-vs-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
        }

        .arena-vs-line-top {
          position: absolute;
          top: 0;
          bottom: 50%;
          width: 2px;
          background: linear-gradient(to bottom, transparent, ${isTgt ? 'rgba(176, 38, 255, 0.45)' : 'rgba(212, 175, 55, 0.45)'});
          z-index: 1;
        }

        .arena-vs-line-bottom {
          position: absolute;
          top: 50%;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to top, transparent, rgba(212, 175, 55, 0.45));
          z-index: 1;
        }

        .arena-vs-badge {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0A0A0A;
          padding: 1.2rem 0.5rem;
        }

        .arena-vs-text {
          font-size: 4.2rem;
          font-weight: 900;
          font-family: var(--font-teko), sans-serif;
          line-height: 0.8;
          letter-spacing: -1px;
          background: ${isTgt
            ? 'linear-gradient(180deg, #FFFFFF 18%, #B026FF 52%, #FFD700 85%)'
            : 'linear-gradient(180deg, #FFFFFF 18%, #F4D06F 55%, #B8860B 90%)'};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .arena-hint-desktop {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #71717a;
          font-size: 0.85rem;
          font-family: var(--font-teko), sans-serif;
          letter-spacing: 1px;
          z-index: 10;
        }

        .arena-hint-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .arena-duelo-main {
            padding: 78px 0.75rem 1.25rem;
            justify-content: flex-start;
            gap: 0.85rem;
          }

          .arena-topbar-btn {
            padding: 0.4rem 0.7rem;
            font-size: 0.85rem;
          }

          .arena-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            align-items: stretch;
            flex: 0 0 auto;
            margin-top: 0.25rem;
          }

          .arena-slot-left,
          .arena-slot-right {
            justify-content: center;
          }

          .arena-card-wrap {
            max-width: 100%;
          }

          .arena-vs-col {
            position: absolute;
            top: 44%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: auto;
            z-index: 30;
            pointer-events: none;
          }

          .arena-vs-line-top,
          .arena-vs-line-bottom {
            display: none;
          }

          .arena-vs-badge {
            padding: 0.35rem 0.55rem;
            background-color: rgba(10, 10, 14, 0.94);
            border: 1px solid ${corTema};
            box-shadow: 0 0 18px ${isTgt ? 'rgba(176, 38, 255, 0.55)' : 'rgba(212, 175, 55, 0.55)'};
          }

          .arena-vs-text {
            font-size: 1.75rem;
            line-height: 0.9;
          }

          .arena-hint-desktop {
            display: none;
          }

          .arena-hint-mobile {
            display: block;
            color: #a1a1aa;
            font-size: 0.95rem;
            font-family: var(--font-teko), sans-serif;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: center;
            margin-top: 0.5rem;
          }
        }
      `}</style>

      {/* BARRA SUPERIOR DE AÇÕES */}
      <div className="arena-topbar">
        <button type="button" onClick={onTrocarArena} disabled={enviando} className="arena-topbar-btn">
          ← TROCAR ARENA
        </button>

        {dueloAtual > 0 && (
          <button type="button" onClick={onDesfazer} disabled={enviando} className="arena-topbar-btn">
            ↺ DESFAZER VOTO
          </button>
        )}
      </div>

      {/* CABEÇALHO + BARRA DE PROGRESSO */}
      <div className="arena-header">
        <h1
          style={{
            color: '#FFF',
            fontSize: 'clamp(1.85rem, 4.5vw, 3rem)',
            fontWeight: 900,
            margin: 0,
            fontFamily: 'var(--font-teko)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {isTgt ? (
            <>
              QUAL É O SEU <span className="title-shine">TRUE GOTY</span>?
            </>
          ) : (
            <>
              QUAL É O CAMPEÃO DO <span style={{ color: '#D4AF37' }}>MERCADO (TGA)</span>?
            </>
          )}
        </h1>

        <div style={{ width: '100%', marginTop: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#a1a1aa',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.92rem)',
              fontWeight: 800,
              letterSpacing: '1.8px',
              marginBottom: '0.35rem',
              fontFamily: 'var(--font-teko)',
            }}
          >
            <span>
              CONFRONTO {String(dueloAtual + 1).padStart(2, '0')} / {String(totalDuelos).padStart(2, '0')}
            </span>
            <span style={{ color: corTemaClaro }}>
              {isTgt ? 'ARENA TRUE GOTY' : 'ARENA MERCADO (TGA)'}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#111114',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressoPorcentagem}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              style={{
                height: '100%',
                background: gradienteBarra,
                boxShadow: glowBarra,
              }}
            />
          </div>
        </div>
      </div>

      {/* ARENA GRID 1v1 */}
      <div className="arena-grid">
        <div className="arena-slot-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={`jogo1-${dueloAtual}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.25 }}
              className="arena-card-wrap"
            >
              <CardDuelo
                jogo={duelo.jogo1}
                categoria={categoria}
                status={animacao.jogo1}
                isHovered={hoveredCard === 'jogo1'}
                isOpponentHovered={hoveredCard === 'jogo2'}
                onHover={(h) => setHoveredCard(h ? 'jogo1' : null)}
                onClick={() => onVoto(duelo.jogo1, duelo.jogo2, true)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* VS CENTRAL */}
        <div className="arena-vs-col">
          <div className="arena-vs-line-top" />
          <div className="arena-vs-line-bottom" />

          <motion.div
            animate={{ scale: isVoting ? 1.15 : 1 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="arena-vs-badge"
          >
            <span
              className="arena-vs-text"
              style={{
                filter: isVoting
                  ? 'drop-shadow(0 0 18px rgba(212, 175, 55, 0.85))'
                  : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))',
              }}
            >
              VS
            </span>
          </motion.div>
        </div>

        <div className="arena-slot-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={`jogo2-${dueloAtual}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.25 }}
              className="arena-card-wrap"
            >
              <CardDuelo
                jogo={duelo.jogo2}
                categoria={categoria}
                status={animacao.jogo2}
                isHovered={hoveredCard === 'jogo2'}
                isOpponentHovered={hoveredCard === 'jogo1'}
                onHover={(h) => setHoveredCard(h ? 'jogo2' : null)}
                onClick={() => onVoto(duelo.jogo2, duelo.jogo1, false)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DICA DE INTERAÇÃO (TECLADO NO DESKTOP / TOQUE NO MOBILE) */}
      <div className="arena-hint-desktop">
        <kbd
          style={{
            backgroundColor: '#1a1a24',
            border: '1px solid #333',
            borderBottom: '2px solid #555',
            borderRadius: '2px',
            padding: '2px 10px',
            color: '#FFF',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
          }}
        >
          ←
        </kbd>
        <span>OU</span>
        <kbd
          style={{
            backgroundColor: '#1a1a24',
            border: '1px solid #333',
            borderBottom: '2px solid #555',
            borderRadius: '2px',
            padding: '2px 10px',
            color: '#FFF',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
          }}
        >
          →
        </kbd>
        <span>PARA DECIDIR MAIS RÁPIDO</span>
      </div>

      <div className="arena-hint-mobile">TOQUE NA CAPA DO JOGO VENCEDOR</div>
    </main>
  );
}