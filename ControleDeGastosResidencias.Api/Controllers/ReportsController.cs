using ControleDeGastosResidencias.Api.DTOs.Reports;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    [Route("api/relatorios")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsService _service;

        public ReportsController(ReportsService service)
        {
            _service = service;
        }

        [HttpGet("por-pessoa")]
        public async Task<ActionResult<RelatorioPorPessoaResponse>> GerarPorPessoas()
        {
            var relatorio = await _service.GeralRelatorioPorPessoa();

            return Ok(relatorio);
        }

        [HttpGet("por-categoria")]
        public async Task<ActionResult<RelatorioPorCategoriaResponse>> GerarPorCategorias()
        {
            var relatorio = await _service.GeralRelatorioPorCategoria();

            return Ok(relatorio);
        }
    }
}
