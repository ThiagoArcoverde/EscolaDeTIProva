namespace ProvaEscolaDeTI.DTO
{
    public class CriarViagemDTO
    {
        public string Nome { get; set; } = string.Empty;
        public DateTime DataSaida {  get; set; }
        public DateTime DataChegada { get; set; }
        public decimal Valor { get; set; }
    }
}
