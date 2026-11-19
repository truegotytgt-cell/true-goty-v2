'use client';

import { useState, useEffect } from 'react';
import { gerarDuelos, Duelo, Jogo } from './condorcet';

export type Voto = {
  vencedor: string;
  perdedor: string;
};

export function useVotingProgress(categoria: string, jogos: Jogo[]) {
  const [votos, setVotos] = useState<Voto[]>([]);
  const [duelos, setDuelos] = useState<Duelo[]>([]);
  const [dueloAtual, setDueloAtual] = useState(0);
  const [carregado, setCarregado] = useState(false);

  const chaveStorage = `tgt_progress_${categoria}`;
  const quantidadeJogos = Array.isArray(jogos) ? jogos.length : 0;

  function salvarNoNavegadorSeguro(
    novosVotos: Voto[],
    novoDuelo: number,
    listaDuelos: Duelo[]
  ) {
    try {
      localStorage.setItem(
        chaveStorage,
        JSON.stringify({ votos: novosVotos, dueloAtual: novoDuelo, duelos: listaDuelos })
      );
    } catch {
      console.warn(
        'Não foi possível salvar o progresso (modo anônimo ou memória cheia). O jogo continuará funcionando nesta aba, mas não será salvo ao recarregar.'
      );
    }
  }

  useEffect(() => {
    const duelosEsperados =
      quantidadeJogos > 1 ? (quantidadeJogos * (quantidadeJogos - 1)) / 2 : 0;

    if (duelosEsperados === 0) {
      setVotos([]);
      setDuelos([]);
      setDueloAtual(0);
      setCarregado(true);
      return;
    }

    try {
      const salvo = localStorage.getItem(chaveStorage);

      if (salvo) {
        try {
          const parsed = JSON.parse(salvo);
          const votosSalvos: Voto[] = Array.isArray(parsed?.votos) ? parsed.votos : [];
          const dueloRaw = typeof parsed?.dueloAtual === 'number' ? parsed.dueloAtual : 0;
          const dueloAtualSalvo = Math.max(0, Math.min(dueloRaw, duelosEsperados));

          if (Array.isArray(parsed?.duelos) && parsed.duelos.length === duelosEsperados) {
            setVotos(votosSalvos);
            setDueloAtual(dueloAtualSalvo);
            setDuelos(parsed.duelos);
          } else {
            const duelosIniciais = gerarDuelos(jogos);
            setDuelos(duelosIniciais);
            salvarNoNavegadorSeguro(votosSalvos, dueloAtualSalvo, duelosIniciais);
          }
        } catch (parseError) {
          console.error('Cache corrompido. Limpando e reiniciando:', parseError);
          localStorage.removeItem(chaveStorage);
          const duelosIniciais = gerarDuelos(jogos);
          setVotos([]);
          setDueloAtual(0);
          setDuelos(duelosIniciais);
          salvarNoNavegadorSeguro([], 0, duelosIniciais);
        }
      } else {
        const duelosIniciais = gerarDuelos(jogos);
        setVotos([]);
        setDueloAtual(0);
        setDuelos(duelosIniciais);
        salvarNoNavegadorSeguro([], 0, duelosIniciais);
      }
    } catch {
      console.warn('Não foi possível acessar o localStorage. Rodando em memória.');
      const duelosIniciais = gerarDuelos(jogos);
      setVotos([]);
      setDueloAtual(0);
      setDuelos(duelosIniciais);
    }

    setCarregado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveStorage, quantidadeJogos]);

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
    const dueloAnterior = Math.max(0, dueloAtual - 1);
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
    resetarProgresso,
  };
}