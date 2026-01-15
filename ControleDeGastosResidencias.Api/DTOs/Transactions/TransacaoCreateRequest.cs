using ControleDeGastosResidencias.Api.Models.Transacao;

namespace ControleDeGastosResidencias.Api.DTOs.Transactions
{
    public class TransacaoCreateRequest
    {
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public int PessoaId { get; set; }
        public int CategoriaId { get; set; }
    }
}
