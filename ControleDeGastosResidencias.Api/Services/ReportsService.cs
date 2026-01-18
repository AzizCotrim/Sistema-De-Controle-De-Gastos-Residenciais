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
            var itens = await (
                        from t in _db.Transacoes
                        join p in _db.Pessoas on t.PessoaId equals p.Id
                        group t by new { p.Id, p.Nome } into g

                        select new RelatorioPorPessoaItemResponse
                        {
                            Pessoa = new PessoaResumoResponse
                            {
                                Id = g.Key.Id,
                                Nome = g.Key.Nome
                            },
                            TotalReceitas = g.Sum(x =>
                                x.Tipo == TipoTransacao.Receita ? x.Valor : 0
                            ),
                            TotalDespesas = g.Sum(x =>
                                x.Tipo == TipoTransacao.Despesa ? x.Valor : 0
                            ),
                            Saldo =
                                g.Sum(x => x.Tipo == TipoTransacao.Receita ? x.Valor : 0)
                              - g.Sum(x => x.Tipo == TipoTransacao.Despesa ? x.Valor : 0)
                        }

            ).ToListAsync();

            return itens;
        }

        public async Task<List<RelatorioPorCategoriaItemResponse>> ReportItemPorCategoria()
        {
            var itens = await (
                        from t in _db.Transacoes
                        join c in _db.Categorias on t.PessoaId equals c.Id
                        group t by new { c.Id, c.Descricao } into g

                        select new RelatorioPorCategoriaItemResponse
                        {
                            Categoria = new CategoriaResumoResponse
                            {
                                Id = g.Key.Id,
                                Descricao = g.Key.Descricao
                            },
                            TotalReceitas = g.Sum(x =>
                                x.Tipo == TipoTransacao.Receita ? x.Valor : 0
                            ),
                            TotalDespesas = g.Sum(x =>
                                x.Tipo == TipoTransacao.Despesa ? x.Valor : 0
                            ),
                            Saldo =
                                g.Sum(x => x.Tipo == TipoTransacao.Receita ? x.Valor : 0)
                              - g.Sum(x => x.Tipo == TipoTransacao.Despesa ? x.Valor : 0)
                        }

            ).ToListAsync();

            return itens;
        }

        public async Task<RelatorioPorPessoaResponse> ReportTotalPorPessoa(List<RelatorioPorPessoaItemResponse> itens)
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

        public async Task<RelatorioPorCategoriaResponse> ReportTotalPorCategoria(List<RelatorioPorCategoriaItemResponse> itens)
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
    }
}
