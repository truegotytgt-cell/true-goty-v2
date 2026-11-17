// app/votar/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VotarSelecao() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ color: 'var(--text-light)', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
          QUAL É O SEU <span style={{ color: 'var(--purple-neon)' }}>VERDADEIRO GOTY?</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px' }}>
          Escolha o campo de batalha. Você pode votar no nosso torneio oficial ou no comparativo com a premiação do mercado.
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
        
        <Link href="/votar/tgt" style={{ textDecoration: 'none', flex: 1, minWidth: '300px' }}>
          <motion.div whileHover={{ scale: 1.03, y: -5 }} style={{ 
            backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(176, 38, 255, 0.3)', borderRadius: '24px', padding: '3rem 2rem', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem'
          }}>
            <span style={{ fontSize: '4rem' }}>🏆</span>
            <h2 style={{ color: 'var(--purple-neon)', fontSize: '2rem', fontWeight: 900, margin: 0 }}>TRUE GOTY</h2>
            <p style={{ color: '#a1a1aa', margin: 0 }}>O torneio oficial da comunidade para eleger o melhor jogo do ano.</p>
            <span style={{ marginTop: '1rem', backgroundColor: 'var(--purple-neon)', color: '#FFF', padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold' }}>Iniciar Votação</span>
          </motion.div>
        </Link>

        <Link href="/votar/mercado" style={{ textDecoration: 'none', flex: 1, minWidth: '300px' }}>
          <motion.div whileHover={{ scale: 1.03, y: -5 }} style={{ 
            backgroundColor: 'rgba(28, 28, 30, 0.6)', backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '24px', padding: '3rem 2rem', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem'
          }}>
            <span style={{ fontSize: '4rem' }}>🏬</span>
            <h2 style={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 900, margin: 0 }}>MERCADO</h2>
            <p style={{ color: '#a1a1aa', margin: 0 }}>O comparativo de indicados com o The Game Awards.</p>
            <span style={{ marginTop: '1rem', backgroundColor: '#D4AF37', color: '#000', padding: '0.8rem 2rem', borderRadius: '50px', fontWeight: 'bold' }}>Iniciar Votação</span>
          </motion.div>
        </Link>

      </div>
    </main>
  );
}