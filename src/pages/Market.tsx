import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Search, RefreshCw, Loader2, Wallet, Globe, Plus, Minus } from 'lucide-react';
import { getCryptoPrices, getUSStocks, getBRStocks, Asset } from '@/services/marketService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos
interface UserWallet {
  league_id: string;
  balance: number;
  league_name: string;
}

interface PortfolioItem {
  symbol: string;
  quantity: number;
  average_price: number;
}

// --- MODAL DE TRADE OTIMIZADO ---
function TradeModal({ asset, open, onOpenChange, onConfirm, wallet, isProcessing, portfolioItem }: { 
  asset: Asset | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onConfirm: (type: 'BUY' | 'SELL', qtd: number) => void,
  wallet: UserWallet | null,
  isProcessing: boolean,
  portfolioItem: PortfolioItem | null 
}) {
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  
  // Reseta o estado sempre que o ativo muda ou o modal abre/fecha
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setMode('BUY');
    }
  }, [open, asset]);

  if (!asset || !wallet) return null;

  const totalValue = asset.price * quantity;
  const currency = (asset.type === 'Energy' || asset.type === 'Finance' || asset.symbol.endsWith('4') || asset.symbol.endsWith('3')) ? 'R$' : '$';

  const ownedQuantity = portfolioItem?.quantity || 0;
  
  // Validações
  const canBuy = wallet.balance >= totalValue;
  const canSell = ownedQuantity >= quantity;
  const isValid = mode === 'BUY' ? canBuy : canSell;

  // Funções de controle de quantidade
  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const handleMax = () => {
    if (mode === 'BUY') {
      // Calcula o máximo que dá pra comprar com o saldo (arredondado para baixo)
      const maxBuy = Math.floor(wallet.balance / asset.price);
      setQuantity(maxBuy > 0 ? maxBuy : 1);
    } else {
      // Vende tudo que tem
      setQuantity(ownedQuantity > 0 ? ownedQuantity : 1);
    }
  };

  const handleConfirm = () => {
    if (isValid && quantity > 0) {
      onConfirm(mode, quantity);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Negociar {asset.symbol}</span>
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
               Atual: {currency} {asset.price.toFixed(2)}
            </span>
          </DialogTitle>
          <DialogDescription>
            Carteira: <span className="font-semibold text-primary">{wallet.league_name}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'BUY' | 'SELL')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="BUY" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Comprar
            </TabsTrigger>
            <TabsTrigger 
                value="SELL" 
                disabled={ownedQuantity === 0}
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white disabled:opacity-50"
            >
                Vender {ownedQuantity > 0 ? `(${ownedQuantity})` : ''}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 py-6">
          {/* Controle de Quantidade Bonito */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <Label>Quantidade</Label>
                {mode === 'SELL' && (
                    <span className="text-xs text-muted-foreground">Disponível: {ownedQuantity}</span>
                )}
                {mode === 'BUY' && (
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={handleMax}>
                       Pode comprar: {Math.floor(wallet.balance / asset.price)}
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={handleDecrement} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                
                {/* --- AQUI ESTÁ A MUDANÇA --- */}
                {/* Adicionei classes [appearance:textfield] e webkit-inner-spin para esconder as setas nativas */}
                <Input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="text-center text-lg font-bold h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />

                <Button variant="outline" size="icon" onClick={handleIncrement}>
                    <Plus className="h-4 w-4" />
                </Button>

                <Button variant="secondary" size="sm" onClick={handleMax} className="ml-2">
                    Máx
                </Button>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-muted/40 p-4 rounded-lg space-y-2 border border-border/50">
             <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor Total</span>
                <span className="text-xl font-bold">{currency} {totalValue.toFixed(2)}</span>
             </div>
             
             <div className="h-px bg-border/50 w-full my-2"></div>

             <div className="flex justify-between items-center text-sm">
                <span>{mode === 'BUY' ? 'Saldo Restante' : 'Saldo Novo'}</span>
                <span className={isValid ? 'text-primary' : 'text-red-500'}>
                    {currency} {mode === 'BUY' 
                        ? (wallet.balance - totalValue).toLocaleString('en-US', {minimumFractionDigits: 2})
                        : (wallet.balance + totalValue).toLocaleString('en-US', {minimumFractionDigits: 2})
                    }
                </span>
             </div>
          </div>
            
          {!isValid && (
             <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
                <p className="text-sm text-red-500 font-semibold">
                    {mode === 'BUY' ? 'Saldo insuficiente para esta operação' : 'Quantidade insuficiente na carteira'}
                </p>
             </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={handleConfirm} 
            disabled={!isValid || isProcessing || quantity <= 0}
            className={`w-full sm:w-auto text-white active:scale-95 transition-all duration-200 shadow-md ${
                mode === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar {mode === 'BUY' ? 'Compra' : 'Venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function Market() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMarket, setLoadingMarket] = useState(true);
  
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [brStocks, setBrStocks] = useState<Asset[]>([]);
  const [crypto, setCrypto] = useState<Asset[]>([]);

  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  
  // Portfólio Atual (para saber o que pode vender)
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioItem[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Busca Carteiras
  const fetchUserWallets = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select(`league_id, balance, leagues(name)`)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedWallets: UserWallet[] = data.map((item: any) => ({
        league_id: item.league_id,
        balance: item.balance,
        league_name: item.leagues?.name || 'Liga Desconhecida'
      }));

      // Ordena Global primeiro
      formattedWallets.sort((a, b) => (a.league_name === 'Global' ? -1 : 1));
      setWallets(formattedWallets);

      if (!selectedWalletId && formattedWallets.length > 0) {
        setSelectedWalletId(formattedWallets[0].league_id);
      }
    } catch (error) {
      console.error("Erro wallets:", error);
    }
  };

  // 2. Busca Portfólio da Carteira Selecionada
  const fetchPortfolio = async () => {
    if (!user || !selectedWalletId) return;
    try {
        const { data, error } = await supabase
            .from('portfolios')
            .select('symbol, quantity, average_price')
            .eq('user_id', user.id)
            .eq('league_id', selectedWalletId);
        
        if (error) throw error;
        setCurrentPortfolio(data || []);
    } catch (error) {
        console.error("Erro portfolio:", error);
    }
  }

  // 3. Busca Mercado
  const fetchMarketData = async () => {
    setLoadingMarket(true);
    try {
      const [cryptoData, usData, brData] = await Promise.all([
        getCryptoPrices(), getUSStocks(), getBRStocks()
      ]);
      setCrypto(cryptoData);
      setStocks(usData);
      setBrStocks(brData);
    } catch (error) {
      console.error("Erro mercado:", error);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUserWallets();
  }, [user]);

  // Atualiza o portfólio sempre que trocar a carteira
  useEffect(() => {
    if(selectedWalletId) fetchPortfolio();
  }, [selectedWalletId]);

  const handleAssetClick = (asset: Asset) => {
    if (wallets.length === 0) {
        toast.error("Você precisa participar de uma liga.");
        return;
    }
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // --- LÓGICA CENTRAL DE TRADE ---
  // --- LÓGICA CENTRAL DE TRADE ---
  const executeTransaction = async (type: 'BUY' | 'SELL', quantity: number) => {
    if (!selectedAsset || !selectedWalletId || !user) return;
    setIsProcessing(true);

    const price = selectedAsset.price;
    const totalValue = price * quantity;
    const symbol = selectedAsset.symbol;

    try {
        // 1. BUSCA DE SEGURANÇA: Pega o saldo oficial do banco agora (não confia no state visual)
        const { data: balanceData, error: balanceError } = await supabase
            .from('user_balances')
            .select('balance')
            .eq('user_id', user.id)
            .eq('league_id', selectedWalletId)
            .single();

        if (balanceError || !balanceData) {
            throw new Error("Não foi possível confirmar seu saldo atual.");
        }

        const currentSafeBalance = balanceData.balance;

        // A. COMPRA
        if (type === 'BUY') {
            if (currentSafeBalance < totalValue) {
                toast.error("Saldo insuficiente confirmado pelo banco.");
                setIsProcessing(false);
                return;
            }

            // 1. Atualizar Saldo (Subtrair)
            const newBalance = currentSafeBalance - totalValue;
            
            const { error: updateError } = await supabase
                .from('user_balances')
                .update({ balance: newBalance })
                .eq('user_id', user.id)
                .eq('league_id', selectedWalletId);
            
            if (updateError) throw updateError;

            // 2. Atualizar Portfólio (Upsert)
            const existingItem = currentPortfolio.find(p => p.symbol === symbol);
            let newQty = quantity;
            let newAvgPrice = price;

            if (existingItem) {
                const totalInvested = (existingItem.quantity * existingItem.average_price) + totalValue;
                newQty = existingItem.quantity + quantity;
                newAvgPrice = totalInvested / newQty;
            }

            await supabase.from('portfolios').upsert({
                user_id: user.id,
                league_id: selectedWalletId,
                symbol: symbol,
                quantity: newQty,
                average_price: newAvgPrice
            }, { onConflict: 'user_id, league_id, symbol' });

            toast.success(`Comprou ${quantity} de ${symbol}`);
        } 
        // B. VENDA
        else {
            // 1. Atualizar Saldo (Somar)
            // Aqui estava sua dúvida: Pegamos o saldo CONFIRMADO DO BANCO e somamos o valor da venda
            const newBalance = currentSafeBalance + totalValue;
            
            const { error: updateError } = await supabase
                .from('user_balances')
                .update({ balance: newBalance })
                .eq('user_id', user.id)
                .eq('league_id', selectedWalletId);

            if (updateError) throw updateError;

            // 2. Atualizar Portfólio
            const existingItem = currentPortfolio.find(p => p.symbol === symbol);
            if(existingItem) {
                const newQty = existingItem.quantity - quantity;
                if (newQty > 0) {
                    await supabase.from('portfolios').update({ quantity: newQty })
                        .eq('user_id', user.id).eq('league_id', selectedWalletId).eq('symbol', symbol);
                } else {
                    await supabase.from('portfolios').delete()
                        .eq('user_id', user.id).eq('league_id', selectedWalletId).eq('symbol', symbol);
                }
            }
            toast.success(`Vendeu ${quantity} de ${symbol} por $${totalValue.toFixed(2)}`);
        }

        // C. REGISTRAR TRANSAÇÃO
        await supabase.from('transactions').insert({
            user_id: user.id,
            league_id: selectedWalletId,
            symbol: symbol,
            type: type,
            quantity: quantity,
            price: price,
            total_amount: totalValue
        });

        // D. ATUALIZAÇÕES VISUAIS
        
        // 1. Dispara evento para o AppLayout atualizar o header IMEDIATAMENTE
        window.dispatchEvent(new Event('balance_updated'));

        // 2. Atualiza dados da tela de Mercado
        await fetchUserWallets();
        await fetchPortfolio();
        setIsModalOpen(false);

    } catch (error: any) {
        console.error("Trade error:", error);
        toast.error("Erro ao processar transação: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const activeWalletData = wallets.find(w => w.league_id === selectedWalletId);
  const isGlobalWallet = activeWalletData?.league_name === 'Global';
  
  // Encontra se o usuário já tem esse ativo NA CARTEIRA SELECIONADA
  const portfolioItem = currentPortfolio.find(p => p.symbol === selectedAsset?.symbol);

  // Renderização (Cards)
  const renderAssets = (assetList: Asset[]) => {
    const filtered = assetList.filter(asset => 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loadingMarket) return <div className="flex justify-center py-12 w-full"><Loader2 className="animate-spin text-primary" /></div>;
    if (filtered.length === 0) return <div className="text-center py-12 col-span-full text-muted-foreground">Nada encontrado.</div>;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <Card key={asset.symbol} className="glassmorphism hover:border-primary/50 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                  <CardDescription className="text-xs mt-1">{asset.name}</CardDescription>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{asset.type}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {(asset.type === 'Energy' || asset.type === 'Finance' || asset.symbol.endsWith('4') || asset.symbol.endsWith('3')) ? 'R$ ' : '$ '}
                  {asset.price?.toFixed(2)}
                </span>
                <span className={`text-sm flex items-center gap-1 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {asset.change > 0 ? '+' : ''}{asset.change?.toFixed(2)}%
                </span>
              </div>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold active:scale-95 transition-all duration-200 shadow-md" 
                onClick={() => handleAssetClick(asset)}
              >
                Negociar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mercado</h1>
          <p className="text-muted-foreground">Cotações em tempo real e negociação</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-[200px]">
                <Label className="text-xs text-muted-foreground mb-1 block">Carteira Selecionada</Label>
                <Select value={selectedWalletId} onValueChange={setSelectedWalletId} disabled={wallets.length === 0}>
                    <SelectTrigger className={`w-full ${isGlobalWallet ? 'border-indigo-500/50 bg-indigo-500/10' : 'bg-background/50'}`}>
                        <SelectValue placeholder={wallets.length === 0 ? "Sem Ligas" : "Selecione..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.league_id} value={wallet.league_id}>
                             {wallet.league_name === 'Global' ? (
                                <div className="flex items-center gap-2 text-indigo-500 font-bold"><Globe className="h-3 w-3" /> Global</div>
                             ) : wallet.league_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card className={`px-4 py-2 flex items-center gap-3 border shadow-sm w-full md:w-auto min-w-[180px] transition-colors duration-300 ${
                isGlobalWallet ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-muted/50 border-primary/20'
            }`}>
                <div className={`p-2 rounded-full ${isGlobalWallet ? 'bg-indigo-500/20' : 'bg-primary/10'}`}>
                    {isGlobalWallet ? <Globe className="h-5 w-5 text-indigo-400" /> : <Wallet className="h-5 w-5 text-primary" />}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{isGlobalWallet ? 'Saldo Global' : 'Disponível'}</p>
                    <p className={`font-bold font-mono text-lg ${isGlobalWallet ? 'text-indigo-400' : 'text-emerald-500'}`}>
                        $ {activeWalletData?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                </div>
            </Card>

            <Button variant="outline" size="icon" onClick={fetchMarketData} disabled={loadingMarket} className="shrink-0">
                <RefreshCw className={`h-4 w-4 ${loadingMarket ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ativos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="brstocks" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="brstocks">Brasil (B3)</TabsTrigger>
          <TabsTrigger value="stocks">EUA (Stocks)</TabsTrigger>
          <TabsTrigger value="crypto">Cripto</TabsTrigger>
        </TabsList>
        <TabsContent value="brstocks">{renderAssets(brStocks)}</TabsContent>
        <TabsContent value="stocks">{renderAssets(stocks)}</TabsContent>
        <TabsContent value="crypto">{renderAssets(crypto)}</TabsContent>
      </Tabs>

      <TradeModal 
        asset={selectedAsset} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onConfirm={executeTransaction}
        wallet={activeWalletData || null}
        isProcessing={isProcessing}
        portfolioItem={portfolioItem || null}
      />
    </div>
  );
}