using Microsoft.EntityFrameworkCore;
using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.Models;
using ControleDeGastosResidencias.Api.Models.Categoria;

namespace ControleDeGastosResidencias.Api.Services
{
    // Camada de negócio responsável pelas regras e operações relacionadas a Categorias.
    public class CategoriaService
    {
        private readonly AppDbContext _db;

        public CategoriaService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<CategoriaResponse> CreateCategoriaAsync(CategoriaCreateRequest request)
        {
            // Regras de negócio: valida dados antes de criar a categoria.
            if (string.IsNullOrWhiteSpace(request.Descricao))
                throw new InvalidOperationException("A descricao e obrigatoria");

            // Garante que a finalidade informada exista no enum TipoFinalidadeCategoria.
            if (!Enum.IsDefined(typeof(TipoFinalidadeCategoria), request.Finalidade))
                throw new InvalidOperationException("A finalidade é obrigatória");

            // Cria a entidade de domínio após validações.
            var categoria = new Categoria(request.Descricao, request.Finalidade);

            // Persiste no banco e gera o Id.
            _db.Categorias.Add(categoria);
            await _db.SaveChangesAsync();

            // Retorna DTO (não expõe entidade).
            return new CategoriaResponse
            {
                Id = categoria.Id,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade
            };
        }

        public async Task<IReadOnlyList<CategoriaResponse>> ListarCategoriasAsync()
        {
            // Consulta somente leitura, ordenada por Id.
            return await _db.Categorias
                .OrderBy(c => c.Id)
                .Select(c => new CategoriaResponse
                {
                    Id = c.Id,
                    Descricao = c.Descricao,
                    Finalidade = c.Finalidade
                })
                .ToListAsync();
        }

        public async Task DeleteCategoriaAsync(int id)
        {
            // Remove uma categoria existente.
            // Se não for encontrada, lança exceção para retorno 404 no controller.
            var categoria = await _db.Categorias.FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                throw new KeyNotFoundException("Categoria não Encontrada");

            _db.Categorias.Remove(categoria);
            await _db.SaveChangesAsync();
        }
    }
}
