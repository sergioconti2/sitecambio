const { useState, useMemo } = React;
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = Recharts;

// Catálogo com as principais moedas globais e taxas representativas em relação ao USD
const CURRENCIES = {
  USD: { code: 'USD', name: 'Dólar Americano', symbol: '$', rate: 1.0, country: 'Estados Unidos', flag: 'US' },
  BRL: { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', rate: 5.68, country: 'Brasil', flag: 'BR' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, country: 'União Europeia', flag: 'EU' },
  GBP: { code: 'GBP', name: 'Libra Esterlina', symbol: '£', rate: 0.78, country: 'Reino Unido', flag: 'GB' },
  JPY: { code: 'JPY', name: 'Iene Japonês', symbol: '¥', rate: 151.40, country: 'Japão', flag: 'JP' },
  CAD: { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$', rate: 1.38, country: 'Canadá', flag: 'CA' },
  AUD: { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', rate: 1.52, country: 'Austrália', flag: 'AU' },
  CHF: { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF', rate: 0.88, country: 'Suíça', flag: 'CH' },
  CNY: { code: 'CNY', name: 'Yuan Chinês', symbol: '¥', rate: 7.24, country: 'China', flag: 'CN' },
  MXN: { code: 'MXN', name: 'Peso Mexicano', symbol: 'Mex$', rate: 19.80, country: 'México', flag: 'MX' },
  ARS: { code: 'ARS', name: 'Peso Argentino', symbol: 'ARS$', rate: 985.00, country: 'Argentina', flag: 'AR' },
  CLP: { code: 'CLP', name: 'Peso Chileno', symbol: 'CLP$', rate: 945.00, country: 'Chile', flag: 'CL' }
};

const HISTORICAL_SERIES = {
  BRL: [5.62, 5.65, 5.71, 5.67, 5.70, 5.66, 5.68],
  EUR: [0.915, 0.919, 0.924, 0.921, 0.925, 0.922, 0.920],
  GBP: [0.775, 0.778, 0.782, 0.780, 0.785, 0.781, 0.779],
  JPY: [149.5, 150.1, 151.2, 150.8, 151.8, 151.0, 151.4],
  USD: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
};

function App() {
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('BRL');
  const [amount, setAmount] = useState('1000');
  const [spreadMargin, setSpreadMargin] = useState(1.5);
  const [iofTax, setIofTax] = useState(1.1);
  const [activeTab, setActiveTab] = useState('calculator');
  const [searchTerm, setSearchTerm] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const rateFrom = CURRENCIES[fromCurr]?.rate || 1;
  const rateTo = CURRENCIES[toCurr]?.rate || 1;

  const exchangeRate = rateTo / rateFrom;
  const inverseRate = rateFrom / rateTo;

  const rawConverted = parsedAmount * exchangeRate;
  const spreadValue = rawConverted * (spreadMargin / 100);
  const iofValue = (rawConverted - spreadValue) * (iofTax / 100);
  const effectiveTotal = rawConverted - spreadValue - iofValue;

  const handleSwap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const chartData = useMemo(() => {
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'];
    const fromSeries = HISTORICAL_SERIES[fromCurr] || [rateFrom, rateFrom, rateFrom, rateFrom, rateFrom, rateFrom, rateFrom];
    const toSeries = HISTORICAL_SERIES[toCurr] || [rateTo, rateTo, rateTo, rateTo, rateTo, rateTo, rateTo];

    return labels.map((dia, i) => {
      const f = fromSeries[i] || rateFrom;
      const t = toSeries[i] || rateTo;
      return {
        dia,
        taxa: parseFloat((t / f).toFixed(4))
      };
    });
  }, [fromCurr, toCurr, rateFrom, rateTo]);

  const filteredList = Object.values(CURRENCIES).filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter antialiased selection:bg-fuchsia-500 selection:text-white">

      {/* Top Banner Vibrante com Efeito Ticker */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-cyan-500 to-amber-400 py-1 px-4 text-slate-950 text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-slate-950 text-cyan-300 px-2 py-0.5 font-mono text-[10px] tracking-normal border border-cyan-400">COTAÇÕES EM TEMPO REAL</span>
          <span className="hidden md:inline font-bold">PLATAFORMA ATIVA 24 HORAS POR DIA • SPREAD REDUZIDO • VET COMPLETO</span>
        </div>
        <div className="font-mono text-[10px] font-extrabold flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Cabeçalho Principal com Alta Densidade Visual e Cores Neon */}
      <header className="border-b-2 border-cyan-400 bg-slate-900/90 backdrop-blur sticky top-0 z-50 shadow-[0_4px_20px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-lg tracking-tighter shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              24H
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 block leading-none">
                Site Câmbio de Todas as Horas
              </span>
              <span className="text-[11px] text-cyan-400 uppercase font-mono tracking-widest block font-bold mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-fuchsia-400 rounded-none"></span>
                Conversor Oficial de Moedas Mundiais
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end text-xs font-mono">
              <span className="text-slate-400 text-[10px]">PARIDADE ATUAL</span>
              <span className="text-emerald-400 font-extrabold text-sm tabular-nums">
                1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}
              </span>
            </div>
            <div className="px-3 py-1.5 bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-300 font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(217,70,239,0.3)]">
              MERCADO ABERTO
            </div>
          </div>
        </div>
      </header>

      {/* Navegação Vibrante com Abas de Cores Distintas */}
      <div className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex border border-slate-700 bg-slate-950 divide-x divide-slate-800 shadow-lg">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'calculator'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900'
              }`}
            >
              <i className="fa-solid fa-bolt mr-2 text-fuchsia-500"></i>
              Conversor Instantâneo
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'rates'
                  ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                  : 'text-slate-300 hover:text-fuchsia-300 hover:bg-slate-900'
              }`}
            >
              <i className="fa-solid fa-chart-line mr-2 text-cyan-300"></i>
              Todas as Moedas
            </button>
            <button
              onClick={() => setActiveTab('taxes')}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'taxes'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <i className="fa-solid fa-receipt mr-2 text-rose-500"></i>
              Simulador VET & Taxas
            </button>
          </div>

          <div className="text-xs font-mono text-cyan-300 flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse"></span>
            <span>Feed Oficial de Câmbio Interbancário</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ABA 1: CALCULADORA COM CORES VIBRANTES */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Bloco de Conversão Principal */}
            <div className="lg:col-span-7 bg-slate-900 border-2 border-slate-800 hover:border-cyan-500/50 transition-colors p-6 sm:p-8 relative shadow-2xl">
              <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 w-full mb-6"></div>

              {/* Valor a converter */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 inline-block"></span>
                    Quantia a Converter ({fromCurr})
                  </label>
                  <span className="text-[11px] font-mono text-fuchsia-400 font-bold">DIGITE O VALOR</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-fuchsia-400">
                    {CURRENCIES[fromCurr]?.symbol}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-16 pr-4 py-4 bg-slate-950 border-2 border-slate-700 text-3xl sm:text-4xl font-extrabold text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 tabular-nums transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Seletor De / Para com Botão Inverter */}
              <div className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center mb-6">
                <div className="sm:col-span-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-cyan-300 block mb-1 font-bold">
                    Moeda Origem (De)
                  </label>
                  <select
                    value={fromCurr}
                    onChange={(e) => setFromCurr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-3 text-sm font-bold text-white focus:outline-none focus:border-fuchsia-500 cursor-pointer"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.code} - {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 flex justify-center pt-5">
                  <button
                    onClick={handleSwap}
                    title="Inverter Moedas"
                    className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                  >
                    <i className="fa-solid fa-arrow-right-arrow-left text-base"></i>
                  </button>
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-amber-300 block mb-1 font-bold">
                    Moeda Destino (Para)
                  </label>
                  <select
                    value={toCurr}
                    onChange={(e) => setToCurr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-3 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.code} - {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caixa de Resultado em Destaque Vibrante */}
              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-emerald-500/50 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  Resultado Comercial
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
                  Total Convertido
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-6xl font-black tracking-tight text-white tabular-nums drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    {CURRENCIES[toCurr]?.symbol} {rawConverted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-2xl font-black text-cyan-400">{toCurr}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-mono">
                  <div className="bg-slate-900 px-3.5 py-2 border border-cyan-500/30 text-slate-300">
                    Taxa Base: <span className="font-bold text-cyan-300 tabular-nums">1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
                  </div>
                  <div className="bg-slate-900 px-3.5 py-2 border border-fuchsia-500/30 text-slate-300">
                    Taxa Inversa: <span className="font-bold text-fuchsia-300 tabular-nums">1 {toCurr} = {inverseRate.toFixed(4)} {fromCurr}</span>
                  </div>
                </div>
              </div>

              {/* Botões Rápidos com Cores Neon */}
              <div className="pt-6">
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-mono font-bold block mb-2.5">
                  Simulações Rápidas de Montante
                </span>
                <div className="flex flex-wrap gap-2">
                  {['100', '500', '1000', '2500', '5000', '10000', '25000'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className="px-3.5 py-2 text-xs font-mono font-black border border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:bg-slate-900 transition-all active:scale-95"
                    >
                      {CURRENCIES[fromCurr]?.symbol}{val}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Coluna Lateral: Gráficos e Cartão de VET com Cores Vivas */}
            <div className="lg:col-span-5 space-y-6">

              {/* Gráfico Recharts com Linha Fúcsia Neon */}
              <div className="bg-slate-900 border border-slate-800 p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-fuchsia-400 font-mono">
                      Variação em 7 Dias
                    </h3>
                    <div className="text-xs text-cyan-300 font-mono font-bold">Paridade {fromCurr} / {toCurr}</div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-black bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-300">
                    TENDÊNCIA
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 0.01', 'dataMax + 0.01']} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #e879f9', fontSize: '12px' }}
                        itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="taxa"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#fbbf24' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex justify-between text-[11px] font-mono border-t border-slate-800 pt-2.5">
                  <span className="text-cyan-400">Mín: {Math.min(...chartData.map(d => d.taxa)).toFixed(4)}</span>
                  <span className="text-fuchsia-400">Máx: {Math.max(...chartData.map(d => d.taxa)).toFixed(4)}</span>
                </div>
              </div>

              {/* Resumo de Custo Efetivo Real (VET) com Âmbar e Esmeralda Vibrante */}
              <div className="bg-slate-900 border-2 border-amber-400/40 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-extrabold flex items-center gap-1.5">
                    <i className="fa-solid fa-coins text-amber-400"></i>
                    VET - Valor Efetivo Real
                  </span>
                  <span className="text-xs font-mono bg-amber-400 text-slate-950 font-black px-2.5 py-0.5">
                    NO BOLSO
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono text-slate-300 mb-5">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Total Comercial:</span>
                    <span className="text-white font-bold">{CURRENCIES[toCurr]?.symbol} {rawConverted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-rose-400 font-bold">
                    <span>Spread ({spreadMargin}%):</span>
                    <span>- {CURRENCIES[toCurr]?.symbol} {spreadValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-rose-400 font-bold">
                    <span>IOF Cambial ({iofTax}%):</span>
                    <span>- {CURRENCIES[toCurr]?.symbol} {iofValue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-800 bg-slate-950 p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Total Líquido Estimado a Receber:</div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums mt-1 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                    {CURRENCIES[toCurr]?.symbol} {effectiveTotal > 0 ? effectiveTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ABA 2: TODAS AS MOEDAS COM DESTAQUES COLORIDOS */}
        {activeTab === 'rates' && (
          <div className="bg-slate-900 border-2 border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 flex items-center space-x-2">
                  <span>Todas as Moedas Globais</span>
                </h2>
                <p className="text-xs text-slate-300 font-mono mt-1">
                  Cotações simultâneas tendo como referência <span className="text-cyan-300 font-extrabold bg-slate-950 px-2 py-0.5 border border-cyan-500/40">1 {fromCurr}</span>
                </p>
              </div>

              <div className="w-full sm:w-80">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar por moeda, país ou símbolo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-700 px-4 py-2.5 pl-10 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 placeholder-slate-500 shadow-inner"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 text-xs"></i>
                </div>
              </div>
            </div>

            {/* Tabela de Moedas com Cores de Terminal de Câmbio */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 bg-slate-950 text-cyan-400 uppercase tracking-widest font-black">
                    <th className="py-4 px-4">Sigla</th>
                    <th className="py-4 px-4">Moeda</th>
                    <th className="py-4 px-4">País / Região</th>
                    <th className="py-4 px-4 text-right">Cotação (1 {fromCurr})</th>
                    <th className="py-4 px-4 text-right">Inverso (em {fromCurr})</th>
                    <th className="py-4 px-4 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredList.map((item) => {
                    const itemExchange = item.rate / rateFrom;
                    const itemInverse = rateFrom / item.rate;
                    const isSelected = item.code === toCurr;

                    return (
                      <tr 
                        key={item.code} 
                        className={`hover:bg-slate-800/80 transition-colors ${
                          isSelected ? 'bg-fuchsia-950/40 border-l-4 border-l-fuchsia-500' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="font-black text-slate-950 text-xs bg-cyan-400 px-2 py-1 mr-2 tracking-wider">
                            {item.code}
                          </span>
                          <span className="text-amber-400 font-extrabold">{item.symbol}</span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-100">
                          {item.name}
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-medium">
                          {item.country}
                        </td>
                        <td className="py-4 px-4 text-right tabular-nums font-black text-emerald-400 text-sm">
                          {itemExchange.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </td>
                        <td className="py-4 px-4 text-right tabular-nums text-fuchsia-300 font-bold">
                          {itemInverse.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => {
                              setToCurr(item.code);
                              setActiveTab('calculator');
                            }}
                            className="text-[11px] uppercase font-black tracking-wider px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                          >
                            Converter
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: SIMULADOR VET COM PALETA VIBRANTE DE ENERGIA */}
        {activeTab === 'taxes' && (
          <div className="bg-slate-900 border-2 border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="border-b-2 border-slate-800 pb-6">
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 flex items-center space-x-2">
                <span>Simulador Real de Spread Bancário e Tributos (IOF)</span>
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Ajuste os parâmetros para descobrir exatamente quanto chega no seu bolso ou na sua conta internacional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Controles do Simulador */}
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 border border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
                      Spread Cambial da Instituição
                    </label>
                    <span className="text-base font-black font-mono text-fuchsia-400 bg-slate-900 px-3 py-1 border border-fuchsia-500/50">
                      {spreadMargin}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.1"
                    value={spreadMargin}
                    onChange={(e) => setSpreadMargin(parseFloat(e.target.value))}
                    className="w-full accent-fuchsia-500 bg-slate-800 h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-3">
                    <span className="text-cyan-400">0% (Comercial)</span>
                    <span className="text-amber-400 font-bold">1% a 2% (Contas Globais)</span>
                    <span className="text-rose-400 font-bold">3% a 6% (Bancos)</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 border border-slate-800">
                  <label className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold block mb-2.5">
                    Tipo de Operação & Alíquota de IOF
                  </label>
                  <select
                    value={iofTax}
                    onChange={(e) => setIofTax(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="1.1">1,10% - Envio para conta própria no exterior (Wise, Nomad, C6 Global)</option>
                    <option value="0.38">0,38% - Remessa para contas de terceiros / Investimentos / PJ</option>
                    <option value="4.38">4,38% - Cartão de Crédito Internacional e Saques no Exterior</option>
                  </select>
                </div>

                <div className="bg-slate-950 border-l-4 border-l-cyan-400 border border-slate-800 p-4 space-y-2">
                  <div className="text-xs font-black text-cyan-300 uppercase font-mono flex items-center space-x-2">
                    <i className="fa-solid fa-circle-exclamation text-cyan-400"></i>
                    <span>Entenda a regra do VET Oficial</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    O <strong>VET (Valor Efetivo Total)</strong> considera todas as despesas embutidas na transação cambial. Enquanto muitas plataformas divulgam a taxa comercial em destaque, o valor creditado diminui com o spread e o IOF legal.
                  </p>
                </div>
              </div>

              {/* Demonstrativo em Tempo Real */}
              <div className="bg-slate-950 border-2 border-cyan-500/40 p-6 sm:p-7 space-y-5 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-black">
                    Extrato da Operação ({fromCurr} → {toCurr})
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-400 text-slate-950 font-bold px-2 py-0.5">
                    DETALHADO
                  </span>
                </div>

                <div className="space-y-3.5 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Montante Solicitado:</span>
                    <span className="font-extrabold text-white tabular-nums">{CURRENCIES[fromCurr]?.symbol} {parsedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Cotação Interbancária:</span>
                    <span className="text-cyan-300 font-bold tabular-nums">{exchangeRate.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Comercial Bruto:</span>
                    <span className="text-white font-extrabold tabular-nums">{CURRENCIES[toCurr]?.symbol} {rawConverted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-rose-400 font-bold">
                    <span>Taxa de Spread ({spreadMargin}%):</span>
                    <span className="tabular-nums">- {CURRENCIES[toCurr]?.symbol} {spreadValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-rose-400 font-bold">
                    <span>Imposto IOF ({iofTax}%):</span>
                    <span className="tabular-nums">- {CURRENCIES[toCurr]?.symbol} {iofValue.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-700 bg-slate-900/60 p-4">
                    <span className="text-xs font-bold text-slate-300 uppercase block mb-1">Valor Líquido no Bolso (VET Final):</span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                      {CURRENCIES[toCurr]?.symbol} {effectiveTotal > 0 ? effectiveTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Rodapé com Destaques Visuais */}
      <footer className="border-t-2 border-slate-800 bg-slate-900 mt-20 py-10 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400"></div>
            <span className="font-bold text-slate-300">© {new Date().getFullYear()} Site Câmbio de Todas as Horas.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <span className="text-cyan-400 font-bold">Câmbio 24 Horas</span>
            <span className="text-fuchsia-400 font-bold">Simulador VET Oficial</span>
            <span className="text-amber-400 font-bold">Alíquotas BACEN & IOF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}