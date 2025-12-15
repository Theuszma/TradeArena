import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, User, Search, Check, X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFriendSearch } from '@/hooks/useFriendSearch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Mock data for demonstration
const mockFriends = [
  { id: '1', username: 'alex_trader', netWorth: 125430, return: 25.43, rank: 12 },
  { id: '2', username: 'sarah_investor', netWorth: 98750, return: -1.25, rank: 45 },
  { id: '3', username: 'mike_stocks', netWorth: 156200, return: 56.20, rank: 3 },
];

const mockPendingRequests = [
  { id: '4', username: 'john_crypto', sentBy: 'them' },
  { id: '5', username: 'emma_finance', sentBy: 'me' },
];

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { results, loading, searchUsers, sendFriendRequest } = useFriendSearch();

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleViewProfile = (userId: string) => {
    navigate(`/friends/${userId}`);
  };

  const handleSendRequest = async (userId: string) => {
    const success = await sendFriendRequest(userId);
    if (success) {
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">Connect with other traders and compare performance</p>
        </div>
        <Button className="gap-2" onClick={() => setShowSearch(!showSearch)}>
          <UserPlus className="h-4 w-4" />
          Add Friend
        </Button>
      </div>

      {showSearch && (
        <Card className="glassmorphism">
          <CardContent className="pt-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {results.length > 0 && (
              <div className="space-y-2">
                {results.filter(r => r.id !== user?.id).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={result.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{result.username}</span>
                    </div>
                    <Button size="sm" onClick={() => handleSendRequest(result.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">My Friends ({mockFriends.length})</TabsTrigger>
          <TabsTrigger value="requests">Pending ({mockPendingRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {mockFriends.map((friend) => (
            <Card key={friend.id} className="glassmorphism hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleViewProfile(friend.id)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{friend.username}</h3>
                      <p className="text-sm text-muted-foreground">Global Rank #{friend.rank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net Worth</p>
                      <p className="text-lg font-semibold">${friend.netWorth.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className={`text-lg font-semibold flex items-center gap-1 ${friend.return >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {friend.return >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {friend.return >= 0 ? '+' : ''}{friend.return.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {mockPendingRequests.map((request) => (
            <Card key={request.id} className="glassmorphism">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-muted">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{request.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {request.sentBy === 'them' ? 'Sent you a friend request' : 'Waiting for response'}
                      </p>
                    </div>
                  </div>
                  {request.sentBy === 'them' ? (
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-2">
                        <Check className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <X className="h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">Cancel Request</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
