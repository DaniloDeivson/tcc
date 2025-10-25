using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NestFin.API.Data;
using NestFin.API.Models;
using System.Security.Claims;

namespace NestFin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PersonalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonalController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetUserId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("sub");
            if (int.TryParse(sub, out var id)) return id;
            return null;
        }

        // GET api/personal/info
        [HttpGet("info")]
        public async Task<ActionResult<PersonalInfo>> GetInfo()
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();
            var info = await _context.PersonalInfos.FirstOrDefaultAsync(p => p.UserId == userId);
            if (info is null) return NotFound();
            return Ok(info);
        }

        public class PersonalInfoDto
        {
            public string? FullName { get; set; }
            public string? Email { get; set; }
            public string? Phone { get; set; }
            public decimal? MonthlyIncome { get; set; }
            public decimal? MonthlyFixedExpenses { get; set; }
            public decimal? MonthlyVariableExpenses { get; set; }
            public string? Notes { get; set; }
        }

        // PUT api/personal/info (upsert)
        [HttpPut("info")]
        public async Task<IActionResult> UpsertInfo([FromBody] PersonalInfoDto dto)
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();

            var info = await _context.PersonalInfos.FirstOrDefaultAsync(p => p.UserId == userId);
            if (info is null)
            {
                info = new PersonalInfo
                {
                    UserId = userId.Value,
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    MonthlyIncome = dto.MonthlyIncome,
                    MonthlyFixedExpenses = dto.MonthlyFixedExpenses,
                    MonthlyVariableExpenses = dto.MonthlyVariableExpenses,
                    Notes = dto.Notes,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.PersonalInfos.Add(info);
            }
            else
            {
                info.FullName = dto.FullName;
                info.Email = dto.Email;
                info.Phone = dto.Phone;
                info.MonthlyIncome = dto.MonthlyIncome;
                info.MonthlyFixedExpenses = dto.MonthlyFixedExpenses;
                info.MonthlyVariableExpenses = dto.MonthlyVariableExpenses;
                info.Notes = dto.Notes;
                info.UpdatedAt = DateTime.UtcNow;
                _context.PersonalInfos.Update(info);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class GoalDto
        {
            public string Name { get; set; } = string.Empty;
            public decimal TargetAmount { get; set; }
        }

        // POST api/personal/goals
        [HttpPost("goals")]
        public async Task<ActionResult<Goal>> CreateGoal([FromBody] GoalDto dto)
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Nome da meta é obrigatório");

            var goal = new Goal
            {
                UserId = userId.Value,
                Name = dto.Name,
                TargetAmount = dto.TargetAmount,
                CreatedAt = DateTime.UtcNow
            };
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return Ok(goal);
        }

        // GET api/personal/goals
        [HttpGet("goals")]
        public async Task<ActionResult<IEnumerable<Goal>>> ListGoals()
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();
            var goals = await _context.Goals.Where(g => g.UserId == userId).OrderByDescending(g => g.CreatedAt).ToListAsync();
            return Ok(goals);
        }
    }
}



