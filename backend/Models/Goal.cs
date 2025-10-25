using System.ComponentModel.DataAnnotations;

namespace NestFin.API.Models
{
    public class Goal
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        public decimal TargetAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}



