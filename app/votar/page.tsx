// app/votar/page.tsx
import { redirect } from 'next/navigation';

export default function VotarRedirect() {
  // Redireciona automaticamente para a categoria padrão
  redirect('/votar/tgt');
}