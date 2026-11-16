// app/obrigado/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calcularPlacar, Jogo } from '../../lib/condorcet';
import jogosData from '../../lib/jogos.json';

// --- ÍCONES SVG ---
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const IconReddit = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
// ------------------

export default function Obrigado() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoria = searchParams.get('categoria') || 'tgt';
  
  const [ranking, setRanking] = useState<any[] | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [resetando, setResetando] = useState(false);

  const jogosDaCategoria = (jogosData as any)[categoria]?.top10 || [];

  useEffect(() => {
    let rankingSalvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    
    if (!rankingSalvo) {
      const progressoSalvo = localStorage.getItem(`tgt_progress_${categoria}`);
      if (progressoSalvo) {
        try {
          const parsed = JSON.parse(progressoSalvo);
          if (parsed.votos && parsed.votos.length > 0) {
            const placarCalculado = calcularPlacar(jogosDaCategoria as Jogo[], parsed.votos);
            rankingSalvo = JSON.stringify(placarCalculado);
            localStorage.setItem(`tgt_my_ranking_${categoria}`, rankingSalvo);
          }
        } catch (e) {}
      }
    }

    if (rankingSalvo) {
      try {
        setRanking(JSON.parse(rankingSalvo));
      } catch (e) {}
    }
    setCarregado(true);
  }, [categoria, jogosDaCategoria]);

  async function resetarVotos() {
    if (!confirm("Tem certeza que deseja apagar seus votos para testar novamente?")) return;
    
    setResetando(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      
      localStorage.removeItem(`tgt_progress_${categoria}`);
      localStorage.removeItem(`tgt_my_ranking_${categoria}`);
      localStorage.removeItem(`tgt_has_voted_${categoria}`);
      
      router.push(`/votar/${categoria}`);
    } catch (e) {
      alert("Erro ao resetar. Tente limpar o cache do navegador.");
      setResetando(false);
    }
  }

  if (!carregado) {
    return <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--purple-neon)' }}>Carregando...</main>;
  }

  if (!ranking || ranking.length === 0) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '2rem', textAlign: 'center', padding: '1rem' }}>
        <h1 style={{ color: 'var(--purple-neon)', fontSize: '2rem' }}>Ops! Não encontramos seu voto.</h1>
        <p style={{ color: '#a1a1aa' }}>Parece que a verificação de segurança falhou ou você acessou esta página diretamente.</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/votar/${categoria}`} style={{ backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Voltar para a Votação
          </Link>
          <button onClick={resetarVotos} disabled={resetando} style={{ backgroundColor: 'transparent', border: '1px solid #a1a1aa', color: '#a1a1aa', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {resetando ? 'Limpando...' : 'Forçar Reset'}
          </button>
        </div>
      </main>
    );
  }

  const t1 = ranking[0]?.titulo || '';
  const t2 = ranking[1]?.titulo || '';
  const t3 = ranking[2]?.titulo || '';

  const getImagem = (titulo: string) => jogosDaCategoria.find((j: any) => j.titulo === titulo)?.imagem || '';
  const i1 = getImagem(t1);
  const i2 = getImagem(t2);
  const i3 = getImagem(t3);

  // URL da imagem VERTICAL (para download e Instagram)
  const ogImageVerticalUrl = `/api/og-story?t1=${encodeURIComponent(t1)}&i1=${encodeURIComponent(i1)}&t2=${encodeURIComponent(t2)}&i2=${encodeURIComponent(i2)}&t3=${encodeURIComponent(t3)}&i3=${encodeURIComponent(i3)}`;
  
  // A MÁGICA PARA AS REDES SOCIAIS ACONTECE AQUI:
  // Montamos a URL absoluta COM os parâmetros para o robô do WhatsApp/X conseguir gerar a imagem certa.
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://truegoty.com';
  const urlCompartilhar = `${baseUrl}/obrigado?categoria=${categoria}&t1=${encodeURIComponent(t1)}&i1=${encodeURIComponent(i1)}&t2=${encodeURIComponent(t2)}&i2=${encodeURIComponent(i2)}&t3=${encodeURIComponent(t3)}&i3=${encodeURIComponent(i3)}`;

  const textoX = `O júri da internet decidiu. Meu Top 3 do True GOTY está pronto:\n1º ${t1}\n2º ${t2}\n3º ${t3}\n\nConcorda ou vai chorar? Faça o seu em truegoty.com`;
  const textoWhats = `Meu Top 3 no True GOTY (${categoria.toUpperCase()}):\n1º ${t1}\n2º ${t2}\n3º ${t3}\n\nFaça o seu em truegoty.com!`;
  const textoReddit = `Meu Top 3 no True GOTY: 1º ${t1}, 2º ${t2}, 3º ${t3}. Faça o seu em truegoty.com!`;

  const compartilharNativo = async () => {
    try {
      const response = await fetch(ogImageVerticalUrl);
      const blob = await response.blob();
      const file = new File([blob], `meu-top3-${categoria}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meu True GOTY',
          text: textoWhats,
        });
      } else {
        alert('Seu navegador não suporta compartilhamento direto. Baixe a imagem e poste no Instagram!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, x: -20, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '6rem 1rem 2rem', textAlign: 'center', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(26, 26, 36, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)', overflow: 'hidden' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ backgroundColor: 'rgba(20, 20, 20, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '24px', padding: '3rem 2rem', maxWidth: '600px', width: '100%', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(212, 175, 55, 0.1)', position: 'relative' }}
      >
        
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))' }}>
          🏆
        </motion.div>
        
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.1, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
          SEU VEREDITO ESTÁ NA HISTÓRIA!
        </h1>
        
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          Sua voz ajudou a moldar o Placar Global da categoria <strong style={{ color: 'var(--purple-neon)' }}>{categoria.toUpperCase()}</strong>.
          <br/>Agora, mostre ao mundo quem realmente merece o título.
        </p>

        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2.5rem', textAlign: 'left', maxHeight: '380px', overflowY: 'auto', paddingRight: '10px', scrollbarWidth: 'thin', scrollbarColor: '#333 #121212' }}>
          {ranking.map((item, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;
            
            const borderColor = isTop1 ? '#D4AF37' : isTop2 ? '#E2E8F0' : isTop3 ? '#CD7F32' : '#222';
            const bgColor = isTop1 ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(18,18,18,0.5) 100%)' : 'rgba(18,18,18,0.5)';
            const textColor = isTop1 ? '#D4AF37' : isTop2 ? '#E2E8F0' : isTop3 ? '#CD7F32' : '#a1a1aa';

            return (
              <motion.div key={item.titulo} variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: bgColor, borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: isTop1 ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none', transform: isTop1 ? 'scale(1.02)' : 'scale(1)' }}>
                <span style={{ color: textColor, fontWeight: 'bold', fontSize: isTop1 ? '1.1rem' : '1rem' }}>{index + 1}º {item.titulo}</span>
                <span style={{ color: textColor, fontWeight: isTop1 ? '900' : 'normal' }}>{item.pontos} PTS</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href={ogImageVerticalUrl} download={`meu-top3-${categoria}.png`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'linear-gradient(90deg, #B026FF 0%, #D4AF37 100%)', color: '#000', padding: '1.2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span>⬇️</span> Baixar Meu True GOTY
        </motion.a>

        {/* BOTÕES COM URL CORRIGIDA */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={`https://api.whatsapp.com/send?text=${encodeURIComponent(textoWhats + ' ' + urlCompartilhar)}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', color: '#25D366', borderRadius: '50%', textDecoration: 'none' }}>
            <IconWhatsApp />
          </motion.a>
          
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(textoX)}&url=${encodeURIComponent(urlCompartilhar)}`} target="_blank" rel="noopener noreferrer" title="Postar no X" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #FFF', color: '#FFF', borderRadius: '50%', textDecoration: 'none' }}>
            <IconX />
          </motion.a>

          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={`https://www.reddit.com/submit?url=${encodeURIComponent(urlCompartilhar)}&title=${encodeURIComponent(textoReddit)}`} target="_blank" rel="noopener noreferrer" title="Postar no Reddit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: 'rgba(255, 69, 0, 0.1)', border: '1px solid #FF4500', color: '#FF4500', borderRadius: '50%', textDecoration: 'none' }}>
            <IconReddit />
          </motion.a>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={compartilharNativo} title="Compartilhar (Instagram/Stories)" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: 'rgba(225, 48, 108, 0.1)', border: '1px solid #E1306C', color: '#E1306C', borderRadius: '50%', cursor: 'pointer' }}>
            <IconInstagram />
          </motion.button>
        </div>

        <button onClick={resetarVotos} disabled={resetando} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: resetando ? 'not-allowed' : 'pointer', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#a1a1aa'} onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
          {resetando ? 'Apagando...' : 'Apagar meus votos e testar novamente'}
        </button>

      </motion.div>
    </main>
  );
}