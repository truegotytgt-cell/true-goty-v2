// app/api/reset/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Resetado com sucesso para testes" });
  
  // Limpa os cookies das categorias conhecidas.
  // Definimos maxAge: 0 para o navegador apagá-los imediatamente.
  const categorias = ['tgt', 'mercado'];

  categorias.forEach(cat => {
    response.cookies.set({
      name: `tgt_voted_${cat}`,
      value: '',
      maxAge: 0, 
      path: '/',
    });
  });

  return response;
}