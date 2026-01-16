using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosResidencias.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriasController(CategoriaService service)
        {
            _service = service;
        }

        //POST: Criar Categoria
        [HttpPost]
        public async Task<ActionResult<CategoriaResponse>> Criar(CategoriaCreateRequest request)
        {
            var categoria = await _service.CreateCategoriaAsync(request);

            return Created(string.Empty, categoria);
        }

        //GET: Listar Todas As Categorias
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CategoriaResponse>>> Listar()
        {
            var categorias = await _service.ListarCategoriasAsync();

            return Ok(categorias);
        }

    }
}
