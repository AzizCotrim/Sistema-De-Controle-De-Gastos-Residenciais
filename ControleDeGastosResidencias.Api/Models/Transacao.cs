namespace ControleDeGastosResidencias.Api.Models
{
    public class Transacao
    {
        public int Id { get; private set; }
        public string Descricao { get; private set; }
        public decimal Valor { get; private set; }
        public TipoTransacao Tipo { get; private set; }
        public int CategoriaId { get; private set; }
        public int PessoaId { get; private set; }
                
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, int categoria, int pessoa)
        {
            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;
            CategoriaId = categoria;
            PessoaId = pessoa;
        }
    }
}
