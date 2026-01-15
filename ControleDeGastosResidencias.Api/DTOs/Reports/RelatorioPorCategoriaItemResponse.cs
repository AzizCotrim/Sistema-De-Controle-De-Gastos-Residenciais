using ControleDeGastosResidencias.Api.DTOs.Transactions;

namespace ControleDeGastosResidencias.Api.DTOs.Reports
{
    public class RelatorioPorCategoriaItemResponse
    {
        public CategoriaResumoResponse Categoria { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
