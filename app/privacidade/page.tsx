// app/privacidade/page.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider';

export default function Privacidade() {
  const { t, lang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <main style={{ padding: '6rem 2rem', color: 'var(--text-light)', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
        {t.priv_titulo}
      </h1>
      
      <div style={{ color: '#a1a1aa', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>{t.priv_p1}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.priv_h2_1}</h2>
        <p>{t.priv_p2}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.priv_h2_2}</h2>
        <p>{t.priv_p3}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.priv_h2_3}</h2>
        <p>{t.priv_p4}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>
          {isEn ? 'Google AdSense & Third-Party Cookies' : 'Google AdSense e Cookies de Publicidade'}
        </h2>
        <p>
          {isEn
            ? 'True GOTY (truegoty.com) uses Google AdSense to display advertisements and sustain the platform independently. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the internet.'
            : 'O True GOTY (truegoty.com) utiliza o Google AdSense para exibir anúncios e manter a plataforma funcionando de forma independente. Fornecedores terceiros, incluindo o Google, utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário a este site ou a outros sites na internet.'}
        </p>
        <p>
          {isEn ? (
            <>
              Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to truegoty.com and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--purple-neon)', textDecoration: 'underline' }}
              >
                Google Ads Settings
              </a>
              .
            </>
          ) : (
            <>
              O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios aos usuários com base nas visitas feitas ao truegoty.com e/ou a outros sites na internet. Você pode desativar a publicidade personalizada a qualquer momento acessando as{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--purple-neon)', textDecoration: 'underline' }}
              >
                Configurações de Anúncios do Google
              </a>
              .
            </>
          )}
        </p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>
          {isEn ? 'Security, Anti-Bot Protection & Contact' : 'Segurança, Proteção Contra Bots e Contato'}
        </h2>
        <p>
          {isEn
            ? 'To preserve the integrity of community voting, truegoty.com uses Cloudflare Turnstile and anonymized cryptographic session hashes to prevent automated spam without storing personally identifiable profiles. For privacy inquiries, contact us at truegoty.tgt@gmail.com.'
            : 'Para preservar a integridade da votação da comunidade, o truegoty.com utiliza Cloudflare Turnstile e hashes criptográficos anonimizados de sessão para impedir votos automatizados, sem armazenar perfis pessoais identificáveis. Para dúvidas sobre privacidade, entre em contato pelo e-mail truegoty.tgt@gmail.com.'}
        </p>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" style={{ color: 'var(--purple-neon)', textDecoration: 'none', fontWeight: 'bold' }}>
            {t.priv_voltar}
          </Link>
        </div>
      </div>
    </main>
  );
}