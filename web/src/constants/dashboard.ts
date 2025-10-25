export const DASHBOARD_TABS = [
  { label: 'Patrimônio líquido', value: 'patrimonio' },
  { label: 'Conta corrente', value: 'conta' },
  { label: 'Poupança', value: 'poupanca' },
  { label: 'Economia Mensal', value: 'economia' },
] as const;

export type DashboardTab = typeof DASHBOARD_TABS[number]['value'];

export const DASHBOARD_CONFIG: Record<DashboardTab, {
  title: string;
  subtitle: string;
  chartLabel: string;
  period: string;
  growth: string;
}> = {
  patrimonio: {
    title: 'Patrimônio líquido',
    subtitle: 'Valor total dos seus ativos',
    chartLabel: 'Patrimônio líquido',
    period: 'Últimos 6 meses',
    growth: '+12%',
  },
  conta: {
    title: 'Conta corrente',
    subtitle: 'Saldo disponível na conta',
    chartLabel: 'Equilíbrio ao longo do tempo',
    period: 'Últimos 30 dias',
    growth: '+2.5%',
  },
  poupanca: {
    title: 'Poupança',
    subtitle: 'Valor total da poupança',
    chartLabel: 'Poupança ao Longo do Tempo',
    period: 'Últimos 30 dias',
    growth: '+5%',
  },
  economia: {
    title: 'Economia Mensal',
    subtitle: 'Controle suas economias e progresso das metas',
    chartLabel: 'Economia Mensal',
    period: 'Este mês',
    growth: '+15%',
  },
};

// Mock data para gráficos
export const CHART_DATA = {
  patrimonio: [
    { name: 'Jan', value: 2000 },
    { name: 'Fev', value: 1800 },
    { name: 'Mar', value: 2200 },
    { name: 'Abr', value: 2100 },
    { name: 'Mai', value: 2400 },
    { name: 'Jun', value: 2300 },
  ],
  conta: [
    { name: 'Jul 1', value: 8000 },
    { name: 'Jul 8', value: 9000 },
    { name: 'Jul 15', value: 8500 },
    { name: 'Jul 22', value: 11000 },
    { name: 'Jul 29', value: 12345.67 },
  ],
  poupanca: [
    { name: 'Jul 1', value: 4000 },
    { name: 'Jul 8', value: 9000 },
    { name: 'Jul 15', value: 5000 },
    { name: 'Jul 22', value: 11000 },
    { name: 'Jul 29', value: 12345.67 },
  ],
};

export const THEME = {
  colors: {
    background: '#1A3A1A',
    cardBg: '#3A5A3A',
    cardBgDark: '#2A4A2A',
    border: '#6B8A6B',
    borderLight: '#4A7C4A',
    textPrimary: '#ffffff',
    textSecondary: '#9EBF9E',
    textMuted: '#E5E8EB',
    accent: '#c6ffe9',
    accentGreen: '#22c55e',
  },
};
