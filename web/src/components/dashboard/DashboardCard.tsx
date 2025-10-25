'use client'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { DashboardTab, DASHBOARD_CONFIG } from '@/constants/dashboard';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardCardProps {
  type: DashboardTab;
  value: string;
}

const DashboardCard = ({ type, value }: DashboardCardProps) => {
  const { monthlySavings, extraExpenses, personalInfo } = useAuth();
  const config = DASHBOARD_CONFIG[type];

  // Gerar dados do gráfico baseados nos dados reais
  const generateChartData = () => {
    const currentDate = new Date();
    const currentYear = 2025; // Ano fixo conforme solicitado
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Pegar os últimos 6 meses
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const monthName = months[monthIndex];
      last6Months.push(monthName);
    }

    return last6Months.map(monthName => {
      let monthValue = 0;
      
      switch (type) {
        case 'patrimonio':
          // Para patrimônio, calcular valor acumulado até esse mês
          const patrimonioSavings = monthlySavings
            .filter(savings => {
              const savingsMonthIndex = months.indexOf(savings.month);
              const currentMonthIndex = months.indexOf(monthName);
              return savingsMonthIndex <= currentMonthIndex && savings.year === currentYear;
            })
            .reduce((total, savings) => total + savings.amount, 0);
          
          const patrimonioExpenses = extraExpenses
            .filter(expense => {
              const expenseMonthIndex = months.indexOf(expense.month);
              const currentMonthIndex = months.indexOf(monthName);
              return expenseMonthIndex <= currentMonthIndex && expense.year === currentYear;
            })
            .reduce((total, expense) => total + expense.amount, 0);
          
          monthValue = Math.max(0, patrimonioSavings - patrimonioExpenses);
          break;
          
        case 'poupanca':
          // Para poupança, mesmo cálculo do patrimônio
          const poupancaSavings = monthlySavings
            .filter(savings => {
              const savingsMonthIndex = months.indexOf(savings.month);
              const currentMonthIndex = months.indexOf(monthName);
              return savingsMonthIndex <= currentMonthIndex && savings.year === currentYear;
            })
            .reduce((total, savings) => total + savings.amount, 0);
          
          const poupancaExpenses = extraExpenses
            .filter(expense => {
              const expenseMonthIndex = months.indexOf(expense.month);
              const currentMonthIndex = months.indexOf(monthName);
              return expenseMonthIndex <= currentMonthIndex && expense.year === currentYear;
            })
            .reduce((total, expense) => total + expense.amount, 0);
          
          monthValue = Math.max(0, poupancaSavings - poupancaExpenses);
          break;
          
        case 'conta':
          // Para conta corrente, mostrar ganho mensal
          monthValue = personalInfo?.monthlyIncome || 0;
          break;
          
        default:
          monthValue = 0;
      }
      
      return {
        name: monthName,
        value: monthValue
      };
    });
  };

  const data = generateChartData();

  return (
    <div className="w-full max-w-[960px] bg-[#2A4A2A] border border-[#4A7C4A] rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-md">
      <div>
        <div className="text-white text-sm sm:text-base font-semibold">{config.chartLabel}</div>
        <div className="text-2xl sm:text-4xl font-bold text-white mt-1">{value}</div>
        <div className="text-[#9EBF9E] text-xs sm:text-sm mt-1">
          {config.period} <span className="text-green-400 font-semibold">{config.growth}</span>
        </div>
      </div>
      <div className="w-full h-32 sm:h-40 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              stroke="#9EBF9E" 
              fontSize={12}
              dy={10} 
            />
            <Bar 
              dataKey="value" 
              fill="#9EBF9E" 
              radius={[6, 6, 0, 0]} 
              barSize={32} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCard;
