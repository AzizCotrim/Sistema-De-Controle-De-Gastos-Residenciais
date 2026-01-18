import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTransacoes } from "../api/transacoes";
import type { TransacaoResponse } from "../types/transacao";

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

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const variant = props.variant ?? "primary";
  const base: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  };

  const styles: React.CSSProperties =
    variant === "primary"
      ? { ...base, background: "#111", color: "#fff" }
      : { ...base, background: "transparent", color: "#111" };

  return <button {...props} style={{ ...styles, ...(props.style ?? {}) }} />;
}

function tipoLabel(valor: number) {
  switch (valor) {
    case 1:
      return "Despesa";
    case 2:
      return "Receita";
    default:
      return "-";
  }
}

export function HomePage() {
  const navigate = useNavigate();

  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const data = await listarTransacoes();
      setTransacoes(data);
    } catch {
      setErro("Não foi possível carregar o histórico de transações.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Cabeçalho da Home */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Início</h2>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
            Ações rápidas e histórico das transações.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={carregar}>
            Recarregar
          </Button>
          <Button onClick={() => navigate("/transacoes")}>Nova transação</Button>
        </div>
      </div>

      {/* Grid de cards */}
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Card title="Ações rápidas">
          <div style={{ display: "grid", gap: 8 }}>
            <Button onClick={() => navigate("/pessoas")}>Adicionar pessoa</Button>
            <Button onClick={() => navigate("/categorias")}>Adicionar categoria</Button>
            <Button onClick={() => navigate("/transacoes")}>Adicionar transação</Button>
          </div>
          <p style={{ margin: "10px 0 0", color: "#777", fontSize: 12 }}>
            Dica: cadastre pessoas e categorias antes de lançar transações.
          </p>
        </Card>

        <Card title="Relatórios">
          <div style={{ display: "grid", gap: 8 }}>
            {/* Ajuste as rotas quando você criar as páginas */}
            <Button variant="ghost" onClick={() => navigate("/relatorios/por-pessoa")}>
              Gerar relatório por pessoa
            </Button>
            <Button variant="ghost" onClick={() => navigate("/relatorios/por-categoria")}>
              Gerar relatório por categoria
            </Button>
          </div>
          <p style={{ margin: "10px 0 0", color: "#777", fontSize: 12 }}>
            Os relatórios mostram totais e saldo agrupados.
          </p>
        </Card>
      </div>

      {/* Histórico */}
      <Card
        title="Histórico de transações"
        right={<span style={{ fontSize: 12, color: "#666" }}>{transacoes.length} itens</span>}
      >
        {erro && <p style={{ color: "crimson", margin: 0 }}>{erro}</p>}
        {carregando && <p style={{ color: "#666", margin: 0 }}>Carregando...</p>}

        {!carregando && !erro && transacoes.length === 0 && (
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.04)" }}>
            <p style={{ margin: 0, color: "#666" }}>Nenhuma transação cadastrada ainda.</p>
          </div>
        )}

        {!carregando && !erro && transacoes.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>#</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Descrição</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Valor</th>
                  <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{t.id}</td>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{t.descricao}</td>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{t.valor}</td>
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#444" }}>{tipoLabel(t.tipo)}</td>
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
