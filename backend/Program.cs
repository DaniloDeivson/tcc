// Programa: configura DB, CORS, Swagger, Auth (JWT) e o pipeline HTTP
using NestFin.API.Data; // DbContext
using Microsoft.EntityFrameworkCore; // EF Core
using Microsoft.AspNetCore.Authentication.JwtBearer; // Autenticação JWT
using Microsoft.IdentityModel.Tokens; // Validação do token
using System.Text; // Codificação da chave secreta
using NestFin.API.Repositories;
using NestFin.API.Repositories.Interfaces;
using NestFin.API.Services;
using NestFin.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args); // Host e DI

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database (MySQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// AutoMapper (opcional)
builder.Services.AddAutoMapper(typeof(Program));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<FinancialCalculationService>();

// CORS (libera geral para dev)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Auth JWT (Bearer)
var jwtSecret = builder.Configuration["JwtSettings:SecretKey"] ?? "dev_secret";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// Pipeline: Swagger em Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // desligado no dev
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();