import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Star, Heart, 
  Minus, Plus, Shield, Truck, RefreshCw, Trophy, ShoppingCart
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { products } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const { addItem, toggleCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [emblaRef] = useEmblaCarousel({ slidesToScroll: 1, align: 'start' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#07080f]">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-[#7c3aed] hover:underline">Voltar para a Home</Link>
      </div>
    </div>
  );

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#07080f] text-white selection:bg-[#06b6d4] selection:text-black">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* GALERIA */}
          <div className="lg:w-[45%] space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square bg-white/[0.02] border border-[#7c3aed]/20 rounded-2xl overflow-hidden cursor-zoom-in"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-contain p-8"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#f59e0b] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest z-10">
                  -{discount}% OFF
                </div>
              )}
              <button 
                onClick={() => toggleItem(product.id)}
                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-10"
              >
                <motion.div whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Heart size={20} className={isWishlisted ? "fill-[#7c3aed] text-[#7c3aed]" : "text-white"} />
                </motion.div>
              </button>
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(i)} 
                  className={`border-2 rounded-xl p-2 bg-white/[0.01] transition-all ${selectedImage === i ? 'border-[#7c3aed]' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} thumb ${i}`} className="w-full aspect-square object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="lg:w-[55%]">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em] font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link> <ChevronRight size={10} /> 
              <span className="hover:text-white transition-colors">{product.category}</span> <ChevronRight size={10} /> 
              <span className="text-white">{product.name}</span>
            </div>
            
            <div className="mb-4">
              <span className="bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                📱 {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-syne font-bold uppercase mb-4 tracking-tighter leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-[#f59e0b]">
                {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-700"} />)}
              </div>
              <span className="text-sm font-bold">{product.rating}</span>
              <a href="#avaliacoes" className="text-xs text-gray-500 underline underline-offset-4 hover:text-[#7c3aed] transition-colors">{product.reviews} AVALIAÇÕES</a>
            </div>

            <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-8 rounded-xl mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 blur-[60px] rounded-full" />
              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">R$ {product.price.toLocaleString('pt-BR')}</span>
                {product.oldPrice && <span className="text-lg text-gray-500 line-through">R$ {product.oldPrice.toLocaleString('pt-BR')}</span>}
                {discount > 0 && <span className="bg-[#f59e0b] text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">{discount}% OFF</span>}
              </div>
              <p className="text-[#10b981] text-xs font-bold mb-2">ou 12x de R$ {(product.price/12).toFixed(2).replace('.', ',')} sem juros</p>
              <p className="text-[#06b6d4] text-[10px] font-bold uppercase tracking-widest">◎ Frete grátis para todo o Brasil</p>
            </div>

            {/* SELETORES */}
            <div className="space-y-10 mb-10">
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">COR: <span className="text-[#7c3aed]">{product.colors[selectedColor].name}</span></p>
                 <div className="flex gap-4">
                   {product.colors.map((c, i) => (
                     <button 
                       key={i} 
                       onClick={() => setSelectedColor(i)} 
                       className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${selectedColor === i ? 'border-white ring-2 ring-[#7c3aed]' : 'border-white/10 hover:border-white/30'}`}
                     >
                       <div className="w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">ARMAZENAMENTO:</p>
                 <div className="flex flex-wrap gap-3">
                   {product.models.map((m, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedModel(i)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedModel === i ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20' : 'bg-white/5 border border-white/10 hover:border-[#7c3aed]/40'}`}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="flex items-center gap-10">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">QTD</p>
                    <div className="flex items-center border border-white/10 rounded-lg bg-white/[0.02]">
                      <button className="px-5 py-2.5 hover:bg-white/5 transition-colors" onClick={() => setQuantity(Math.max(1, quantity-1))}><Minus size={14}/></button>
                      <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                      <button className="px-5 py-2.5 hover:bg-white/5 transition-colors" onClick={() => setQuantity(Math.min(product.stock, quantity+1))}><Plus size={14}/></button>
                    </div>
                  </div>
                  <div className="pt-6">
                    {product.stock > 10 ? (
                      <span className="text-[#10b981] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">✅ Em estoque</span>
                    ) : product.stock > 0 ? (
                      <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">⚠️ Últimas {product.stock} unidades!</motion.span>
                    ) : (
                      <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">❌ Esgotado</span>
                    )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] }); toggleCart(true); }} 
                className="w-full py-5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#7c3aed]/20 relative overflow-hidden group"
              >
                <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 bg-white/5 -skew-x-12" />
                ◎ COMPRAR AGORA
              </motion.button>
              <button 
                onClick={() => { 
                  addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] }); 
                  toast.success("Produto adicionado ao seu orbe!", { style: { background: '#07080f', color: '#fff', border: '1px solid #7c3aed' } }); 
                }} 
                className="w-full py-5 border border-[#7c3aed] text-[#7c3aed] rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#7c3aed] hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart size={18} /> ADICIONAR AO CARRINHO
              </button>
            </div>

            {/* GARANTIAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 p-6 bg-white/[0.03] border border-white/5 rounded-xl">
               {[
                 { icon: Shield, text: "Compra Segura" },
                 { icon: Truck, text: "Frete Grátis" },
                 { icon: RefreshCw, text: "Troca 30 dias" },
                 { icon: Trophy, text: "Garantia 1 ano" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center text-center gap-2">
                   <item.icon size={18} className="text-[#06b6d4]" />
                   <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">{item.text}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* ABAS */}
        <div className="mt-32">
          <Tabs defaultValue="descricao" className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 w-full justify-start gap-12 p-0 h-auto rounded-none mb-12">
              {["Descrição", "Especificações", "Avaliações"].map((tab) => (
                <TabsTrigger 
                  key={tab.toLowerCase()} 
                  value={tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                  className="bg-transparent text-gray-500 data-[state=active]:text-white data-[state=active]:bg-transparent pb-4 p-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#7c3aed] text-[10px] font-bold uppercase tracking-[0.3em] relative"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="descricao" className="text-gray-400 text-sm leading-relaxed font-light space-y-6">
              <p>{product.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                 {["Tecnologia de última geração", "Design premium e ergonômico", "Eficiência energética avançada", "Performance extrema"].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#7c3aed]">
                     <span className="text-violet-500">✦</span> {item}
                   </li>
                 ))}
              </ul>
            </TabsContent>
            <TabsContent value="especificacoes">
              <div className="border border-white/5 rounded-xl overflow-hidden">
                {product.specifications.map((spec, i) => (
                  <div key={i} className={`grid grid-cols-2 p-6 text-[10px] font-bold uppercase tracking-widest ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-[#7c3aed]/5'}`}>
                    <span className="text-gray-500">{spec.key}</span>
                    <span className="text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="avaliacoes" id="avaliacoes">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4 flex flex-col items-center justify-center p-10 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-6xl font-syne font-black mb-4">{product.rating}</span>
                  <div className="flex text-[#f59e0b] mb-4">
                    {[...Array(5)].map((_,i) => <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Baseado em {product.reviews} reviews</p>
                </div>
                <div className="md:col-span-8 space-y-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
                      <span className="w-4">{stars} ★</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: stars === 5 ? '85%' : stars === 4 ? '12%' : '3%' }}
                          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"
                        />
                      </div>
                      <span className="w-8 text-right text-gray-500">{stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RELACIONADOS */}
        <section className="mt-32">
          <div className="mb-12">
            <p className="text-[#7c3aed] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">◎ ORBE CONNECT RECOMENDA</p>
            <h3 className="text-4xl font-syne font-bold uppercase tracking-tighter">VOCÊ TAMBÉM PODE GOSTAR</h3>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.filter(p => p.id !== product.id).slice(0, 6).map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] group">
                  <motion.div whileHover={{ y: -10 }} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#7c3aed]/40 transition-all h-full">
                    <div className="aspect-square bg-black/40 rounded-xl mb-6 p-4 flex items-center justify-center relative overflow-hidden">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      {p.badge && <span className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase">{p.badge}</span>}
                    </div>
                    <h4 className="font-syne font-bold uppercase text-sm mb-4 truncate leading-tight">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">R$ {p.price}</p>
                      <div className="flex text-[#f59e0b] text-[10px]"><Star size={10} fill="currentColor" /> {p.rating}</div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
