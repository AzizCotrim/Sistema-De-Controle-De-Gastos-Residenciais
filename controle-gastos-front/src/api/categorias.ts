import { http } from "./http";
import { type CategoriaCreateRequest, type CategoriaResponse } from "../types/categoria"


export async function criarCategoria(payload: CategoriaCreateRequest) : Promise<CategoriaResponse> {
    const response = await http.post("/api/categorias", payload);
    return response.data;
}

export async function listarCategorias() : Promise<CategoriaResponse[]> {
    const response = await http.get("/api/categorias");
    return response.data;
}
