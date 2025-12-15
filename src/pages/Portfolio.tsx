import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 175.00, currentPrice: 182.50, totalValue: 9125.00 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgPrice: 365.00, currentPrice: 378.90, totalValue: 11367.00 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 25, avgPrice: 450.00, currentPrice: 492.30, totalValue: 12307.50 },
  { symbol: 'SPY', name: 'SPDR S&P 500', shares: 100, avgPrice: 455.00, currentPrice: 468.25, totalValue: 46825.00 },
];

export default function Portfolio() {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const cashBalance = 45805.50;
  const totalPortfolio = totalValue + cashBalance;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
        <p className="text-muted-foreground">Current holdings and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolio.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(totalPortfolio - 100000).toLocaleString()} gain
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${cashBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available to trade</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{holdings.length} positions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Your current positions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const gainLoss = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                return (
                  <TableRow key={holding.symbol}>
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell className="text-right">{holding.shares}</TableCell>
                    <TableCell className="text-right">${holding.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.totalValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={`flex items-center justify-end gap-1 ${gainLoss > 0 ? 'text-profit' : 'text-loss'}`}>
                        {gainLoss > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {gainLoss > 0 ? '+' : ''}{gainLoss.toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
