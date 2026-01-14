using ControleDeGastosResidencias.Api.Models;

namespace ControleDeGastosResidencias.Api.DTOs.Categories
{
    public class CategoriaResponse
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public TipoFinalidadeCategoria Finalidade { get; set; }
    }
}
