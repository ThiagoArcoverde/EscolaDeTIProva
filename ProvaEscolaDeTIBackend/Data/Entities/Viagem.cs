using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProvaEscolaDeTI.Data.Entities
{
    [Table("Viagens")]
    public class Viagem
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataSaida { get; set; }
        public DateTime DataChegada { get; set; }
        public decimal Valor { get; set; }
        public Destino? Destino { get; set; }

        public Viagem() { }
        public Viagem(string nome, DateTime dataSaida, DateTime dataChegada, decimal valor)
        {
            Nome = nome;
            DataSaida = dataSaida;
            DataChegada = dataChegada;
            Valor = valor;
        }

        public void AddDestino( Destino destino)
        {
            Destino = destino;
        }

        public void RemoveDestino()
        {
            Destino = null;
        }
    }
}
