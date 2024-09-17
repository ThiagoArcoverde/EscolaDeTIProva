using Microsoft.EntityFrameworkCore;
using ProvaEscolaDeTI.Data.Entities;

namespace ProvaEscolaDeTI.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }
        public DbSet<Viagem> Viagens { get; set; }
        public DbSet<Destino> Destinos { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Viagem>().HasKey(m => m.Id);
            builder.Entity<Destino>().HasKey(m => m.Id);

            base.OnModelCreating(builder);
        }

    }
}
