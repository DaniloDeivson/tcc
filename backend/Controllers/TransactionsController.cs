using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NestFin.API.Data;
using NestFin.API.Models;
using NestFin.API.Services;

namespace NestFin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly FinancialCalculationService _calculationService;

        public TransactionsController(ApplicationDbContext context, FinancialCalculationService calculationService)
        {
            _context = context;
            _calculationService = calculationService;
        }

        // DTOs
        public record CreateTransactionRequest(
            string Description,
            decimal Amount,
            TransactionType Type,
            TransactionCategory Category,
            DateTime Date,
            string? Notes = null,
            string? Location = null
        );

        public record UpdateTransactionRequest(
            string Description,
            decimal Amount,
            TransactionType Type,
            TransactionCategory Category,
            DateTime Date,
            string? Notes = null,
            string? Location = null
        );

        public record TransactionResponse(
            int Id,
            string Description,
            decimal Amount,
            TransactionType Type,
            TransactionCategory Category,
            DateTime Date,
            string? Notes,
            string? Location,
            DateTime CreatedAt
        );

        /// <summary>
        /// Cria nova transação
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TransactionResponse>> CreateTransaction(CreateTransactionRequest request)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário - implementar autenticação

            var transaction = new Transaction
            {
                UserId = userId,
                Description = request.Description,
                Amount = request.Amount,
                Type = request.Type,
                Category = request.Category,
                Date = request.Date,
                Notes = request.Notes,
                Location = request.Location,
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new TransactionResponse(
                transaction.Id,
                transaction.Description,
                transaction.Amount,
                transaction.Type,
                transaction.Category,
                transaction.Date,
                transaction.Notes,
                transaction.Location,
                transaction.CreatedAt
            ));
        }

        /// <summary>
        /// Lista transações do usuário
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<TransactionResponse>>> GetTransactions(
            int page = 1, 
            int pageSize = 20,
            TransactionType? type = null,
            TransactionCategory? category = null,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var query = _context.Transactions
                .Where(t => t.UserId == userId && t.IsActive);

            if (type.HasValue)
                query = query.Where(t => t.Type == type.Value);

            if (category.HasValue)
                query = query.Where(t => t.Category == category.Value);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            var transactions = await query
                .OrderByDescending(t => t.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TransactionResponse(
                    t.Id,
                    t.Description,
                    t.Amount,
                    t.Type,
                    t.Category,
                    t.Date,
                    t.Notes,
                    t.Location,
                    t.CreatedAt
                ))
                .ToListAsync();

            return Ok(transactions);
        }

        /// <summary>
        /// Obtém relatório financeiro completo
        /// </summary>
        [HttpGet("report")]
        public async Task<ActionResult<FinancialReport>> GetFinancialReport(int months = 6)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var report = await _calculationService.CalculateFinancialReport(userId, months);
            return Ok(report);
        }

        /// <summary>
        /// Obtém análise de gastos
        /// </summary>
        [HttpGet("spending-analysis")]
        public async Task<ActionResult<SpendingAnalysis>> GetSpendingAnalysis(int days = 30)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var analysis = await _calculationService.CalculateSpendingAnalysis(userId, days);
            return Ok(analysis);
        }

        /// <summary>
        /// Obtém patrimônio líquido
        /// </summary>
        [HttpGet("net-worth")]
        public async Task<ActionResult<decimal>> GetNetWorth()
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var netWorth = await _calculationService.CalculateNetWorth(userId);
            return Ok(netWorth);
        }

        /// <summary>
        /// Obtém projeção de gastos
        /// </summary>
        [HttpGet("projected-expenses")]
        public async Task<ActionResult<decimal>> GetProjectedExpenses(int months = 3)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var projected = await _calculationService.CalculateProjectedExpenses(userId, months);
            return Ok(projected);
        }

        /// <summary>
        /// Atualiza transação
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<TransactionResponse>> UpdateTransaction(int id, UpdateTransactionRequest request)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
                return NotFound("Transação não encontrada");

            transaction.Description = request.Description;
            transaction.Amount = request.Amount;
            transaction.Type = request.Type;
            transaction.Category = request.Category;
            transaction.Date = request.Date;
            transaction.Notes = request.Notes;
            transaction.Location = request.Location;
            transaction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new TransactionResponse(
                transaction.Id,
                transaction.Description,
                transaction.Amount,
                transaction.Type,
                transaction.Category,
                transaction.Date,
                transaction.Notes,
                transaction.Location,
                transaction.CreatedAt
            ));
        }

        /// <summary>
        /// Remove transação (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTransaction(int id)
        {
            // TODO: Obter UserId do JWT token
            var userId = 1; // Temporário

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
                return NotFound("Transação não encontrada");

            transaction.IsActive = false;
            transaction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

