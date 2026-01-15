namespace ControleDeGastosResidencias.Api.DTOs.Reports
{
    public class RelatorioPorCategoriaResponse
    {
        public List<RelatorioPorCategoriaItemResponse> Itens { get; set; }
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
