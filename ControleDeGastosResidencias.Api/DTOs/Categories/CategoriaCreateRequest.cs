using ControleDeGastosResidencias.Api.Models;

namespace ControleDeGastosResidencias.Api.DTOs.Categories
{
    public class CategoriaCreateRequest
    {
        public string Descricao { get; set; }
        public TipoFinalidadeCategoria Finalidade { get; set; }
    }
}
