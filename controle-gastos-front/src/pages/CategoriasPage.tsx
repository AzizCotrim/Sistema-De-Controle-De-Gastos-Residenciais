import { useEffect, useState } from "react";
import { criarCategoria, listarCategorias } from "../api/categorias";
import type { CategoriaResponse } from "../types/categoria";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

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
    <div className="page-grid">
      <div>
        <h2>Categorias</h2>
        <p className="page-subtitle">Cadastre categorias para classificar receitas e despesas.</p>
      </div>

      <Card title="Nova categoria">
        <form onSubmit={handleCriar} className="form-grid">
          <div className="field">
            <label>Descrição</label>
            <Input
              placeholder="Ex.: Alimentação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              hasError={!!erro && !descricao.trim()}
            />
          </div>

          <div className="field">
            <label>Finalidade</label>
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

          <Button type="submit" variant="secondary" disabled={carregando}>
            Criar
          </Button>
        </form>

        {erro && <p className="status-error">{erro}</p>}
        {carregando && <p className="status-muted">Carregando...</p>}
      </Card>

      <Card
        title="Lista de categorias"
        right={<span className="badge">{categorias.length} itens</span>}
      >
        {!carregando && categorias.length === 0 && (
          <p className="text-muted">Nenhuma categoria cadastrada.</p>
        )}

        {categorias.length > 0 && (
          <div className="table-scroll">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Finalidade</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.descricao}</td>
                    <td>{finalidadeLabel(c.finalidade)}</td>
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
