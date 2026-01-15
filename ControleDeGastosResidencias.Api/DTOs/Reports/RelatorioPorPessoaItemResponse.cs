using ControleDeGastosResidencias.Api.DTOs.Transactions;

namespace ControleDeGastosResidencias.Api.DTOs.Reports
{
    public class RelatorioPorPessoaItemResponse
    {
        public PessoaResumoResponse Pessoa { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
