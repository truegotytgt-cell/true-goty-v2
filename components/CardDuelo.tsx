'use client';

import { motion } from 'framer-motion';
import { Jogo } from '../lib/condorcet';
import { useLanguage } from './LanguageProvider';

type Props = {
  jogo: Jogo;
  categoria?: string;
  onClick: () => void;
  status?: 'idle' | 'winner' | 'loser';
  isHovered: boolean;
  isOpponentHovered: boolean;
  onHover: (hovering: boolean) => void;
};

export default function CardDuelo({
  jogo,
  categoria = 'tgt',
  onClick,
  status = 'idle',
  isHovered,
  onHover,
}: Props) {
  const { t } = useLanguage();
  const isWinner = status === 'winner';
  const isLoser = status === 'loser';
  const isIdle = status === 'idle';
  const isTgt = categoria === 'tgt';

  const activeHover = isHovered && isIdle;
  const corTema = isTgt ? '#B026FF' : '#D4AF37';
  const corTextoBtn = isTgt ? '#FFFFFF' : '#0A0A0A';
  const corGlowHover = isTgt
    ? '0 0 28px rgba(176, 38, 255, 0.75), inset 0 0 0 2px #B026FF'
    : '0 0 28px rgba(212, 175, 55, 0.75), inset 0 0 0 2px #D4AF37';

  const baseScale = isWinner ? 1.04 : isLoser ? 0.88 : activeHover ? 1.02 : 1;

  let boxShadow = '0 10px 30px rgba(0, 0, 0, 0.85), inset 0 0 0 1px rgba(255, 255, 255, 0.14)';
  if (isWinner) {
    boxShadow =
      '0 0 35px rgba(255, 255, 255, 0.6), 0 0 70px rgba(212, 175, 55, 0.75), inset 0 0 0 3px #FFD700';
  } else if (activeHover) {
    boxShadow = corGlowHover;
  }

  const handleCardClick = () => {
    if (!isIdle) return;
    onHover(false);
    onClick();
  };

  const statusLabel = isWinner
    ? t.arena_selado
    : isLoser
      ? t.arena_eliminado
      : t.arena_desafiante;

  return (
    <>
      <style>{`
        .card-duelo-cta-hover {
          display: none;
        }
        .card-duelo-status-label {
          display: flex;
        }
        @media (hover: hover) and (pointer: fine) {
          .card-duelo-cta-hover.is-active {
            display: inline-flex;
          }
          .card-duelo-status-label.is-hidden-on-hover {
            display: none;
          }
        }
      `}</style>

      <motion.div
        onMouseEnter={() => {
          if (
            isIdle &&
            typeof window !== 'undefined' &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches
          ) {
            onHover(true);
          }
        }}
        onMouseLeave={() => onHover(false)}
        onPointerCancel={() => onHover(false)}
        onClick={handleCardClick}
        animate={{
          scale: baseScale,
          opacity: isLoser ? 0.22 : 1,
          filter: isLoser
            ? 'grayscale(100%) blur(4px) brightness(0.3)'
            : 'grayscale(0%) blur(0px) brightness(1)',
        }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          cursor: isIdle ? 'pointer' : 'default',
          zIndex: isWinner ? 20 : activeHover ? 10 : 1,
          backgroundColor: '#111114',
          borderRadius: '0px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          boxShadow,
          transition: 'box-shadow 0.15s ease-out',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          touchAction: 'manipulation',
        }}
      >
        <img
          src={jogo.imagem}
          alt={jogo.titulo}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            transition: 'transform 0.35s ease',
            transform: activeHover ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(to top, rgba(5, 5, 8, 0.98) 0%, rgba(5, 5, 8, 0.78) 28%, transparent 62%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 3,
            padding: 'clamp(0.75rem, 2.5vw, 1.4rem) clamp(0.5rem, 2vw, 1rem)',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {isWinner && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#FFD700',
                fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
                fontWeight: 900,
                letterSpacing: '2px',
                marginBottom: '0.35rem',
                textShadow: '0 0 12px rgba(212, 175, 55, 0.8)',
              }}
            >
              {t.arena_veredito_selado}
            </motion.div>
          )}

          <h2
            style={{
              color: '#FFF',
              fontSize: 'clamp(1.05rem, 3.4vw, 1.65rem)',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.05,
              fontFamily: 'var(--font-teko)',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
              wordBreak: 'break-word',
            }}
          >
            {jogo.titulo}
          </h2>

          <div
            style={{
              minHeight: '24px',
              marginTop: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className={`card-duelo-cta-hover ${activeHover ? 'is-active' : ''}`}
              style={{
                color: corTextoBtn,
                backgroundColor: corTema,
                padding: '3px 12px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                borderRadius: '0px',
                boxShadow: `0 0 14px ${corTema}`,
              }}
            >
              {t.arena_escolher_este}
            </div>

            <div
              className={`card-duelo-status-label ${activeHover ? 'is-hidden-on-hover' : ''}`}
              style={{
                color: isWinner ? '#FFD700' : '#a1a1aa',
                fontSize: 'clamp(0.62rem, 1.8vw, 0.74rem)',
                fontWeight: 800,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
              }}
            >
              {statusLabel}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}