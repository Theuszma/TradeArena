import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const leagues = [
  {
    id: 1,
    name: 'Tech Titans',
    members: 12,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    myRank: 3,
    myReturn: 28.5,
  },
  {
    id: 2,
    name: 'Weekend Warriors',
    members: 8,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    myRank: 1,
    myReturn: 15.2,
  },
  {
    id: 3,
    name: 'Office League',
    members: 24,
    startDate: '2024-02-15',
    endDate: '2024-11-15',
    myRank: 7,
    myReturn: 12.8,
  },
];

export default function MyLeagues() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Leagues</h1>
          <p className="text-muted-foreground">Compete with friends and colleagues</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create League
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <Card
            key={league.id}
            className="glassmorphism hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/leagues/${league.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    {league.name}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {league.members} members
                  </CardDescription>
                </div>
                <Badge variant={league.myRank === 1 ? 'default' : 'secondary'}>
                  #{league.myRank}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Your Return</span>
                <span className="text-lg font-bold text-profit">+{league.myReturn}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
