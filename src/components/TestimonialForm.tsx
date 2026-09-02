"use client";

import { useRef, useState } from "react";

type Status = { kind: "idle" | "sending" | "ok" } | { kind: "error"; msg: string };

export function TestimonialForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [photoName, setPhotoName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/testimonial", { method: "POST", body: data });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStatus({ kind: "ok" });
        formRef.current?.reset();
        setPhotoName(null);
      } else {
        setStatus({ kind: "error", msg: json.error ?? "Não foi possível enviar. Tente novamente." });
      }
    } catch {
      setStatus({ kind: "error", msg: "Falha de conexão. Tente novamente." });
    }
  }

  if (status.kind === "ok") {
    return (
      <p className="ok">
        Obrigado pela avaliação! Ela será publicada assim que for aprovada.
      </p>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit}>
      <label>
        Seu nome
        <input name="author" type="text" required minLength={2} maxLength={80} autoComplete="name" />
      </label>

      <label>
        Nota
        <select name="rating" required defaultValue="5">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} estrela{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sua avaliação
        <textarea name="text" required minLength={10} maxLength={2000} rows={4} />
      </label>

      <label>
        Foto (opcional)
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
        />
        {photoName ? <small className="muted">{photoName}</small> : null}
      </label>

      {/* honeypot invisível para bots */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <button type="submit" disabled={sending}>
        {sending ? "Enviando…" : "Enviar avaliação"}
      </button>

      {status.kind === "error" ? <p className="err">{status.msg}</p> : null}
    </form>
  );
}
