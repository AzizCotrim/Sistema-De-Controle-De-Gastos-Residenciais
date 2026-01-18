using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Models;
using ControleDeGastosResidencias.Api.Models.Transacao;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    public class TransacaoService
    {
        private readonly AppDbContext _db;

        public TransacaoService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<TransacaoResponse> CreateTransacaoAsync(TransacaoCreateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Descricao) || request.Valor <= 0)
                throw new InvalidOperationException("Dados inseridos invalidos");


            var pessoa = await _db.Pessoas.Where(p => p.Id == request.PessoaId)
                                          .Select(p => new PessoaResponse { Id = p.Id, Nome = p.Nome, Idade = p.Idade })
                                          .FirstOrDefaultAsync();

            if (pessoa == null)
                throw new KeyNotFoundException("Pessoa nao encontrada");

            if (pessoa.Idade < 18 && request.Tipo == TipoTransacao.Receita)
                throw new InvalidOperationException("So pode ser cadastrado despesas para menores de 18 anos");



            var categoria = await _db.Categorias
                .Where(c => c.Id == request.CategoriaId)
                .Select(c => new CategoriaResponse { Id = c.Id, Descricao = c.Descricao, Finalidade = c.Finalidade })
                .FirstOrDefaultAsync();

            if (categoria == null)
                throw new KeyNotFoundException("Categoria nao encontrada");

            //Regra de negocios: Apenas cadastrar uma transacao que o tipo seja igual a finalidade da categoria ou seja com o valor ambas
            bool liberado = ((int)categoria.Finalidade == (int)request.Tipo)
                               || categoria.Finalidade == TipoFinalidadeCategoria.Ambas;

            if (!liberado)
                throw new InvalidOperationException("Essa categoria não permite esse tipo de transação.");



            var transacao = new Transacao(request.Descricao, request.Valor, request.Tipo,
                                          request.CategoriaId, request.PessoaId);

            _db.Transacoes.Add(transacao);
            await _db.SaveChangesAsync();



            return new TransacaoResponse
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                CategoriaResumo = new CategoriaResumoResponse { Id = categoria.Id, Descricao = categoria.Descricao },
                PessoaResumo = new PessoaResumoResponse { Id = pessoa.Id, Nome = pessoa.Nome }
            };
        }

        public async Task<IReadOnlyList<TransacaoResponse>> ListarTransacaoAsync()
        {
            var query =
                from t in _db.Transacoes
                join p in _db.Pessoas on t.PessoaId equals p.Id
                join c in _db.Categorias on t.CategoriaId equals c.Id
                orderby t.Id

                select new TransacaoResponse
                {
                    Id = t.Id,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = t.Tipo,

                    PessoaResumo = new PessoaResumoResponse
                    {
                        Id = p.Id,
                        Nome = p.Nome
                    },

                    CategoriaResumo = new CategoriaResumoResponse
                    {
                        Id = c.Id,
                        Descricao = c.Descricao,
                    }
                };

            return await query.ToListAsync();
        }

        public async Task DeleteTransacaoAsync(int id)
        {
            var transacao = await _db.Transacoes.FirstOrDefaultAsync(t => t.Id == id);

            if (transacao == null)
                throw new KeyNotFoundException("Transacao não Encontrada");

            _db.Transacoes.Remove(transacao);
            await _db.SaveChangesAsync();
        }
    }
}
