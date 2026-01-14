using ControleDeGastosResidencias.Api.Models.Transacao;

namespace ControleDeGastosResidencias.Api.DTOs.Transactions
{
    public class TransacaoResponse
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public PessoaResumoResponse PessoaResumo { get; set; }
        public CategoriaResumoResponse CategoriaResumo { get; set; }
    }
}
