// Autenticação: registro, login e geração de JWT
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NestFin.API.Data;
using NestFin.API.Models;
using NestFin.API.Services;

namespace NestFin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // DTOs simples
        public record RegisterRequest(string Name, string Email, string Password);
        public record LoginRequest(string Email, string Password);
        public record AuthResponse(string Token, int UserId, string Name, string Email);

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Validação do nome
            var nameValidation = ValidationService.ValidateName(request.Name);
            if (!nameValidation.IsValid)
                return BadRequest(nameValidation.ErrorMessage);

            // Validação do email
            var emailValidation = ValidationService.ValidateEmail(request.Email);
            if (!emailValidation.IsValid)
                return BadRequest(emailValidation.ErrorMessage);

            // Validação da senha
            var passwordValidation = ValidationService.ValidatePassword(request.Password);
            if (!passwordValidation.IsValid)
                return BadRequest(passwordValidation.ErrorMessage);

            // Impede e-mail duplicado
            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (exists) return Conflict("Email já registrado");

            // Cria usuário com senha em hash
            var user = new User
            {
                Name = request.Name.Trim(),
                Email = request.Email.ToLower().Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // Salva no banco
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Gera token
            var token = GenerateJwt(user);
            return Ok(new AuthResponse(token, user.Id, user.Name, user.Email));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            // Busca por e-mail
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null) return Unauthorized("Credenciais inválidas");

            // Confere senha no bd
            var ok = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!ok) return Unauthorized("Credenciais inválidas");

            // Gera token = id 
            var token = GenerateJwt(user);
            return Ok(new AuthResponse(token, user.Id, user.Name, user.Email));
        }

        private string GenerateJwt(User user)
        {
            // Lê configs do JWT
            var secret = _configuration["JwtSettings:SecretKey"] ?? "dev_secret";
            var issuer = _configuration["JwtSettings:Issuer"] ?? "NestFin";
            var audience = _configuration["JwtSettings:Audience"] ?? "NestFinUsers";

            // Chave e credenciais
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims básicas
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.Name)
            };

            // Expiração
            var expiresMinutes = int.TryParse(_configuration["JwtSettings:ExpirationInMinutes"], out var m) ? m : 60;

            // Monta token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            // Retorna token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


