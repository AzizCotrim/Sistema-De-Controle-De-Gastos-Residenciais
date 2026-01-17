import { useEffect, useState } from "react";
import { criarTransacao, listarTransacoes } from "../api/transacoes";
import { listarPessoas } from "../api/pessoas";
import { listarCategorias } from "../api/categorias";

import type { TransacaoResponse } from "../types/transacao";
import type { PessoaResumoResponse } from "../types/pessoa";
import type { CategoriaResumoResponse } from "../types/categoria";

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
      setTipo(1);
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
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>Transações</h2>

      <form
        onSubmit={handleCriar}
        style={{ display: "grid", gap: 8, marginBottom: 16 }}
      >
        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valorStr}
          onChange={(e) => setValorStr(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
          <option value={1}>Despesa</option>
          <option value={2}>Receita</option>
        </select>

        <select value={pessoaId} onChange={e => setPessoaId(Number(e.target.value))}>
            <option value={0}>Selecione uma pessoa</option>

            {pessoas.map(p => (
                <option key={p.id} value={p.id}>
                    {p.nome}
                </option>
            ))}
        </select>


        <select value={categoriaId} onChange={e => setCategoriaId(Number(e.target.value))}>
            <option value={0}>Selecione uma categoria</option>

            {categorias.map(p => (
                <option key={p.id} value={p.id}>
                    {p.descricao}
                </option>
            ))}
        </select>

        <button type="submit">Criar</button>
      </form>

      {erro && <p style={{ color: "crimson" }}>{erro}</p>}
      {carregando && <p>Carregando...</p>}

      <ul>
        {transacoes.map((t) => (
          <li key={t.id}>
            #{t.id} - {t.descricao} | {t.valor}
          </li>
        ))}
      </ul>

      {!carregando && transacoes.length === 0 && (
        <p>Nenhuma transação cadastrada.</p>
      )}
    </div>
  );
}
