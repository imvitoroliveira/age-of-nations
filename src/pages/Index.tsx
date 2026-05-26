import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Zap, Truck, Shield, CreditCard, RefreshCw } from "lucide-react";

const products = [
  { id: 1, name: "Galaxy S25 Ultra", category: "Celulares", price: 6299, badge: "TOP" },
  { id: 2, name: "Headset Pro", category: "Áudio & Som", price: 499, badge: "OFERTA" },
  { id: 3, name: "Laptop Gamer X", category: "Mundo Gamer", price: 8599, badge: "NOVO" },
  { id: 4, name: "Smartwatch Elite", category: "Smartwatches", price: 1299, badge: "" },
  { id: 5, name: "Fone Bluetooth", category: "Acessórios para Celular", price: 199, badge: "OFERTA" },
  { id: 6, name: "Teclado Mecânico", category: "Computadores & Periféricos", price: 350, badge: "" },
  { id: 7, name: "Mouse Gamer", category: "Mundo Gamer", price: 250, badge: "TOP" },
  { id: 8, name: "Soundbar 2.1", category: "Áudio & Som", price: 899, badge: "" },
];

export default function Index() {
  const [cartCount, setCartCount] = useState(0);
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 30, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (id: number) => {
    setCartCount(prev => prev + 1);
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white font-sans overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-rajdhani font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
          <Zap className="text-[#00f0ff]" /> NEXUS TECH
        </div>
        <div className="hidden md:flex gap-8 font-rajdhani text-lg">
          {["Produtos", "Promoções", "Sobre", "Contato"].map(item => <a key={item} href="#" className="hover:text-[#00f0ff] transition-colors">{item}</a>)}
        </div>
        <div className="flex items-center gap-4">
          <Search className="cursor-pointer hover:text-[#00f0ff]" />
          <button className="relative p-2 hover:bg-white/10 rounded-full"><ShoppingCart /> {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#ff2d78] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}</button>
        </div>
      </nav>

      <section className="relative h-screen flex items-center pt-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-8xl font-rajdhani font-bold leading-none">O FUTURO DA<br/>TECNOLOGIA<br/>É AQUI.</h1>
            <div className="mt-8 flex gap-4">
              <button className="bg-[#00f0ff] text-black font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:opacity-90">⚡ VER OFERTAS AGORA</button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-12 max-w-7xl mx-auto border-y border-white/5">
        {[
          { icon: Truck, text: "Frete Grátis" },
          { icon: Shield, text: "Garantia Real" },
          { icon: CreditCard, text: "12x Sem Juros" },
          { icon: RefreshCw, text: "Troca Fácil" }
        ].map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <b.icon className="text-[#00f0ff]" />
            <span className="font-rajdhani font-bold">{b.text}</span>
          </div>
        ))}
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-[#0f141e] p-12 rounded-2xl border border-[#ff2d78]/30 relative overflow-hidden">
          <div>
            <div className="text-[#ff2d78] font-rajdhani font-bold text-2xl flex items-center gap-2"><Zap /> FLASH SALE</div>
            <h2 className="text-4xl font-rajdhani font-bold mt-2">ATÉ 40% OFF EM GAMER</h2>
          </div>
          <div className="flex gap-4 font-rajdhani text-4xl font-bold">
            <div className="bg-black p-4 rounded-lg border border-white/10">{timeLeft.h.toString().padStart(2, '0')}h</div>
            <div className="bg-black p-4 rounded-lg border border-white/10">{timeLeft.m.toString().padStart(2, '0')}m</div>
            <div className="bg-black p-4 rounded-lg border border-white/10">{timeLeft.s.toString().padStart(2, '0')}s</div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((prod) => (
            <div key={prod.id} className="bg-[#0f141e] border border-white/5 p-6 rounded-xl hover:border-[#00f0ff] transition-all">
              <div className="h-48 bg-white/5 rounded-lg mb-4 flex items-center justify-center">[Img]</div>
              <h4 className="font-rajdhani font-bold text-xl">{prod.name}</h4>
              <p className="text-[#00f0ff] font-bold mt-2 text-xl">R$ {prod.price}</p>
              <button onClick={() => addToCart(prod.id)} className="w-full mt-4 py-3 rounded-lg border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-bold transition-all">
                {addedProduct === prod.id ? "✓ ADICIONADO!" : "🛒 ADICIONAR AO CARRINHO"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-20 border-t border-white/10 mt-20 text-center">
        <p className="text-gray-500">© 2025 NEXUS TECH.</p>
      </footer>
    </div>
  );
}
