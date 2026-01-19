using ControleDeGastosResidencias.Api.Data;
using ControleDeGastosResidencias.Api.DTOs.Categories;
using ControleDeGastosResidencias.Api.DTOs.People;
using ControleDeGastosResidencias.Api.DTOs.Transactions;
using ControleDeGastosResidencias.Api.Models;
using ControleDeGastosResidencias.Api.Models.Transacao;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Services
{
    // Camada de negócio de Transações.
    // Centraliza validações, regras (idade, finalidade da categoria) e montagem do DTO de resposta.
    public class TransacaoService
    {
        private readonly AppDbContext _db;

        public TransacaoService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<TransacaoResponse> CreateTransacaoAsync(TransacaoCreateRequest request)
        {
            // Validação mínima: descrição obrigatória e valor precisa ser positivo.
            if (string.IsNullOrWhiteSpace(request.Descricao) || request.Valor <= 0)
                throw new InvalidOperationException("Dados inseridos invalidos");

            // Busca a pessoa vinculada (projetando para DTO para evitar carregar entidade inteira).
            var pessoa = await _db.Pessoas.Where(p => p.Id == request.PessoaId)
                                          .Select(p => new PessoaResponse { Id = p.Id, Nome = p.Nome, Idade = p.Idade })
                                          .FirstOrDefaultAsync();

            if (pessoa == null)
                throw new KeyNotFoundException("Pessoa nao encontrada");

            // Regra de negócio: menores de 18 não podem cadastrar Receita (apenas Despesa).
            if (pessoa.Idade < 18 && request.Tipo == TipoTransacao.Receita)
                throw new InvalidOperationException("So pode ser cadastrado despesas para menores de 18 anos");

            // Busca a categoria vinculada (projetando para DTO).
            var categoria = await _db.Categorias
                .Where(c => c.Id == request.CategoriaId)
                .Select(c => new CategoriaResponse { Id = c.Id, Descricao = c.Descricao, Finalidade = c.Finalidade })
                .FirstOrDefaultAsync();

            if (categoria == null)
                throw new KeyNotFoundException("Categoria nao encontrada");

            // Regra de negócio: só permite transação se o Tipo for compatível com a Finalidade da Categoria,
            // ou se a categoria for "Ambas".
            bool liberado = ((int)categoria.Finalidade == (int)request.Tipo)
                               || categoria.Finalidade == TipoFinalidadeCategoria.Ambas;

            if (!liberado)
                throw new InvalidOperationException("Essa categoria não permite esse tipo de transação.");

            // Cria a entidade de domínio e persiste no banco.
            var transacao = new Transacao(request.Descricao, request.Valor, request.Tipo,
                                          request.CategoriaId, request.PessoaId);

            _db.Transacoes.Add(transacao);
            await _db.SaveChangesAsync();

            // Retorna DTO com resumos de Pessoa e Categoria (evita múltiplas chamadas no frontend).
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
            // Lista transações com JOIN em Pessoa e Categoria para retornar os resumos no mesmo payload.
            // Ordena por Id para manter histórico consistente.
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
                    PessoaResumo = new PessoaResumoResponse { Id = p.Id, Nome = p.Nome },
                    CategoriaResumo = new CategoriaResumoResponse { Id = c.Id, Descricao = c.Descricao }
                };

            return await query.ToListAsync();
        }

        public async Task DeleteTransacaoAsync(int id)
        {
            // Remove uma transação existente; se não existir, lança exceção para retorno 404.
            var transacao = await _db.Transacoes.FirstOrDefaultAsync(t => t.Id == id);

            if (transacao == null)
                throw new KeyNotFoundException("Transacao não Encontrada");

            _db.Transacoes.Remove(transacao);
            await _db.SaveChangesAsync();
        }
    }
}
