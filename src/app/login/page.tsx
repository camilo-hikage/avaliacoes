"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const notAdmin = params.get("error") === "not_admin";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="wrap narrow">
      <h1>Entrar</h1>

      {notAdmin ? (
        <p className="err">Essa conta não tem acesso ao painel. Use o email de administrador.</p>
      ) : null}

      {sent ? (
        <p className="ok">
          Enviamos um link de acesso para <strong>{email}</strong>. Abra o email e clique no link
          para entrar.
        </p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Enviando…" : "Enviar link de acesso"}
          </button>
          {error ? <p className="err">{error}</p> : null}
        </form>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="wrap narrow">Carregando…</main>}>
      <LoginForm />
    </Suspense>
  );
}
