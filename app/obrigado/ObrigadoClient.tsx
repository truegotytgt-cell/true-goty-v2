// app/obrigado/ObrigadoClient.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jogosData from '../../lib/jogos.json';
import StoryExportCard from './StoryExportCard';
import { IconShare, SocialShareBar } from './ShareIcons';
import {
  JogoTop3,
  RedeSocial,
  getTextoCompartilhamento,
  getTituloReddit,
  isDispositivoMobile,
  salvarBlobComoArquivo,
} from './shareUtils';

type ToastState = {
  mensagem: string;
  mostrarBotaoTexto?: boolean;
};

export default function ObrigadoClient() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') || 'tgt';

  const [top3, setTop3] = useState<JogoTop3[]>([]);
  const [previewScale, setPreviewScale] = useState(0.38);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);
  const blobCacheRef = useRef<Blob | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTgt = categoria === 'tgt';
  const corPrincipal = isTgt ? '#B026FF' : '#D4AF37';
  const corPrincipalHoverBg = isTgt
    ? 'rgba(176, 38, 255, 0.16)'
    : 'rgba(212, 175, 55, 0.16)';
  const corOuro = '#D4AF37';

  // Ajusta o tamanho do preview para dar presença monumental no PC e caber bem no celular
  useEffect(() => {
    const atualizarEscala = () => {
      const larguraDisponivel = window.innerWidth - 48;
      const alturaDisponivel = window.innerHeight - 130;
      const escalaPorLargura = larguraDisponivel / 1080;
      const escalaPorAltura = alturaDisponivel / 1920;

      const escalaDesejada =
        window.innerWidth >= 900
          ? Math.min(0.42, Math.max(0.36, escalaPorAltura))
          : Math.min(0.36, escalaPorLargura);

      setPreviewScale(Math.max(0.26, Math.min(escalaDesejada, escalaPorLargura)));
    };

    atualizarEscala();
    window.addEventListener('resize', atualizarEscala);
    return () => window.removeEventListener('resize', atualizarEscala);
  }, []);

  useEffect(() => {
    const rankingSalvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    if (rankingSalvo) {
      try {
        const parsed = JSON.parse(rankingSalvo);
        const jogosJSON = (jogosData as any)[categoria]?.top10 || [];

        const comImagens: JogoTop3[] = parsed.slice(0, 3).map((item: any) => {
          const infoJogo = jogosJSON.find((j: any) => j.titulo === item.titulo);
          return {
            titulo: item.titulo,
            pontos: typeof item.pontos === 'number' ? item.pontos : undefined,
            imagem: infoJogo?.imagem || '/placeholder.jpg',
          };
        });

        blobCacheRef.current = null;
        setTop3(comImagens);
      } catch (e) {
        console.error('Erro ao ler ranking', e);
      }
    }
  }, [categoria]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const gerarImagemStory = useCallback(async (usarCache = true): Promise<Blob | null> => {
    if (usarCache && blobCacheRef.current) return blobCacheRef.current;
    if (!exportRef.current) return null;

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(exportRef.current, {
        useCORS: true,
        backgroundColor: '#050508',
        scale: 1,
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), 'image/png');
      });

      if (blob) blobCacheRef.current = blob;
      return blob;
    } catch (error) {
      console.error('Erro ao gerar Story 1080x1920:', error);
      return null;
    }
  }, []);

  // Pré-gera o PNG 1080x1920 em segundo plano para cliques instantâneos
  useEffect(() => {
    if (top3.length === 0) return;
    const timer = setTimeout(() => {
      gerarImagemStory(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [top3, gerarImagemStory]);

  const mostrarToast = (mensagem: string, mostrarBotaoTexto = false, duracao = 5500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ mensagem, mostrarBotaoTexto });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, duracao);
  };

  const copiarTextoELink = async () => {
    try {
      await navigator.clipboard.writeText(getTextoCompartilhamento(top3));
      mostrarToast('✓ Texto e link copiados! Agora é só colar.', false, 3500);
    } catch {
      mostrarToast('Não foi possível copiar o texto automaticamente.', false, 3500);
    }
  };

  const copiarImagemParaClipboard = async (blob: Blob): Promise<boolean> => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch (err) {
      console.warn('Falha ao copiar PNG para clipboard:', err);
      return false;
    }
  };

  const copiarImagemOuBaixar = async (blob: Blob): Promise<'copiado' | 'baixado'> => {
    const copiou = await copiarImagemParaClipboard(blob);
    if (copiou) return 'copiado';
    salvarBlobComoArquivo(blob, 'meu-true-goty-2026-story.png');
    return 'baixado';
  };

  // BOTÃO PRINCIPAL: Compartilhamento nativo no mobile, ou download + cópia no desktop
  const compartilharPrincipal = async () => {
    setIsGenerating(true);
    const blob = await gerarImagemStory(true);

    if (!blob) {
      mostrarToast('Erro ao gerar a imagem do pódio.');
      setIsGenerating(false);
      return;
    }

    const texto = getTextoCompartilhamento(top3);
    const file = new File([blob], 'meu-true-goty-2026-story.png', { type: 'image/png' });

    // Mobile real: abre a gaveta nativa já com o PNG + texto
    if (
      isDispositivoMobile() &&
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: 'O Verdadeiro Game of the Year',
          text: texto,
        });
        setIsGenerating(false);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setIsGenerating(false);
          return;
        }
      }
    }

    // Desktop: baixa o PNG em alta definição E copia para a área de transferência
    salvarBlobComoArquivo(blob, 'meu-true-goty-2026-story.png');
    const copiou = await copiarImagemParaClipboard(blob);

    if (copiou) {
      mostrarToast(
        '✓ Cartão 9:16 baixado e copiado! Aperte Ctrl+V nas redes ou publique o arquivo salvo.',
        true,
        8500
      );
    } else {
      mostrarToast(
        '✓ Cartão 9:16 salvo em alta definição! Agora é só compartilhar nas suas redes.',
        true,
        7500
      );
    }

    setIsGenerating(false);
  };

  const compartilharRede = async (rede: RedeSocial) => {
    setIsGenerating(true);
    const texto = getTextoCompartilhamento(top3);
    const blob = await gerarImagemStory(true);

    if (!blob) {
      mostrarToast('Erro ao gerar o cartão do pódio.');
      setIsGenerating(false);
      return;
    }

    const file = new File([blob], 'meu-true-goty-2026-story.png', { type: 'image/png' });

    // 1. APENAS EM CELULARES REAIS: abre gaveta nativa com PNG + texto
    if (
      isDispositivoMobile() &&
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: 'O Verdadeiro Game of the Year',
          text: texto,
        });
        setIsGenerating(false);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setIsGenerating(false);
          return;
        }
      }
    }

    // 2. DESKTOP: Instagram (baixa Story 9:16 + copia legenda)
    if (rede === 'instagram') {
      salvarBlobComoArquivo(blob, 'meu-true-goty-2026-story.png');
      try {
        await navigator.clipboard.writeText(texto);
        mostrarToast(
          '✓ Story 9:16 baixado e legenda copiada! Poste nos seus Stories do Instagram.',
          false,
          7000
        );
      } catch {
        mostrarToast(
          '✓ Story 9:16 baixado! Abra o Instagram e publique nos seus Stories.',
          true,
          7000
        );
      }
      setIsGenerating(false);
      return;
    }

    // 3. DESKTOP: Discord (copia imagem + abre Discord Web em nova aba)
    if (rede === 'discord') {
      const resultado = await copiarImagemOuBaixar(blob);
      window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');

      if (resultado === 'copiado') {
        mostrarToast(
          '✓ Cartão do pódio copiado! No Discord que acabou de abrir, escolha o canal e aperte Ctrl+V.',
          true,
          9000
        );
      } else {
        mostrarToast(
          '✓ Story 9:16 salvo! Arraste a imagem para o canal no Discord.',
          true,
          9000
        );
      }
      setIsGenerating(false);
      return;
    }

    // 4. DESKTOP: WhatsApp, X e Reddit (copia imagem + abre a rede com texto pronto)
    const resultadoImg = await copiarImagemOuBaixar(blob);

    let intentUrl = '';
    if (rede === 'whatsapp') {
      intentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    } else if (rede === 'x') {
      intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`;
    } else if (rede === 'reddit') {
      const tituloReddit = getTituloReddit(top3);
      intentUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(tituloReddit)}&text=${encodeURIComponent(texto)}`;
    }

    if (intentUrl) {
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    }

    const nomeRede = rede === 'whatsapp' ? 'WhatsApp' : rede === 'x' ? 'X' : 'Reddit';
    if (resultadoImg === 'copiado') {
      mostrarToast(
        `✓ Imagem copiada! Na aba do ${nomeRede}, aperte Ctrl+V para colar o pôster junto do texto.`,
        true,
        8000
      );
    } else {
      mostrarToast(
        `✓ Imagem salva! Na aba do ${nomeRede}, anexe o pôster baixado ao seu post.`,
        true,
        8000
      );
    }

    setIsGenerating(false);
  };

  const previewWidth = Math.round(1080 * previewScale);
  const previewHeight = Math.round(1920 * previewScale);

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '92px 2rem 2.5rem',
        backgroundColor: 'transparent',
      }}
    >
      {/* MOLDE OFICIAL 1080x1920 FORA DA TELA (USADO PELO HTML2CANVAS) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1920px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <StoryExportCard ref={exportRef} top3={top3} />
      </div>

      {/* TOAST DE FEEDBACK */}
      <AnimatePresence>
        {toast && (
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: '0 1rem',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              style={{
                pointerEvents: 'auto',
                backgroundColor: '#065f46',
                border: '1px solid #34d399',
                color: '#FFF',
                padding: '0.9rem 1.4rem',
                borderRadius: '0px',
                fontWeight: 600,
                fontSize: '0.92rem',
                boxShadow: '0 12px 32px rgba(0,0,0,0.65)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.9rem',
                maxWidth: '680px',
                textAlign: 'center',
              }}
            >
              <span>{toast.mensagem}</span>

              {toast.mostrarBotaoTexto && (
                <button
                  type="button"
                  onClick={copiarTextoELink}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#FFF',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.26)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
                  }}
                >
                  Copiar texto + link
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          width: '100%',
          maxWidth: '1120px',
          alignItems: 'center',
        }}
      >
        {/* COLUNA ESQUERDA: PRÉVIA AMPLIADA 9:16 COM AURA DE PALCO */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', width: `${previewWidth}px`, height: `${previewHeight}px` }}>
            {/* AURA DE PALCO INTENSA ATRÁS DO CARTÃO */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-48px',
                background:
                  'radial-gradient(ellipse at 50% 44%, rgba(176, 38, 255, 0.58) 0%, rgba(212, 175, 55, 0.36) 38%, rgba(5, 5, 8, 0) 72%)',
                filter: 'blur(38px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* MOLDURA DO PÔSTER 9:16 */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: `${previewWidth}px`,
                height: `${previewHeight}px`,
                overflow: 'hidden',
                borderRadius: '0px',
                border: `1px solid ${corOuro}`,
                boxShadow:
                  '0 0 46px rgba(176, 38, 255, 0.36), 0 0 24px rgba(212, 175, 55, 0.28), 0 28px 65px rgba(0, 0, 0, 0.92)',
                backgroundColor: '#050508',
              }}
            >
              <div
                style={{
                  width: '1080px',
                  height: '1920px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}
              >
                <StoryExportCard top3={top3} />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: TEXTOS E AÇÕES */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              color: corPrincipal,
              fontSize: '0.82rem',
              fontWeight: 900,
              letterSpacing: '3px',
              marginBottom: '0.6rem',
              fontFamily: 'var(--font-teko)',
            }}
          >
            [ VEREDITO REGISTRADO • TEMPORADA 2026 ]
          </div>

          <h1
            style={{
              color: '#FFF',
              fontSize: 'clamp(2.3rem, 3.8vw, 3.3rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-teko)',
              textTransform: 'uppercase',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.05,
            }}
          >
            <span style={{ display: 'block' }}>SEU VEREDITO</span>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
              ESTÁ NA{' '}
              <span className="title-shine" style={{ display: 'inline-block' }}>
                HISTÓRIA!
              </span>
            </span>
          </h1>

          <p
            style={{
              color: '#D1D5DB',
              fontSize: '0.95rem',
              marginBottom: '2rem',
              lineHeight: 1.5,
              maxWidth: '420px',
            }}
          >
            Sua escolha já entrou no Placar Global. Compartilhe seu pôster oficial em alta definição ou desafie a comunidade nas redes.
          </p>

          {/* BOTÃO PRINCIPAL (COMPARTILHAR • CANTOS RETOS 90°) */}
          <button
            type="button"
            onClick={compartilharPrincipal}
            disabled={isGenerating}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.15rem 1.4rem',
              fontSize: '1.15rem',
              background:
                'linear-gradient(90deg, #4C1D95 0%, #7e22ce 50%, #9333EA 85%, #8B6508 100%)',
              color: '#FFF',
              fontWeight: 900,
              border: `1px solid ${corOuro}`,
              borderRadius: '0px',
              cursor: isGenerating ? 'wait' : 'pointer',
              fontFamily: 'var(--font-teko)',
              letterSpacing: '1.2px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '1.5rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              lineHeight: 1.1,
            }}
            onMouseOver={(e) => {
              if (!isGenerating) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              if (!isGenerating) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isGenerating ? (
              'GERANDO PÔSTER...'
            ) : (
              <>
                <IconShare /> COMPARTILHAR O VERDADEIRO GAME OF THE YEAR
              </>
            )}
          </button>

          {/* ÍCONES SOCIAIS (CANTOS RETOS 90°) */}
          <SocialShareBar
            corPrincipal={corPrincipal}
            corHoverBg={corPrincipalHoverBg}
            isGenerating={isGenerating}
            onShare={compartilharRede}
          />

          <Link
            href={`/resultados/global?cat=${categoria}`}
            style={{
              color: '#D1D5DB',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s',
              fontFamily: 'var(--font-teko)',
              letterSpacing: '1px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = corPrincipal;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#D1D5DB';
            }}
          >
            VER PLACAR GLOBAL <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}