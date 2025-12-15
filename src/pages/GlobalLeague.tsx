import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Medal,
  Calendar,
  Target
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Participant {
  rank: number;
  username: string;
  avatarUrl?: string;
  portfolioValue: number;
  percentChange: number;
  totalTrades: number;
}

const mockParticipants: Participant[] = [
  { rank: 1, username: 'WallStreetWolf', portfolioValue: 156420.50, percentChange: 56.42, totalTrades: 142 },
  { rank: 2, username: 'BullishBear', portfolioValue: 148930.25, percentChange: 48.93, totalTrades: 98 },
  { rank: 3, username: 'TradeMaster', portfolioValue: 142780.00, percentChange: 42.78, totalTrades: 156 },
  { rank: 4, username: 'StockNinja', portfolioValue: 138450.75, percentChange: 38.45, totalTrades: 87 },
  { rank: 5, username: 'AlphaTrader', portfolioValue: 135200.00, percentChange: 35.20, totalTrades: 112 },
  { rank: 6, username: 'MarketGuru', portfolioValue: 131890.50, percentChange: 31.89, totalTrades: 76 },
  { rank: 7, username: 'InvestorPro', portfolioValue: 128340.25, percentChange: 28.34, totalTrades: 134 },
  { rank: 8, username: 'DayTrader99', portfolioValue: 124500.00, percentChange: 24.50, totalTrades: 189 },
  { rank: 9, username: 'ValueHunter', portfolioValue: 121780.75, percentChange: 21.78, totalTrades: 45 },
  { rank: 10, username: 'SwingKing', portfolioValue: 118920.00, percentChange: 18.92, totalTrades: 67 },
];

const currentLeagueInfo = {
  name: 'December 2024 Championship',
  prizePool: 50000,
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  totalParticipants: 1247,
  startingBalance: 100000,
  yourRank: 42,
  yourPortfolio: 112450.75,
};

export default function GlobalLeague() {
  const [isJoined, setIsJoined] = useState(false);
  
  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(currentLeagueInfo.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));
  const totalDays = Math.ceil(
    (new Date(currentLeagueInfo.endDate).getTime() - new Date(currentLeagueInfo.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPercent = Math.round(((totalDays - daysRemaining) / totalDays) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Global League</h1>
        <p className="text-muted-foreground">
          Compete with traders worldwide for the ultimate prize
        </p>
      </div>

      {/* Hero Card */}
      <Card className="glassmorphism bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h2 className="text-2xl font-bold">{currentLeagueInfo.name}</h2>
                  <p className="text-muted-foreground">Winner Takes All</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Prize Pool</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    ${currentLeagueInfo.prizePool.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {currentLeagueInfo.totalParticipants.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {daysRemaining} days remaining
                  </span>
                  <span className="text-primary font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setIsJoined(true)}
                disabled={isJoined}
              >
                {isJoined ? 'Already Joined' : 'Join This League'}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Position
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                  <p className="text-3xl font-bold">#{currentLeagueInfo.yourRank}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${currentLeagueInfo.yourPortfolio.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Your Performance</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-xl font-bold text-green-500">
                    +{((currentLeagueInfo.yourPortfolio / currentLeagueInfo.startingBalance - 1) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules and Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• New global league starts every month</p>
            <p>• Everyone starts with ${currentLeagueInfo.startingBalance.toLocaleString()}</p>
            <p>• Trade real stocks with virtual money</p>
            <p>• Rankings based on portfolio value</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Prize Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-yellow-500" /> 1st Place
              </span>
              <span className="font-bold text-yellow-500">$25,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-gray-400" /> 2nd Place
              </span>
              <span className="font-bold text-gray-400">$15,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-600" /> 3rd Place
              </span>
              <span className="font-bold text-amber-600">$10,000</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Trade US stocks only</p>
            <p>• Max 25% of portfolio in single stock</p>
            <p>• No margin trading allowed</p>
            <p>• Minimum 10 trades required</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top 10 traders this month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead className="text-right">Portfolio Value</TableHead>
                <TableHead className="text-right">Return</TableHead>
                <TableHead className="text-right">Trades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockParticipants.map((participant) => (
                <TableRow key={participant.rank}>
                  <TableCell>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                      {participant.rank <= 3 ? (
                        <Medal className={`h-5 w-5 ${
                          participant.rank === 1 ? 'text-yellow-500' :
                          participant.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                      ) : (
                        participant.rank
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatarUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {participant.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{participant.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${participant.portfolioValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-500 font-medium">
                      +{participant.percentChange.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {participant.totalTrades}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
