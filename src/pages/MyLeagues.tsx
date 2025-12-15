import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Users, Calendar, Plus, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface League {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  starting_balance: number;
}

export default function MyLeagues() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Form State
  const [newLeagueName, setNewLeagueName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Estado para controle do Dinheiro
  const [displayMoney, setDisplayMoney] = useState('10.000'); 
  const [rawMoney, setRawMoney] = useState<number>(10000); 

  useEffect(() => {
    fetchLeagues();
  }, [user]);

  const fetchLeagues = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          league_id,
          leagues (
            id,
            name,
            start_date,
            end_date,
            starting_balance
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const formattedLeagues = data
        .map((item: any) => item.leagues)
        .filter((league: any) => league !== null) as League[];
        
      setLeagues(formattedLeagues);
    } catch (error) {
      console.error('Erro ao buscar ligas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value === '') {
      setDisplayMoney('');
      setRawMoney(0);
      return;
    }

    const numberValue = parseInt(value, 10);
    setRawMoney(numberValue);
    setDisplayMoney(numberValue.toLocaleString('pt-BR'));
  };

  const handleCreateLeague = async () => {
    if (newLeagueName.trim().toLowerCase() === 'global') {
      toast.error('O nome "Global" é reservado pelo sistema e não pode ser utilizado.');
      return;
    }
    if (!user || !newLeagueName.trim() || !startDate || !endDate || !rawMoney) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    const startDateTime = new Date(`${startDate}T09:30:00`);
    const endDateTime = new Date(`${endDate}T16:00:00`);

    const now = new Date();
    now.setHours(0,0,0,0);
    
    const startCheck = new Date(startDate);
    startCheck.setHours(startCheck.getHours() + 4); 
    startCheck.setHours(0,0,0,0);

    if (startCheck < now) {
      toast.error('A data de início não pode ser no passado.');
      return;
    }

    if (endDateTime <= startDateTime) {
      toast.error('A data de término deve ser posterior à data de início.');
      return;
    }
    
    setIsCreating(true);

    try {
      // 1. Criar a Liga
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: newLeagueName,
          creator_id: user.id,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
          starting_balance: rawMoney
        })
        .select()
        .single();

      if (leagueError) throw leagueError;
      if (!leagueData) throw new Error('Falha ao criar liga');

      // 2. Adicionar membro
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

     // 3. Adicionar saldo
      const { error: balanceError } = await supabase
        .from('user_balances') 
        .insert({
          league_id: leagueData.id,
          user_id: user.id,
          balance: rawMoney 
        } as any)

      if (balanceError) throw balanceError;

      toast.success('Liga criada com sucesso!');
      
      setNewLeagueName('');
      setStartDate('');
      setEndDate('');
      setDisplayMoney('10.000');
      setRawMoney(10000);
      setOpenDialog(false);
      
      fetchLeagues();
      
    } catch (error: any) {
      console.error('Erro ao criar liga:', error);
      toast.error(error.message || 'Erro ao criar liga');
    } finally {
      setIsCreating(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Minhas Ligas</h1>
          <p className="text-muted-foreground">Participe de competições e desafie amigos</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            {/* BOTÃO 1: CRIAR NOVA LIGA (TRIGGER) - Ajustado para Verde Emerald */}
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 active:text-emerald-200 transition-all duration-200 shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Liga
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Liga</DialogTitle>
              <DialogDescription>
                Configure a competição. O horário segue o mercado americano (09:30 - 16:00 EST).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Titãs do Trade"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  Saldo Inicial
                </Label>
                <Input
                  id="balance"
                  type="text"
                  value={displayMoney}
                  onChange={handleMoneyChange}
                  className="col-span-3"
                  placeholder="10.000"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Início
                </Label>
                <div className="col-span-3">
                    <Input
                      id="start"
                      type="date"
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  Fim
                </Label>
                <div className="col-span-3">
                    <Input
                      id="end"
                      type="date"
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                </div>
              </div>
            </div>
            <DialogFooter>
              {/* BOTÃO 2: CRIAR LIGA (CONFIRMAR) - Ajustado para Verde Emerald */}
              <Button 
                onClick={handleCreateLeague} 
                disabled={isCreating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 active:text-emerald-200 transition-all duration-200 shadow-sm"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Liga
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {leagues.length === 0 ? (
        <Card className="glassmorphism border-dashed p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Trophy className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Nenhuma liga encontrada</h3>
              <p className="text-muted-foreground">Você ainda não participa de nenhuma competição.</p>
            </div>
            <Button variant="outline" onClick={() => setOpenDialog(true)}>
              Começar agora
            </Button>
          </div>
        </Card>
      ) : (
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
                      Saldo Inicial: ${league.starting_balance?.toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Ativa</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(league.start_date).toLocaleDateString()} - {new Date(league.end_date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}