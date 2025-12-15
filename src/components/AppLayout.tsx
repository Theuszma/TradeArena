import { ReactNode, useEffect, useState, useCallback } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { 
  User, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Loader2,
  LayoutDashboard,
  CandlestickChart,
  PieChart,
  GraduationCap,
  Info
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/components/ThemeProvider';
// Importamos os serviços de mercado para calcular o valor das ações
import { getCryptoPrices, getUSStocks, getBRStocks, Asset } from '@/services/marketService';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Estados para o Patrimônio
  const [totalNetWorth, setTotalNetWorth] = useState<number | null>(null);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [investedValue, setInvestedValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Configuração de Títulos e Ícones
  const getPageDetails = (pathname: string) => {
    const path = pathname.toLowerCase();
    if (path === '/' || path === '/dashboard') return { icon: LayoutDashboard, title: 'Dashboard' };
    if (path.includes('/market') || path.includes('/mercado')) return { icon: CandlestickChart, title: 'Mercado de Ações' };
    if (path.includes('/portfolio') || path.includes('/wallet')) return { icon: PieChart, title: 'Meu Portfólio' };
    if (path.includes('/leagues')) return { icon: TrendingUp, title: 'Ranking & Ligas' };
    if (path.includes('/learn')) return { icon: GraduationCap, title: 'Aprenda a Investir' };
    if (path.includes('/profile')) return { icon: User, title: 'Perfil' };
    if (path.includes('/settings')) return { icon: Settings, title: 'Configurações' };
    return { icon: TrendingUp, title: 'Investimento Fantasy' };
  };

  const { icon: PageIcon, title: PageTitle } = getPageDetails(location.pathname);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // 2. Função Poderosa de Cálculo de Patrimônio
  const calculateTotalNetWorth = useCallback(async () => {
    if (!user) return;
    
    // Evita loading piscando se já tiver dados, mas mostra loading na primeira vez
    if (totalNetWorth === null) setIsLoading(true);

    try {
      // A. Buscamos Saldo e Portfólio em paralelo (Banco de Dados)
      const [balanceResponse, portfolioResponse] = await Promise.all([
        supabase
          .from('user_balances')
          .select('balance, leagues!inner(name)')
          .eq('user_id', user.id)
          .eq('leagues.name', 'Global')
          .maybeSingle(),
        
        supabase
          .from('portfolios')
          .select('symbol, quantity, leagues!inner(name)')
          .eq('user_id', user.id)
          .eq('leagues.name', 'Global')
      ]);

      const currentCash = balanceResponse.data?.balance ?? 0;
      const portfolioItems = portfolioResponse.data ?? [];

      let currentInvested = 0;

      // B. Se o usuário tem ações, precisamos saber quanto elas valem AGORA (API de Mercado)
      if (portfolioItems.length > 0) {
        // Buscamos cotações atuais (apenas se tiver itens no portfólio para economizar)
        // Nota: Idealmente, cachearíamos isso, mas para MVP faremos a chamada.
        const [crypto, us, br] = await Promise.all([
          getCryptoPrices(), 
          getUSStocks(), 
          getBRStocks()
        ]);
        
        const allAssets = [...crypto, ...us, ...br];

        // Calcula o valor total das ações
        currentInvested = portfolioItems.reduce((acc, item) => {
          // Tenta achar o preço atual
          const assetData = allAssets.find(a => a.symbol === item.symbol);
          // Se achar o preço atual, usa. Se não (API falhou ou ativo sumiu), não somamos ou usamos preço médio (optei por ignorar para segurança)
          const currentPrice = assetData ? assetData.price : 0; 
          return acc + (item.quantity * currentPrice);
        }, 0);
      }

      setCashBalance(currentCash);
      setInvestedValue(currentInvested);
      setTotalNetWorth(currentCash + currentInvested);

    } catch (error) {
      console.error("Erro ao calcular patrimônio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, totalNetWorth]);

  // 3. Efeitos e Listeners
  useEffect(() => {
    if (!user) return;

    // Cálculo inicial
    calculateTotalNetWorth();

    // Listener do Supabase (Se o saldo mudar no banco)
    const channel = supabase
      .channel('app_layout_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_balances' },
        (payload) => {
            // @ts-ignore
            if (payload.new && payload.new.user_id === user.id) calculateTotalNetWorth();
        }
      )
      .subscribe();

    // Listener Manual (Disparado pelo seu código de Venda/Compra)
    const handleManualUpdate = () => {
        // Pequeno delay para garantir que o banco processou, se necessário
        setTimeout(() => calculateTotalNetWorth(), 500);
    };
    
    window.addEventListener('balance_updated', handleManualUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('balance_updated', handleManualUpdate);
    };
  }, [user, calculateTotalNetWorth]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
          <header className="sticky top-0 z-10 w-full h-16 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
            
            {/* Esquerda: Menu e Título da Página */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" />
              <div className="h-6 w-px bg-border/50 hidden sm:block" />
              <div className="flex items-center gap-2 text-foreground/80">
                <PageIcon className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm hidden sm:block">{PageTitle}</span>
              </div>
            </div>

            {/* Direita: Patrimônio e Perfil */}
            <div className="flex items-center gap-4">
              
              {/* Bloco de Patrimônio com Tooltip */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1 mb-0.5">
                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Patrimônio Total</p>
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger>
                         <Info className="h-3 w-3 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                       </TooltipTrigger>
                       <TooltipContent>
                         <div className="text-xs space-y-1">
                           <p className="flex justify-between gap-4"><span>Caixa:</span> <span className="font-mono font-bold text-emerald-500">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                           <p className="flex justify-between gap-4"><span>Ações:</span> <span className="font-mono font-bold text-blue-500">${investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                         </div>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                </div>

                <p className={`text-sm font-mono font-semibold transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'} ${totalNetWorth !== null && totalNetWorth > 100000 ? 'text-indigo-400' : 'text-foreground'}`}>
                  {totalNetWorth === null ? (
                    <Loader2 className="h-3 w-3 animate-spin ml-auto" />
                  ) : (
                    `$${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  )}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border border-border/50 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {profile?.username?.substring(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.username || 'Usuário'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                    {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto bg-muted/5">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}