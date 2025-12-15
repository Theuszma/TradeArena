import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, TrendingUp, Trophy, DollarSign } from 'lucide-react';

// Mock data
const mockUserProfile = {
  id: '1',
  username: 'alex_trader',
  netWorth: 125430,
  return: 25.43,
  rank: 12,
  activeLeagues: 3,
  totalTrades: 156,
  winRate: 68,
  topHoldings: [
    { symbol: 'AAPL', shares: 50, value: 8750 },
    { symbol: 'TSLA', shares: 25, value: 5625 },
    { symbol: 'MSFT', shares: 30, value: 9450 },
  ],
};

export default function FriendProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/friends')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Friends
      </Button>

      <Card className="glassmorphism">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{mockUserProfile.username}</h1>
              <p className="text-muted-foreground">Global Rank #{mockUserProfile.rank}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">${mockUserProfile.netWorth.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-profit" />
              <p className="text-2xl font-bold text-profit">+{mockUserProfile.return}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Leagues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <p className="text-2xl font-bold">{mockUserProfile.activeLeagues}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockUserProfile.winRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUserProfile.topHoldings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <p className="font-semibold">{holding.symbol}</p>
                  <p className="text-sm text-muted-foreground">{holding.shares} shares</p>
                </div>
                <p className="font-semibold">${holding.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Trading Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
              <p className="text-2xl font-bold">{mockUserProfile.totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-profit">{mockUserProfile.winRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
