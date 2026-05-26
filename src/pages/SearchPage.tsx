import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { 
  Zap, ChevronRight, LayoutGrid, List, SlidersHorizontal, 
  X, Star, ArrowRight, Loader2
} from "lucide-react";

import { products } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevancia");
  const [minRating, setMinRating] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and Fuzzy Search Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Fuzzy search with Fuse.js
    if (query.trim()) {
      const fuse = new Fuse(products, {
        keys: ["name", "category", "description", "brand"],
        threshold: 0.4, // Lower is stricter, 0.4 is a good balance for fuzzy
        distance: 100,
        includeScore: true
      });
      
      const searchResults = fuse.search(query);
      result = searchResults.map(r => r.item);
    }

    // Apply Filters
    result = result.filter(p => {
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchPrice && matchRating;
    });

    // Apply Sorting
    if (sortBy === "preco-menor") result.sort((a, b) => a.price - b.price);
    if (sortBy === "preco-maior") result.sort((a, b) => b.price - a.price);
    if (sortBy === "avaliados") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [query, priceRange, minRating, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSortBy("relevancia");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  // Helper to highlight search term
  const HighlightText = ({ text, term }: { text: string; term: string }) => {
    if (!term.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() 
            ? <span key={i} className="text-[#f59e0b] bg-[#f59e0b]/10 px-0.5 rounded-sm">{part}</span> 
            : part
        )}
      </span>
    );
  };

  const categories = [
    "Celulares", "Áudio & Som", "Mundo Gamer", "Smartwatches", "Acessórios", "Computadores"
  ];

  return (
    <div className="min-h-screen bg-[#07080f] text-white font-sans selection:bg-[#06b6d4] selection:text-black">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* HEADER DE BUSCA */}
        <section className="py-12 px-6 border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-6 uppercase tracking-[0.3em] font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-gray-500">Busca</span>
              <ChevronRight size={12} />
              <span className="text-white">"{query}"</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
              <div>
            <h1 className="text-4xl md:text-5xl font-syne font-extrabold uppercase tracking-tighter">
              Resultados para <span className="text-[#f59e0b]">"{query}"</span>
            </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-4">
                  {filteredProducts.length} itens encontrados em nossa órbita tecnológica
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BARRA DE CONTROLES */}
        <section className="sticky top-[72px] z-40 bg-[#07080f]/95 backdrop-blur-xl border-b border-white/5 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Ajuste sua frequência de busca
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-gray-500 hover:text-white'}`}
                >
                  <List size={18} />
                </button>
              </div>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#07080f] border border-[#7c3aed]/30 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#7c3aed] transition-colors"
              >
                <option value="relevancia">Mais Relevantes</option>
                <option value="preco-menor">Menor Preço</option>
                <option value="preco-maior">Maior Preço</option>
                <option value="avaliados">Mais Avaliados</option>
              </select>

              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <SlidersHorizontal size={14} /> Filtros
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SIDEBAR FILTROS (Reused from CategoryPage) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="font-syne font-bold text-xs uppercase tracking-[0.2em]">Filtros</h3>
              <button onClick={clearFilters} className="text-[10px] text-[#7c3aed] font-bold uppercase tracking-widest hover:underline">Limpar tudo</button>
            </div>

            <FilterSection title="Faixa de Preço">
              <div className="space-y-4 pt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#7c3aed]" 
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>R$ 0</span>
                  <span className="text-[#7c3aed]">R$ {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Avaliação">
              <div className="space-y-3">
                {[4, 3, 2].map(star => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      className="hidden" 
                      onChange={() => setMinRating(star)}
                      checked={minRating === star}
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${minRating === star ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-white/20 group-hover:border-white/40'}`}>
                      {minRating === star && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < star ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />
                      ))}
                      <span className="text-[10px] text-gray-500 ml-1 font-bold uppercase tracking-widest">e acima</span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* GRID DE PRODUTOS */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <>
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "flex flex-col gap-6"
                }>
                  {filteredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} viewMode={viewMode} query={query} HighlightText={HighlightText} />
                  ))}
                </div>

                <div className="mt-20 flex flex-col items-center gap-8">
                  <button 
                    onClick={() => {
                      setIsLoadingMore(true);
                      setTimeout(() => setIsLoadingMore(false), 1500);
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all group"
                  >
                    {isLoadingMore ? <Loader2 size={16} className="animate-spin text-[#7c3aed]" /> : "Carregar Mais"}
                    {!isLoadingMore && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-40 h-40 bg-white/[0.02] rounded-full flex items-center justify-center mb-8 relative border border-white/5"
                >
                  <Zap size={64} className="text-gray-800" />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] rounded-full"></div>
                </motion.div>
                
                <h3 className="text-3xl font-syne font-bold uppercase mb-4 tracking-tighter">
                  Nenhum resultado para <span className="text-[#7c3aed]">"{query}"</span>
                </h3>
                <p className="text-gray-500 text-sm font-light mb-12 max-w-sm leading-relaxed">
                  Parece que essa órbita está vazia. Tente simplificar seus termos ou explore nossos universos tecnológicos abaixo:
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mb-20">
                  {categories.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={`/categoria/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-[#7c3aed] transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>

                <div className="w-full border-t border-white/5 pt-20">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-xl font-syne font-bold uppercase tracking-widest">Mais Vendidos da ORBE Connect</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map(p => (
                      <ProductCard key={p.id} product={p} viewMode="grid" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MOBILE FILTERS SHEET */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-[#07080f] rounded-t-3xl border-t border-white/10 p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-syne font-bold text-lg uppercase">Filtros de Busca</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
              </div>
              
              <div className="space-y-10 pb-8">
                <FilterSection title="Faixa de Preço">
                  <input type="range" min="0" max="10000" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#7c3aed]" />
                </FilterSection>
                <button onClick={() => setShowMobileFilters(false)} className="w-full py-5 bg-[#7c3aed] text-white font-black rounded-2xl uppercase tracking-widest text-xs">Aplicar Frequência</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</h4>
      {children}
      <div className="h-[1px] bg-white/5 w-full mt-6"></div>
    </div>
  );
}

function ProductCard({ product, viewMode, query, HighlightText }: { product: any; viewMode: "grid" | "list"; query?: string; HighlightText?: any }) {
  const isList = viewMode === "list";

  return (
    <Link to={`/produto/${product.id}`} className="block">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -6 }}
        className={`group bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#7c3aed]/50 transition-all relative overflow-hidden ${isList ? 'flex gap-8 p-6' : 'p-6'}`}
      >
        <div className={`relative bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 transition-all ${isList ? 'w-48 h-48 shrink-0' : 'aspect-square mb-6'}`}>
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
          {product.badge && <span className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter">{product.badge}</span>}
        </div>

        <div className={`flex flex-col ${isList ? 'flex-1 justify-center' : ''}`}>
          <h4 className={`font-syne font-bold uppercase tracking-tight line-clamp-2 leading-tight ${isList ? 'text-2xl mb-4' : 'text-sm h-12 flex items-center'}`}>
            {query && HighlightText ? <HighlightText text={product.name} term={query} /> : product.name}
          </h4>
          
          <div className={`flex items-center gap-4 ${isList ? 'mb-6' : 'mt-4 justify-between'}`}>
            <p className={`text-white font-bold ${isList ? 'text-2xl' : 'text-lg'}`}>R$ {product.price}</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />)}
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { addItem } = useCartStore.getState();
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
              });
            }}
            className={`w-full mt-6 py-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all uppercase tracking-widest`}
          >
             🛒 {isList ? "Adicionar ao Carrinho" : "Adicionar"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
