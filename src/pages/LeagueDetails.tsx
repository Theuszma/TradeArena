import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Mock data - replace with real data from Supabase
const mockLeague = {
  id: '1',
  name: 'Summer Trading Challenge',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  startingBalance: 100000,
  members: [
    { id: '1', username: 'trader_pro', rank: 1, netWorth: 156200, return: 56.20 },
    { id: '2', username: 'sarah_investor', rank: 2, netWorth: 125430, return: 25.43 },
    { id: '3', username: 'mike_stocks', rank: 3, netWorth: 98750, return: -1.25 },
  ],
  recentTrades: [
    { id: '1', username: 'trader_pro', type: 'buy', symbol: 'AAPL', shares: 50, price: 175.50, time: '2 hours ago' },
    { id: '2', username: 'sarah_investor', type: 'sell', symbol: 'GOOGL', shares: 25, price: 142.30, time: '4 hours ago' },
    { id: '3', username: 'mike_stocks', type: 'buy', symbol: 'TSLA', shares: 10, price: 245.80, time: '5 hours ago' },
  ],
};

export default function LeagueDetails() {
  const { leagueId } = useParams();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">{mockLeague.name}</h1>
        <p className="text-muted-foreground">
          {new Date(mockLeague.startDate).toLocaleDateString()} - {new Date(mockLeague.endDate).toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="standings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="space-y-4">
          {mockLeague.members.map((member, index) => (
            <Card key={member.id} className="glassmorphism hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                      {index === 1 && <Trophy className="h-6 w-6 text-gray-400" />}
                      {index === 2 && <Trophy className="h-6 w-6 text-amber-600" />}
                      {index > 2 && <span className="text-2xl font-bold text-muted-foreground w-6 text-center">#{member.rank}</span>}
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.username}</h3>
                      <p className="text-sm text-muted-foreground">Rank #{member.rank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net Worth</p>
                      <p className="text-lg font-semibold">${member.netWorth.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className={`text-lg font-semibold flex items-center gap-1 ${member.return >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {member.return >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {member.return >= 0 ? '+' : ''}{member.return.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          {mockLeague.recentTrades.map((trade) => (
            <Card key={trade.id} className="glassmorphism">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-muted">
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{trade.username}</p>
                      <p className="text-sm text-muted-foreground">{trade.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                      {trade.type === 'buy' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {trade.type.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold">{trade.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {trade.shares} shares @ ${trade.price}
                      </p>
                    </div>
                    <p className="font-semibold text-lg">
                      ${(trade.shares * trade.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="portfolios" className="space-y-4">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Portfolio Comparison</CardTitle>
              <CardDescription>Compare portfolio allocations across members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Portfolio comparison visualization coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
