// app/obrigado/StoryExportCard.tsx
'use client';

import React, { forwardRef } from 'react';
import type { JogoTop3 } from './shareUtils';

type Props = {
  top3: JogoTop3[];
};

const LaurelBranch = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="70"
    height="44"
    viewBox="0 0 70 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: flip ? 'scaleX(-1)' : undefined,
      flexShrink: 0,
    }}
  >
    {/* Caule principal */}
    <path
      d="M64 38 C36 39, 17 27, 13 6"
      stroke="#D4AF37"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Folhas externas */}
    <path d="M51 37 C43 43, 33 42, 28 36 C36 33, 45 34, 51 37 Z" fill="#D4AF37" />
    <path d="M35 32 C25 35, 16 32, 13 25 C22 24, 30 27, 35 32 Z" fill="#D4AF37" />
    <path d="M22 23 C12 24, 6 19, 5 11 C13 12, 19 16, 22 23 Z" fill="#D4AF37" />
    <path d="M15 12 C9 10, 7 5, 11 1 C15 4, 16 8, 15 12 Z" fill="#D4AF37" />
    {/* Folhas internas */}
    <path d="M52 35 C49 27, 53 21, 61 20 C61 27, 57 32, 52 35 Z" fill="#D4AF37" />
    <path d="M37 29 C35 20, 40 14, 48 13 C48 21, 43 26, 37 29 Z" fill="#D4AF37" />
    <path d="M24 20 C24 12, 29 7, 37 6 C35 13, 30 18, 24 20 Z" fill="#D4AF37" />
    <path d="M16 11 C18 4, 23 1, 30 1 C27 7, 22 10, 16 11 Z" fill="#D4AF37" />
  </svg>
);

const StoryExportCard = forwardRef<HTMLDivElement, Props>(({ top3 }, ref) => {
  const corOuro = '#D4AF37';
  const corPrata = '#E2E8F0';
  const corBronze = '#CD7F32';
  const corRoxoSuave = '#C084FC';

  const campeao = top3[0];
  const segundo = top3[1];
  const terceiro = top3[2];

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1920px',
        backgroundColor: '#050508',
        border: `4px solid ${corOuro}`,
        borderRadius: '0px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        // Zonas seguras discretas: ~10% no topo (185px) e ~12% na base (225px)
        paddingTop: '185px',
        paddingBottom: '225px',
        paddingLeft: '56px',
        paddingRight: '56px',
        fontFamily: 'var(--font-inter), sans-serif',
        color: '#F4F4F0',
      }}
    >
      {/* ILUMINAÇÃO DE PALCO NO FUNDO (ROXO IMPERIAL + OURO) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 41%, rgba(176, 38, 255, 0.46) 0%, rgba(126, 34, 206, 0.22) 34%, rgba(5, 5, 8, 0) 72%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.36) 0%, rgba(212, 175, 55, 0.12) 24%, rgba(5, 5, 8, 0) 48%)',
          pointerEvents: 'none',
        }}
      />

      {/* ONDAS DE AÇO DAMASCO */}
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '1080px',
          height: '1920px',
          pointerEvents: 'none',
        }}
      >
        <path d="M-80 220 C240 80 760 400 1160 180" stroke="#B026FF" strokeWidth="2.5" opacity="0.34" />
        <path d="M-80 310 C260 170 780 490 1160 270" stroke="#A855F7" strokeWidth="1.5" opacity="0.2" />
        <path d="M-80 610 C220 450 760 790 1160 570" stroke="#D4AF37" strokeWidth="2" opacity="0.24" />
        <path d="M-80 700 C220 540 760 880 1160 660" stroke="#B026FF" strokeWidth="2.2" opacity="0.28" />
        <path d="M-80 1180 C280 1000 720 1360 1160 1140" stroke="#B026FF" strokeWidth="2.5" opacity="0.3" />
        <path d="M-80 1280 C280 1100 720 1460 1160 1240" stroke="#D4AF37" strokeWidth="1.8" opacity="0.22" />
        <path d="M-80 1620 C300 1460 760 1760 1160 1560" stroke="#B026FF" strokeWidth="2" opacity="0.24" />
        <path d="M-80 1710 C300 1550 760 1850 1160 1650" stroke="#D4AF37" strokeWidth="1.5" opacity="0.18" />
      </svg>

      {/* 1. CABEÇALHO MONUMENTAL (SEM LOGO TGT) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: '58px',
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: '6px',
            color: '#FFFFFF',
            textTransform: 'uppercase',
          }}
        >
          O VERDADEIRO
        </div>

        <div
          style={{
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: '94px',
            fontWeight: 900,
            lineHeight: 0.86,
            letterSpacing: '3.5px',
            color: corOuro,
            textTransform: 'uppercase',
            marginTop: '4px',
          }}
        >
          GAME OF THE YEAR
        </div>

        <div
          style={{
            marginTop: '12px',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '5px',
            color: corRoxoSuave,
            textTransform: 'uppercase',
          }}
        >
          MEU VEREDITO OFICIAL • 45 DUELOS
        </div>
      </div>

      {/* 2. 1º LUGAR DOMINANTE (CAMPEÃO SEM PONTOS) */}
      {campeao && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* RAMOS DE LOUROS + CAMPEÃO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '12px',
            }}
          >
            <LaurelBranch />
            <span
              style={{
                fontFamily: 'var(--font-teko), sans-serif',
                fontSize: '46px',
                fontWeight: 800,
                letterSpacing: '7px',
                color: corOuro,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              CAMPEÃO
            </span>
            <LaurelBranch flip />
          </div>

          {/* CAPA DOMINANTE + HOLOFOTE RADIAL ATRÁS (SEPARADO PARA NÃO TINGIR A ARTE) */}
          <div style={{ position: 'relative', width: '468px', height: '588px' }}>
            <div
              style={{
                position: 'absolute',
                inset: '-72px',
                background:
                  'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.72) 0%, rgba(176, 38, 255, 0.48) 46%, rgba(5, 5, 8, 0) 74%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                border: `6px solid ${corOuro}`,
                borderRadius: '0px',
                backgroundColor: '#0B0B10',
                backgroundImage: `url(${campeao.imagem})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              marginTop: '18px',
              fontFamily: 'var(--font-teko), sans-serif',
              fontSize: '54px',
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '2px',
              color: '#FFFFFF',
              textAlign: 'center',
              textTransform: 'uppercase',
              maxWidth: '940px',
            }}
          >
            {campeao.titulo}
          </div>
        </div>
      )}

      {/* 3. 2º LUGAR (PRATA) E 3º LUGAR (BRONZE) AMPLIADOS LADO A LADO */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '54px',
          width: '100%',
          maxWidth: '880px',
          alignItems: 'start',
        }}
      >
        {[
          {
            label: '2º LUGAR',
            jogo: segundo,
            cor: corPrata,
            corBrilho: 'rgba(226, 232, 240, 0.3)',
          },
          {
            label: '3º LUGAR',
            jogo: terceiro,
            cor: corBronze,
            corBrilho: 'rgba(205, 127, 50, 0.36)',
          },
        ].map(
          ({ label, jogo, cor, corBrilho }) =>
            jogo && (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-teko), sans-serif',
                    fontSize: '36px',
                    fontWeight: 800,
                    letterSpacing: '4.5px',
                    color: cor,
                    marginBottom: '10px',
                    lineHeight: 1,
                  }}
                >
                  {label}
                </div>

                <div style={{ position: 'relative', width: '300px', height: '376px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-30px',
                      background: `radial-gradient(ellipse at center, ${corBrilho} 0%, rgba(5, 5, 8, 0) 72%)`,
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',
                      height: '100%',
                      border: `4px solid ${cor}`,
                      borderRadius: '0px',
                      backgroundColor: '#0B0B10',
                      backgroundImage: `url(${jogo.imagem})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: '14px',
                    fontSize: '28px',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: '#FFFFFF',
                    maxWidth: '400px',
                  }}
                >
                  {jogo.titulo}
                </div>
              </div>
            )
        )}
      </div>

      {/* 4. RODAPÉ OFICIAL COM DOMÍNIO TRUEGOTY.COM */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '620px',
            height: '2px',
            background:
              'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.85) 50%, rgba(212,175,55,0) 100%)',
            marginBottom: '16px',
          }}
        />

        <div
          style={{
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: '44px',
            fontWeight: 800,
            letterSpacing: '3.5px',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          DESCUBRA O SEU EM{' '}
          <span style={{ color: corOuro, letterSpacing: '4.5px' }}>TRUEGOTY.COM</span>
        </div>
      </div>
    </div>
  );
});

StoryExportCard.displayName = 'StoryExportCard';

export default StoryExportCard;