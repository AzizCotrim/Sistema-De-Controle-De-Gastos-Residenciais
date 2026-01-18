import type { PessoaResumoResponse } from "./pessoa";
import type { CategoriaResumoResponse } from "./categoria";

export type RelatorioPorPessoaItemResponse = {
  pessoa: PessoaResumoResponse;
  totalReceitas: number; // no JSON pode vir number (mesmo que no C# seja decimal)
  totalDespesas: number;
  saldo: number;
};

export type RelatorioPorPessoaResponse = {
  itens: RelatorioPorPessoaItemResponse[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
};

export type RelatorioPorCategoriaItemResponse = {
  categoria: CategoriaResumoResponse;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type RelatorioPorCategoriaResponse = {
  itens: RelatorioPorCategoriaItemResponse[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
};