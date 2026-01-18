import type React from "react";

type Variant = "primary" | "ghost" | "secondary" | "danger";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
) {
  const variant = props.variant ?? "primary";

  const className = [
    "btn",
    variant === "primary" ? "btn-primary" : "",
    variant === "ghost" ? "btn-ghost" : "",
    variant === "secondary" ? "btn-secondary" : "",
    variant === "danger" ? "btn-danger" : "",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <button {...props} className={className} />;
}
