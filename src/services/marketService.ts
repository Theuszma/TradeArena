// src/services/marketService.ts

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BRAPI_KEY = import.meta.env.VITE_BRAPI_API_KEY;

// Tipo unificado para nossa interface
export type Asset = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: 'Tech' | 'Auto' | 'Retail' | 'Finance' | 'Energy' | 'Crypto' | 'Index';
};

// --- 1. Serviço de Cripto (CoinGecko - Grátis/Público) ---
export const getCryptoPrices = async (): Promise<Asset[]> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change, type: 'Crypto' },
      { symbol: 'ETH', name: 'Ethereum', price: data.ethereum.usd, change: data.ethereum.usd_24h_change, type: 'Crypto' },
      { symbol: 'SOL', name: 'Solana', price: data.solana.usd, change: data.solana.usd_24h_change, type: 'Crypto' },
      { symbol: 'ADA', name: 'Cardano', price: data.cardano.usd, change: data.cardano.usd_24h_change, type: 'Crypto' },
    ];
  } catch (error) {
    console.error("Erro Crypto:", error);
    return [];
  }
};

// --- 2. Serviço de Ações EUA (Finnhub) ---
export const getUSStocks = async (): Promise<Asset[]> => {
  if (!FINNHUB_KEY) {
    console.warn("Finnhub Key não encontrada");
    return [];
  }

  const symbols = [
    { s: 'AAPL', n: 'Apple Inc.', t: 'Tech' },
    { s: 'MSFT', n: 'Microsoft', t: 'Tech' },
    { s: 'NVDA', n: 'NVIDIA', t: 'Tech' },
    { s: 'TSLA', n: 'Tesla', t: 'Auto' },
  ];

  try {
    // Finnhub free não aceita batch (vários de uma vez), então fazemos Promise.all
    const requests = symbols.map(async (item) => {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${item.s}&token=${FINNHUB_KEY}`);
      const data = await res.json();
      // data.c = current price, data.dp = percent change
      return {
        symbol: item.s,
        name: item.n,
        price: data.c,
        change: data.dp,
        type: item.t as any
      };
    });

    return await Promise.all(requests);
  } catch (error) {
    console.error("Erro US Stocks:", error);
    return [];
  }
};

// --- 3. Serviço de Ações BR (Brapi) ---
// --- 3. Serviço de Ações BR (Brapi) com Proteção contra Erros ---
export const getBRStocks = async (): Promise<Asset[]> => {
  const tokenParams = BRAPI_KEY ? `&token=${BRAPI_KEY}` : '';
  const symbols = 'PETR4,VALE3,ITUB4,MGLU3,WEGE3';

  try {
    const response = await fetch(`https://brapi.dev/api/quote/${symbols}?range=1d&interval=1d${tokenParams}`);

    // 1. Tratamento específico para limite de API (Erro 429)
    if (response.status === 429) {
      console.warn("⚠️ Limite da API Brapi atingido (429). Usando dados simulados para não travar.");
      return [
        { symbol: 'PETR4', name: 'Petrobras PN (Simulado)', price: 41.50, change: 2.3, type: 'Energy' },
        { symbol: 'VALE3', name: 'Vale ON (Simulado)', price: 68.20, change: -1.5, type: 'Energy' },
        { symbol: 'ITUB4', name: 'Itaú Unibanco (Simulado)', price: 33.10, change: 0.8, type: 'Finance' },
        { symbol: 'MGLU3', name: 'Magalu (Simulado)', price: 2.15, change: -4.2, type: 'Retail' },
        { symbol: 'WEGE3', name: 'WEG ON (Simulado)', price: 36.90, change: 1.1, type: 'Tech' }
      ];
    }

    // 2. Se a resposta não for OK por outro motivo
    if (!response.ok) {
        console.error(`Erro na API Brapi: ${response.status}`);
        return [];
    }

    const data = await response.json();

    // 3. Verificação de segurança: checa se 'results' existe antes de mapear
    if (!data.results || !Array.isArray(data.results)) {
        console.error("Formato inesperado da Brapi:", data);
        return [];
    }

    return data.results.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.longName || stock.symbol,
      price: stock.regularMarketPrice,
      change: stock.regularMarketChangePercent,
      type: stock.symbol === 'ITUB4' ? 'Finance' : (stock.symbol === 'PETR4' || stock.symbol === 'VALE3') ? 'Energy' : 'Retail'
    }));

  } catch (error) {
    console.error("Erro geral BR Stocks:", error);
    // Retorna array vazio ou dados simulados em caso de falha de rede
    return []; 
  }
};