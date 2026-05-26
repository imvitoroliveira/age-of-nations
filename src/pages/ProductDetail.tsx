import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Star, Heart, 
  Minus, Plus, Shield, Truck, RefreshCw, Trophy, 
  CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight
} from "lucide-react";
import { products } from "@/data/products";
import Navbar from "@/components/layout/Navbar";



export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Descrição");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedImage(0);
      setSelectedColor(0);
      setSelectedModel(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#07080f] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-syne font-bold mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-[#7c3aed] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar para a loja
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#07080f] text-white font-sans selection:bg-[#06b6d4] selection:text-black">
      <Navbar />


      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="hover:text-white transition-colors cursor-pointer">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* GALERIA DO PRODUTO (5 Colunas) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square bg-black/40 rounded-2xl border border-white/5 overflow-hidden group mb-4">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-110 cursor-zoom-in" 
                />
              </AnimatePresence>
              
              {product.oldPrice && (
                <div className="absolute top-6 left-6 bg-[#f59e0b] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </div>
              )}

              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:border-[#7c3aed]/50 transition-all group/wish"
              >
                <Heart 
                  size={20} 
                  className={`transition-all duration-300 ${isWishlisted ? 'fill-[#7c3aed] text-[#7c3aed] scale-110' : 'text-white'}`}
                  style={{ animation: isWishlisted ? 'pulse-wish 0.4s ease-out' : 'none' }}
                />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl border transition-all overflow-hidden bg-black/40 p-2 ${selectedImage === idx ? 'border-[#7c3aed] shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* INFORMAÇÕES DO PRODUTO (5 Colunas) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-2">
              <span className="text-[10px] font-bold bg-[#7c3aed]/10 text-[#7c3aed] px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-[#7c3aed]/20">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4 uppercase leading-tight tracking-tighter">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating}</span>
              <a href="#avaliacoes" className="text-xs text-gray-500 hover:text-[#06b6d4] transition-colors uppercase tracking-widest underline underline-offset-4">
                {product.reviews} Avaliações
              </a>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/5 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex items-baseline gap-4 mb-1">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#10b981] text-xs font-medium">
                  ou 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                </span>
                {product.oldPrice && (
                  <span className="bg-[#f59e0b] text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                    OFERTA ATIVA
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* SELETOR DE COR */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selecione a Cor</span>
                  <span className="text-xs font-bold text-white">{product.colors[selectedColor].name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColor === idx ? 'border-white ring-2 ring-[#7c3aed]' : 'border-white/10 hover:border-white/30'}`}
                      title={color.name}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SELETOR DE MODELO */}
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Versão / Memória</span>
                <div className="flex flex-wrap gap-2">
                  {product.models.map((model, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedModel(idx)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedModel === idx ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20' : 'bg-white/5 border border-white/10 hover:border-[#7c3aed]/30'}`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTIDADE E ESTOQUE */}
              <div className="flex items-center gap-8">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Qtd</span>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden h-10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 h-full hover:bg-white/10 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 h-full hover:bg-white/10 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="pt-6">
                  {product.stock > 5 ? (
                    <div className="flex items-center gap-2 text-[#10b981] text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={14} /> Em estoque ({product.stock} unidades)
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#f59e0b] text-[10px] font-bold uppercase tracking-wider">
                      <AlertTriangle size={14} /> Últimas unidades!
                    </div>
                  )}
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="space-y-4 pt-4">
                <button className="w-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-black py-5 rounded-xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#7c3aed]/20 hover:scale-[1.02] transition-all relative overflow-hidden group animate-pulse-slow">
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="flex items-center justify-center gap-3">
                    Comprar Agora
                  </span>
                </button>

                <button className="w-full border border-[#7c3aed] text-[#7c3aed] font-black py-5 rounded-xl uppercase tracking-[0.2em] text-sm hover:bg-[#7c3aed] hover:text-white transition-all flex items-center justify-center gap-3">
                  <ShoppingCart size={18} /> Adicionar ao Carrinho
                </button>
              </div>

              {/* GARANTIAS VISUAIS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {[
                  { icon: Shield, text: "Compra Segura" },
                  { icon: Truck, text: "Frete Grátis" },
                  { icon: RefreshCw, text: "Troca 30 dias" },
                  { icon: Trophy, text: "Garantia 1 ano" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                    <item.icon size={20} className="text-[#06b6d4]" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ABAS DE INFORMAÇÃO */}
        <div className="mt-24">
          <div className="flex border-b border-white/5 gap-12 mb-12">
            {["Descrição", "Especificações", "Avaliações"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "Descrição" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {product.description.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-400 text-sm leading-relaxed font-light">{para}</p>
                  ))}
                  <ul className="space-y-4 pt-4">
                    {["Tecnologia de última geração", "Design premium e ergonômico", "Eficiência energética classe A+"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#06b6d4]">
                        <Zap size={14} className="fill-[#06b6d4]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video group">
                  <img src={product.images[1]} alt="Context" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080f] to-transparent"></div>
                </div>
              </motion.div>
            )}

            {activeTab === "Especificações" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                <div className="border border-white/5 rounded-2xl overflow-hidden">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className={`grid grid-cols-2 p-6 text-xs uppercase tracking-widest ${idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-[#7c3aed]/5'}`}>
                      <span className="font-bold text-gray-400">{spec.key}</span>
                      <span className="text-white text-right md:text-left">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "Avaliações" && (
              <motion.div id="avaliacoes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-6xl font-syne font-black mb-2">{product.rating}</span>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className={i < Math.floor(product.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-700'} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Baseado em {product.reviews} reviews</span>
                  </div>
                  
                  <div className="lg:col-span-8 space-y-4">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-4">{stars} ★</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]" 
                            style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-right text-gray-500">{stars === 5 ? 85 : stars === 4 ? 12 : 3}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 space-y-6">
                  {[
                    { name: "Alex R.", date: "15 Mai, 2025", text: "Simplesmente incrível. A performance superou todas as minhas expectativas. O design cyberpunk combina perfeitamente com meu setup." },
                    { name: "Mariana S.", date: "22 Abr, 2025", text: "Entrega super rápida e produto de altíssima qualidade. O acabamento em titânio é um diferencial absurdo." },
                    { name: "Carlos T.", date: "05 Abr, 2025", text: "A bateria dura o dia todo mesmo com uso intenso. A tela é a melhor que já vi em um smartphone." }
                  ].map((review, i) => (
                    <div key={i} className="p-6 border border-white/5 rounded-2xl bg-white/[0.01]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] font-bold text-xs uppercase tracking-tighter">
                            {review.name[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest">{review.name}</h4>
                            <span className="text-[10px] text-gray-600 font-bold tracking-tighter uppercase">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => <Star key={j} size={10} className="fill-[#f59e0b] text-[#f59e0b]" />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-light leading-relaxed italic">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#06b6d4] font-syne text-[10px] font-bold tracking-[0.3em] uppercase">◎ ORBE RECOMENDA</span>
              <h2 className="text-3xl font-syne font-extrabold mt-2 uppercase">VOCÊ TAMBÉM PODE GOSTAR</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-3 border border-white/5 rounded-full hover:border-[#7c3aed] transition-all"><ArrowLeft size={16} /></button>
              <button className="p-3 border border-white/5 rounded-full hover:border-[#7c3aed] transition-all"><ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => (
              <Link to={`/produto/${prod.id}`} key={prod.id}>
                <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#7c3aed]/50 transition-all hover:-translate-y-2 relative">
                  <div className="relative aspect-square bg-black/40 rounded-xl mb-6 overflow-hidden flex items-center justify-center p-4">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-syne font-bold text-xs uppercase tracking-tight h-10 line-clamp-2">{prod.name}</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-white font-bold">R$ {prod.price}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-[#f59e0b] text-[#f59e0b]" />)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse-wish {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
