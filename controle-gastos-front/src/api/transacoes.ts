import { http } from "./http";
import type {TransacaoCreateRequest, TransacaoResponse} from "../types/transacao"
import type { CategoriaCreateRequest } from "../types/categoria";

export async function criarTransacao(payload: TransacaoCreateRequest) : Promise<TransacaoResponse>{
    const response = await http.post("/api/transacoes", payload);
    return response.data;
}

export async function listarTransacoes() : Promise<TransacaoResponse[]>{
    const response = await http.get("/api/transacoes");
    return response.data;
}