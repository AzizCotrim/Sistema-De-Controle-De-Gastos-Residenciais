import { useEffect, useState } from "react";
import { criarPessoa, listarPessoas, deletarPessoa } from "../api/pessoas";
import type { PessoaResponse } from "../types/pessoa";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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
    <div className="page-grid">
      <div className="page-header">
        <div>
          <h2>Pessoas</h2>
          <p className="page-subtitle">Cadastre pessoas para associar às transações.</p>
        </div>

        <Button variant="ghost" onClick={carregar} disabled={carregando}>
          Recarregar
        </Button>
      </div>

      <Card title="Nova pessoa">
        <form onSubmit={handleCriar} className="form-grid">
          <div className="field">
            <label>Nome</label>
            <Input
              placeholder="Ex.: Aziz"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              hasError={!!erro && nomeInvalido}
            />
          </div>

          <div className="field">
            <label>Idade</label>
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

          <div className="btn-row">
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

        {erro && <p className="status-error">{erro}</p>}
        {carregando && <p className="status-muted">Carregando...</p>}
      </Card>

      <Card
        title="Lista de pessoas"
        right={<span className="badge">{pessoas.length} itens</span>}
      >
        {!carregando && !erro && pessoas.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma pessoa cadastrada.</p>
          </div>
        )}

        {pessoas.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.idade}</td>
                    <td>
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
