'use client';

import { useState, useEffect, useCallback } from 'react';
import { gerarDuelos, Duelo, Jogo } from './condorcet';

export type Voto = {
  vencedor: string;
  perdedor: string;
};

type EstadoVotacao = {
  votos: Voto[];
  duelos: Duelo[];
  dueloAtual: number;
  carregado: boolean;
};

export function useVotingProgress(categoria: string, jogos: Jogo[]) {
  const [estado, setEstado] = useState<EstadoVotacao>({
    votos: [],
    duelos: [],
    dueloAtual: 0,
    carregado: false,
  });

  const chaveStorage = `tgt_progress_${categoria}`;
  const quantidadeJogos = Array.isArray(jogos) ? jogos.length : 0;

  const salvarNoNavegadorSeguro = useCallback(
    (novosVotos: Voto[], novoDuelo: number, listaDuelos: Duelo[]) => {
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
    },
    [chaveStorage]
  );

  useEffect(() => {
    const duelosEsperados =
      quantidadeJogos > 1 ? (quantidadeJogos * (quantidadeJogos - 1)) / 2 : 0;

    let proximoEstado: EstadoVotacao;

    if (duelosEsperados === 0) {
      proximoEstado = {
        votos: [],
        duelos: [],
        dueloAtual: 0,
        carregado: true,
      };
    } else {
      try {
        const salvo = localStorage.getItem(chaveStorage);
        if (salvo) {
          try {
            const parsed = JSON.parse(salvo);
            const votosSalvos: Voto[] = Array.isArray(parsed?.votos) ? parsed.votos : [];
            const dueloRaw = typeof parsed?.dueloAtual === 'number' ? parsed.dueloAtual : 0;
            const dueloAtualSalvo = Math.max(0, Math.min(dueloRaw, duelosEsperados));

            if (Array.isArray(parsed?.duelos) && parsed.duelos.length === duelosEsperados) {
              proximoEstado = {
                votos: votosSalvos,
                dueloAtual: dueloAtualSalvo,
                duelos: parsed.duelos,
                carregado: true,
              };
            } else {
              const duelosIniciais = gerarDuelos(jogos);
              salvarNoNavegadorSeguro(votosSalvos, dueloAtualSalvo, duelosIniciais);
              proximoEstado = {
                votos: votosSalvos,
                dueloAtual: dueloAtualSalvo,
                duelos: duelosIniciais,
                carregado: true,
              };
            }
          } catch (parseError) {
            console.error('Cache corrompido. Limpando e reiniciando:', parseError);
            localStorage.removeItem(chaveStorage);
            const duelosIniciais = gerarDuelos(jogos);
            salvarNoNavegadorSeguro([], 0, duelosIniciais);
            proximoEstado = {
              votos: [],
              dueloAtual: 0,
              duelos: duelosIniciais,
              carregado: true,
            };
          }
        } else {
          const duelosIniciais = gerarDuelos(jogos);
          salvarNoNavegadorSeguro([], 0, duelosIniciais);
          proximoEstado = {
            votos: [],
            dueloAtual: 0,
            duelos: duelosIniciais,
            carregado: true,
          };
        }
      } catch {
        console.warn('Não foi possível acessar o localStorage. Rodando em memória.');
        const duelosIniciais = gerarDuelos(jogos);
        proximoEstado = {
          votos: [],
          dueloAtual: 0,
          duelos: duelosIniciais,
          carregado: true,
        };
      }
    }

    const frameId = requestAnimationFrame(() => {
      setEstado(proximoEstado);
    });

    return () => cancelAnimationFrame(frameId);
  }, [chaveStorage, quantidadeJogos, jogos, salvarNoNavegadorSeguro]);

  function registrarVoto(vencedor: string, perdedor: string) {
    setEstado((prev) => {
      const novosVotos = [...prev.votos, { vencedor, perdedor }];
      const proximoDuelo = prev.dueloAtual + 1;
      salvarNoNavegadorSeguro(novosVotos, proximoDuelo, prev.duelos);
      return {
        ...prev,
        votos: novosVotos,
        dueloAtual: proximoDuelo,
      };
    });
  }

  function desfazerVoto() {
    setEstado((prev) => {
      if (prev.votos.length === 0) return prev;
      const novosVotos = prev.votos.slice(0, -1);
      const dueloAnterior = Math.max(0, prev.dueloAtual - 1);
      salvarNoNavegadorSeguro(novosVotos, dueloAnterior, prev.duelos);
      return {
        ...prev,
        votos: novosVotos,
        dueloAtual: dueloAnterior,
      };
    });
  }

  function resetarProgresso() {
    const novosDuelos = gerarDuelos(jogos);
    salvarNoNavegadorSeguro([], 0, novosDuelos);
    setEstado({
      votos: [],
      dueloAtual: 0,
      duelos: novosDuelos,
      carregado: true,
    });
  }

  return {
    votos: estado.votos,
    duelos: estado.duelos,
    dueloAtual: estado.dueloAtual,
    carregado: estado.carregado,
    registrarVoto,
    desfazerVoto,
    resetarProgresso,
  };
}