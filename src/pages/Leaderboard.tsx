import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const leaderboard = [
  { rank: 1, username: 'WolfOfWallSt', returns: 35.2, portfolio: 135200 },
  { rank: 2, username: 'BullishBob', returns: 32.8, portfolio: 132800 },
  { rank: 3, username: 'DiamondHands', returns: 28.5, portfolio: 128500 },
  { rank: 4, username: 'TechTrader99', returns: 25.1, portfolio: 125100 },
  { rank: 5, username: 'ValueInvestor', returns: 22.9, portfolio: 122900 },
  { rank: 6, username: 'MomentumKing', returns: 20.3, portfolio: 120300 },
  { rank: 7, username: 'SmartMoney', returns: 18.7, portfolio: 118700 },
  { rank: 8, username: 'IndexHodler', returns: 16.2, portfolio: 116200 },
];

export default function Leaderboard() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See how you stack up</p>
        </div>
        <Select defaultValue="global">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="tech">Tech Titans</SelectItem>
            <SelectItem value="weekend">Weekend Warriors</SelectItem>
            <SelectItem value="office">Office League</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Rankings based on portfolio returns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead className="text-right">Returns</TableHead>
                <TableHead className="text-right">Portfolio Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((trader) => (
                <TableRow key={trader.rank}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(trader.rank)}
                      <span className="font-bold">#{trader.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {trader.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{trader.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-profit font-semibold">+{trader.returns}%</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${trader.portfolio.toLocaleString()}
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
