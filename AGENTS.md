# True GOTY (TGT) — Guia para IAs

## 1. Regras de Ouro de Trabalho
- O criador do projeto não é programador: use linguagem simples, didática e passo a passo no VS Code.
- SEMPRE peça para colar o código atual do arquivo antes de propor alterações (nunca assuma que o GitHub ou o mapa está 100% atualizado).
- NUNCA envie apenas trechos de código: devolva sempre o ARQUIVO INTEIRO pronto para substituir.
- Foco em entretenimento e visual premium, sem overengineering.

## 2. Stack e Restrições Críticas
- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Deploy e Banco:** Cloudflare Workers (`@opennextjs/cloudflare`) + Cloudflare D1 (`schema.sql`).
- **Animações:** Framer Motion.
- **ESTILIZAÇÃO (PROIBIDO TAILWIND):** Não usamos Tailwind CSS. Use apenas CSS puro (`app/globals.css`), CSS Modules ou estilos inline (`style={{...}}`).

## 3. Design System (`app/globals.css`)
- **Variáveis `:root`:**
  - `--bg-black: #0A0A0A` (fundo principal)
  - `--bg-gray: #1C1C1E` (superfícies/cards)
  - `--purple-neon: #a855f7` (destaque roxo)
  - `--border-color: #333333` (bordas)
  - `--text-light: #F4F4F0` (texto principal)
  - `--text-muted: #D1D5DB` (texto secundário)
- **Cores de destaque adicionais:** Dourado `#D4AF37` (categoria Mercado / detalhes) e Roxo Glow `#B026FF` (categoria Arena / brilhos).
- **Fontes:** `var(--font-inter)` no corpo e `var(--font-teko)` (uppercase) em `h1, h2, h3` e `.font-arena`.
- **Classes globais prontas:** `.title-shine` (texto com brilho animado), `.btn-arena` (botão roxo chanfrado), `.btn-mercado` (botão dourado chanfrado), `.hud-placar` e `.hud-placar-inner` (caixa chanfrada de placar).

## 4. Arquitetura Essencial
- **Categorias:** `tgt` e `mercado`, definidas em `lib/jogos.json`.
- **Votação Condorcet (1v1):** Lógica em `lib/condorcet.ts` e progresso local em `lib/useVotingProgress.ts`.
- **Banco D1 (`schema.sql`):** Tabelas `results` e `pairwise_results` acessadas via `lib/db.ts`.
- **Idiomas:** `pt`, `en` e `es` via `components/LanguageProvider.tsx` e `lib/i18n.ts`.
- **Observação sobre `repomix-mapa.md`:** Gerado com `--compress`; se precisar de chaves exatas de tradução ou regras CSS detalhadas, peça para colar `lib/i18n.ts` ou `app/globals.css`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->