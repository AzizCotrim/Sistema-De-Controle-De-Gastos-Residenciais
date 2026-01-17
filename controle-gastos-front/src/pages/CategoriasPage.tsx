import { useEffect, useState } from "react";
import { criarCategoria, listarCategorias } from "../api/categorias"
import type { CategoriaResponse } from "../types/categoria";

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
        } catch (e) {
            setErro("Nao foi possivel carregar as categorias");
        } finally {
            setCarregando(false);
        }
    }

    async function handleCriar(e: React.FormEvent) {
        e.preventDefault(); //Evitar Reload da pagina

        if (!descricao.trim()) {
            setErro("Descricao e obrigataria");
            return;
        }

        if (finalidade === null || finalidade === undefined){
            setErro("Finalidade e obrigataria");
            return;
        }

        setErro(null);
        try {
            await criarCategoria({ descricao, finalidade });
            setDescricao("");
            setFinalidade(0);
            await carregar(); //recarregar lista
        } catch (e) {
            setErro("Nao foi possivel criar a categoria");
        }

    }
    useEffect(() => {
        carregar();
    }, []);

    return (
        <div style={{ padding: 16, maxWidth: 720 }}>
            <h2>Categorias</h2>

            <form onSubmit={handleCriar} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                <input
                    placeholder="Descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <select
                    value={finalidade}
                    onChange={(e) => setFinalidade(Number(e.target.value))}
                >
                    <option value={1}>Despesa</option>
                    <option value={2}>Receita</option>
                    <option value={3}>Ambas</option>
                </select>

                <button type="submit">Criar</button>
            </form>

            {erro && <p style={{ color: "crimson" }}>{erro}</p>}
            {carregando && <p>Carregando...</p>}

            <ul>
                {categorias.map((c) => (
                    <li key={c.id}>
                        #{c.id} - {c.descricao} ({c.finalidade})
                    </li>
                ))}
            </ul>

            {!carregando && categorias.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
        </div>
    );
}

