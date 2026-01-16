using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _service;

        public TransacoesController(TransacaoService service)
        {
            _service = service;
        }

        //POST:
        [HttpPost]
        public async Task<ActionResult<TransacaoResponse>> Criar(TransacaoCreateRequest request)
        {
            var transacao = await _service.CreateTransacaoAsync(request);

            return Created(string.Empty, transacao);
        }

        //GET:
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar()
        {
            var transacoes = await _service.ListarTransacaoAsync();

            return Ok(transacoes);
        }

    }
}
