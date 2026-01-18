import { useEffect, useState } from "react";
import { criarPessoa, listarPessoas, deletarPessoa } from "../api/pessoas";
import type { PessoaResponse } from "../types/pessoa";

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

function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }
) {
  const variant = props.variant ?? "primary";
  const base: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    whiteSpace: "nowrap",
  };

  const styles: React.CSSProperties =
    variant === "primary"
      ? { ...base, background: "#111", color: "#fff" }
      : variant === "danger"
      ? { ...base, background: "rgba(198,40,40,0.08)", color: "#c62828", borderColor: "rgba(198,40,40,0.25)" }
      : { ...base, background: "transparent", color: "#111" };

  return <button {...props} style={{ ...styles, ...(props.style ?? {}) }} />;
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
        color: "#111", 
        fontWeight: 500,
        ...(props.style ?? {}),
      }}
    />
  );
}

export function PessoaFormularioPage() {
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [nome, setNome] = useState("");
  const [idadeStr, setIdadeStr] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const data = await listarPessoas();
      setPessoas(data);
    } catch {
      setErro("Não foi possível carregar as pessoas.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();

    const nomeLimpo = nome.trim();
    const idadeLimpa = idadeStr.trim();

    if (!nomeLimpo) {
      setErro("Nome é obrigatório.");
      return;
    }

    if (!idadeLimpa) {
      setErro("Idade é obrigatória.");
      return;
    }

    if (!/^\d+$/.test(idadeLimpa)) {
      setErro("Idade deve conter apenas números.");
      return;
    }

    const idade = Number(idadeLimpa);
    if (!Number.isFinite(idade)) {
      setErro("Idade inválida.");
      return;
    }

    setErro(null);

    try {
      await criarPessoa({ nome: nomeLimpo, idade });
      setNome("");
      setIdadeStr("");
      await carregar();
    } catch {
      setErro("Não foi possível criar a pessoa.");
    }
  }

  async function handleDeletar(id: number) {
    setErro(null);

    try {
      await deletarPessoa(id);
      await carregar();
    } catch {
      setErro("Não foi possível excluir a pessoa.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const nomeInvalido = !nome.trim();
  const idadeInvalida = !idadeStr.trim();

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Pessoas</h2>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
            Cadastre pessoas para associar às transações.
          </p>
        </div>

        <Button variant="ghost" onClick={carregar} disabled={carregando}>
          Recarregar
        </Button>
      </div>

      {/* Form */}
      <Card title="Nova pessoa">
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
            <label style={{ fontSize: 12, color: "#666" }}>Nome</label>
            <Input
              placeholder="Ex.: Aziz"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              hasError={!!erro && nomeInvalido}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Idade</label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Ex.: 20"
              value={idadeStr}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^\d*$/.test(valor)) setIdadeStr(valor);
              }}
              hasError={!!erro && idadeInvalida}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit" disabled={carregando}>
              Criar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setNome("");
                setIdadeStr("");
                setErro(null);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>

        {erro && <p style={{ color: "crimson", margin: "12px 0 0" }}>{erro}</p>}
        {carregando && <p style={{ color: "#666", margin: "12px 0 0" }}>Carregando...</p>}
      </Card>

      {/* Lista */}
      <Card title="Lista de pessoas" right={<span style={{ fontSize: 12, color: "#666" }}>{pessoas.length} itens</span>}>
        {!carregando && !erro && pessoas.length === 0 && (
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.04)" }}>
            <p style={{ margin: 0, color: "#666" }}>Nenhuma pessoa cadastrada.</p>
          </div>
        )}

        {pessoas.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>#</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Nome</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Idade</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666", width: 120 }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {pessoas.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{p.id}</td>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{p.nome}</td>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{p.idade}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDeletar(p.id)}
                        aria-label={`Excluir ${p.nome}`}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
