using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    /// <summary>
    /// Controlador responsável pelas operações relacionadas a Pessoas.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaService _service;

        public PessoasController(PessoaService service)
        {
            _service = service;
        }

        /// <summary>
        /// Cria uma nova pessoa.
        /// </summary>
        /// <param name="request">Dados da pessoa a ser criada.</param>
        /// <returns>Objeto da pessoa criada.</returns>
        /// <response code="201">Pessoa criada com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        [HttpPost]
        public async Task<ActionResult<PessoaResponse>> Criar(PessoaCreateRequest request)
        {
            var pessoa = await _service.CreatePessoaAsync(request);
            return Created(string.Empty, pessoa);
        }

        /// <summary>
        /// Retorna a lista de todas as pessoas cadastradas.
        /// </summary>
        /// <returns>Lista de pessoas.</returns>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar()
        {
            var pessoas = await _service.ListarPessoasAsync();
            return Ok(pessoas);
        }

        /// <summary>
        /// Remove uma pessoa pelo identificador.
        /// </summary>
        /// <param name="id">Identificador da pessoa.</param>
        /// <response code="204">Pessoa removida com sucesso.</response>
        /// <response code="404">Pessoa não encontrada.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _service.DeletePessoaAsync(id);
            return NoContent();
        }
    }
}
