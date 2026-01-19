using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    /// <summary>
    /// Controlador responsável pelas operações relacionadas a Transações.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _service;

        public TransacoesController(TransacaoService service)
        {
            _service = service;
        }

        /// <summary>
        /// Cria uma nova transação financeira.
        /// </summary>
        /// <param name="request">Dados da transação a ser criada.</param>
        /// <returns>Objeto da transação criada.</returns>
        /// <response code="201">Transação criada com sucesso.</response>
        /// <response code="400">Dados inválidos ou violação de regra de negócio.</response>
        /// <response code="404">Pessoa ou categoria não encontrada.</response>
        [HttpPost]
        public async Task<ActionResult<TransacaoResponse>> Criar(TransacaoCreateRequest request)
        {
            var transacao = await _service.CreateTransacaoAsync(request);
            return Created(string.Empty, transacao);
        }

        /// <summary>
        /// Retorna a lista de todas as transações cadastradas.
        /// </summary>
        /// <returns>Lista de transações.</returns>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar()
        {
            var transacoes = await _service.ListarTransacaoAsync();
            return Ok(transacoes);
        }
    }
}
