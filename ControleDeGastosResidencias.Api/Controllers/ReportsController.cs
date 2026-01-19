using ControleDeGastosResidencias.Api.DTOs.Reports;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    /// <summary>
    /// Controlador responsável pela geração de relatórios financeiros.
    /// </summary>
    /// <remarks>
    /// Os relatórios são somente leitura e retornam dados agregados
    /// (totais de receitas, despesas e saldo).
    /// </remarks>
    [Route("api/relatorios")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsService _service;

        public ReportsController(ReportsService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gera o relatório financeiro agrupado por pessoa.
        /// </summary>
        /// <returns>Relatório contendo totais de receitas, despesas e saldo por pessoa.</returns>
        /// <response code="200">Relatório gerado com sucesso.</response>
        [HttpGet("por-pessoa")]
        public async Task<ActionResult<RelatorioPorPessoaResponse>> GerarPorPessoas()
        {
            var relatorio = await _service.GeralRelatorioPorPessoa();
            return Ok(relatorio);
        }

        /// <summary>
        /// Gera o relatório financeiro agrupado por categoria.
        /// </summary>
        /// <returns>Relatório contendo totais de receitas, despesas e saldo por categoria.</returns>
        /// <response code="200">Relatório gerado com sucesso.</response>
        [HttpGet("por-categoria")]
        public async Task<ActionResult<RelatorioPorCategoriaResponse>> GerarPorCategorias()
        {
            var relatorio = await _service.GeralRelatorioPorCategoria();
            return Ok(relatorio);
        }
    }
}
