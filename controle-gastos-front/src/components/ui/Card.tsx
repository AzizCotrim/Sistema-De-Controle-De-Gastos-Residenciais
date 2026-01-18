import type React from "react";

export function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">{props.title}</h3>
        {props.right}
      </div>
      <div className="card-content">{props.children}</div>
    </section>
  );
}
