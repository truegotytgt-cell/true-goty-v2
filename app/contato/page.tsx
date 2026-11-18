// app/contato/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../components/LanguageProvider';

// Ícone de Antena de Transmissão (SVG)
const IconAntenna = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--purple-neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20v-8"/>
    <path d="M6 10a8 8 0 0 1 12 0"/>
    <path d="M4 6a12 12 0 0 1 16 0"/>
    <path d="M12 20h.01"/>
    <path d="M10 20h4"/>
  </svg>
);

export default function Contato() {
  const [copiado, setCopiado] = useState(false);
  const email = "truegoty.tgt@gmail.com";
  const { t } = useLanguage();

  const copiarEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    });
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '140px 2rem 4rem', backgroundColor: 'transparent' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ 
          backgroundColor: 'rgba(20, 20, 22, 0.85)', backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(176, 38, 255, 0.2)', padding: '3.5rem 2.5rem',
          textAlign: 'center', maxWidth: '650px', width: '100%',
          borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          position: 'relative'
        }}
      >
        {/* Ícone */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <IconAntenna />
        </div>

        {/* Selo Superior */}
        <div style={{ color: 'var(--purple-neon)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>
          [ CENTRAL DE COMUNICAÇÃO • {t.nav_contato} ]
        </div>

        {/* Título com escala ampliada */}
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#F4F4F0', marginBottom: '1rem', lineHeight: 1, fontFamily: 'var(--font-teko)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {t.contato_titulo}
        </h1>
        
        {/* Subtítulo */}
        <p style={{ color: '#D1D5DB', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
          {t.contato_sub}
        </p>

        {/* Tags de Assunto */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>[ IMPRENSA ]</span>
          <span style={{ color: '#71717a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>•</span>
          <span style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>[ PARCERIAS ]</span>
          <span style={{ color: '#71717a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>•</span>
          <span style={{ color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>[ FEEDBACK ]</span>
        </div>

        {/* Visor de E-mail (Invertido e com borda roxa) */}
        <div style={{ 
          backgroundColor: 'rgba(10, 10, 10, 0.6)', padding: '1.5rem', marginBottom: '2rem',
          border: '1px solid rgba(176, 38, 255, 0.4)', borderRadius: '12px', position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--purple-neon)', boxShadow: '0 0 10px var(--purple-neon)', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ color: 'var(--purple-neon)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>CANAL ATIVO</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', letterSpacing: '1px' }}>
            {email}
          </span>
        </div>

        {/* Botão de Copiar (Pílula Original) */}
        <button 
          onClick={copiarEmail}
          style={{ 
            width: '100%', maxWidth: '320px', padding: '1rem 2rem', fontSize: '1.1rem', margin: '0 auto', display: 'flex', justifyContent: 'center',
            backgroundColor: copiado ? '#D4AF37' : 'var(--purple-neon)', 
            color: copiado ? '#000' : '#FFF',
            borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 900,
            boxShadow: copiado ? '0 0 20px rgba(212, 175, 55, 0.4)' : '0 0 30px rgba(176, 38, 255, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          {copiado ? '✓ ENDEREÇO COPIADO' : t.contato_btn}
        </button>

        {/* Aviso Legal */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: '#71717a', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
            O TGT é um projeto independente de entretenimento. Não possui vínculo, afiliação ou apoio do TGA nem de outras premiações do mercado.
          </p>
        </div>

        {/* Link de Voltar */}
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#FFF'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>
            ← {t.contato_voltar}
          </Link>
        </div>

      </motion.div>
    </main>
  );
}