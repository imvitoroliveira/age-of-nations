import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ChevronRight, LayoutGrid, List, SlidersHorizontal, 
  X, Star, ShoppingCart, ArrowRight, Loader2,
  Smartphone, Headphones, Laptop, Gamepad2, Speaker, Watch
} from "lucide-react";
import { products } from "@/data/products";

const categoryIcons: Record<string, any> = {
  "celulares": Smartphone,
  "acessorios-para-celular": Headphones,
  "computadores-perifericos": Laptop,
  "mundo-gamer": Gamepad2,
  "audio-som": Speaker,
  "smartwatches": Watch,
};

const categoryNames: Record<string, string> = {
  "celulares": "Celulares",
  "acessorios-para-celular": "Acessórios para Celular",
  "computadores-perifericos": "Computadores & Periféricos",
  "mundo-gamer": "Mundo Gamer",
  "audio-som": "Áudio & Som",
  "smartwatches": "Smartwatches",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const categoryName = slug ? categoryNames[slug] || "Produtos" : "Produtos";
  const Icon = slug ? categoryIcons[slug] || Zap : Zap;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevancia");
  const [/* selectedBrands */, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [condition, setCondition] = useState("novo");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCategory = slug ? p.category === categoryName : true;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchCategory && matchPrice && matchRating;
    });

    if (sortBy === "preco-menor") result.sort((a, b) => a.price - b.price);
    if (sortBy === "preco-maior") result.sort((a, b) => b.price - a.price);
    if (sortBy === "avaliados") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [slug, categoryName, priceRange, minRating, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSortBy("relevancia");
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-white font-sans selection:bg-[#06b6d4] selection:text-black">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-syne font-bold bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] bg-clip-text text-transparent uppercase tracking-tight">
          <Zap className="text-[#06b6d4] fill-[#06b6d4]" /> NEXUS TECH
        </Link>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-all">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {/* HEADER DA CATEGORIA */}
        <section className="relative py-20 px-6 overflow-hidden border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/5 rounded-full blur-[120px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-8 uppercase tracking-[0.3em] font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white">{categoryName}</span>
            </div>
            
            <div className="p-5 bg-white/[0.02] border border-[#7c3aed]/20 rounded-full mb-6 relative">
              <Icon size={40} className="text-[#7c3aed]" />
              <div className="absolute inset-0 bg-[#7c3aed]/20 blur-xl rounded-full -z-10"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-syne font-extrabold uppercase tracking-tighter mb-4">
              {categoryName}
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
              {filteredProducts.length} produtos encontrados nesta órbita
            </p>
          </div>
        </section>

        {/* BARRA DE CONTROLES */}
        <section className="sticky top-[68px] z-40 bg-[#07080f]/95 backdrop-blur-xl border-b border-white/5 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Mostrando 1–{filteredProducts.length} de {filteredProducts.length} produtos
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
          {/* SIDEBAR FILTROS */}
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

            <FilterSection title="Condição">
              <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/5">
                {["novo", "seminovo"].map(c => (
                  <button 
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${condition === c ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    {c}
                  </button>
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
                    <ProductCard key={prod.id} product={prod} viewMode={viewMode} />
                  ))}
                </div>

                <div className="mt-20 flex flex-col items-center gap-8">
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-lg bg-[#7c3aed] text-white font-bold flex items-center justify-center">1</button>
                    <button className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#7c3aed]/30 transition-all font-bold flex items-center justify-center text-gray-400">2</button>
                    <button className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#7c3aed]/30 transition-all font-bold flex items-center justify-center text-gray-400">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  
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
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-32 h-32 bg-white/[0.02] rounded-full flex items-center justify-center mb-8 relative border border-white/5">
                  <Zap size={48} className="text-gray-800" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-full"></div>
                </div>
                <h3 className="text-2xl font-syne font-bold uppercase mb-4 tracking-tight">Nenhum produto encontrado nessa órbita.</h3>
                <p className="text-gray-500 text-sm font-light mb-8 max-w-xs">Tente ajustar seus filtros para encontrar novos horizontes tecnológicos.</p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-4 bg-[#7c3aed] text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#7c3aed]/20"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MOBILE FILTERS BOTTOM SHEET */}
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-[#07080f] rounded-t-3xl border-t border-white/10 p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-syne font-bold text-lg uppercase">Filtros Avançados</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-10 pb-8">
                <FilterSection title="Faixa de Preço">
                   <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#7c3aed]" 
                  />
                  <div className="flex justify-between mt-4 text-sm font-bold">
                    <span className="text-gray-500">R$ 0</span>
                    <span className="text-[#7c3aed]">R$ {priceRange[1].toLocaleString()}</span>
                  </div>
                </FilterSection>

                <FilterSection title="Avaliação">
                  <div className="grid grid-cols-2 gap-4">
                    {[4, 3, 2].map(star => (
                      <button 
                        key={star}
                        onClick={() => setMinRating(star)}
                        className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${minRating === star ? 'border-[#7c3aed] bg-[#7c3aed]/10' : 'border-white/10'}`}
                      >
                        <span className="text-xs font-bold">{star}★+</span>
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-5 bg-[#7c3aed] text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-[#7c3aed]/20"
                >
                  Ver Resultados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

function ProductCard({ product, viewMode }: { product: any; viewMode: "grid" | "list" }) {
  const isList = viewMode === "list";

  return (
    <Link to={`/produto/${product.id}`} className="block">
      <motion.div 
        layout
        className={`group bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#7c3aed]/50 transition-all hover:-translate-y-1 shadow-2xl relative overflow-hidden ${isList ? 'flex gap-8 p-6' : 'p-6'}`}
      >
        <div className={`relative bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 transition-all ${isList ? 'w-48 h-48 shrink-0' : 'aspect-square mb-6'}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter">
              {product.badge}
            </span>
          )}
        </div>

        <div className={`flex flex-col ${isList ? 'flex-1 justify-center' : ''}`}>
          <h4 className={`font-syne font-bold uppercase tracking-tight line-clamp-2 leading-tight ${isList ? 'text-2xl mb-4' : 'text-sm h-12 flex items-center'}`}>
            {product.name}
          </h4>
          
          <div className={`flex items-center gap-4 ${isList ? 'mb-6' : 'mt-4 justify-between'}`}>
            <div>
              <p className={`text-white font-bold ${isList ? 'text-2xl' : 'text-lg'}`}>R$ {product.price}</p>
              {product.oldPrice && <p className="text-gray-500 text-[10px] line-through">R$ {product.oldPrice}</p>}
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />
              ))}
            </div>
          </div>

          {!isList ? (
            <button className="w-full mt-6 py-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-[#7c3aed]/10">
              🛒 Adicionar
            </button>
          ) : (
            <div className="flex gap-4">
               <button className="flex-1 bg-[#7c3aed] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
                🛒 Adicionar ao Carrinho
              </button>
               <button className="px-6 border border-white/10 hover:border-[#7c3aed] rounded-xl transition-all">
                <Star size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
