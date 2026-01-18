using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Reports;
using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Models.Transacao;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    public class ReportsService
    {
        private readonly AppDbContext _db;

        public ReportsService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<RelatorioPorPessoaItemResponse>> ReportItemPorPessoa()
        {
            // 1) traz dados "flat" do banco
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

            // 2) agrupa e soma em memória (aqui decimal funciona)
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
            var relatorio = new RelatorioPorPessoaResponse
            {
                Itens = itens,
                TotalGeralReceitas = itens.Sum(x => x.TotalReceitas),
                TotalGeralDespesas = itens.Sum(x => x.TotalDespesas),
                SaldoLiquido = itens.Sum(x => x.Saldo),
            };

            return relatorio;
        }

        public RelatorioPorCategoriaResponse ReportTotalPorCategoria(List<RelatorioPorCategoriaItemResponse> itens)
        {
            var relatorio = new RelatorioPorCategoriaResponse
            {
                Itens = itens,
                TotalGeralReceitas = itens.Sum(x => x.TotalReceitas),
                TotalGeralDespesas = itens.Sum(x => x.TotalDespesas),
                SaldoLiquido = itens.Sum(x => x.Saldo),
            };

            return relatorio;
        }

        public async Task<RelatorioPorPessoaResponse> GeralRelatorioPorPessoa()
        {
            var itens = await ReportItemPorPessoa();
            var relatorio = ReportTotalPorPessoa(itens);

            return relatorio;
        }

        public async Task<RelatorioPorCategoriaResponse> GeralRelatorioPorCategoria()
        {
            var itens = await ReportItemPorCategoria();
            var relatorio = ReportTotalPorCategoria(itens);

            return relatorio;
        }
    }
}
