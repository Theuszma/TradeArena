import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useStockPrices } from '@/hooks/useStockPrices';

// Tipo para os períodos disponíveis
type TimePeriod = 'today' | '1w' | '1m' | '1y';

// Gráfico mockado (placeholder)
const performanceData = [
  { date: 'Jan', portfolio: 100000, sp500: 100000 },
  { date: 'Feb', portfolio: 102000, sp500: 101000 },
  { date: 'Mar', portfolio: 108000, sp500: 103000 },
  { date: 'Apr', portfolio: 115000, sp500: 105000 },
  { date: 'May', portfolio: 125430, sp500: 107000 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeLeaguesCount, setActiveLeaguesCount] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  
  // Estado para controlar o período selecionado no widget de ações
  const [period, setPeriod] = useState<TimePeriod>('today');

  const { stocks: topMovers, loading: moversLoading } = useStockPrices(['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN']);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        // 1. Contar Ligas Ativas
        const { count: leaguesCount, error: leaguesError } = await supabase
          .from('league_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (leaguesError) throw leaguesError;
        setActiveLeaguesCount(leaguesCount || 0);

        // 2. Somar Saldo em Caixa (balance)
        const { data: balances, error: balanceError } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('user_id', user.id);

        if (balanceError) throw balanceError;

        const cashSum = balances?.reduce((acc, curr: any) => acc + Number(curr.balance), 0) || 0;
        setTotalCash(cashSum);

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, trader.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Saldo em Caixa */}
        <Card className="glassmorphism bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caixa Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Disponível para operar</p>
          </CardContent>
        </Card>

        {/* Card 2: Ligas Ativas */}
        <Card className="glassmorphism bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ligas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeLeaguesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Competições em andamento</p>
          </CardContent>
        </Card>

        {/* Card 3: Ranking */}
        <Card className="glassmorphism bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rank Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground mt-1">Participe de ligas para ranquear</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Gráfico de Performance */}
        <Card className="glassmorphism md:col-span-2 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Performance da Carteira</CardTitle>
            <CardDescription>Seus retornos vs S&P 500 (Simulado)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line type="monotone" dataKey="portfolio" stroke="#10b981" strokeWidth={2} name="Sua Carteira" />
                  <Line type="monotone" dataKey="sp500" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="S&P 500" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Movers com Seletor de Período */}
        <Card className="glassmorphism flex flex-col bg-card text-card-foreground">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <CardTitle>Mercado</CardTitle>
              
              {/* Seletor de Período (Responsivo + Cores do Tema) */}
              <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg border border-border">
                {(['today', '1w', '1m', '1y'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 sm:flex-none px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      period === p 
                        ? 'bg-background text-foreground shadow-sm' // Ativo: fundo do card e texto padrão
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50' // Inativo
                    }`}
                  >
                    {p === 'today' ? '1D' : p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <CardDescription>
              Variação: {period === 'today' ? 'Últimas 24h' : period === '1w' ? '7 Dias' : period === '1m' ? '30 Dias' : '1 Ano'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1">
            {moversLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : topMovers && topMovers.length > 0 ? (
              <div className="space-y-4">
                {/* Aviso discreto sobre dados mockados se necessário */}
                {/* <div className="text-xs text-yellow-500 flex items-center gap-1 mb-2">
                    <AlertCircle size={12} /> Dados Simulados (API Limit)
                </div> */}

                {topMovers.map((stock: any) => {
                  const changeValue = stock.changes?.[period] || 0;
                  const isPositive = changeValue >= 0;

                  return (
                    <div key={stock.symbol} className="flex items-center justify-between group cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors -mx-2">
                      <div>
                        {/* Símbolo: Cor padrão do tema (Preto no Light, Branco no Dark) */}
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{stock.symbol}</p>
                      </div>
                      <div className="text-right">
                        {/* Preço: Cor padrão do tema */}
                        <p className="font-semibold text-foreground">${stock.price?.toFixed(2) || '0.00'}</p>
                        
                        {/* Variação: Mantém Verde/Vermelho fixo pois é convenção de mercado */}
                        <p className={`text-xs font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isPositive ? '+' : ''}{changeValue.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Sem dados. Verifique a API Key.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}