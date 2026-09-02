"use client";

import { useActionState } from "react";
import { submitTestimonial, type SubmitState } from "@/app/actions";

const initial: SubmitState = { ok: false, error: "" };

export function TestimonialForm() {
  const [state, formAction, pending] = useActionState(submitTestimonial, initial);

  if (state.ok) {
    return (
      <p className="ok">
        Obrigado pela avaliação! Ela será publicada assim que for aprovada.
      </p>
    );
  }

  return (
    <form className="form" action={formAction}>
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

      {/* honeypot invisível para bots */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar avaliação"}
      </button>

      {state.error ? <p className="err">{state.error}</p> : null}
    </form>
  );
}
