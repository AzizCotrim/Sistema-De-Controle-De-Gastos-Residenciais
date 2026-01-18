import { useEffect, useMemo, useState } from "react";
import { criarTransacao, listarTransacoes } from "../api/transacoes";
import { listarPessoas } from "../api/pessoas";
import { listarCategorias } from "../api/categorias";

import type { TransacaoResponse } from "../types/transacao";
import type { PessoaResumoResponse } from "../types/pessoa";
import type { CategoriaResumoResponse } from "../types/categoria";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

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

export function TransacaoFormularioPage() {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [pessoas, setPessoas] = useState<PessoaResumoResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResumoResponse[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valorStr, setValorStr] = useState("");
  const [tipo, setTipo] = useState<number>(0);
  const [pessoaId, setPessoaId] = useState<number>(0);
  const [categoriaId, setCategoriaId] = useState<number>(0);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const tipoLabelTxt = useMemo(() => {
    return tipo === 2 ? "Receita" : "Despesa";
  }, [tipo]);

  async function carregarTransacoes() {
    const data = await listarTransacoes();
    setTransacoes(data);
  }

  async function carregarCombos() {
    const [ps, cs] = await Promise.all([listarPessoas(), listarCategorias()]);
    setPessoas(ps);
    setCategorias(cs);
  }

  async function carregarTudo() {
    setCarregando(true);
    setErro(null);
    try {
      await Promise.all([carregarTransacoes(), carregarCombos()]);
    } catch {
      setErro("Nao foi possivel carregar dados da tela");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();

    if (!descricao.trim()) {
      setErro("Descrição é obrigatória");
      return;
    }

    if (!valorStr.trim()) {
      setErro("Valor é obrigatório");
      return;
    }

    const valor = Number(valorStr);
    if (!Number.isFinite(valor)) {
      setErro("Valor inválido");
      return;
    }

    if (tipo <= 0) {
      setErro("Tipo é obrigatório");
      return;
    }

    if (pessoaId <= 0) {
      setErro("Pessoa é obrigatória");
      return;
    }

    if (categoriaId <= 0) {
      setErro("Categoria é obrigatória");
      return;
    }

    setErro(null);

    try {
      await criarTransacao({ descricao, valor, tipo, pessoaId, categoriaId });

      setDescricao("");
      setValorStr("");
      setTipo(0);
      setPessoaId(0);
      setCategoriaId(0);

      await carregarTransacoes();
    } catch {
      setErro("Não foi possível criar a transação");
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div className="page-grid">
      <div className="page-header">
        <div>
          <h2>Transações</h2>
          <p className="page-subtitle">Cadastre uma transação e acompanhe o histórico.</p>
        </div>

        <div className="actions-row">
          <Button variant="ghost" onClick={carregarTudo} disabled={carregando}>
            Recarregar
          </Button>
        </div>
      </div>

      <Card title="Nova transação" right={<span className="badge">Tipo: {tipoLabelTxt}</span>}>
        <form onSubmit={handleCriar} className="form-grid">
          <div className="field">
            <label>Descrição</label>
            <Input
              placeholder="Ex.: Mercado, Internet, Salário..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Valor</label>
            <Input
              type="number"
              placeholder="0,00"
              value={valorStr}
              onChange={(e) => setValorStr(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Tipo</label>
            <Select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
              <option value={0}>Selecione o Tipo da Transacao</option>
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
            </Select>
          </div>

          <div className="field">
            <label>Pessoa</label>
            <Select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))}>
              <option value={0}>Selecione uma pessoa</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </div>

          <div className="field">
            <label>Categoria</label>
            <Select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
              <option value={0}>Selecione uma categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao}
                </option>
              ))}
            </Select>
          </div>

          <div className="btn-row">
            <Button type="submit" disabled={carregando}>
              Criar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDescricao("");
                setValorStr("");
                setTipo(0);
                setPessoaId(0);
                setCategoriaId(0);
                setErro(null);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>

        {erro && <p className="status-error">{erro}</p>}
        {carregando && <p className="status-muted">Carregando...</p>}
      </Card>

      <Card title="Histórico" right={<span className="badge">{transacoes.length} itens</span>}>
        {!carregando && !erro && transacoes.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma transação cadastrada.</p>
          </div>
        )}

        {!carregando && transacoes.length > 0 && (
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
