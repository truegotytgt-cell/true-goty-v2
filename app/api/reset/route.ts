// app/api/reset/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Resetado" });
  
  // Define o cookie como vazio e com data de expiração no passado
  response.cookies.set({
    name: 'tgt_voted_tgt',
    value: '',
    maxAge: 0, // Expira imediatamente
    path: '/',
  });

  return response;
}