// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageProvider';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  // Fecha o dropdown de idioma ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha o menu gaveta e o seletor sempre que mudar de página
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Trava a rolagem do fundo enquanto o menu mobile estiver aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Fecha o menu gaveta se a tela crescer para desktop ou apertar ESC
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLangOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: t.nav_inicio, path: '/' },
    { name: t.nav_votar, path: '/votar', isVotar: true },
    { name: t.nav_goty, path: '/resultados' },
    { name: t.nav_indicados, path: '/indicados' },
    { name: t.nav_metodo, path: '/metodo' },
    { name: 'HISTÓRIA', path: '/historia' },
    { name: t.nav_sobre, path: '/sobre' },
  ];

  const flagAtual = lang === 'pt' ? 'br' : lang === 'en' ? 'us' : 'es';
  const labelAtual = lang === 'pt' ? 'PT-BR' : lang === 'en' ? 'EN' : 'ES';

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* ESQUERDA: LOGO TGT */}
          <Link
            href="/"
            className={styles.logoLink}
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/logo-tgt.png"
              alt="TGT - True GOTY"
              className={styles.logoImg}
            />
          </Link>

          {/* CENTRO: NAVEGAÇÃO DESKTOP */}
          <nav className={styles.desktopNav} aria-label="Navegação principal">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              const classes = [
                styles.desktopNavLink,
                link.isVotar ? styles.desktopNavLinkVotar : '',
                active ? styles.desktopNavLinkActive : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <Link key={link.path} href={link.path} className={classes}>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* DIREITA: IDIOMA + CONTATO (DESKTOP) + HAMBÚRGUER (MOBILE) */}
          <div className={styles.rightActions}>
            <div className={styles.langWrapper} ref={dropdownRef}>
              <button
                type="button"
                className={styles.langButton}
                aria-label="Selecionar idioma"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((prev) => !prev)}
              >
                <img
                  src={`https://flagcdn.com/${flagAtual}.svg`}
                  width="18"
                  alt={labelAtual}
                  className={styles.flagIcon}
                />
                <span>{labelAtual}</span>
              </button>

              {langOpen && (
                <div className={styles.langDropdown}>
                  <button
                    type="button"
                    className={styles.langOption}
                    onClick={() => {
                      setLang('pt');
                      setLangOpen(false);
                    }}
                  >
                    <img src="https://flagcdn.com/br.svg" width="18" alt="BR" className={styles.flagIcon} />
                    <img src="https://flagcdn.com/pt.svg" width="18" alt="PT" className={styles.flagIcon} />
                    <span className={styles.langOptionLabel}>Português</span>
                  </button>
                  <button
                    type="button"
                    className={styles.langOption}
                    onClick={() => {
                      setLang('en');
                      setLangOpen(false);
                    }}
                  >
                    <img src="https://flagcdn.com/us.svg" width="18" alt="US" className={styles.flagIcon} />
                    <img src="https://flagcdn.com/gb.svg" width="18" alt="GB" className={styles.flagIcon} />
                    <span className={styles.langOptionLabel}>English</span>
                  </button>
                  <button
                    type="button"
                    className={styles.langOption}
                    onClick={() => {
                      setLang('es');
                      setLangOpen(false);
                    }}
                  >
                    <img src="https://flagcdn.com/es.svg" width="18" alt="ES" className={styles.flagIcon} />
                    <span className={styles.langOptionLabel}>Español</span>
                  </button>
                </div>
              )}
            </div>

            <Link href="/contato" className={styles.desktopContactBtn}>
              {t.nav_contato}
            </Link>

            <button
              type="button"
              className={`${styles.hamburgerBtn} ${menuOpen ? styles.hamburgerBtnOpen : ''}`}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => {
                setLangOpen(false);
                setMenuOpen((prev) => !prev);
              }}
            >
              <span className={`${styles.hamburgerLine} ${styles.hamburgerLineTop}`} />
              <span className={`${styles.hamburgerLine} ${styles.hamburgerLineMiddle}`} />
              <span className={`${styles.hamburgerLine} ${styles.hamburgerLineBottom}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MENU GAVETA MOBILE */}
      {menuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-label="Menu de navegação">
          <nav className={styles.mobileNavList}>
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              const classes = [
                styles.mobileNavLink,
                link.isVotar ? styles.mobileNavLinkVotar : '',
                active ? styles.mobileNavLinkActive : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={classes}
                >
                  <span>{link.name}</span>
                  {active && <span className={styles.activeDot} />}
                </Link>
              );
            })}
          </nav>

          <div className={styles.mobileDrawerFooter}>
            <Link
              href="/contato"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileContactBtn}
            >
              {t.nav_contato}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}