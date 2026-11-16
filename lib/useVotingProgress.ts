// lib/useVotingProgress.ts
'use client'; 

import { useState, useEffect } from 'react';
import { gerarDuelos, Duelo } from './condorcet';

export type Voto = {
  vencedor: string;
  perdedor: string;
};

export function useVotingProgress(categoria: string, jogos: any[]) {
  const [votos, setVotos] = useState<Voto[]>([]);
  const [duelos, setDuelos] = useState<Duelo[]>([]);
  const [dueloAtual, setDueloAtual] = useState(0);
  const [carregado, setCarregado] = useState(false);

  const chaveStorage = `tgt_progress_${categoria}`;

  // Função auxiliar para nunca quebrar a tela se o navegador bloquear o salvamento
  function salvarNoNavegadorSeguro(novosVotos: Voto[], novoDuelo: number, listaDuelos: Duelo[]) {
    try {
      localStorage.setItem(
        chaveStorage, 
        JSON.stringify({ votos: novosVotos, dueloAtual: novoDuelo, duelos: listaDuelos })
      );
    } catch (e) {
      console.warn("Não foi possível salvar o progresso (modo anônimo ou memória cheia). O jogo continuará funcionando nesta aba, mas não será salvo ao recarregar.");
    }
  }

  useEffect(() => {
    // A quantidade esperada de confrontos (ex: 10 jogos = 45 duelos)
    const duelosEsperados = jogos.length > 0 ? (jogos.length * (jogos.length - 1)) / 2 : 0;

    try {
      const salvo = localStorage.getItem(chaveStorage);
      
      if (salvo) {
        try {
          const parsed = JSON.parse(salvo);
          const votosSalvos = parsed.votos || [];
          const dueloAtualSalvo = parsed.dueloAtual || 0;
          
          // Valida se os duelos existem e se a quantidade está correta
          if (parsed.duelos && parsed.duelos.length === duelosEsperados) {
            setVotos(votosSalvos);
            setDueloAtual(dueloAtualSalvo);
            setDuelos(parsed.duelos);
          } else {
            // Se os duelos estão corrompidos ou faltando, gera novos e salva na hora
            const duelosIniciais = gerarDuelos(jogos);
            setDuelos(duelosIniciais);
            salvarNoNavegadorSeguro(votosSalvos, dueloAtualSalvo, duelosIniciais);
          }
        } catch (parseError) {
          // Se o JSON estiver corrompido, limpa o lixo e recomeça
          console.error("Cache corrompido. Limpando e reiniciando:", parseError);
          localStorage.removeItem(chaveStorage);
          const duelosIniciais = gerarDuelos(jogos);
          setDuelos(duelosIniciais);
          salvarNoNavegadorSeguro([], 0, duelosIniciais);
        }
      } else {
        // Primeira vez do usuário: gera e salva
        const duelosIniciais = gerarDuelos(jogos);
        setDuelos(duelosIniciais);
        salvarNoNavegadorSeguro([], 0, duelosIniciais);
      }
    } catch (e) {
      // Se o navegador bloquear até a LEITURA (caso raro, mas possível)
      console.warn("Não foi possível acessar o localStorage. Rodando em memória.");
      const duelosIniciais = gerarDuelos(jogos);
      setDuelos(duelosIniciais);
    }
    
    setCarregado(true);
  }, [chaveStorage, jogos]);

  function registrarVoto(vencedor: string, perdedor: string) {
    const novosVotos = [...votos, { vencedor, perdedor }];
    const proximoDuelo = dueloAtual + 1;
    
    setVotos(novosVotos);
    setDueloAtual(proximoDuelo);
    salvarNoNavegadorSeguro(novosVotos, proximoDuelo, duelos);
  }

  function desfazerVoto() {
    if (votos.length === 0) return;
    const novosVotos = votos.slice(0, -1);
    const dueloAnterior = dueloAtual - 1;
    setVotos(novosVotos);
    setDueloAtual(dueloAnterior);
    salvarNoNavegadorSeguro(novosVotos, dueloAnterior, duelos);
  }

  function resetarProgresso() {
    setVotos([]);
    setDueloAtual(0);
    const novosDuelos = gerarDuelos(jogos);
    setDuelos(novosDuelos);
    salvarNoNavegadorSeguro([], 0, novosDuelos);
  }

  return {
    votos,
    duelos,
    dueloAtual,
    carregado,
    registrarVoto,
    desfazerVoto,
    resetarProgresso
  };
}