﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProvaEscolaDeTI.Data;

#nullable disable

namespace ProvaEscolaDeTI.Migrations
{
    [DbContext(typeof(Context))]
    partial class ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

            modelBuilder.Entity("ProvaEscolaDeTI.Data.Entities.Destino", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Destinos");
                });

            modelBuilder.Entity("ProvaEscolaDeTI.Data.Entities.Viagem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DataChegada")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DataSaida")
                        .HasColumnType("TEXT");

                    b.Property<int?>("DestinoId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Valor")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("DestinoId");

                    b.ToTable("Viagens");
                });

            modelBuilder.Entity("ProvaEscolaDeTI.Data.Entities.Viagem", b =>
                {
                    b.HasOne("ProvaEscolaDeTI.Data.Entities.Destino", "Destino")
                        .WithMany()
                        .HasForeignKey("DestinoId");

                    b.Navigation("Destino");
                });
#pragma warning restore 612, 618
        }
    }
}
