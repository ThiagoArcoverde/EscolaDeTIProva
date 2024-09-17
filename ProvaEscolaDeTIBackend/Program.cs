using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProvaEscolaDeTI.Data;
using ProvaEscolaDeTI.Data.Entities;
using ProvaEscolaDeTI.DTO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlite("Data Source=EscolaDeTI.db");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("api/viagem", async (Context contexto) =>
{
    var viagens = await contexto.Viagens
    .Include(w => w.Destino)    
    .ToListAsync();
    return Results.Ok(viagens);
});

app.MapGet("api/destino", async (Context contexto) =>
{
    var destinos = await contexto.Destinos.ToListAsync();
    return Results.Ok(destinos);
});

app.MapGet("api/viagem/{id:int}", async (Context contexto, int id) =>
{
    var viagem = await contexto.Viagens.FirstOrDefaultAsync(w => w.Id == id);
    if (viagem is null)
        return Results.NotFound();
    return Results.Ok(viagem);
});
app.MapGet("api/destino/{id:int}", async (Context contexto, int id) =>
{
    var destino = await contexto.Destinos.SingleOrDefaultAsync(w => w.Id == id);
    if (destino is null)
        return Results.NotFound();
    return Results.Ok(destino);
});

app.MapPost("api/viagem", async (Context contexto, CriarViagemDTO dto) =>
{
    try
    {
        var viagem = new Viagem(dto.Nome, dto.DataSaida, dto.DataChegada, dto.Valor);
        await contexto.Viagens.AddAsync(viagem);
        await contexto.SaveChangesAsync();
        return Results.Created();
    }
    catch (Exception e)
    {
        return Results.Problem(e.Message);
    }
});

app.MapPost("api/destino", async (Context contexto, CriarDestinoDTO dto) =>
{
    try
    {
        var destino = new Destino(dto.Nome);
        await contexto.Destinos.AddAsync(destino);
        await contexto.SaveChangesAsync();
        return Results.Created();
    }
    catch (Exception e)
    {
        return Results.Problem(e.Message);
    }
});

app.MapPost("api/viagem/destino/adicionar", async (Context contexto, [FromQuery]int destinoId, [FromQuery]int viagemId) =>
{
    var viagem = await contexto.Viagens.Where(w => w.Id == viagemId).FirstOrDefaultAsync();
    if (viagem is null)
        return Results.NotFound("Viagem não encontrada");
    var destino = await contexto.Destinos.Where(w => w.Id == destinoId).FirstOrDefaultAsync();
    if (destino is null)
        return Results.NotFound("Destino não encontrado");

    viagem.AddDestino(destino);
    await contexto.SaveChangesAsync();
    return Results.Ok();
});

app.MapPost("api/viagem/destino/remover/{id:int}", async (Context contexto, int id) =>
{
    var viagem = await contexto.Viagens.SingleOrDefaultAsync(w => w.Id == id);
    if (viagem is null)
        return Results.NotFound("Viagem nao encontrada");
    if (viagem.Destino is null)
        return Results.BadRequest("Viagem não possui destino.");
    viagem.RemoveDestino();
    await contexto.SaveChangesAsync();
    return Results.Ok();
});

app.MapDelete("api/viagem/{id:int}", async (Context contexto, int id) =>
{
    try
    {
        var viagem = await contexto.Viagens.SingleOrDefaultAsync(w => w.Id == id);
        if (viagem is null)
            return Results.NotFound();
        contexto.Viagens.Remove(viagem);
        await contexto.SaveChangesAsync();
        return Results.Ok();
    }
    catch (Exception e)
    {
        return Results.Problem(e.Message);
    }
});

app.MapDelete("api/destino/{id:int}", async (Context contexto, int id) =>
{
    try
    {
        var destino = await contexto.Destinos.SingleOrDefaultAsync(w => w.Id == id);
        if (destino is null)
            return Results.NotFound();
        contexto.Destinos.Remove(destino);
        await contexto.SaveChangesAsync();
        return Results.Ok();
    }
    catch (Exception e)
    {
        return Results.Problem(e.Message);
    }
});



app.Run();
