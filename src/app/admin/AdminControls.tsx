"use client";

import { useTransition } from "react";
import { setTestimonialStatus, toggleFeatured, setGoogleHidden } from "./actions";

type Props =
  | {
      kind: "testimonial";
      id: string;
      status: "pending" | "approved" | "rejected";
      featured: boolean;
    }
  | {
      kind: "google";
      id: string;
      hidden: boolean;
    };

export function AdminControls(props: Props) {
  const [pending, start] = useTransition();

  if (props.kind === "google") {
    return (
      <div className="controls">
        <button
          className="ghost"
          disabled={pending}
          onClick={() => start(() => setGoogleHidden(props.id, !props.hidden))}
        >
          {props.hidden ? "Mostrar na home" : "Ocultar da home"}
        </button>
      </div>
    );
  }

  return (
    <div className="controls">
      <button
        disabled={pending || props.status === "approved"}
        onClick={() => start(() => setTestimonialStatus(props.id, "approved"))}
      >
        Aprovar
      </button>
      <button
        className="ghost"
        disabled={pending || props.status === "rejected"}
        onClick={() => start(() => setTestimonialStatus(props.id, "rejected"))}
      >
        Rejeitar
      </button>
      <button
        className="ghost"
        disabled={pending}
        onClick={() => start(() => toggleFeatured(props.id, !props.featured))}
      >
        {props.featured ? "Tirar destaque" : "Destacar"}
      </button>
    </div>
  );
}
