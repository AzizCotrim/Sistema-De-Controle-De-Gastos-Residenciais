export type CategoriaResponse = {
    id: number;
    descricao: string;
    finalidade: string;
};

export type CategoriaCreateRequest = {
    descricao: string;
    finalidade: number;
}