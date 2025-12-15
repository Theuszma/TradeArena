import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
}

export const useStockPrices = (symbols: string[]) => {
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length > 0) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [symbols.join(',')]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('stock-prices', {
        body: { symbols },
      });

      if (error) throw error;
      setStocks(data.stocks);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  return { stocks, loading, error, refetch: fetchPrices };
};
