import { useEffect, useState } from "react";
import { criarPessoa, listarPessoas, deletarPessoa } from "../api/pessoas"
import type { PessoaResponse } from "../types/pessoa";

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
        } catch (e) {
            setErro("Nao foi possivel carregar as pessoas");
        } finally {
            setCarregando(false);
        }
    }

    async function handleCriar(e: React.FormEvent) {
        e.preventDefault(); //Evitar Reload da pagina

        const idadeLimpa = idadeStr.trim();

        if (!nome.trim) {
            setErro("Nome é obrigatório");
            return;
        }

        if (!idadeLimpa) {
            setErro("Idade é obrigatória");
            return;
        }

        if (!/^\d+$/.test(idadeLimpa)) {
            setErro("Idade deve conter apenas números");
            return;
        }

        const idade = Number(idadeLimpa);

        if (!Number.isFinite(idade)) {
            setErro("Idade inválida");
            return;
        }

        try {
            await criarPessoa({ nome, idade });
            setNome("");
            setIdadeStr("");
            await carregar(); //recarregar lista
        } catch (e) {
            setErro("Nao foi possivel criar a categoria");
        }
    }

    async function handleDeletar(id: number){
        setErro(null);
        
        try{
            await deletarPessoa(id);
            await carregar();
        }catch(e){
            setErro("Nao foi possivel excluir a pessoa");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div style={{ padding: 16, maxWidth: 720 }}>
            <h2>Pessoas</h2>

            <form onSubmit={handleCriar} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Idade"
                    value={idadeStr}
                    onChange={(e) => {
                        const valor = e.target.value;

                        if(/^\d*$/.test(valor)){
                            setIdadeStr(valor);
                        }
                    }}
                />

                <button type="submit">Criar</button>
            </form>

            {erro && <p style={{ color: "crimson" }}>{erro}</p>}
            {carregando && <p>Carregando...</p>}

            <ul>
                {pessoas.map((c) => (
                    <li key={c.id} style={{display: "flex", gap: 8, alignItems: "center"}}>
                        <span>
                            #{c.id} - {c.nome} ({c.idade})
                        </span>

                        <button type="button"
                            onClick={() => handleDeletar(c.id)}
                            aria-label="{Excluir ${c.nome}}"
                            style={{
                                marginLeft: "auto",
                                cursor: "pointer",
                                border: "none",
                                background: "transparent",
                                color: "crimson",
                                fontWeight: 700,
                                fontSize: 16
                            }}>
                            X
                        </button>
                    </li>
                ))}
            </ul>

            {!carregando && pessoas.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
        </div>
    );
}

