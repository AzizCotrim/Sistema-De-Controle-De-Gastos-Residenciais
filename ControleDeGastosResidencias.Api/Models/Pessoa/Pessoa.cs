namespace ControleDeGastosResidencias.Api.Models.Pessoa
{
    public class Pessoa
    {
        //O Id é gerado pelo banco de dados; por isso o setter é privado para evitar atribuição manual.
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public int Idade { get; private set; }

        private Pessoa()
        {
        }

        public Pessoa(string nome, int idade)
        {
            Nome = nome;
            Idade = idade;
        }
    }
}
