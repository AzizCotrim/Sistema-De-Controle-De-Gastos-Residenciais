namespace ControleDeGastosResidencias.Api.Models.Categoria
{
    public class Categoria
    {
        public int Id { get; private set; }
        public string Descricao { get; private set; }
        public TipoFinalidadeCategoria Finalidade { get; private set; }

        private Categoria()
        {
        }

        public Categoria(string descricao, TipoFinalidadeCategoria finalidade)
        {
            Descricao = descricao;
            Finalidade = finalidade;
        }
    }
}
