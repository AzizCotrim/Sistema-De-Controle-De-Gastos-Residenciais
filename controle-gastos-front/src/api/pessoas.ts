import { http } from "./http";
import {type PessoaCreateRequest, type PessoaResponse} from "../types/pessoa"

export async function criarPessoa(payload:PessoaCreateRequest) : Promise<PessoaResponse> {
    const response = await http.post("/api/pessoas", payload);
    return response.data;
}

export async function listarPessoas() : Promise<PessoaResponse[]>{
    const response = await http.get("/api/pessoas");
    return response.data;
}

export async function deletarPessoa(id:number) {
    const response = await http.delete("/api/pessoas/" + id);
    return response.data;
}