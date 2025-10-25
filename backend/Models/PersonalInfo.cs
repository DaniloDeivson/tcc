using System.ComponentModel.DataAnnotations;

namespace NestFin.API.Models
{
    public class PersonalInfo
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [StringLength(200)]
        public string? FullName { get; set; }

        [StringLength(150)]
        public string? Email { get; set; }

        [StringLength(30)]
        public string? Phone { get; set; }

        public decimal? MonthlyIncome { get; set; }
        public decimal? MonthlyFixedExpenses { get; set; }
        public decimal? MonthlyVariableExpenses { get; set; }

        public string? Notes { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}



