using Microsoft.EntityFrameworkCore;
using NestFin.API.Data;
using NestFin.API.Models;

namespace NestFin.API.Services
{
    public class FinancialCalculationService
    {
        private readonly ApplicationDbContext _context;

        public FinancialCalculationService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Calcula relatório financeiro completo do usuário
        /// </summary>
        public async Task<FinancialReport> CalculateFinancialReport(int userId, int months = 6)
        {
            var startDate = DateTime.UtcNow.AddMonths(-months);
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.IsActive && t.Date >= startDate)
                .ToListAsync();

            var report = new FinancialReport();

            // Cálculos básicos
            report.TotalIncome = transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            report.TotalExpenses = transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            report.NetIncome = report.TotalIncome - report.TotalExpenses;
            report.SavingsRate = report.TotalIncome > 0 
                ? (report.NetIncome / report.TotalIncome) * 100 
                : 0;

            // Análise por categoria
            report.CategoryBreakdown = CalculateCategoryBreakdown(transactions);

            // Tendências mensais
            report.MonthlyTrends = CalculateMonthlyTrends(transactions, months);

            // Transações recentes
            report.RecentTransactions = transactions
                .OrderByDescending(t => t.Date)
                .Take(10)
                .ToList();

            // Médias e projeções
            report.AverageDailySpending = CalculateAverageDailySpending(transactions);
            report.ProjectedMonthlyExpenses = CalculateProjectedMonthlyExpenses(transactions);

            return report;
        }

        /// <summary>
        /// Calcula análise detalhada de gastos
        /// </summary>
        public async Task<SpendingAnalysis> CalculateSpendingAnalysis(int userId, int days = 30)
        {
            var startDate = DateTime.UtcNow.AddDays(-days);
            var expenses = await _context.Transactions
                .Where(t => t.UserId == userId && 
                           t.Type == TransactionType.Expense && 
                           t.IsActive && 
                           t.Date >= startDate)
                .ToListAsync();

            var analysis = new SpendingAnalysis
            {
                TotalSpent = expenses.Sum(t => t.Amount),
                TotalTransactions = expenses.Count,
                HighestSingleExpense = expenses.Any() ? expenses.Max(t => t.Amount) : 0,
                LowestSingleExpense = expenses.Any() ? expenses.Min(t => t.Amount) : 0
            };

            // Cálculos de médias
            analysis.AveragePerDay = analysis.TotalSpent / days;
            analysis.AveragePerWeek = analysis.TotalSpent / (days / 7.0m);
            analysis.AveragePerMonth = analysis.TotalSpent / (days / 30.0m);

            // Top categorias
            analysis.TopCategories = expenses
                .GroupBy(t => t.Category)
                .Select(g => new CategorySummary
                {
                    Category = g.Key,
                    CategoryName = GetCategoryName(g.Key),
                    Amount = g.Sum(t => t.Amount),
                    TransactionCount = g.Count(),
                    AverageAmount = g.Average(t => t.Amount)
                })
                .OrderByDescending(c => c.Amount)
                .Take(5)
                .ToList();

            // Calcular percentuais
            foreach (var category in analysis.TopCategories)
            {
                category.Percentage = analysis.TotalSpent > 0 
                    ? (category.Amount / analysis.TotalSpent) * 100 
                    : 0;
            }

            return analysis;
        }

        /// <summary>
        /// Calcula patrimônio líquido do usuário
        /// </summary>
        public async Task<decimal> CalculateNetWorth(int userId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.IsActive)
                .ToListAsync();

            var totalIncome = transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var totalExpenses = transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            return totalIncome - totalExpenses;
        }

        /// <summary>
        /// Calcula projeção de gastos futuros baseada no histórico
        /// </summary>
        public async Task<decimal> CalculateProjectedExpenses(int userId, int months = 3)
        {
            var startDate = DateTime.UtcNow.AddMonths(-6); // Últimos 6 meses
            var expenses = await _context.Transactions
                .Where(t => t.UserId == userId && 
                           t.Type == TransactionType.Expense && 
                           t.IsActive && 
                           t.Date >= startDate)
                .ToListAsync();

            if (!expenses.Any()) return 0;

            // Média dos últimos 6 meses
            var monthlyAverage = expenses
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => g.Sum(t => t.Amount))
                .Average();

            return monthlyAverage * months;
        }

        /// <summary>
        /// Calcula análise de categoria
        /// </summary>
        private List<CategorySummary> CalculateCategoryBreakdown(List<Transaction> transactions)
        {
            return transactions
                .GroupBy(t => t.Category)
                .Select(g => new CategorySummary
                {
                    Category = g.Key,
                    CategoryName = GetCategoryName(g.Key),
                    Amount = g.Sum(t => t.Amount),
                    TransactionCount = g.Count(),
                    AverageAmount = g.Average(t => t.Amount)
                })
                .OrderByDescending(c => c.Amount)
                .ToList();
        }

        /// <summary>
        /// Calcula tendências mensais
        /// </summary>
        private List<MonthlyTrend> CalculateMonthlyTrends(List<Transaction> transactions, int months)
        {
            var trends = new List<MonthlyTrend>();
            var currentDate = DateTime.UtcNow;

            for (int i = months - 1; i >= 0; i--)
            {
                var monthDate = currentDate.AddMonths(-i);
                var monthTransactions = transactions
                    .Where(t => t.Date.Year == monthDate.Year && t.Date.Month == monthDate.Month)
                    .ToList();

                var income = monthTransactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var expenses = monthTransactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                var netIncome = income - expenses;
                var savingsRate = income > 0 ? (netIncome / income) * 100 : 0;

                trends.Add(new MonthlyTrend
                {
                    Year = monthDate.Year,
                    Month = monthDate.Month,
                    MonthName = monthDate.ToString("MMM/yyyy"),
                    Income = income,
                    Expenses = expenses,
                    NetIncome = netIncome,
                    SavingsRate = savingsRate
                });
            }

            return trends;
        }

        /// <summary>
        /// Calcula gasto médio diário
        /// </summary>
        private decimal CalculateAverageDailySpending(List<Transaction> transactions)
        {
            var expenses = transactions.Where(t => t.Type == TransactionType.Expense).ToList();
            if (!expenses.Any()) return 0;

            var days = (DateTime.UtcNow - expenses.Min(t => t.Date)).Days + 1;
            return expenses.Sum(t => t.Amount) / days;
        }

        /// <summary>
        /// Calcula projeção de gastos mensais
        /// </summary>
        private decimal CalculateProjectedMonthlyExpenses(List<Transaction> transactions)
        {
            var expenses = transactions.Where(t => t.Type == TransactionType.Expense).ToList();
            if (!expenses.Any()) return 0;

            var monthlyGroups = expenses
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => g.Sum(t => t.Amount))
                .ToList();

            return monthlyGroups.Any() ? monthlyGroups.Average() : 0;
        }

        /// <summary>
        /// Obtém nome da categoria
        /// </summary>
        private string GetCategoryName(TransactionCategory category)
        {
            return category switch
            {
                TransactionCategory.Salary => "Salário",
                TransactionCategory.Freelance => "Freelance",
                TransactionCategory.Investment => "Investimentos",
                TransactionCategory.Business => "Negócios",
                TransactionCategory.OtherIncome => "Outras Receitas",
                TransactionCategory.Food => "Alimentação",
                TransactionCategory.Transportation => "Transporte",
                TransactionCategory.Housing => "Moradia",
                TransactionCategory.Health => "Saúde",
                TransactionCategory.Education => "Educação",
                TransactionCategory.Entertainment => "Entretenimento",
                TransactionCategory.Shopping => "Compras",
                TransactionCategory.Bills => "Contas",
                TransactionCategory.Insurance => "Seguros",
                TransactionCategory.OtherExpense => "Outras Despesas",
                _ => "Outros"
            };
        }
    }
}

