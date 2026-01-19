using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Reports;
using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Models.Transacao;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    // Serviço de relatórios (somente leitura).
    // Responsável por gerar agregações (totais e saldo) por Pessoa e por Categoria.
    public class ReportsService
    {
        private readonly AppDbContext _db;

        public ReportsService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<RelatorioPorPessoaItemResponse>> ReportItemPorPessoa()
        {
            // Consulta read-only (AsNoTracking) e projeta dados "flat" para reduzir custo de materialização.
            // Estratégia: traz registros simples do banco e faz a agregação em memória
            // para manter a lógica de cálculo (decimal, saldo) clara e controlada.
            var rows = await (
                from t in _db.Transacoes.AsNoTracking()
                join p in _db.Pessoas.AsNoTracking() on t.PessoaId equals p.Id
                select new
                {
                    PessoaId = p.Id,
                    PessoaNome = p.Nome,
                    t.Tipo,
                    t.Valor
                }
            ).ToListAsync();

            // Agrupa por pessoa e calcula: total de receitas, total de despesas e saldo (receitas - despesas).
            var itens = rows
                .GroupBy(x => new { x.PessoaId, x.PessoaNome })
                .Select(g =>
                {
                    var totalReceitas = g.Where(x => x.Tipo == TipoTransacao.Receita).Sum(x => x.Valor);
                    var totalDespesas = g.Where(x => x.Tipo == TipoTransacao.Despesa).Sum(x => x.Valor);

                    return new RelatorioPorPessoaItemResponse
                    {
                        Pessoa = new PessoaResumoResponse
                        {
                            Id = g.Key.PessoaId,
                            Nome = g.Key.PessoaNome
                        },
                        TotalReceitas = totalReceitas,
                        TotalDespesas = totalDespesas,
                        Saldo = totalReceitas - totalDespesas
                    };
                })
                .ToList();

            return itens;
        }

        public async Task<List<RelatorioPorCategoriaItemResponse>> ReportItemPorCategoria()
        {
            // Consulta read-only (AsNoTracking) e projeta dados "flat".
            // Estratégia: traz registros simples do banco e agrega em memória para simplificar cálculos de totais e saldo.
            var rows = await (
                from t in _db.Transacoes.AsNoTracking()
                join c in _db.Categorias.AsNoTracking() on t.CategoriaId equals c.Id
                select new
                {
                    CategoriaId = c.Id,
                    CategoriaDescricao = c.Descricao,
                    t.Tipo,
                    t.Valor
                }
            ).ToListAsync();

            // Agrupa por categoria e calcula: total de receitas, total de despesas e saldo (receitas - despesas).
            var itens = rows
                .GroupBy(x => new { x.CategoriaId, x.CategoriaDescricao })
                .Select(g =>
                {
                    var totalReceitas = g.Where(x => x.Tipo == TipoTransacao.Receita).Sum(x => x.Valor);
                    var totalDespesas = g.Where(x => x.Tipo == TipoTransacao.Despesa).Sum(x => x.Valor);

                    return new RelatorioPorCategoriaItemResponse
                    {
                        Categoria = new CategoriaResumoResponse
                        {
                            Id = g.Key.CategoriaId,
                            Descricao = g.Key.CategoriaDescricao
                        },
                        TotalReceitas = totalReceitas,
                        TotalDespesas = totalDespesas,
                        Saldo = totalReceitas - totalDespesas
                    };
                })
                .ToList();

            return itens;
        }

        public RelatorioPorPessoaResponse ReportTotalPorPessoa(List<RelatorioPorPessoaItemResponse> itens)
        {
            // Monta o relatório final calculando totais gerais a partir dos itens já agregados.
            return new RelatorioPorPessoaResponse
            {
                Itens = itens,
                TotalGeralReceitas = itens.Sum(x => x.TotalReceitas),
                TotalGeralDespesas = itens.Sum(x => x.TotalDespesas),
                SaldoLiquido = itens.Sum(x => x.Saldo),
            };
        }

        public RelatorioPorCategoriaResponse ReportTotalPorCategoria(List<RelatorioPorCategoriaItemResponse> itens)
        {
            // Monta o relatório final calculando totais gerais a partir dos itens já agregados.
            return new RelatorioPorCategoriaResponse
            {
                Itens = itens,
                TotalGeralReceitas = itens.Sum(x => x.TotalReceitas),
                TotalGeralDespesas = itens.Sum(x => x.TotalDespesas),
                SaldoLiquido = itens.Sum(x => x.Saldo),
            };
        }

        public async Task<RelatorioPorPessoaResponse> GeralRelatorioPorPessoa()
        {
            // Orquestra a geração do relatório: itens (por pessoa) + totais gerais.
            var itens = await ReportItemPorPessoa();
            return ReportTotalPorPessoa(itens);
        }

        public async Task<RelatorioPorCategoriaResponse> GeralRelatorioPorCategoria()
        {
            // Orquestra a geração do relatório: itens (por categoria) + totais gerais.
            var itens = await ReportItemPorCategoria();
            return ReportTotalPorCategoria(itens);
        }
    }
}