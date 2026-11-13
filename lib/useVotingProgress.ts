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

  useEffect(() => {
    const salvo = localStorage.getItem(chaveStorage);
    
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        setVotos(parsed.votos || []);
        setDueloAtual(parsed.dueloAtual || 0);
        
        if (parsed.duelos && parsed.duelos.length > 0) {
          setDuelos(parsed.duelos);
        } else {
          setDuelos(gerarDuelos(jogos));
        }
      } catch (e) {
        console.error("Erro ao ler o progresso:", e);
      }
    } else {
      // AQUI ESTÁ A CORREÇÃO DO BUG 1:
      // Se é a primeira vez, gera os duelos E salva imediatamente no localStorage
      const duelosIniciais = gerarDuelos(jogos);
      setDuelos(duelosIniciais);
      localStorage.setItem(
        chaveStorage, 
        JSON.stringify({ votos: [], dueloAtual: 0, duelos: duelosIniciais })
      );
    }
    setCarregado(true);
  }, [chaveStorage, jogos]);

  function salvarNoNavegador(novosVotos: Voto[], novoDuelo: number, listaDuelos: Duelo[]) {
    localStorage.setItem(
      chaveStorage, 
      JSON.stringify({ votos: novosVotos, dueloAtual: novoDuelo, duelos: listaDuelos })
    );
  }

  function registrarVoto(vencedor: string, perdedor: string) {
    const novosVotos = [...votos, { vencedor, perdedor }];
    const proximoDuelo = dueloAtual + 1;
    
    setVotos(novosVotos);
    setDueloAtual(proximoDuelo);
    salvarNoNavegador(novosVotos, proximoDuelo, duelos);
  }

  function desfazerVoto() {
    if (votos.length === 0) return;
    const novosVotos = votos.slice(0, -1);
    const dueloAnterior = dueloAtual - 1;
    setVotos(novosVotos);
    setDueloAtual(dueloAnterior);
    salvarNoNavegador(novosVotos, dueloAnterior, duelos);
  }

  function resetarProgresso() {
    setVotos([]);
    setDueloAtual(0);
    const novosDuelos = gerarDuelos(jogos);
    setDuelos(novosDuelos);
    localStorage.setItem(
      chaveStorage, 
      JSON.stringify({ votos: [], dueloAtual: 0, duelos: novosDuelos })
    );
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