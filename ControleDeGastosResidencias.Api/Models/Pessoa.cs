namespace ControleDeGastosResidencias.Api.Models
{
    public class Pessoa
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public int Idade { get; private set; }

        public Pessoa(string nome, int idade)
        {
            Nome = nome;
            Idade = idade;
        }
    }
}
