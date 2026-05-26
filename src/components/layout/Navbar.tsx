import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Zap, ShoppingCart, History, TrendingUp, ChevronRight } from "lucide-react";
import { products } from "@/data/products";

export default function Navbar({ cartCount = 0 }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("nexus_search_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("nexus_search_history", JSON.stringify(newHistory));
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery);
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("nexus_search_history");
  };

  const suggestedProducts = searchQuery.length >= 2 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  const popularSearches = ["iPhone 16", "RTX 5070", "Headset Gamer", "Monitor 4K"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-2xl font-syne font-bold bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] bg-clip-text text-transparent uppercase tracking-tight shrink-0">
        <Zap className="text-[#06b6d4] fill-[#06b6d4]" /> NEXUS TECH
      </Link>

      <div className="hidden md:flex gap-8 font-syne text-sm font-semibold uppercase tracking-wider">
        {["Produtos", "Promoções", "Sobre", "Contato"].map(item => (
          <Link key={item} to="/" className="hover:text-[#06b6d4] transition-colors">{item}</Link>
        ))}
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos, marcas..."
                  className="w-full bg-[#0d1120] border border-[#7c3aed]/40 rounded-lg px-4 py-2 text-xs font-inter focus:outline-none focus:border-[#7c3aed] transition-all pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          
          {!isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-300 hover:text-[#06b6d4]"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        <button className="relative p-2 hover:bg-white/10 rounded-full transition-all text-gray-300">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#7c3aed] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white">
              {cartCount}
            </span>
          )}
        </button>

        {/* DROPDOWN DE SUGESTÕES */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-4 right-0 w-[400px] bg-[#07080f]/95 backdrop-blur-xl border border-[#7c3aed]/30 rounded-2xl shadow-2xl overflow-hidden z-[60]"
            >
              <div className="p-6 space-y-8">
                {searchQuery.length < 2 ? (
                  <>
                    {/* Histórico */}
                    {history.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Buscas Recentes</h4>
                          <button onClick={clearHistory} className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase font-bold">Limpar</button>
                        </div>
                        <div className="space-y-2">
                          {history.map((h, i) => (
                            <button 
                              key={i} 
                              onClick={() => { setSearchQuery(h); handleSearch(); }}
                              className="flex items-center gap-3 w-full text-xs text-gray-400 hover:text-white transition-colors group"
                            >
                              <History size={14} className="text-gray-600" />
                              <span className="flex-1 text-left">{h}</span>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Buscas Populares */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <TrendingUp size={12} className="text-[#7c3aed]" /> Sugestões Nexus
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((s, i) => (
                          <button 
                            key={i} 
                            onClick={() => { setSearchQuery(s); handleSearch(); }}
                            className="px-4 py-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#7c3aed] hover:text-white transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Resultados sugeridos */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Produtos sugeridos</h4>
                      <div className="space-y-1">
                        {suggestedProducts.length > 0 ? (
                          suggestedProducts.map((p) => (
                            <Link 
                              key={p.id} 
                              to={`/produto/${p.id}`} 
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#7c3aed]/10 transition-all border border-transparent hover:border-[#7c3aed]/20 group"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <div className="w-12 h-12 bg-black/40 rounded-lg p-2 border border-white/5 group-hover:border-[#7c3aed]/30 transition-all">
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-tight group-hover:text-[#7c3aed] transition-colors">{p.name}</p>
                                <p className="text-[10px] text-[#06b6d4] font-bold">R$ {p.price.toLocaleString()}</p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-gray-600 italic">Nenhum produto correspondente...</p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleSearch}
                      className="w-full py-4 bg-[#7c3aed] text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-[#7c3aed]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Ver todos os resultados <ChevronRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
