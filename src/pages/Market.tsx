import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

const assets = {
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.50, change: 5.2, type: 'Tech' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 2.1, type: 'Tech' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.5, type: 'Tech' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: -3.1, type: 'Auto' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 178.35, change: 1.8, type: 'Retail' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 492.30, change: 8.7, type: 'Tech' },
  ],
  etfs: [
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 468.25, change: 0.8, type: 'Index' },
    { symbol: 'QQQ', name: 'Invesco QQQ', price: 389.50, change: 1.2, type: 'Tech' },
    { symbol: 'VOO', name: 'Vanguard S&P 500', price: 431.80, change: 0.7, type: 'Index' },
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 4.5, type: 'Crypto' },
    { symbol: 'ETH', name: 'Ethereum', price: 2280.50, change: 3.2, type: 'Crypto' },
    { symbol: 'SOL', name: 'Solana', price: 102.75, change: -2.1, type: 'Crypto' },
  ],
};

export default function Market() {
  const [searchTerm, setSearchTerm] = useState('');

  const renderAssets = (assetList: typeof assets.stocks) => {
    const filtered = assetList.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <Card key={asset.symbol} className="glassmorphism hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                  <CardDescription className="text-xs mt-1">{asset.name}</CardDescription>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {asset.type}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${asset.price.toFixed(2)}</span>
                <span className={`text-sm flex items-center gap-1 ${asset.change > 0 ? 'text-profit' : 'text-loss'}`}>
                  {asset.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {asset.change > 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
              <Button className="w-full">Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market</h1>
        <p className="text-muted-foreground">Browse and trade assets</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="stocks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="etfs">ETFs</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">{renderAssets(assets.stocks)}</TabsContent>
        <TabsContent value="etfs">{renderAssets(assets.etfs)}</TabsContent>
        <TabsContent value="crypto">{renderAssets(assets.crypto)}</TabsContent>
      </Tabs>
    </div>
  );
}
