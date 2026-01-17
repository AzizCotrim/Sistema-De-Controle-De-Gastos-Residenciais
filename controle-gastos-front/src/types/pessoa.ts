export type PessoaCreateRequest = {
    nome: string;
    idade: number;
}

export type PessoaResponse = {
    id: number;
    nome: string;
    idade: number;
}

export type PessoaResumoResponse = {
    id: number;
    nome: string;
}