using Microsoft.EntityFrameworkCore;
using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.Models;
using ControleDeGastosResidencias.Api.Models.Categoria;

namespace ControleDeGastosResidencias.Api.Services
{
    public class CategoriaService
    {
        private readonly AppDbContext _db;

        public CategoriaService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<CategoriaResponse> CreateCategoriaAsync(CategoriaCreateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Descricao))
                throw new InvalidOperationException("A descricao e obrigatoria");

            // Remove the null check for value type enum, and instead check for a valid enum value if needed
            if (!Enum.IsDefined(typeof(TipoFinalidadeCategoria), request.Finalidade))
                throw new InvalidOperationException("A finalidade é obrigatória");

            var categoria = new Categoria(request.Descricao, request.Finalidade);

            _db.Categorias.Add(categoria);
            await _db.SaveChangesAsync();

            return new CategoriaResponse
            {
                Id = categoria.Id,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade
            };
        }

        public async Task<IReadOnlyList<CategoriaResponse>> ListarCategoriasAsync()
        {
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
    }
}
