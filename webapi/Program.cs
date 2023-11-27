using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;

var builder = WebApplication.CreateBuilder(args);

        
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "angularapp/dist";
});

// Add services to the container.var Configuration = builder.Configuration;
builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 12;
        options.Password.RequireDigit = true; 
        options.Password.RequireLowercase = true; 
        options.Password.RequireUppercase = true; 
        options.Password.RequireNonAlphanumeric = true; 
        
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value is { Errors.Count: > 0 })
                .SelectMany(e => e.Value!.Errors.Select(error => new ResponseResult
                {
                    Code = "ValidationError",
                    Field = e.Key,
                    Description = error.ErrorMessage
                }))
                .ToList();
            
            return new BadRequestObjectResult(errors)
            {
                ContentTypes = { "application/problem+json" }
            };
        };
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply database migrations at application startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Seed database with default values
var seeder = new Seeder(app.Services);
seeder.AddRoles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await seeder.AddTestUsers();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();
}
app.UseCors(b => 
    b.WithOrigins("http://localhost:4200"));

app.UseAuthorization();

app.MapControllers();

app.Run();
