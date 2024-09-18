using System.ComponentModel.DataAnnotations.Schema;

namespace ProvaEscolaDeTI.Data.Entities
{
    [Table("Destinos")]
    public class Destino
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty; 
        public Destino() { }
        public Destino(string nome)
        {
            Nome = nome;
        }
    }
}
