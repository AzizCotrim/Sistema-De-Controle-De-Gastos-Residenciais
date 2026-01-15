namespace ControleDeGastosResidencias.Api.DTOs.Reports
{
    public class RelatorioPorPessoaResponse
    {
        public List<RelatorioPorPessoaItemResponse> Itens { get; set; }
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
