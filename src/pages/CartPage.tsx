import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Trash2, Minus, Plus, X, 
  ArrowLeft, ShoppingBag, Lock, 
  CheckCircle2, Star
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { products } from "@/data/products";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, addItem } = useCartStore();
  const [cep, setCep] = useState("");
  const [isCepCalculated, setIsCepCalculated] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("pac");
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const navigate = useNavigate();

  const [emblaRef] = useEmblaCarousel({ slidesToScroll: 1, align: 'start' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRemoveItem = (item: any) => {
    removeItem(item.id);
    toast.error(`${item.name} removido`, {
      action: {
        label: "Desfazer",
        onClick: () => addItem(item)
      },
    });
  };

  const handleClearCart = () => {
    const backup = [...items];
    clearCart();
    toast.error("Carrinho esvaziado", {
      action: {
        label: "Desfazer",
        onClick: () => backup.forEach(item => addItem(item))
      },
    });
  };

  const shippingCost = shippingMethod === "sedex" ? 18.9 : 0;
  const discount = isCouponApplied ? totalPrice() * 0.1 : 0;
  const total = totalPrice() + shippingCost - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#07080f] text-white selection:bg-[#06b6d4] selection:text-black">
        <Navbar />
        <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-48 h-48 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-8 relative border border-[#7c3aed]/20">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-[#7c3aed]/20 rounded-full blur-xl"
                />
                <ShoppingBag size={64} className="text-[#7c3aed]" />
              </div>
              <h1 className="text-4xl font-syne font-bold uppercase mb-4 tracking-tighter">Seu carrinho está vazio</h1>
              <p className="text-gray-500 mb-10 max-w-sm">Explore nossa loja e encontre os dispositivos tecnológicos que orbitam o seu mundo.</p>
              <Link to="/">
                <button className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-black px-12 py-5 rounded-xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#7c3aed]/20 hover:scale-105 transition-all">
                  ◎ EXPLORAR PRODUTOS
                </button>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* MAIS VENDIDOS */}
          <section className="mt-32 w-full">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-syne font-bold uppercase tracking-widest">Mais Vendidos da ORBE Connect</h3>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {products.slice(0, 6).map((p) => (
                  <Link key={p.id} to={`/produto/${p.id}`} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] group">
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#7c3aed]/40 transition-all">
                      <div className="aspect-square bg-black/40 rounded-xl mb-6 p-4 flex items-center justify-center relative overflow-hidden">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h4 className="font-syne font-bold uppercase text-sm mb-4 truncate">{p.name}</h4>
                      <p className="text-lg font-bold text-[#7c3aed]">R$ {p.price.toLocaleString()}</p>
                    </div>
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

  return (
    <div className="min-h-screen bg-[#07080f] text-white selection:bg-[#06b6d4] selection:text-black">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-4 uppercase tracking-[0.3em] font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white">Carrinho</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-syne font-bold uppercase tracking-tighter">Meu Carrinho</h1>
            <span className="bg-[#7c3aed] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {totalItems()} itens
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LISTA DE PRODUTOS */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <Link to="/">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#7c3aed] transition-colors border border-white/10 hover:border-[#7c3aed]/40 px-4 py-2 rounded-lg">
                  <ArrowLeft size={14} /> Continuar Comprando
                </button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors flex items-center gap-2">
                    <Trash2 size={14} /> Limpar Carrinho
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0d1120] border-white/10 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-syne">Esvaziar carrinho?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      Todos os seus itens tecnológicos serão removidos desta órbita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearCart} className="bg-red-600 text-white hover:bg-red-700">Sim, esvaziar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0 }}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:bg-[#7c3aed]/[0.05] transition-all relative group"
                  >
                    <button 
                      onClick={() => handleRemoveItem(item)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>

                    <div className="w-full sm:w-32 aspect-square bg-black/40 rounded-xl border border-[#7c3aed]/20 p-4 shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#7c3aed]/20 text-[#7c3aed] text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                            TECNOLOGIA
                          </span>
                          <div className="flex text-[#f59e0b] text-[8px] items-center gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                            <span className="text-gray-500 ml-1">4.8</span>
                          </div>
                        </div>
                        <Link to={`/produto/${item.id}`}>
                          <h3 className="text-lg font-syne font-bold uppercase tracking-tight hover:text-[#7c3aed] transition-colors line-clamp-1">{item.name}</h3>
                        </Link>
                        <p className="text-[13px] text-gray-500 mt-1">Cor: Padrão ORBE · 256GB</p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center border border-white/10 rounded-lg bg-white/[0.03]">
                          <button 
                            className="px-3 py-1.5 hover:bg-white/10 transition-colors text-gray-400"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                          </button>
                          <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            className="px-3 py-1.5 hover:bg-white/10 transition-colors text-gray-400"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center sm:min-w-[120px]">
                      <motion.span 
                        key={item.price * item.quantity}
                        initial={{ scale: 1.1, color: "#7c3aed" }}
                        animate={{ scale: 1, color: "#7c3aed" }}
                        className="text-xl font-syne font-bold"
                      >
                        R$ {(item.price * item.quantity).toLocaleString()}
                      </motion.span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                        R$ {item.price.toLocaleString()} un.
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* RESUMO DO PEDIDO */}
          <aside className="w-full lg:w-[380px]">
            <div className="bg-[#7c3aed]/[0.06] border border-[#7c3aed]/20 rounded-2xl p-8 sticky top-32">
              <h2 className="text-xs font-syne font-bold uppercase tracking-[0.3em] text-[#7c3aed] mb-8">Resumo do Pedido</h2>
              
              <div className="space-y-4 text-sm font-medium uppercase tracking-widest text-gray-400 mb-8">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({totalItems()} itens)</span>
                  <span className="text-white">R$ {totalPrice().toLocaleString()}</span>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span>Frete</span>
                    <button 
                      onClick={() => setIsCepCalculated(!isCepCalculated)}
                      className="text-[#06b6d4] hover:underline"
                    >
                      {isCepCalculated ? "Alterar CEP" : "Calcular CEP"}
                    </button>
                  </div>
                  
                  {isCepCalculated && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="00000-000" 
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          className="bg-white/5 border-white/10 text-xs h-10"
                        />
                        <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] h-10 text-[10px] uppercase font-bold px-6">OK</Button>
                      </div>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setShippingMethod("pac")}
                          className={`w-full flex justify-between items-center p-3 rounded-lg border text-[10px] transition-all ${shippingMethod === "pac" ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-white' : 'border-white/5 hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className={shippingMethod === "pac" ? "text-[#7c3aed]" : "text-gray-700"} />
                            <span>PAC (6-10 dias)</span>
                          </div>
                          <span className="text-[#10b981]">GRÁTIS</span>
                        </button>
                        <button 
                          onClick={() => setShippingMethod("sedex")}
                          className={`w-full flex justify-between items-center p-3 rounded-lg border text-[10px] transition-all ${shippingMethod === "sedex" ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-white' : 'border-white/5 hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className={shippingMethod === "sedex" ? "text-[#7c3aed]" : "text-gray-700"} />
                            <span>SEDEX (2-4 dias)</span>
                          </div>
                          <span>R$ 18,90</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span>Cupom</span>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Código" 
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="bg-white/5 border-white/10 text-xs h-10"
                    />
                    <Button 
                      onClick={() => {
                        if (coupon.toUpperCase() === "ORBE10") {
                          setIsCouponApplied(true);
                          toast.success("Cupom ORBE10 aplicado!");
                        } else {
                          toast.error("Cupom inválido");
                        }
                      }}
                      className="bg-white/10 hover:bg-white/20 h-10 text-[10px] uppercase font-bold px-6"
                    >
                      Aplicar
                    </Button>
                  </div>
                  {isCouponApplied && (
                    <p className="text-[#10b981] text-[10px] mt-2 flex items-center gap-1">✓ Desconto de 10% aplicado!</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#7c3aed]/30">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-syne font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-right text-[#10b981] text-[10px] font-bold uppercase mb-8">
                  ou 12x de R$ {(total/12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                </p>

                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/checkout')}
                  className="w-full py-5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-black rounded-xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#7c3aed]/20 relative overflow-hidden group mb-6"
                >
                  <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 bg-white/5 -skew-x-12" />
                  ◎ Finalizar Compra
                </motion.button>

                <div className="flex justify-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all mb-6">
                   <div className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">PIX</div>
                   <div className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">VISA</div>
                   <div className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">MASTER</div>
                </div>

                <p className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  <Lock size={12} /> Compra 100% segura
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
