import type {CategoriaResumoResponse} from "./categoria";
import type {PessoaResumoResponse} from "./pessoa";

export type TransacaoCreateRequest = {
    descricao: string;
    valor: number;
    tipo: number;
    pessoaId: number;
    categoriaId: number;
}

export type TransacaoResponse = {
    id: number;
    descricao: string;
    valor: number;
    tipo: number;
    pessoaResumo: PessoaResumoResponse;
    categoriaResumo: CategoriaResumoResponse;
}

