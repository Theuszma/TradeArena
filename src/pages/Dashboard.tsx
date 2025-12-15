import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { date: 'Jan', portfolio: 100000, sp500: 100000 },
  { date: 'Feb', portfolio: 102000, sp500: 101000 },
  { date: 'Mar', portfolio: 108000, sp500: 103000 },
  { date: 'Apr', portfolio: 115000, sp500: 105000 },
  { date: 'May', portfolio: 125430, sp500: 107000 },
];

const topMovers = [
  { symbol: 'AAPL', name: 'Apple Inc.', change: 5.2, price: 182.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', change: -3.1, price: 245.80 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', change: 8.7, price: 492.30 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your performance and market activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-profit" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">+25.43%</div>
            <p className="text-xs text-muted-foreground mt-1">+$25,430.00 all time</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leagues</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 ending this month</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#1,247</div>
            <p className="text-xs text-muted-foreground mt-1">Top 5% of players</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Your returns vs S&P 500</CardDescription>
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
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="hsl(var(--profit))"
                  strokeWidth={2}
                  name="Your Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="sp500"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  name="S&P 500"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Top Movers Today</CardTitle>
          <CardDescription>Assets with significant price changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topMovers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm flex items-center gap-1 ${stock.change > 0 ? 'text-profit' : 'text-loss'}`}>
                    {stock.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stock.change > 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
