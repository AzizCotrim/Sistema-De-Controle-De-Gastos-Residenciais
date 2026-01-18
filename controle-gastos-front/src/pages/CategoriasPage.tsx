import { useEffect, useState } from "react";
import { criarCategoria, listarCategorias } from "../api/categorias";
import type { CategoriaResponse } from "../types/categoria";

function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 14,
        padding: 14,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, color: "#111" }}>{props.title}</h3>
        {props.right}
      </div>
      <div style={{ marginTop: 12 }}>{props.children}</div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      style={{
        width: "90%",
        padding: "10px 12px",
        borderRadius: 12,
        border: `1px solid ${props.hasError ? "rgba(198,40,40,0.5)" : "rgba(0,0,0,0.12)"}`,
        background: props.hasError ? "rgba(198,40,40,0.05)" : "#fff",
        outline: "none",
        color: "#111", // letra preta apenas no input
        ...(props.style ?? {}),
      }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: `1px solid ${props.hasError ? "rgba(198,40,40,0.5)" : "rgba(0,0,0,0.12)"}`,
        background: "#fff",
        outline: "none",
        color: "#111",
        ...(props.style ?? {}),
      }}
    />
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        borderRadius: 12,
        padding: "10px 12px",
        border: "1px solid rgba(0,0,0,0.12)",
        background: "#eaeaea",
        color: "#111",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        ...(props.style ?? {}),
      }}
    />
  );
}

function finalidadeLabel(valor: number) {
  switch (valor) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    case 3:
      return "Ambas";
    default:
      return "-";
  }
}

export function CategoriaFormularioPage() {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<number>(0);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch {
      setErro("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();

    if (!descricao.trim()) {
      setErro("Descrição é obrigatória.");
      return;
    }

    if (finalidade <= 0) {
      setErro("Finalidade é obrigatória.");
      return;
    }

    setErro(null);

    try {
      await criarCategoria({ descricao, finalidade });
      setDescricao("");
      setFinalidade(0);
      await carregar();
    } catch {
      setErro("Não foi possível criar a categoria.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Cabeçalho */}
      <div>
        <h2 style={{ margin: 0 }}>Categorias</h2>
        <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
          Cadastre categorias para classificar receitas e despesas.
        </p>
      </div>

      {/* Formulário */}
      <Card title="Nova categoria">
        <form
          onSubmit={handleCriar}
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            alignItems: "end",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Descrição</label>
            <Input
              placeholder="Ex.: Alimentação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              hasError={!!erro && !descricao.trim()}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Finalidade</label>
            <Select
              value={finalidade}
              onChange={(e) => setFinalidade(Number(e.target.value))}
              hasError={!!erro && finalidade <= 0}
            >
              <option value={0}>Selecione</option>
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
              <option value={3}>Ambas</option>
            </Select>
          </div>

          <Button type="submit" disabled={carregando}>
            Criar
          </Button>
        </form>

        {erro && <p style={{ color: "crimson", margin: "12px 0 0" }}>{erro}</p>}
        {carregando && <p style={{ color: "#666", margin: "12px 0 0" }}>Carregando...</p>}
      </Card>

      {/* Lista */}
      <Card
        title="Lista de categorias"
        right={<span style={{ fontSize: 12, color: "#666" }}>{categorias.length} itens</span>}
      >
        {!carregando && categorias.length === 0 && (
          <p style={{ color: "#666" }}>Nenhuma categoria cadastrada.</p>
        )}

        {categorias.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <th style={{ padding: 8, fontSize: 12, color: "#666" }}>#</th>
                <th style={{ padding: 8, fontSize: 12, color: "#666" }}>Descrição</th>
                <th style={{ padding: 8, fontSize: 12, color: "#666" }}>Finalidade</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td style={{ padding: 8, fontSize: 12, color: "#000"}}>{c.id}</td>
                  <td style={{ padding: 8, fontSize: 12, color: "#000"}}>{c.descricao}</td>
                  <td style={{ padding: 8, fontSize: 12, color: "#000"}}>{finalidadeLabel(c.finalidade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
