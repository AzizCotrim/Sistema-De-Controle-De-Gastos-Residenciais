using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    /// <summary>
    /// Controlador responsável pelas operações relacionadas a Categorias.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriasController(CategoriaService service)
        {
            _service = service;
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        /// <param name="request">Dados da categoria a ser criada.</param>
        /// <returns>Objeto da categoria criada.</returns>
        /// <response code="201">Categoria criada com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        [HttpPost]
        public async Task<ActionResult<CategoriaResponse>> Criar(CategoriaCreateRequest request)
        {
            var categoria = await _service.CreateCategoriaAsync(request);
            return Created(string.Empty, categoria);
        }

        /// <summary>
        /// Retorna a lista de todas as categorias cadastradas.
        /// </summary>
        /// <returns>Lista de categorias.</returns>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CategoriaResponse>>> Listar()
        {
            var categorias = await _service.ListarCategoriasAsync();
            return Ok(categorias);
        }
    }
}
