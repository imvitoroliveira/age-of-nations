import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Zap, Gamepad2, Smartphone, Headphones, Laptop, Speaker, Watch, Truck, Shield, CreditCard, RefreshCw } from "lucide-react";

import { products } from "@/data/products";

const categories = [
  { name: "Celulares", icon: Smartphone },
  { name: "Acessórios para Celular", icon: Headphones },
  { name: "Computadores & Periféricos", icon: Laptop },
  { name: "Mundo Gamer", icon: Gamepad2 },
  { name: "Áudio & Som", icon: Speaker },
  { name: "Smartwatches", icon: Watch },
];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("Todos");
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

  const addToCart = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCartCount(prev => prev + 1);
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-white font-sans overflow-x-hidden selection:bg-[#06b6d4] selection:text-black">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-syne font-bold bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] bg-clip-text text-transparent uppercase tracking-tight">
          <Zap className="text-[#06b6d4] fill-[#06b6d4]" /> NEXUS TECH
        </div>
        <div className="hidden md:flex gap-8 font-syne text-sm font-semibold uppercase tracking-wider">
          {["Produtos", "Promoções", "Sobre", "Contato"].map(item => <a key={item} href="#" className="hover:text-[#06b6d4] transition-colors">{item}</a>)}
        </div>
        <div className="flex items-center gap-4">
          <Search className="cursor-pointer hover:text-[#06b6d4] w-5 h-5" />
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-all">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#7c3aed] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center px-6 overflow-hidden">
        {/* Background Grid & Particles Effect */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#06b6d4]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#06b6d4] font-syne text-[10px] border border-[#06b6d4] px-4 py-1 rounded-full uppercase tracking-[0.2em] font-bold">Lançamentos 2025</span>
            <h1 className="text-6xl md:text-8xl font-syne font-extrabold mt-6 leading-none tracking-tighter">O FUTURO DA<br/><span className="text-[#06b6d4] neon-ciano">TECNOLOGIA</span><br/>É AQUI.</h1>
            <p className="mt-8 text-gray-400 text-lg max-w-lg font-light leading-relaxed">Sinta a evolução com os dispositivos mais avançados do planeta. Design disruptivo e performance extrema para quem não aceita o comum.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-[#7c3aed] text-white font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] uppercase text-sm tracking-widest">⚡ VER OFERTAS AGORA</button>
              <button className="border border-white/20 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/5 transition-all uppercase text-sm tracking-widest">🎮 MUNDO GAMER</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative hidden md:block">
            <div className="w-full aspect-square bg-gradient-to-br from-[#06b6d4]/5 to-[#7c3aed]/5 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden relative backdrop-blur-3xl">
              <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop" alt="Hero" className="w-3/4 object-contain animate-float" />
              <div className="absolute top-10 right-0 bg-[#07080f]/80 p-4 border border-[#06b6d4]/20 rounded-xl backdrop-blur-md animate-bounce-slow">
                <p className="text-[#06b6d4] text-[10px] font-bold tracking-widest uppercase">🔥 MAIS VENDIDO</p>
                <p className="font-syne font-bold">Galaxy S25 Ultra</p>
                <p className="text-sm text-[#06b6d4] font-bold">R$ 6.299</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STRIP DE BENEFÍCIOS */}
      <section className="bg-white/[0.02] py-10 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, text: "Frete Grátis", sub: "Acima de R$299" },
            { icon: Shield, text: "Garantia Real", sub: "12 a 24 meses" },
            { icon: CreditCard, text: "12x Sem Juros", sub: "Nos cartões" },
            { icon: RefreshCw, text: "Troca Fácil", sub: "30 dias" }
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5"><b.icon className="text-[#7c3aed] w-5 h-5" /></div>
              <div><p className="font-bold font-syne text-sm uppercase tracking-wider">{b.text}</p><p className="text-[10px] text-gray-500 font-medium">{b.sub}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#7c3aed] font-syne text-[10px] font-bold tracking-[0.3em] uppercase">Categorias</span>
          <h2 className="text-4xl font-syne font-extrabold mt-4 uppercase">Explorar Universo</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div onClick={() => setActiveCategory("Todos")} className={`p-8 rounded-2xl border cursor-pointer transition-all hover:border-[#7c3aed] group flex flex-col items-center justify-center text-center ${activeCategory === "Todos" ? 'border-[#7c3aed] bg-[#7c3aed]/10' : 'border-white/5 bg-white/[0.02]'}`}>
            <p className="font-syne font-bold text-xs uppercase tracking-widest group-hover:text-[#7c3aed]">TODOS</p>
          </div>
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={`/categoria/${cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`}
              className={`p-8 rounded-2xl border cursor-pointer transition-all hover:border-[#7c3aed] group flex flex-col items-center justify-center text-center ${activeCategory === cat.name ? 'border-[#7c3aed] bg-[#7c3aed]/10' : 'border-white/5 bg-white/[0.02]'}`}
            >
              <cat.icon size={32} className={`mb-4 transition-colors ${activeCategory === cat.name ? 'text-[#7c3aed]' : 'text-gray-600 group-hover:text-[#06b6d4]'}`} />
              <p className="font-syne font-bold text-[10px] uppercase tracking-widest group-hover:text-[#7c3aed]">{cat.name}</p>
            </Link>
          ))}

        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => activeCategory === "Todos" || p.category === activeCategory).map((prod) => (
            <Link to={`/produto/${prod.id}`} key={prod.id}>
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#7c3aed]/50 transition-all hover:-translate-y-2 shadow-2xl relative">
                <div className="relative aspect-square bg-black/40 rounded-xl mb-6 overflow-hidden flex items-center justify-center p-4">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  {prod.badge && <span className="absolute top-4 left-4 bg-[#7c3aed] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter">{prod.badge}</span>}
                </div>
                <div className="h-12 flex items-center">
                  <h4 className="font-syne font-bold text-sm uppercase tracking-tight line-clamp-2 leading-tight">{prod.name}</h4>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">R$ {prod.price}</p>
                    {prod.oldPrice && <p className="text-gray-500 text-[10px] line-through">R$ {prod.oldPrice}</p>}
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-[10px] ${i < Math.floor(prod.rating) ? 'text-[#f59e0b]' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={(e) => addToCart(e, prod.id)} 
                  className={`w-full mt-6 py-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${addedProduct === prod.id ? 'bg-[#10b981] text-white' : 'bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white shadow-lg shadow-[#7c3aed]/5'}`}
                >
                  {addedProduct === prod.id ? "✓ ADICIONADO!" : "🛒 ADICIONAR"}
                </button>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE BANNER */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative bg-white/[0.01] rounded-3xl border border-[#7c3aed]/20 p-12 overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-[100px]"></div>
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
            <div>
              <span className="bg-[#7c3aed] text-white font-syne font-bold px-4 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase">⚡ FLASH SALE</span>
              <h2 className="text-5xl font-syne font-extrabold mt-6 uppercase leading-tight">ATÉ 40% OFF EM<br/>SETUP GAMER</h2>
              <p className="mt-4 text-gray-400 font-light">Oferta por tempo limitado. Garanta seu setup ultra-potente agora.</p>
              <button className="mt-8 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] uppercase text-sm tracking-widest">APROVEITAR AGORA</button>
            </div>
            <div className="flex gap-4">
              {[
                { label: "Horas", value: timeLeft.h },
                { label: "Minutos", value: timeLeft.m },
                { label: "Segundos", value: timeLeft.s }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-4xl font-syne font-bold text-[#7c3aed]">{t.value.toString().padStart(2, '0')}</div>
                  <span className="mt-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-white/5 mt-20 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-syne font-bold text-[#06b6d4] mb-6 uppercase"><Zap className="fill-[#06b6d4]" /> NEXUS TECH</div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-light">A Nexus Tech é a sua porta de entrada para o futuro. Especializada em eletrônicos de alta gama e estética cyberpunk para quem vive à frente do seu tempo.</p>
          </div>
          <div>
            <h4 className="font-syne font-bold mb-6 uppercase tracking-[0.2em] text-[#7c3aed] text-xs">Produtos</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-white transition-colors">Smartphone</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Computadores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smartwatch</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-syne font-bold mb-6 uppercase tracking-[0.2em] text-[#7c3aed] text-xs">Suporte</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Entregas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-syne font-bold mb-6 uppercase tracking-[0.2em] text-[#7c3aed] text-xs">Empresa</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Novidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-medium">© 2025 NEXUS TECH. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            {["Pix", "Visa", "Master", "Boleto"].map(m => <span key={m} className="font-bold text-[9px] uppercase tracking-tighter">{m}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
