import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, LayoutGrid, List, SlidersHorizontal, 
  X, Star, Zap, Smartphone, Headphones, 
  Laptop, Gamepad2, Speaker, Watch, ChevronDown, Heart, ShoppingCart
} from "lucide-react";

import { products, Product } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevancia");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [condition, setCondition] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [slug, priceRange, sortBy, selectedBrands, minRating, condition, currentPage]);

  const brands = useMemo(() => {
    const categoryProducts = slug ? products.filter(p => p.category === categoryName) : products;
    const brandCounts: Record<string, number> = {};
    categoryProducts.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    return Object.entries(brandCounts).map(([name, count]) => ({ name, count }));
  }, [slug, categoryName]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCategory = slug ? p.category === categoryName : true;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      const matchBrand = selectedBrands.length > 0 ? selectedBrands.includes(p.brand) : true;
      const matchCondition = condition ? p.condition === condition : true;
      return matchCategory && matchPrice && matchRating && matchBrand && matchCondition;
    });

    if (sortBy === "preco-menor") result.sort((a, b) => a.price - b.price);
    if (sortBy === "preco-maior") result.sort((a, b) => b.price - a.price);
    if (sortBy === "avaliados") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [slug, categoryName, priceRange, minRating, selectedBrands, sortBy, condition]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSelectedBrands([]);
    setCondition(null);
    setSortBy("relevancia");
    setCurrentPage(1);
  };

  const removeBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-white font-sans selection:bg-[#06b6d4] selection:text-black">
      <Navbar />

      <main className="pt-20">
        {/* HEADER DA CATEGORIA */}
        <section className="relative h-[200px] flex items-center px-6 overflow-hidden border-b border-white/5">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7c3aed] rounded-full blur-[100px] -z-10"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.3em] font-medium">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span className="text-white">{categoryName}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/[0.05] border border-[#7c3aed]/30 rounded-2xl">
                  <Icon size={32} className="text-[#7c3aed]" />
                </div>
                <div>
                  <h1 className="text-4xl font-syne font-bold uppercase tracking-tighter">
                    {categoryName}
                  </h1>
                  <span className="bg-[#7c3aed]/20 text-[#7c3aed] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter mt-1 inline-block">
                    {filteredProducts.length} produtos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* BARRA DE CONTROLES */}
        <section className="sticky top-[68px] z-40 bg-[#07080f]/95 backdrop-blur-xl border-b border-white/5 py-3 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Mostrando {(currentPage-1)*itemsPerPage + 1}–{Math.min(currentPage*itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
              </p>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedBrands.map(brand => (
                    <motion.span 
                      key={brand}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded text-[9px] font-bold uppercase text-[#7c3aed]"
                    >
                      {brand}
                      <button onClick={() => removeBrand(brand)} className="hover:text-white"><X size={10} /></button>
                    </motion.span>
                  ))}
                  {condition && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded text-[9px] font-bold uppercase text-[#06b6d4]"
                    >
                      {condition}
                      <button onClick={() => setCondition(null)} className="hover:text-white"><X size={10} /></button>
                    </motion.span>
                  )}
                  {priceRange[1] < 10000 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[9px] font-bold uppercase text-amber-500"
                    >
                      Até R$ {priceRange[1]}
                      <button onClick={() => setPriceRange([0, 10000])} className="hover:text-white"><X size={10} /></button>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-lg p-0.5">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-[#07080f] border-[#7c3aed]/30 text-[10px] font-bold uppercase tracking-widest h-9">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-[#07080f] border-[#7c3aed]/30 text-white">
                  <SelectItem value="relevancia">Mais Relevantes</SelectItem>
                  <SelectItem value="preco-menor">Menor Preço</SelectItem>
                  <SelectItem value="preco-maior">Maior Preço</SelectItem>
                  <SelectItem value="avaliados">Mais Avaliados</SelectItem>
                </SelectContent>
              </Select>

              <Drawer>
                <DrawerTrigger asChild>
                  <button className="lg:hidden flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    <SlidersHorizontal size={14} /> Filtros
                  </button>
                </DrawerTrigger>
                <DrawerContent className="bg-[#07080f] border-white/10 text-white">
                  <DrawerHeader>
                    <DrawerTitle className="font-syne font-bold uppercase text-center">Filtros Avançados</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <SidebarFilters 
                      priceRange={priceRange} 
                      setPriceRange={setPriceRange} 
                      brands={brands} 
                      selectedBrands={selectedBrands} 
                      setSelectedBrands={setSelectedBrands}
                      minRating={minRating}
                      setMinRating={setMinRating}
                      condition={condition}
                      setCondition={setCondition}
                      clearFilters={clearFilters}
                    />
                    <DrawerClose asChild>
                      <button className="w-full mt-6 py-4 bg-[#7c3aed] text-white font-black rounded-xl uppercase tracking-widest text-xs">Ver Resultados</button>
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SIDEBAR FILTROS (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <SidebarFilters 
              priceRange={priceRange} 
              setPriceRange={setPriceRange} 
              brands={brands} 
              selectedBrands={selectedBrands} 
              setSelectedBrands={setSelectedBrands}
              minRating={minRating}
              setMinRating={setMinRating}
              condition={condition}
              setCondition={setCondition}
              clearFilters={clearFilters}
            />
          </aside>

          {/* GRID DE PRODUTOS */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl h-[400px]">
                    <Skeleton className="w-full aspect-square rounded-xl bg-white/5 mb-6" />
                    <Skeleton className="h-4 w-3/4 bg-white/5 mb-4" />
                    <Skeleton className="h-8 w-1/2 bg-white/5" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div 
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
                    : "flex flex-col gap-6"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} viewMode={viewMode} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* PAGINAÇÃO */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-3">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === 1 ? 'text-gray-700' : 'bg-white/[0.02] border border-white/10 hover:border-[#7c3aed] text-gray-400'}`}
                    >
                      ←
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button 
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg text-xs font-bold uppercase transition-all ${currentPage === i + 1 ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20' : 'bg-white/[0.02] border border-white/10 hover:border-[#7c3aed] text-gray-500'}`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-gray-700' : 'bg-white/[0.02] border border-white/10 hover:border-[#7c3aed] text-gray-400'}`}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-48 h-48 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-8 relative border border-[#7c3aed]/20"
                >
                  <Zap size={64} className="text-gray-800" />
                  <div className="absolute inset-0 bg-[#07080f]/40 backdrop-blur-[2px] rounded-full"></div>
                </motion.div>
                <h3 className="text-2xl font-syne font-bold uppercase mb-4 tracking-tight">Nenhum produto encontrado nessa órbita.</h3>
                <p className="text-gray-500 text-sm font-light mb-8 max-w-xs">Tente ajustar seus filtros ou explore outras categorias para encontrar novos horizontes tecnológicos.</p>
                <button 
                  onClick={clearFilters}
                  className="px-10 py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#7c3aed]/20"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SidebarFilters({ 
  priceRange, setPriceRange, brands, selectedBrands, setSelectedBrands, minRating, setMinRating, condition, setCondition, clearFilters 
}: any) {
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev: string[]) => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h3 className="font-syne font-bold text-xs uppercase tracking-[0.2em]">Filtros</h3>
        <button onClick={clearFilters} className="text-[10px] text-[#7c3aed] font-bold uppercase tracking-widest hover:underline">Limpar tudo</button>
      </div>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Faixa de Preço</h4>
          <ChevronDown size={14} className="text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 space-y-6">
          <Slider 
            defaultValue={[0, 10000]} 
            max={10000} 
            step={100} 
            value={[priceRange[1]]}
            onValueChange={(val) => setPriceRange([0, val[0]])}
            className="accent-[#7c3aed]"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] text-gray-500 font-bold uppercase">Mín</label>
              <input 
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-2 text-xs font-bold text-gray-300 outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] text-gray-500 font-bold uppercase">Máx</label>
              <input 
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-2 text-xs font-bold text-gray-300 outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-white/5" />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Marcas</h4>
          <ChevronDown size={14} className="text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6">
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {brands.map((brand: any) => (
              <label key={brand.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={() => toggleBrand(brand.name)}
                    className="border-white/20 data-[state=checked]:bg-[#7c3aed] data-[state=checked]:border-[#7c3aed]" 
                  />
                  <span className={`text-[11px] uppercase tracking-wide transition-colors ${selectedBrands.includes(brand.name) ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {brand.name}
                  </span>
                </div>
                <span className="text-[9px] text-gray-600 font-mono">({brand.count})</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-white/5" />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Avaliação</h4>
          <ChevronDown size={14} className="text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 space-y-3">
          {[5, 4, 3, 2].map(star => (
            <label key={star} className="flex items-center gap-3 group cursor-pointer">
              <div 
                onClick={() => setMinRating(star)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${minRating === star ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-white/10 group-hover:border-white/30'}`}
              >
                {minRating === star && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={i < star ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />
                ))}
                {star < 5 && <span className="text-[9px] text-gray-600 ml-1 font-bold uppercase">+</span>}
              </div>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-white/5" />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Condição</h4>
          <ChevronDown size={14} className="text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 flex gap-2">
          {["novo", "seminovo"].map(c => (
            <button 
              key={c}
              onClick={() => setCondition(condition === c ? null : c)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border ${condition === c ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20' : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'}`}
            >
              {c}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  const isList = viewMode === "list";
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
    toast.success("Adicionado ao seu orbe!", { style: { background: '#07080f', color: '#fff', border: '1px solid #7c3aed' } });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#7c3aed]/50 transition-all shadow-2xl relative overflow-hidden ${isList ? 'flex gap-8 p-6' : 'p-6'}`}
    >
      <Link to={`/produto/${product.id}`} className={isList ? 'flex gap-8 w-full' : 'block w-full'}>
        <div className={`relative bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 transition-all ${isList ? 'w-48 h-48 shrink-0' : 'aspect-square mb-6'}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter shadow-lg">
              {product.badge}
            </span>
          )}
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 hover:border-[#7c3aed]/50 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart size={14} className={isWishlisted ? "fill-[#7c3aed] text-[#7c3aed]" : "text-white"} />
          </button>
        </div>

        <div className={`flex flex-col ${isList ? 'flex-1 justify-center' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8} className={i < Math.floor(product.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-800'} />
              ))}
            </div>
          </div>
          <h4 className={`font-syne font-bold uppercase tracking-tight line-clamp-2 leading-tight ${isList ? 'text-3xl mb-4' : 'text-sm h-12 flex items-center'}`}>
            {product.name}
          </h4>
          
          <div className={`flex items-center gap-4 ${isList ? 'mb-8' : 'mt-4 justify-between'}`}>
            <div>
              <p className={`text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] ${isList ? 'text-3xl' : 'text-lg'}`}>R$ {product.price.toLocaleString()}</p>
              {product.oldPrice && <p className="text-gray-500 text-[10px] line-through">R$ {product.oldPrice.toLocaleString()}</p>}
            </div>
            {isList && (
               <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-[#06b6d4]">
                 <span>◎ FRETE GRÁTIS</span>
                 <span className="text-[#10b981]">✅ EM ESTOQUE</span>
               </div>
            )}
          </div>

          {!isList ? (
            <button 
              onClick={handleAddToCart}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#7c3aed]/10 to-[#7c3aed]/5 border border-[#7c3aed]/30 text-[#7c3aed] font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-[#7c3aed] hover:text-white transition-all shadow-lg shadow-[#7c3aed]/5 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> Adicionar
            </button>
          ) : (
            <div className="flex gap-4">
               <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#7c3aed]/20 flex items-center justify-center gap-3"
               >
                <ShoppingCart size={16} /> Adicionar ao Carrinho
              </button>
               <button className="px-6 bg-white/[0.02] border border-white/5 hover:border-[#7c3aed] rounded-xl transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
