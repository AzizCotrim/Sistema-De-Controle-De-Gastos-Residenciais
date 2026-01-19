using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.Models.Pessoa;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    // Camada de negócio para operações de Pessoa.
    // Centraliza validações e retorna DTOs para evitar expor entidades diretamente.
    public class PessoaService
    {
        private readonly AppDbContext _db;

        public PessoaService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<PessoaResponse> CreatePessoaAsync(PessoaCreateRequest request)
        {
            // Regras de negócio: valida a entrada antes de criar a entidade.
            if (string.IsNullOrWhiteSpace(request.Nome))
                throw new InvalidOperationException("O nome é obrigatório");

            if (request.Idade <= 0)
                throw new InvalidOperationException("A idade precisa ser positiva");

            // Cria a entidade de domínio após validações.
            var pessoa = new Pessoa(request.Nome, request.Idade);

            // Persiste e obtém o Id gerado pelo banco/EF.
            _db.Pessoas.Add(pessoa);
            await _db.SaveChangesAsync();

            // Retorna DTO (não expõe a entidade).
            return new PessoaResponse
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };
        }

        public async Task<IReadOnlyList<PessoaResponse>> ListarPessoasAsync()
        {
            // Consulta somente leitura, ordenada por Id.
            return await _db.Pessoas
                .OrderBy(p => p.Id)
                .Select(p => new PessoaResponse
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade
                })
                .ToListAsync();
        }

        public async Task DeletePessoaAsync(int id)
        {
            // Remove uma pessoa existente.
            // Se não existir, lança KeyNotFoundException.
            var pessoa = await _db.Pessoas.FirstOrDefaultAsync(p => p.Id == id);

            if (pessoa == null)
                throw new KeyNotFoundException("Pessoa não Encontrada");

            _db.Pessoas.Remove(pessoa);
            await _db.SaveChangesAsync();
        }
    }
}
