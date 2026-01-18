import { useEffect, useState, useMemo } from "react";
import { criarTransacao, listarTransacoes } from "../api/transacoes";
import { listarPessoas } from "../api/pessoas";
import { listarCategorias } from "../api/categorias";

import type { TransacaoResponse } from "../types/transacao";
import type { PessoaResumoResponse } from "../types/pessoa";
import type { CategoriaResumoResponse } from "../types/categoria";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 14, color: "#111" }}>{props.title}</h3>
        {props.right}
      </div>
      <div style={{ marginTop: 12 }}>{props.children}</div>
    </section>
  );
}

function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
) {
  const variant = props.variant ?? "primary";
  const base: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  };

  const styles: React.CSSProperties =
    variant === "primary"
      ? { ...base, background: "#111", color: "#fff" }
      : { ...base, background: "transparent", color: "#111" };

  return <button {...props} style={{ ...styles, ...(props.style ?? {}) }} />;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "90%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        outline: "none",
        background: "#fff",
        color: "#111", 
        fontWeight: 500,
        ...(props.style ?? {}),
      }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        outline: "none",
        background: "#fff",
        color: "#111", 
        fontWeight: 500,
        ...(props.style ?? {}),
      }}
    />
  );
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

  async function carregarCombos(){
    const [ps, cs] = await Promise.all([listarPessoas(), listarCategorias()]);
    setPessoas(ps);
    setCategorias(cs);
  }

  async function carregarTudo(){
    setCarregando(true);
    setErro(null);
    try{
      await Promise.all([carregarTransacoes(), carregarCombos()]);
    }catch{
      setErro("Nao foi possivel carregar dados da tela");
    }finally{
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
      await criarTransacao({
        descricao,
        valor,
        tipo,
        pessoaId,
        categoriaId,
      });

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
          <h2 style={{ margin: 0 }}>Transações</h2>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
            Cadastre uma transação e acompanhe o histórico.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={carregarTudo} disabled={carregando}>
            Recarregar
          </Button>
        </div>
      </div>

      {/* Formulário */}
      <Card
        title="Nova transação"
        right={<span style={{ fontSize: 12, color: "#666" }}>Tipo: {tipoLabelTxt}</span>}
      >
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
              placeholder="Ex.: Mercado, Internet, Salário..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ color: "#111" }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Valor</label>
            <Input
              type="number"
              placeholder="0,00"
              value={valorStr}
              onChange={(e) => setValorStr(e.target.value)}
              style={{ color: "#111" }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Tipo</label>
            <Select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
              <option value={0}>Selecione o Tipo da Transacao</option>
              <option value={1}>Despesa</option>
              <option value={2}>Receita</option>
            </Select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Pessoa</label>
            <Select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))}>
              <option value={0}>Selecione uma pessoa</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Categoria</label>
            <Select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
              <option value={0}>Selecione uma categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao}
                </option>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit" disabled={carregando}>
              Criar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDescricao("");
                setValorStr("");
                setTipo(1);
                setPessoaId(0);
                setCategoriaId(0);
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

      {/* Histórico */}
      <Card
        title="Histórico"
        right={<span style={{ fontSize: 12, color: "#666" }}>{transacoes.length} itens</span>}
      >
        {!carregando && !erro && transacoes.length === 0 && (
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.04)" }}>
            <p style={{ margin: 0, color: "#666" }}>Nenhuma transação cadastrada.</p>
          </div>
        )}

        {!carregando && transacoes.length > 0 && (
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
