import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Zap, Gamepad2, Smartphone, Headphones, Laptop, Speaker, Watch, Truck, Shield, CreditCard, RefreshCw, Mail, Instagram, Twitter, Facebook } from "lucide-react";

const products = [
  { id: 1, name: "Galaxy S25 Ultra", category: "Celulares", price: 6299, oldPrice: 6999, badge: "TOP" },
  { id: 2, name: "Headset RGB Pro", category: "Áudio & Som", price: 499, oldPrice: 599, badge: "OFERTA" },
  { id: 3, name: "Laptop Nexus X", category: "Mundo Gamer", price: 8599, badge: "NOVO" },
  { id: 4, name: "Nexus Watch v2", category: "Smartwatches", price: 1299, badge: "" },
  { id: 5, name: "Air Buds Lite", category: "Acessórios para Celular", price: 199, badge: "OFERTA" },
  { id: 6, name: "Cyber Keyboard", category: "Computadores & Periféricos", price: 350, badge: "" },
  { id: 7, name: "Gamer Mouse v3", category: "Mundo Gamer", price: 250, badge: "TOP" },
  { id: 8, name: "Audio System 2.1", category: "Áudio & Som", price: 899, badge: "" },
];

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

  const addToCart = (id: number) => {
    setCartCount(prev => prev + 1);
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white font-sans overflow-x-hidden selection:bg-[#00f0ff] selection:text-black">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-rajdhani font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
          <Zap className="text-[#00f0ff]" /> NEXUS TECH
        </div>
        <div className="hidden md:flex gap-8 font-rajdhani text-lg">
          {["Produtos", "Promoções", "Sobre", "Contato"].map(item => <a key={item} href="#" className="hover:text-[#00f0ff] transition-colors">{item}</a>)}
        </div>
        <div className="flex items-center gap-4">
          <Search className="cursor-pointer hover:text-[#00f0ff]" />
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-all">
            <ShoppingCart />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#ff2d78] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center px-6 overflow-hidden">
        {/* Background Grid & Particles Effect */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00f0ff]/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#a855f7]/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#00f0ff] font-rajdhani text-sm border border-[#00f0ff] px-4 py-1 rounded-full uppercase tracking-widest">Lançamentos 2025 disponíveis</span>
            <h1 className="text-6xl md:text-8xl font-rajdhani font-bold mt-6 leading-none tracking-tight">O FUTURO DA<br/><span className="text-[#00f0ff] neon-ciano">TECNOLOGIA</span><br/>É AQUI.</h1>
            <p className="mt-8 text-gray-400 text-xl max-w-lg">Sinta a evolução com os dispositivos mais avançados do planeta. Design disruptivo e performance extrema.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-[#00f0ff] text-black font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_#00f0ff]">⚡ VER OFERTAS AGORA</button>
              <button className="border border-[#a855f7] text-[#a855f7] font-bold px-8 py-4 rounded-lg hover:bg-[#a855f7] hover:text-white transition-all">🎮 MUNDO GAMER</button>
            </div>
            <div className="mt-12 flex gap-12">
              <div><p className="text-3xl font-rajdhani font-bold">5.000+</p><p className="text-gray-500 text-sm">Produtos</p></div>
              <div><p className="text-3xl font-rajdhani font-bold">98%</p><p className="text-gray-500 text-sm">Satisfação</p></div>
              <div><p className="text-3xl font-rajdhani font-bold">24h</p><p className="text-gray-500 text-sm">Suporte</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative hidden md:block">
            <div className="w-full aspect-square bg-gradient-to-br from-[#00f0ff]/10 to-[#a855f7]/10 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop" alt="Hero" className="w-3/4 object-contain animate-float" />
              <div className="absolute top-10 right-0 bg-[#070b12]/80 p-4 border border-[#00f0ff]/30 rounded-xl backdrop-blur-md animate-bounce-slow">
                <p className="text-[#00f0ff] text-xs font-bold">🔥 MAIS VENDIDO</p>
                <p className="font-bold">Galaxy S25 Ultra</p>
                <p className="text-sm text-gray-400">R$ 6.299</p>
              </div>
              <div className="absolute bottom-10 left-0 bg-[#070b12]/80 p-4 border border-[#00f0ff]/30 rounded-xl backdrop-blur-md animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <p className="text-green-400 text-xs font-bold">✅ FRETE GRÁTIS</p>
                <p className="font-bold">Em todo o Brasil</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STRIP DE BENEFÍCIOS */}
      <section className="bg-white/5 py-8 border-y border-white/10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, text: "Frete Grátis", sub: "Acima de R$299" },
            { icon: Shield, text: "Garantia Real", sub: "12 a 24 meses" },
            { icon: CreditCard, text: "12x Sem Juros", sub: "Nos cartões" },
            { icon: RefreshCw, text: "Troca Fácil", sub: "30 dias" }
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg"><b.icon className="text-[#00f0ff]" /></div>
              <div><p className="font-bold font-rajdhani">{b.text}</p><p className="text-xs text-gray-500">{b.sub}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#00f0ff] font-rajdhani text-sm font-bold tracking-widest uppercase">Categorias</span>
          <h2 className="text-5xl font-rajdhani font-bold mt-4">EXPLORE O UNIVERSO TECH</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div onClick={() => setActiveCategory("Todos")} className={`p-8 rounded-2xl border border-white/5 cursor-pointer transition-all hover:border-[#00f0ff] group flex flex-col items-center justify-center text-center ${activeCategory === "Todos" ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'bg-white/5'}`}>
            <p className="font-rajdhani font-bold text-lg group-hover:text-[#00f0ff]">TODOS</p>
          </div>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => setActiveCategory(cat.name)} className={`p-8 rounded-2xl border border-white/5 cursor-pointer transition-all hover:border-[#00f0ff] group flex flex-col items-center justify-center text-center ${activeCategory === cat.name ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'bg-white/5'}`}>
              <cat.icon size={40} className={`mb-4 transition-colors ${activeCategory === cat.name ? 'text-[#00f0ff]' : 'text-[#a855f7]'}`} />
              <p className="font-rajdhani font-bold text-sm group-hover:text-[#00f0ff]">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => activeCategory === "Todos" || p.category === activeCategory).map((prod) => (
            <motion.div key={prod.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-[#0f141e] border border-white/5 p-6 rounded-2xl hover:border-[#00f0ff] transition-all hover:-translate-y-2 shadow-2xl">
              <div className="relative aspect-square bg-black/40 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
                <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop&sig=${prod.id}`} alt={prod.name} className="w-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
                {prod.badge && <span className="absolute top-4 left-4 bg-[#ff2d78] text-white text-[10px] font-bold px-2 py-1 rounded">{prod.badge}</span>}
              </div>
              <h4 className="font-rajdhani font-bold text-xl h-14">{prod.name}</h4>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[#00f0ff] text-2xl font-bold">R$ {prod.price}</p>
                  {prod.oldPrice && <p className="text-gray-500 text-xs line-through">R$ {prod.oldPrice}</p>}
                </div>
                <div className="flex text-yellow-500">{"★".repeat(5)}</div>
              </div>
              <button onClick={() => addToCart(prod.id)} className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${addedProduct === prod.id ? 'bg-green-500 text-white' : 'border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black'}`}>
                {addedProduct === prod.id ? "✓ ADICIONADO!" : "🛒 ADICIONAR AO CARRINHO"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLASH SALE BANNER */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative bg-[#0f141e] rounded-3xl border border-[#ff2d78]/30 p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff2d78]/10 rounded-full blur-[100px]"></div>
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
            <div>
              <span className="bg-[#ff2d78] text-white font-rajdhani font-bold px-4 py-1 rounded-full text-sm">⚡ FLASH SALE</span>
              <h2 className="text-5xl font-rajdhani font-bold mt-6">ATÉ 40% OFF EM GAMER</h2>
              <p className="mt-4 text-gray-400">Oferta por tempo limitado. Garanta seu setup ultra-potente agora.</p>
              <button className="mt-8 bg-gradient-to-r from-[#ff2d78] to-[#a855f7] text-white font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_#ff2d78/40]">APROVEITAR AGORA →</button>
            </div>
            <div className="flex gap-4">
              {[
                { label: "Horas", value: timeLeft.h },
                { label: "Minutos", value: timeLeft.m },
                { label: "Segundos", value: timeLeft.s }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-black/60 border border-[#ff2d78]/30 rounded-2xl flex items-center justify-center text-4xl font-rajdhani font-bold">{t.value.toString().padStart(2, '0')}</div>
                  <span className="mt-2 text-xs text-gray-500 font-bold uppercase">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="p-12 bg-white/5 rounded-3xl border border-white/10">
          <Mail className="mx-auto text-[#00f0ff] mb-6" size={48} />
          <h2 className="text-4xl font-rajdhani font-bold uppercase">Fique por dentro</h2>
          <p className="mt-4 text-gray-400">Receba ofertas exclusivas e as últimas novidades tecnológicas diretamente no seu e-mail.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <input type="email" placeholder="Seu melhor e-mail" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 focus:border-[#00f0ff] outline-none transition-all" />
            <button className="bg-[#00f0ff] text-black font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all">QUERO DESCONTOS</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-white/10 mt-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-rajdhani font-bold text-[#00f0ff] mb-6"><Zap /> NEXUS TECH</div>
            <p className="text-gray-500 text-sm leading-relaxed">A Nexus Tech é a sua porta de entrada para o futuro. Especializada em eletrônicos de alta gama e estética cyberpunk.</p>
            <div className="flex gap-4 mt-8">
              <Instagram className="cursor-pointer hover:text-[#00f0ff]" />
              <Twitter className="cursor-pointer hover:text-[#00f0ff]" />
              <Facebook className="cursor-pointer hover:text-[#00f0ff]" />
            </div>
          </div>
          <div>
            <h4 className="font-rajdhani font-bold mb-6 uppercase tracking-widest text-[#00f0ff]">Produtos</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Smartphone</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Computadores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smartwatch</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-rajdhani font-bold mb-6 uppercase tracking-widest text-[#00f0ff]">Suporte</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Entregas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-rajdhani font-bold mb-6 uppercase tracking-widest text-[#00f0ff]">Empresa</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Novidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-xs">© 2025 NEXUS TECH. Todos os direitos reservados. Desenvolvido para o Futuro.</p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold text-xs uppercase">Pix</span>
            <span className="font-bold text-xs uppercase">Visa</span>
            <span className="font-bold text-xs uppercase">Mastercard</span>
            <span className="font-bold text-xs uppercase">Boleto</span>
          </div>
        </div>
      </footer>

      {/* Estilos Globais Customizados Adicionais Inline */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
