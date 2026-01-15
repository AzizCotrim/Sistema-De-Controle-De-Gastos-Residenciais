using ControleDeGastosResidencias.Api.Models.Categoria;
using ControleDeGastosResidencias.Api.Models.Pessoa;
using ControleDeGastosResidencias.Api.Models.Transacao;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastosResidencias.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuracao de entidade Pessoa

            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Nome)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(p => p.Idade)
                      .IsRequired();
            });

            // Configuracao de entidade Categoria

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Descricao)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(c => c.Finalidade)
                      .IsRequired();
            });

            // Configuracao de entidade Transacao

            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Descricao)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(t => t.Valor)
                      .HasColumnType("decimal(18,2)");

                entity.Property(t => t.Tipo)
                      .IsRequired();

                entity.HasOne<Categoria>()
                      .WithMany()
                      .HasForeignKey(t => t.CategoriaId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<Pessoa>()
                      .WithMany()
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);

            });

        }

    }
}
