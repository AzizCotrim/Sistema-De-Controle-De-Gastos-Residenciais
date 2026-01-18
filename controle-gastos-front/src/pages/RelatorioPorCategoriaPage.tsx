// src/pages/RelatorioPorCategoriaPage.tsx
import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { RelatorioPorCategoriaResponse } from "../types/relatorio";

function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 14,
        padding: 14,
        background: "#fff",
        color: "#111",
        fontWeight: 500
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

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RelatorioPorCategoriaPage() {
  const [relatorio, setRelatorio] = useState<RelatorioPorCategoriaResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const response = await http.get<RelatorioPorCategoriaResponse>("/api/relatorios/por-categoria");
      setRelatorio(response.data);
    } catch {
      setErro("Não foi possível gerar o relatório por categoria.");
      setRelatorio(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Relatório por categoria</h2>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
            Totais de receitas, despesas e saldo agrupados por categoria.
          </p>
        </div>

        <Button onClick={carregar} disabled={carregando}>
          Regerar relatório
        </Button>
      </div>

      {erro && (
        <Card title="Erro">
          <p style={{ margin: 0, color: "crimson" }}>{erro}</p>
        </Card>
      )}

      {carregando && (
        <Card title="Carregando">
          <p style={{ margin: 0, color: "#666" }}>Gerando relatório...</p>
        </Card>
      )}

      {/* Resumo */}
      {relatorio && (
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Card title="Total de receitas">
            <div style={{ fontSize: 18, fontWeight: 800 }}>{formatBRL(relatorio.totalGeralReceitas)}</div>
          </Card>

          <Card title="Total de despesas">
            <div style={{ fontSize: 18, fontWeight: 800 }}>{formatBRL(relatorio.totalGeralDespesas)}</div>
          </Card>

          <Card title="Saldo líquido">
            <div style={{ fontSize: 18, fontWeight: 800 }}>{formatBRL(relatorio.saldoLiquido)}</div>
          </Card>
        </div>
      )}

      {/* Tabela */}
      {relatorio && (
        <Card
          title="Detalhamento"
          right={<span style={{ fontSize: 12, color: "#666" }}>{relatorio.itens.length} categorias</span>}
        >
          {relatorio.itens.length === 0 ? (
            <p style={{ margin: 0, color: "#666" }}>Não há transações para compor o relatório.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Categoria</th>
                    <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Receitas</th>
                    <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Despesas</th>
                    <th style={{ padding: "10px 8px", fontSize: 12, color: "#666" }}>Saldo</th>
                  </tr>
                </thead>

                <tbody>
                  {relatorio.itens.map((i) => (
                    <tr key={i.categoria.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700 }}>
                        {i.categoria.descricao}
                      </td>
                      <td style={{ padding: "10px 8px", fontSize: 13 }}>{formatBRL(i.totalReceitas)}</td>
                      <td style={{ padding: "10px 8px", fontSize: 13 }}>{formatBRL(i.totalDespesas)}</td>
                      <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700 }}>
                        {formatBRL(i.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
