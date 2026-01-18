import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTransacoes } from "../api/transacoes";
import type { TransacaoResponse } from "../types/transacao";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

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
    <div className="page-grid">
      <div className="page-header">
        <div>
          <h2>Início</h2>
          <p className="page-subtitle">Ações rápidas e histórico das transações.</p>
        </div>

        <div className="actions-row">
          <Button variant="ghost" onClick={carregar}>
            Recarregar
          </Button>
          <Button onClick={() => navigate("/transacoes")}>Nova transação</Button>
        </div>
      </div>

      <div className="cards-grid">
        <Card title="Ações rápidas">
          <div className="page-grid" style={{ gap: 8 }}>
            <Button onClick={() => navigate("/pessoas")}>Adicionar pessoa</Button>
            <Button onClick={() => navigate("/categorias")}>Adicionar categoria</Button>
            <Button onClick={() => navigate("/transacoes")}>Adicionar transação</Button>
          </div>
          <p className="small" style={{ marginTop: 10 }}>
            Dica: cadastre pessoas e categorias antes de lançar transações.
          </p>
        </Card>

        <Card title="Relatórios">
          <div className="page-grid" style={{ gap: 8 }}>
            <Button variant="ghost" onClick={() => navigate("/relatorios/por-pessoa")}>
              Gerar relatório por pessoa
            </Button>
            <Button variant="ghost" onClick={() => navigate("/relatorios/por-categoria")}>
              Gerar relatório por categoria
            </Button>
          </div>
          <p className="small" style={{ marginTop: 10 }}>
            Os relatórios mostram totais e saldo agrupados.
          </p>
        </Card>
      </div>

      <Card
        title="Histórico de transações"
        right={<span className="badge">{transacoes.length} itens</span>}
      >
        {erro && <p className="status-error" style={{ marginTop: 0 }}>{erro}</p>}
        {carregando && <p className="status-muted" style={{ marginTop: 0 }}>Carregando...</p>}

        {!carregando && !erro && transacoes.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma transação cadastrada ainda.</p>
          </div>
        )}

        {!carregando && !erro && transacoes.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.descricao}</td>
                    <td>{t.valor}</td>
                    <td>{tipoLabel(t.tipo)}</td>
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
