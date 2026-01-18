export type CategoriaCreateRequest = {
    descricao: string;
    finalidade: number;
}

export type CategoriaResponse = {
    id: number;
    descricao: string;
    finalidade: number;
};

export type CategoriaResumoResponse = {
    id: number;
    descricao: string;
}