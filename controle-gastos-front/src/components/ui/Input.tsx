import type React from "react";

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
) {
  const className = [
    "input",
    props.hasError ? "is-error" : "",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const { hasError: _hasError, ...rest } = props;
  return <input {...rest} className={className} />;
}
