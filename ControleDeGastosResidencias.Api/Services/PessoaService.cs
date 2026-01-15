using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.Models.Pessoa;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    public class PessoaService
    {
        private readonly AppDbContext _db;

        public PessoaService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<PessoaResponse> CreatePessoaAsync(PessoaCreateRequest request)
        {
            //Regra de negócio: Validações
            if (string.IsNullOrWhiteSpace(request.Nome))
                throw new InvalidOperationException("O nome é obrigatório");

            if (request.Idade <= 0)
                throw new InvalidOperationException("A idade precisa ser positiva");

            var pessoa = new Pessoa(request.Nome, request.Idade);

            _db.Pessoas.Add(pessoa);
            await _db.SaveChangesAsync();

            return new PessoaResponse
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };
        }

        public async Task DeletePessoaAsync(int id)
        {
            var pessoa = await _db.Pessoas.FirstOrDefaultAsync(p => p.Id == id);

            if (pessoa == null)
                throw new KeyNotFoundException("Pessoa não Encontrada");

            _db.Pessoas.Remove(pessoa);
            await _db.SaveChangesAsync();
        }

        //Retornar lista apenas para leitura
        public async Task<IReadOnlyList<PessoaResponse>> ListarPessoasAsync()
        {
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
    }
}
