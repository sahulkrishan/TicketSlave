using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Configuration;
using webapi.Classes;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.var Configuration = builder.Configuration;
StripeConfiguration.ApiKey = "sk_test_51OFHWkKVCBU41NoxWMHjM9EzavGIpjAbunSvIqWxp7yB0JOk7j8vv6ccT1VKkyUiqHClyhgVXzNKBD1LyQIyE60V00IGrqvLnL";
builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
