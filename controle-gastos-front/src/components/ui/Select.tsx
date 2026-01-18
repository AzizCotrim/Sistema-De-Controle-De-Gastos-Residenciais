import type React from "react";

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
) {
  const className = [
    "select",
    props.hasError ? "is-error" : "",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const { hasError: _hasError, ...rest } = props;
  return <select {...rest} className={className} />;
}
