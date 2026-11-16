-- schema.reset.sql
--
-- ⚠️  ATENÇÃO: ESTE ARQUIVO APAGA TODOS OS DADOS DO BANCO. ⚠️
--
-- Use SOMENTE em desenvolvimento local. NUNCA rode este arquivo contra
-- o banco de produção do Cloudflare.
--
-- Como usar:
--   1) npx wrangler d1 execute true-goty-db --local --file=schema.reset.sql
--   2) npx wrangler d1 execute true-goty-db --local --file=schema.sql
--
-- (A ordem importa: reset primeiro, schema depois.)

DROP TABLE IF EXISTS battles;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS pairwise_results;