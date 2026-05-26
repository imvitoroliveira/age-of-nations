import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Zap, Gamepad2, Smartphone, Headphones, Laptop, Speaker, Watch, Mail, ChevronRight } from "lucide-react";

const products = [
  { id: 1, name: "Galaxy S25 Ultra", category: "Celulares", price: 6299, oldPrice: 6999, badge: "TOP" },
  { id: 2, name: "Headset Pro", category: "Áudio & Som", price: 499, oldPrice: 599, badge: "OFERTA" },
  { id: 3, name: "Laptop Gamer X", category: "Mundo Gamer", price: 8599, badge: "NOVO" },
  { id: 4, name: "Smartwatch Elite", category: "Smartwatches", price: 1299, badge: "" },
  { id: 5, name: "Fone Bluetooth", category: "Acessórios para Celular", price: 199, badge: "OFERTA" },
  { id: 6, name: "Teclado Mecânico", category: "Computadores & Periféricos", price: 350, badge: "" },
  { id: 7, name: "Mouse Gamer", category: "Mundo Gamer", price: 250, badge: "TOP" },
  { id: 8, name: "Soundbar 2.1", category: "Áudio & Som", price: 899, badge: "" },
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

  const addToCart = (id: number) => {
    setCartCount((prev) => prev + 1);
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-rajdhani font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
          <Zap className="text-[#00f0ff]" /> NEXUS TECH
        </div>
        <div className="hidden md:flex gap-8 font-rajdhani text-lg">
          {["Produtos", "Promoções", "Sobre", "Contato"].map((item) => (
            <a key={item} href="#" className="hover:text-[#00f0ff] transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Search className="cursor-pointer hover:text-[#00f0ff]" />
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-all">
            <ShoppingCart />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#ff2d78] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center pt-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#00f0ff] font-rajdhani text-sm border border-[#00f0ff] px-3 py-1 rounded-full">Lançamentos 2025 disponíveis</span>
            <h1 className="text-6xl md:text-8xl font-rajdhani font-bold mt-4 leading-none">O FUTURO DA<br/>TECNOLOGIA<br/>É AQUI.</h1>
            <p className="mt-6 text-gray-400 text-lg">Explore a fronteira da inovação com dispositivos de última geração.</p>
            <div className="mt-8 flex gap-4">
              <button className="bg-[#00f0ff] text-black font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:opacity-90">⚡ VER OFERTAS AGORA</button>
              <button className="border border-[#a855f7] text-[#a855f7] font-bold px-8 py-4 rounded-lg hover:bg-[#a855f7] hover:text-white transition-all">🎮 MUNDO GAMER</button>
            </div>
          </motion.div>
          <div className="relative">
            <div className="w-full h-[400px] bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 rounded-2xl border border-white/10 flex items-center justify-center">
              [Smartphone Placeholder]
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h3 className="text-[#00f0ff] font-rajdhani text-lg font-bold uppercase tracking-widest">Categorias</h3>
        <h2 className="text-4xl font-rajdhani font-bold mt-2">EXPLORE O UNIVERSO TECH</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {categories.map((cat, i) => (
            <div key={i} onClick={() => setActiveCategory(cat.name)} className={`p-6 rounded-xl border border-white/10 cursor-pointer transition-all hover:border-[#00f0ff] hover:bg-white/5 ${activeCategory === cat.name ? 'border-[#00f0ff] bg-white/10' : ''}`}>
              <cat.icon size={40} className="mb-4 text-[#a855f7]" />
              <p className="font-rajdhani font-bold">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => activeCategory === "Todos" || p.category === activeCategory).map((prod) => (
            <motion.div key={prod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-[#0f141e] border border-white/5 p-6 rounded-xl group hover:border-[#00f0ff] transition-all">
              <div className="h-48 bg-white/5 rounded-lg mb-4 flex items-center justify-center">[Img]</div>
              <h4 className="font-rajdhani font-bold text-xl">{prod.name}</h4>
              <p className="text-[#00f0ff] font-bold mt-2 text-xl">R$ {prod.price}</p>
              <button onClick={() => addToCart(prod.id)} className={`w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${addedProduct === prod.id ? 'bg-green-500 text-white' : 'border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black'}`}>
                {addedProduct === prod.id ? "✓ ADICIONADO!" : "🛒 ADICIONAR AO CARRINHO"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">© 2025 NEXUS TECH. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
