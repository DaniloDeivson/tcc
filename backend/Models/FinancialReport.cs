namespace NestFin.API.Models
{
    public class FinancialReport
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetIncome { get; set; }
        public decimal SavingsRate { get; set; }
        public List<CategorySummary> CategoryBreakdown { get; set; } = new();
        public List<MonthlyTrend> MonthlyTrends { get; set; } = new();
        public List<Transaction> RecentTransactions { get; set; } = new();
        public decimal AverageDailySpending { get; set; }
        public decimal ProjectedMonthlyExpenses { get; set; }
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
    }

    public class CategorySummary
    {
        public TransactionCategory Category { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
        public int TransactionCount { get; set; }
        public decimal AverageAmount { get; set; }
    }

    public class MonthlyTrend
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public decimal Income { get; set; }
        public decimal Expenses { get; set; }
        public decimal NetIncome { get; set; }
        public decimal SavingsRate { get; set; }
    }

    public class SpendingAnalysis
    {
        public decimal TotalSpent { get; set; }
        public decimal AveragePerDay { get; set; }
        public decimal AveragePerWeek { get; set; }
        public decimal AveragePerMonth { get; set; }
        public decimal HighestSingleExpense { get; set; }
        public decimal LowestSingleExpense { get; set; }
        public int TotalTransactions { get; set; }
        public List<CategorySummary> TopCategories { get; set; } = new();
    }
}

