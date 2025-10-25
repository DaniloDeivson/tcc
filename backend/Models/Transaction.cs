using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NestFin.API.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        [Required]
        public TransactionType Type { get; set; }
        
        [Required]
        public TransactionCategory Category { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public bool IsActive { get; set; } = true;
    }

    public enum TransactionType
    {
        Income = 1,    // Receita
        Expense = 2    // Despesa
    }

    public enum TransactionCategory
    {
        // Receitas
        Salary = 1,           // Salário
        Freelance = 2,        // Freelance
        Investment = 3,        // Investimentos
        Business = 4,         // Negócios
        OtherIncome = 5,      // Outras receitas
        
        // Despesas
        Food = 10,            // Alimentação
        Transportation = 11,  // Transporte
        Housing = 12,         // Moradia
        Health = 13,         // Saúde
        Education = 14,       // Educação
        Entertainment = 15,   // Entretenimento
        Shopping = 16,        // Compras
        Bills = 17,          // Contas
        Insurance = 18,       // Seguros
        OtherExpense = 19     // Outras despesas
    }
}
