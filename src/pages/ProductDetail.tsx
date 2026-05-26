import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Star, Heart, 
  Minus, Plus, Shield, Truck, RefreshCw, Trophy, Zap,
  CheckCircle2, AlertTriangle, ArrowLeft, ShoppingCart
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { products } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState("Descrição");

  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 1, align: 'start' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="min-h-screen flex items-center justify-center text-white">Produto não encontrado</div>;

  return (
    <div className="min-h-screen bg-[#07080f] text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* GALERIA */}
          <div className="lg:w-[45%] space-y-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-white/[0.02] border border-[#7c3aed]/30 rounded-2xl overflow-hidden cursor-zoom-in"
            >
              <motion.img 
                key={selectedImage}
                src={product.images[selectedImage]}
                className="w-full h-full object-contain p-8"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute top-4 left-4 bg-[#f59e0b] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </div>
              <button 
                onClick={() => toggleItem(product.id)}
                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10"
              >
                <motion.div whileTap={{ scale: 0.8 }}>
                  <Heart size={20} className={isWishlisted ? "fill-[#7c3aed] text-[#7c3aed]" : "text-white"} />
                </motion.div>
              </button>
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`border-2 rounded-xl p-2 ${selectedImage === i ? 'border-[#7c3aed]' : 'border-white/10'}`}>
                  <img src={img} className="w-full aspect-square object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="lg:w-[55%]">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 uppercase tracking-widest">
              <Link to="/">Home</Link> <ChevronRight size={12} /> <span>{product.category}</span> <ChevronRight size={12} /> <span className="text-white">{product.name}</span>
            </div>
            <h1 className="text-4xl font-syne font-bold uppercase mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-[#f59e0b]">{[...Array(5)].map((_,i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <span className="text-sm font-bold">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-6 rounded-xl mb-8">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">R$ {product.price}</span>
                <span className="text-lg text-gray-500 line-through">R$ {product.oldPrice}</span>
              </div>
              <p className="text-[#10b981] text-xs">ou 12x de R$ {(product.price/12).toFixed(2)} sem juros</p>
              <p className="text-[#06b6d4] text-xs font-bold mt-2">◎ Frete grátis para todo o Brasil</p>
            </div>

            {/* SELETORES */}
            <div className="space-y-6 mb-8">
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">COR: <span className="text-[#7c3aed]">{product.colors[selectedColor].name}</span></p>
                 <div className="flex gap-3">
                   {product.colors.map((c, i) => (
                     <button key={i} onClick={() => setSelectedColor(i)} className={`w-8 h-8 rounded-full border-2 p-0.5 ${selectedColor === i ? 'border-white' : 'border-transparent'}`}>
                       <div className="w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="flex border border-white/10 rounded-lg">
                    <button className="px-4 py-2 hover:bg-white/5" onClick={() => setQuantity(Math.max(1, quantity-1))}>-</button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button className="px-4 py-2 hover:bg-white/5" onClick={() => setQuantity(Math.min(product.stock, quantity+1))}>+</button>
                  </div>
                  {product.stock > 10 ? <span className="text-[#10b981] text-xs">✅ Em estoque</span> : <motion.span animate={{ opacity: [1, 0.5, 1] }} className="text-[#f59e0b] text-xs">⚠️ Últimas {product.stock} unidades!</motion.span>}
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] }); toggleCart(true); }} className="w-full py-5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-xl font-bold uppercase tracking-widest hover:scale-[0.99] transition-transform">◎ COMPRAR AGORA</button>
              <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] }); toast("Adicionado ao carrinho"); }} className="w-full py-5 border border-[#7c3aed] text-[#7c3aed] rounded-xl font-bold uppercase tracking-widest hover:bg-[#7c3aed] hover:text-white transition-colors">🛒 ADICIONAR AO CARRINHO</button>
            </div>
          </div>
        </div>

        {/* RELATED */}
        <section className="mt-20">
          <p className="text-[#7c3aed] text-[10px] font-bold uppercase tracking-widest">◎ ORBE CONNECT RECOMENDA</p>
          <h3 className="text-3xl font-syne font-bold uppercase mb-10">VOCÊ TAMBÉM PODE GOSTAR</h3>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%]">
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                    <img src={p.images[0]} className="w-full aspect-square object-contain mb-4" />
                    <h4 className="font-syne font-bold uppercase text-sm truncate">{p.name}</h4>
                    <p className="text-[#06b6d4] font-bold">R$ {p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
