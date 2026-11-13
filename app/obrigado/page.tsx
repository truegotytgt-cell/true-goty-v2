// app/obrigado/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import jogosData from '../../lib/jogos.json';

export default function Obrigado() {
  const [urlImagem, setUrlImagem] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') || 'tgt';

  useEffect(() => {
    const salvo = localStorage.getItem(`tgt_my_ranking_${categoria}`);
    if (salvo) {
      const placar = JSON.parse(salvo);
      if (placar.length >= 3) {
        const jogos = jogosData.top10;
        const img1 = jogos.find(j => j.titulo === placar[0].titulo)?.imagem || '';
        const img2 = jogos.find(j => j.titulo === placar[1].titulo)?.imagem || '';
        const img3 = jogos.find(j => j.titulo === placar[2].titulo)?.imagem || '';

        const url = `/api/og?t1=${encodeURIComponent(placar[0].titulo)}&i1=${encodeURIComponent(img1)}&t2=${encodeURIComponent(placar[1].titulo)}&i2=${encodeURIComponent(img2)}&t3=${encodeURIComponent(placar[2].titulo)}&i3=${encodeURIComponent(img3)}`;
        setUrlImagem(url);
      }
    }
  }, [categoria]);

  // Funções de compartilhamento
  const shareText = encodeURIComponent(`Meu Top 3 no True GOTY: ${localStorage.getItem(`tgt_my_ranking_${categoria}`) ? JSON.parse(localStorage.getItem(`tgt_my_ranking_${categoria}`) as string).slice(0,3).map((j:any)=>j.titulo).join(', ') : ''}. Faça o seu em truegoty.com`);
  
  const shareWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');

  async function resetarTudo() {
    if (!confirm("Deseja apagar seu voto e começar do zero?")) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      localStorage.removeItem(`tgt_has_voted_${categoria}`);
      localStorage.removeItem(`tgt_my_ranking_${categoria}`);
      localStorage.removeItem(`tgt_progress_${categoria}`);
      router.push(`/votar/${categoria}`);
    } catch (error) {
      alert("Erro ao resetar. Tente limpar os cookies do navegador.");
    }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', textAlign: 'center', padding: '2rem' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 1, type: "spring", bounce: 0.3 }} // Animação de entrada com mola
        style={{ 
          backgroundColor: 'rgba(15, 15, 20, 0.7)', backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '30px', 
          padding: '4rem 3rem', maxWidth: '750px', width: '100%',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(212, 175, 55, 0.05)'
        }}
      >
        <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))' }}>
          🏆
        </div>

        <h1 style={{ fontSize: '3rem', color: '#FFF', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-1px' }}>
          SEU VEREDITO ESTÁ NA HISTÓRIA!
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          Sua voz ajudou a moldar o <strong style={{ color: '#D4AF37' }}>Placar Global da categoria {categoria.toUpperCase()}</strong>.<br/>
          Agora, mostre ao mundo qual jogo realmente merece o título.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          
          {urlImagem && (
            <motion.a 
              whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(212, 175, 55, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              href={urlImagem} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                width: '100%', background: 'linear-gradient(to right, #B026FF, #D4AF37)', color: '#FFF', 
                padding: '1.2rem', fontSize: '1.2rem', fontWeight: 900, borderRadius: '50px', 
                textDecoration: 'none', boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)', 
                border: '1px solid rgba(255,255,255,0.3)', letterSpacing: '1px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
              }}
            >
              📲 BAIXAR IMAGEM DO TOP 3
            </motion.a>
          )}

          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button onClick={shareWhatsApp} style={{ 
              backgroundColor: 'rgba(37, 211, 102, 0.1)', color: '#25D366', padding: '0.8rem 1.5rem', 
              fontSize: '0.95rem', fontWeight: 'bold', border: '1px solid rgba(37, 211, 102, 0.3)', 
              borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.2)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.1)'}>
              <span>WhatsApp</span>
            </button>
            
            <button onClick={shareTwitter} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#FFF', padding: '0.8rem 1.5rem', 
              fontSize: '0.95rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', 
              borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}>
              <span>Postar no X</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', width: '100%', justifyContent: 'center' }}>
             <Link href={`/meu-ranking?categoria=${categoria}`} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
              Ver Meu Ranking
            </Link>
            <Link href="/ranking" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
              Ver Placar Global
            </Link>
          </div>

        </div>

        <div style={{ marginTop: '3rem' }}>
          <button onClick={resetarTudo} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', opacity: 0.5 }}>
            Apagar voto e votar novamente (Teste)
          </button>
        </div>
      </motion.div>
    </main>
  );
}