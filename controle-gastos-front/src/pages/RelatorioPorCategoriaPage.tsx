import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { RelatorioPorCategoriaResponse } from "../types/relatorio";

function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
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

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`btn btn-secondary ${props.className ?? ""}`.trim()} />;
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
    <div className="page-grid">
      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <h2>Relatório por categoria</h2>
          <p className="page-subtitle">
            Totais de receitas, despesas e saldo agrupados por categoria.
          </p>
        </div>

        <Button onClick={carregar} disabled={carregando}>
          Regerar relatório
        </Button>
      </div>

      {erro && (
        <Card title="Erro">
          <p className="status-error" style={{ marginTop: 0 }}>
            {erro}
          </p>
        </Card>
      )}

      {carregando && (
        <Card title="Carregando">
          <p className="status-muted" style={{ marginTop: 0 }}>
            Gerando relatório...
          </p>
        </Card>
      )}

      {/* Resumo */}
      {relatorio && (
        <div className="kpi-grid">
          <Card title="Total de receitas">
            <div className="kpi-value">{formatBRL(relatorio.totalGeralReceitas)}</div>
          </Card>

          <Card title="Total de despesas">
            <div className="kpi-value">{formatBRL(relatorio.totalGeralDespesas)}</div>
          </Card>

          <Card title="Saldo líquido">
            <div className="kpi-value">{formatBRL(relatorio.saldoLiquido)}</div>
          </Card>
        </div>
      )}

      {/* Tabela */}
      {relatorio && (
        <Card
          title="Detalhamento"
          right={<span className="badge">{relatorio.itens.length} categorias</span>}
        >
          {relatorio.itens.length === 0 ? (
            <p className="text-muted">Não há transações para compor o relatório.</p>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>

                <tbody>
                  {relatorio.itens.map((i) => (
                    <tr key={i.categoria.id}>
                      <td className="fw-700">{i.categoria.descricao}</td>
                      <td>{formatBRL(i.totalReceitas)}</td>
                      <td>{formatBRL(i.totalDespesas)}</td>
                      <td className="fw-700">{formatBRL(i.saldo)}</td>
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
