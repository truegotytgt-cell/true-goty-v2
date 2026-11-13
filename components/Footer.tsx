// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '2rem 1rem',
      backgroundColor: 'var(--bg-color)',
      borderTop: '1px solid #222',
      textAlign: 'center',
      marginTop: 'auto', // Empurra o footer para o final da página
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem' }}>
        <Link href="/termos" style={{ color: 'var(--purple-neon)', textDecoration: 'none' }}>
          Termos de Uso
        </Link>
        <span style={{ color: '#333' }}>|</span>
        <Link href="/privacidade" style={{ color: 'var(--purple-neon)', textDecoration: 'none' }}>
          Política de Privacidade
        </Link>
      </div>
      <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>
        © 2026 TGT - True GOTY. Todos os direitos reservados. Projeto não oficial sem vínculo com as premiações do mercado.
      </p>
    </footer>
  );
}