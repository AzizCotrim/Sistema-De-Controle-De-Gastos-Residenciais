import { http } from "./http";

export async function listarCategorias() {
    const response = await http.get("/api/categorias");
    return response.data;
}