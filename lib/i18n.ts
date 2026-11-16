// lib/i18n.ts
export const translations = {
  pt: {
    nav_inicio: "INÍCIO", nav_metodo: "MÉTODO", nav_indicados: "INDICADOS", 
    nav_goty: "GOTY", nav_votar: "VOTAR", nav_sobre: "SOBRE", nav_contato: "CONTATO",
    home_eyebrow: "★ A Verdadeira Escolha da Comunidade",
    home_titulo1: "QUAL É O VERDADEIRO",
    home_titulo2: "GAME OF THE YEAR?",
    home_sub: "Escolhas frente a frente garantem que o jogo mais amado vença, sem empates. Sua voz importa: descubra qual título realmente marcou a comunidade.",
    home_btn_votar: "COMEÇAR A VOTAR",
    home_btn_mercado: "COMPARATIVO MERCADO (EM BREVE)",
    home_contador: "Jogadores já definiram seu veredito oficial",
    
    arena_titulo: "QUAL FOI O MELHOR?",
    arena_batalha: "BATALHA", arena_de: "DE",
    arena_dica_esq: "Pressione ← para escolher",
    arena_dica_dir: "Pressione → para escolher",
    arena_desfazer: "← Desfazer último voto",
    arena_final_titulo: "SUA SELEÇÃO FINAL",
    arena_final_sub: "O jogo mais amado da comunidade vai ser decidido pelos seus votos.",
    arena_final_btn: "CONFIRMAR MEU TRUE GOTY",

    rank_titulo: "SEU RANKING PESSOAL",
    rank_sub: "Este é o resultado dos seus votos.",
    rank_btn_global: "Ver Placar Global",
    rank_btn_inicio: "Voltar ao Início",

    contato_titulo: "FALE CONOSCO",
    contato_sub: "Tem alguma dúvida, sugestão ou quer anunciar no TGT? Estamos sempre abertos a parcerias, patrocínios e feedbacks da comunidade.",
    contato_btn: "COPIAR E-MAIL",
    contato_copiado: "E-MAIL COPIADO!",
    contato_voltar: "Voltar para o Início",

    // Footer
    footer_termos: "Termos de Uso",
    footer_privacidade: "Política de Privacidade",
    footer_direitos: "© 2026 TGT - True GOTY. Todos os direitos reservados. Projeto não oficial sem vínculo com as premiações do mercado.",

    // Termos
    termos_titulo: "Termos de Uso",
    termos_p1: "Bem-vindo ao True GOTY (TGT). Ao acessar e utilizar este site, você concorda com os termos descritos abaixo.",
    termos_h2_1: "1. Propósito do Site",
    termos_p2: "O TGT é uma plataforma de entretenimento comunitário criada para descobrir, através de votação popular (Método Condorcet), o jogo mais amado do ano. O site não possui vínculo oficial com as premiações reais do mercado (como o The Game Awards).",
    termos_h2_2: "2. Regras de Votação",
    termos_p3: "Para garantir a integridade da voz da comunidade, cada usuário pode votar apenas uma vez por categoria (TGT e Mercado). Utilizamos tecnologias de verificação (Cloudflare Turnstile) e anonimização de IP para evitar fraudes e bots.",
    termos_h2_3: "3. Conduta do Usuário",
    termos_p4: "É proibido tentar burlar o sistema de votação, usar scripts automatizados para votar em massa ou qualquer ação que comprometa a estabilidade do site.",
    termos_voltar: "← Voltar para a página inicial",

    // Privacidade
    priv_titulo: "Política de Privacidade",
    priv_p1: "No True GOTY, sua privacidade é levada a sério. Esta página explica de forma simples como lidamos com seus dados (ou a ausência deles).",
    priv_h2_1: "1. Não Coletamos Dados Pessoais",
    priv_p2: "Nós não pedimos e não armazenamos seu nome, e-mail, número de telefone ou qualquer dado que possa identificar quem você é.",
    priv_h2_2: "2. Como Evitamos Votos Duplicados",
    priv_p3: "Para impedir que uma mesma pessoa vote várias vezes, nós pegamos o endereço IP da sua conexão no momento do voto e o transformamos em um código embaralhado (Hash SHA-256 com um sal secreto). O seu IP real é descartado na mesma hora. Guardamos apenas esse código anônimo no banco de dados, sendo impossível reverter e descobrir quem é você.",
    priv_h2_3: "3. Armazenamento Local (Cookies)",
    priv_p4: "Utilizamos o armazenamento local (Local Storage) do seu próprio navegador apenas para salvar o progresso dos seus votos caso você feche a página no meio. Nenhum dado é enviado para terceiros.",
    priv_voltar: "← Voltar para a página inicial"
  },
  en: {
    nav_inicio: "HOME", nav_metodo: "METHOD", nav_indicados: "NOMINEES", 
    nav_goty: "GOTY", nav_votar: "VOTE", nav_sobre: "ABOUT", nav_contato: "CONTACT",
    home_eyebrow: "★ The Community's True Choice",
    home_titulo1: "WHAT IS THE TRUE",
    home_titulo2: "GAME OF THE YEAR?",
    home_sub: "Head-to-head choices ensure the most beloved game wins, without ties. Your voice matters: discover which title truly marked the community.",
    home_btn_votar: "START VOTING",
    home_btn_mercado: "MARKET COMPARISON (COMING SOON)",
    home_contador: "Players have already defined their official verdict",
    
    arena_titulo: "WHICH WAS BETTER?",
    arena_batalha: "MATCH", arena_de: "OF",
    arena_dica_esq: "Press ← to choose",
    arena_dica_dir: "Press → to choose",
    arena_desfazer: "← Undo last vote",
    arena_final_titulo: "YOUR FINAL SELECTION",
    arena_final_sub: "The community's most beloved game will be decided by your votes.",
    arena_final_btn: "CONFIRM MY TRUE GOTY",

    rank_titulo: "YOUR PERSONAL RANKING",
    rank_sub: "This is the result of your votes.",
    rank_btn_global: "View Global Scoreboard",
    rank_btn_inicio: "Back to Home",

    contato_titulo: "CONTACT US",
    contato_sub: "Do you have a question, suggestion, or want to advertise on TGT? We are always open to partnerships, sponsorships, and community feedback.",
    contato_btn: "COPY EMAIL",
    contato_copiado: "EMAIL COPIED!",
    contato_voltar: "Back to Home",

    // Footer
    footer_termos: "Terms of Use",
    footer_privacidade: "Privacy Policy",
    footer_direitos: "© 2026 TGT - True GOTY. All rights reserved. Unofficial project not affiliated with market awards.",

    // Termos
    termos_titulo: "Terms of Use",
    termos_p1: "Welcome to True GOTY (TGT). By accessing and using this site, you agree to the terms described below.",
    termos_h2_1: "1. Site Purpose",
    termos_p2: "TGT is a community entertainment platform created to discover, through popular voting (Condorcet Method), the most beloved game of the year. The site is not officially affiliated with real market awards (such as The Game Awards).",
    termos_h2_2: "2. Voting Rules",
    termos_p3: "To ensure the integrity of the community's voice, each user can vote only once per category (TGT and Market). We use verification technologies (Cloudflare Turnstile) and IP anonymization to prevent fraud and bots.",
    termos_h2_3: "3. User Conduct",
    termos_p4: "It is prohibited to attempt to bypass the voting system, use automated scripts to vote in bulk, or take any action that compromises the stability of the site.",
    termos_voltar: "← Back to home page",

    // Privacidade
    priv_titulo: "Privacy Policy",
    priv_p1: "At True GOTY, your privacy is taken seriously. This page explains in a simple way how we handle your data (or the lack thereof).",
    priv_h2_1: "1. We Do Not Collect Personal Data",
    priv_p2: "We do not ask for and do not store your name, email, phone number, or any data that could identify who you are.",
    priv_h2_2: "2. How We Prevent Duplicate Votes",
    priv_p3: "To prevent the same person from voting multiple times, we take the IP address of your connection at the time of voting and turn it into a scrambled code (SHA-256 Hash with a secret salt). Your real IP is discarded immediately. We only store this anonymous code in the database, making it impossible to reverse and find out who you are.",
    priv_h2_3: "3. Local Storage (Cookies)",
    priv_p4: "We use the local storage of your own browser only to save the progress of your votes if you close the page halfway through. No data is sent to third parties.",
    priv_voltar: "← Back to home page"
  },
  es: {
    nav_inicio: "INICIO", nav_metodo: "MÉTODO", nav_indicados: "NOMINADOS", 
    nav_goty: "GOTY", nav_votar: "VOTAR", nav_sobre: "SOBRE", nav_contato: "CONTACTO",
    home_eyebrow: "★ La Verdadera Elección de la Comunidad",
    home_titulo1: "¿CUÁL ES EL VERDADERO",
    home_titulo2: "JUEGO DEL AÑO?",
    home_sub: "Las elecciones cara a cara garantizan que el juego más querido gane, sin empates. Tu voz importa: descubre qué título marcó realmente a la comunidad.",
    home_btn_votar: "COMENZAR A VOTAR",
    home_btn_mercado: "COMPARATIVA MERCADO (PRÓXIMAMENTE)",
    home_contador: "Los jugadores ya definieron su veredicto oficial",
    
    arena_titulo: "¿CUÁL FUE EL MEJOR?",
    arena_batalha: "COMBATE", arena_de: "DE",
    arena_dica_esq: "Presiona ← para elegir",
    arena_dica_dir: "Presiona → para elegir",
    arena_desfazer: "← Deshacer último voto",
    arena_final_titulo: "TU SELECCIÓN FINAL",
    arena_final_sub: "El juego más querido de la comunidad se decidirá por tus votos.",
    arena_final_btn: "CONFIRMAR MI TRUE GOTY",

    rank_titulo: "TU RANKING PERSONAL",
    rank_sub: "Este es el resultado de tus votos.",
    rank_btn_global: "Ver Tabla Global",
    rank_btn_inicio: "Volver al Inicio",

    contato_titulo: "CONTÁCTANOS",
    contato_sub: "¿Tienes alguna duda, sugerencia o quieres anunciarte en TGT? Siempre estamos abiertos a alianzas, patrocinios y comentarios de la comunidad.",
    contato_btn: "COPIAR CORREO",
    contato_copiado: "¡CORREO COPIADO!",
    contato_voltar: "Volver al Inicio",

    // Footer
    footer_termos: "Términos de Uso",
    footer_privacidade: "Política de Privacidad",
    footer_direitos: "© 2026 TGT - True GOTY. Todos los derechos reservados. Proyecto no oficial sin vínculo con las premiaciones del mercado.",

    // Termos
    termos_titulo: "Términos de Uso",
    termos_p1: "Bienvenido a True GOTY (TGT). Al acceder y utilizar este sitio, aceptas los términos descritos a continuación.",
    termos_h2_1: "1. Propósito del Sitio",
    termos_p2: "TGT es una plataforma de entretenimiento comunitario creada para descubrir, a través de la votación popular (Método Condorcet), el juego más querido del año. El sitio no tiene vínculo oficial con las premiaciones reales del mercado (como The Game Awards).",
    termos_h2_2: "2. Reglas de Votación",
    termos_p3: "Para garantizar la integridad de la voz de la comunidad, cada usuario puede votar solo una vez por categoría (TGT y Mercado). Utilizamos tecnologías de verificación (Cloudflare Turnstile) y anonimización de IP para evitar fraudes y bots.",
    termos_h2_3: "3. Conducta del Usuario",
    termos_p4: "Está prohibido intentar eludir el sistema de votación, utilizar scripts automatizados para votar en masa o cualquier acción que comprometa la estabilidad del sitio.",
    termos_voltar: "← Volver a la página de inicio",

    // Privacidade
    priv_titulo: "Política de Privacidad",
    priv_p1: "En True GOTY, tu privacidad se toma en serio. Esta página explica de forma sencilla cómo manejamos tus datos (o la ausencia de ellos).",
    priv_h2_1: "1. No Recopilamos Datos Personales",
    priv_p2: "No solicitamos ni almacenamos tu nombre, correo electrónico, número de teléfono o cualquier dato que pueda identificar quién eres.",
    priv_h2_2: "2. Cómo Evitamos Votos Duplicados",
    priv_p3: "Para evitar que la misma persona vote varias veces, tomamos la dirección IP de tu conexión en el momento de la votación y la convertimos en un código codificado (Hash SHA-256 con una sal secreta). Tu IP real se descarta de inmediato. Solo guardamos este código anónimo en la base de datos, lo que hace imposible revertirlo y descubrir quién eres.",
    priv_h2_3: "3. Almacenamiento Local (Cookies)",
    priv_p4: "Utilizamos el almacenamiento local de tu propio navegador solo para guardar el progreso de tus votos si cierras la página a mitad de camino. No se envían datos a terceros.",
    priv_voltar: "← Volver a la página de inicio"
  }
};