using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaService _service;

        public PessoasController(PessoaService service)
        {
            _service = service;
        }

        //POST: Criar Pessoa
        [HttpPost]
        public async Task<ActionResult<PessoaResponse>> Criar(PessoaCreateRequest request)
        {
            var pessoa = await _service.CreatePessoaAsync(request);
            return Created(string.Empty, pessoa);
        }

        //LEMBRETE: Criar busca por id em todos os controllers


        //GET: Listar Todas As Pessoas
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar()
        {
            var pessoas = await _service.ListarPessoasAsync();

            return Ok(pessoas);
        }

        //DELETE: Deletar Pessoa 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            await _service.DeletePessoaAsync(id);

            return NoContent();
        }
    }
}
