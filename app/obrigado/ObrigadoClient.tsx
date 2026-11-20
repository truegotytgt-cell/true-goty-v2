'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jogosData from '../../lib/jogos.json';
import StoryExportCard from './StoryExportCard';
import { IconShare, SocialShareBar } from './ShareIcons';
import { useLanguage } from '../../components/LanguageProvider';
import {
  JogoTop3,
  RedeSocial,
  getNomeArquivoStory,
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
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoria = searchParams.get('categoria') === 'mercado' ? 'mercado' : 'tgt';

  const [top3, setTop3] = useState<JogoTop3[]>([]);
  const [verificado, setVerificado] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.3);
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
  const nomeArquivo = getNomeArquivoStory(categoria);

  const feedbackText =
    lang === 'en'
      ? {
          shareTitleTgt: 'The True Game of the Year',
          shareTitleMercado: 'My TGA Nominees Verdict',
          toastCopiadoTexto: '✓ Text & link copied to clipboard!',
          toastFalhaTexto: '! Could not copy text automatically.',
          toastErroImagem: 'Could not generate image. Try again.',
          toastProntoRede: '✓ Image ready! Text also copied so you can paste.',
          toastProntoInstagram: '✓ Story saved & caption copied for Instagram!',
        }
      : lang === 'es'
        ? {
            shareTitleTgt: 'El Verdadero Game of the Year',
            shareTitleMercado: 'Mi Veredicto en Nominados TGA',
            toastCopiadoTexto: '✓ ¡Texto y enlace copiados al portapapeles!',
            toastFalhaTexto: '! No se pudo copiar el texto automáticamente.',
            toastErroImagem: 'No se pudo generar la imagen. Inténtalo de nuevo.',
            toastProntoRede: '✓ ¡Imagen lista! También copiamos el texto para pegar.',
            toastProntoInstagram: '✓ ¡Story guardada y mensaje copiado para Instagram!',
          }
        : {
            shareTitleTgt: 'O Verdadeiro Game of the Year',
            shareTitleMercado: 'Meu Veredito nos Indicados do TGA',
            toastCopiadoTexto: '✓ Texto e link copiados!',
            toastFalhaTexto: '! Não foi possível copiar o texto automaticamente.',
            toastErroImagem: 'Não foi possível gerar a imagem. Tente novamente.',
            toastProntoRede: '✓ Imagem pronta! Também copiamos o texto para colar.',
            toastProntoInstagram: '✓ Story salvo e legenda copiada para o Instagram!',
          };

  useEffect(() => {
    const atualizarEscala = () => {
      const larguraJanela = document.documentElement.clientWidth || window.innerWidth;
      const larguraDisponivel = Math.max(240, larguraJanela - 32);
      const alturaDisponivel = Math.max(400, window.innerHeight - 150);
      const escalaPorLargura = larguraDisponivel / 1080;
      const escalaPorAltura = alturaDisponivel / 1920;

      const escalaDesejada =
        larguraJanela >= 900
          ? Math.min(0.42, Math.max(0.32, escalaPorAltura))
          : Math.min(0.32, escalaPorLargura);

      setPreviewScale(Math.max(0.22, Math.min(escalaDesejada, escalaPorLargura)));
    };

    atualizarEscala();
    window.addEventListener('resize', atualizarEscala);
    return () => window.removeEventListener('resize', atualizarEscala);
  }, []);

  useEffect(() => {
    const rankingSalvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    if (!rankingSalvo) {
      router.replace('/votar');
      return;
    }

    try {
      const parsed = JSON.parse(rankingSalvo);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        router.replace('/votar');
        return;
      }

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
      setVerificado(true);
    } catch (e) {
      console.error('Erro ao ler ranking', e);
      router.replace('/votar');
    }
  }, [categoria, router]);

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

  useEffect(() => {
    if (!verificado || top3.length === 0) return;
    const timer = setTimeout(() => {
      gerarImagemStory(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [verificado, top3, categoria, lang, gerarImagemStory]);

  const mostrarToast = (mensagem: string, mostrarBotaoTexto = false, duracao = 5500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ mensagem, mostrarBotaoTexto });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, duracao);
  };

  const copiarTextoELink = async () => {
    try {
      await navigator.clipboard.writeText(getTextoCompartilhamento(top3, categoria, lang));
      mostrarToast(feedbackText.toastCopiadoTexto, false, 3500);
    } catch {
      mostrarToast(feedbackText.toastFalhaTexto, false, 3500);
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
    salvarBlobComoArquivo(blob, nomeArquivo);
    return 'baixado';
  };

  const compartilharPrincipal = async () => {
    setIsGenerating(true);
    const blob = await gerarImagemStory(true);

    if (!blob) {
      mostrarToast(feedbackText.toastErroImagem);
      setIsGenerating(false);
      return;
    }

    const texto = getTextoCompartilhamento(top3, categoria, lang);
    const file = new File([blob], nomeArquivo, { type: 'image/png' });

    if (
      isDispositivoMobile() &&
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: isTgt ? feedbackText.shareTitleTgt : feedbackText.shareTitleMercado,
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

    salvarBlobComoArquivo(blob, nomeArquivo);
    await copiarImagemParaClipboard(blob);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // ignora falha de clipboard
    }
    mostrarToast(feedbackText.toastProntoRede, true, 7500);
    setIsGenerating(false);
  };

  const compartilharRede = async (rede: RedeSocial) => {
    setIsGenerating(true);
    const texto = getTextoCompartilhamento(top3, categoria, lang);
    const blob = await gerarImagemStory(true);

    if (!blob) {
      mostrarToast(feedbackText.toastErroImagem);
      setIsGenerating(false);
      return;
    }

    const file = new File([blob], nomeArquivo, { type: 'image/png' });

    if (
      isDispositivoMobile() &&
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: isTgt ? feedbackText.shareTitleTgt : feedbackText.shareTitleMercado,
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

    if (rede === 'instagram') {
      salvarBlobComoArquivo(blob, nomeArquivo);
      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        // ignora falha de clipboard
      }
      mostrarToast(feedbackText.toastProntoInstagram, false, 7000);
      setIsGenerating(false);
      return;
    }

    if (rede === 'discord') {
      await copiarImagemOuBaixar(blob);
      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        // ignora falha de clipboard
      }
      window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');
      mostrarToast(feedbackText.toastProntoRede, true, 8000);
      setIsGenerating(false);
      return;
    }

    await copiarImagemOuBaixar(blob);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // ignora falha de clipboard
    }

    let intentUrl = '';
    if (rede === 'whatsapp') {
      intentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    } else if (rede === 'x') {
      intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`;
    } else if (rede === 'reddit') {
      const tituloReddit = getTituloReddit(top3, categoria, lang);
      intentUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(tituloReddit)}&text=${encodeURIComponent(texto)}`;
    }

    if (intentUrl) {
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    }

    mostrarToast(feedbackText.toastProntoRede, true, 8000);
    setIsGenerating(false);
  };

  if (!verificado) {
    return (
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: corPrincipal,
          fontFamily: 'var(--font-teko)',
          fontSize: '1.5rem',
          letterSpacing: '2px',
        }}
      >
        {t.rank_carregando}
      </main>
    );
  }

  const previewWidth = Math.round(1080 * previewScale);
  const previewHeight = Math.round(1920 * previewScale);

  return (
    <main className="obrigado-main">
      <style>{`
        .obrigado-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100dvh;
          padding: 96px 1rem 3rem;
          background-color: transparent;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .obrigado-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          max-width: 1120px;
          box-sizing: border-box;
        }
        .obrigado-actions-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        @media (min-width: 900px) {
          .obrigado-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 3.5rem;
            align-items: center;
            justify-items: center;
          }
        }
      `}</style>

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
        <StoryExportCard ref={exportRef} top3={top3} categoria={categoria} />
      </div>

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
                >
                  {t.obrigado_copiar_texto}
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
        className="obrigado-grid"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ position: 'relative', width: `${previewWidth}px`, height: `${previewHeight}px` }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-24px',
                background: isTgt
                  ? 'radial-gradient(ellipse at 50% 44%, rgba(176, 38, 255, 0.52) 0%, rgba(212, 175, 55, 0.32) 38%, rgba(5, 5, 8, 0) 72%)'
                  : 'radial-gradient(ellipse at 50% 44%, rgba(212, 175, 55, 0.56) 0%, rgba(244, 208, 111, 0.24) 38%, rgba(5, 5, 8, 0) 72%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: `${previewWidth}px`,
                height: `${previewHeight}px`,
                overflow: 'hidden',
                borderRadius: '0px',
                border: `1px solid ${corOuro}`,
                boxShadow: isTgt
                  ? '0 0 46px rgba(176, 38, 255, 0.36), 0 0 24px rgba(212, 175, 55, 0.28), 0 28px 65px rgba(0, 0, 0, 0.92)'
                  : '0 0 46px rgba(212, 175, 55, 0.42), 0 0 24px rgba(244, 208, 111, 0.24), 0 28px 65px rgba(0, 0, 0, 0.92)',
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
                <StoryExportCard top3={top3} categoria={categoria} />
              </div>
            </div>
          </div>
        </div>

        <div className="obrigado-actions-col">
          <div
            style={{
              color: corPrincipal,
              fontSize: '0.82rem',
              fontWeight: 900,
              letterSpacing: '2.5px',
              marginBottom: '0.6rem',
              fontFamily: 'var(--font-teko)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {isTgt ? t.rank_arena_tgt : t.rank_arena_mercado}
          </div>

          <h1
            style={{
              color: '#FFF',
              fontSize: 'clamp(2.2rem, 6.5vw, 3.3rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-teko)',
              textTransform: 'uppercase',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.05,
              textAlign: 'center',
              width: '100%',
            }}
          >
            <span className="title-shine">{t.obrigado_titulo}</span>
          </h1>

          <p
            style={{
              color: '#D1D5DB',
              fontSize: '0.95rem',
              marginBottom: '2rem',
              lineHeight: 1.5,
              maxWidth: '420px',
              textAlign: 'center',
            }}
          >
            {t.obrigado_sub}
          </p>

          <button
            type="button"
            onClick={compartilharPrincipal}
            disabled={isGenerating}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.15rem 1.4rem',
              fontSize: '1.15rem',
              background: isTgt
                ? 'linear-gradient(90deg, #4C1D95 0%, #7e22ce 50%, #9333EA 85%, #8B6508 100%)'
                : 'linear-gradient(90deg, #8B6508 0%, #B8860B 45%, #D4AF37 100%)',
              color: isTgt ? '#FFF' : '#0A0A0A',
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
              textShadow: isTgt ? '0 1px 3px rgba(0,0,0,0.8)' : 'none',
              lineHeight: 1.1,
              boxSizing: 'border-box',
            }}
          >
            <IconShare />
            <span>{t.obrigado_btn_compartilhar}</span>
          </button>

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
              marginTop: '0.5rem',
            }}
          >
            {t.rank_global_tab} <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}