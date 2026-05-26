import { Instagram, Globe } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-24 border-t border-white/5 mt-20 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-1 text-2xl font-syne tracking-tight mb-6">
            <span className="text-3xl text-[#7c3aed]">◎</span>
            <span className="font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent uppercase">ORBE</span>
            <span className="font-light text-white/90 uppercase">Connect</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-light mb-8">
            A ORBE Connect é a sua porta de entrada para o futuro. Especializada em eletrônicos de alta gama e tecnologia que orbita o seu mundo.
          </p>
          
          <div className="space-y-4">
            <h4 className="font-syne font-bold uppercase tracking-[0.3em] text-[#7c3aed] text-[12px]">SIGA A ORBE CONNECT</h4>
            <a 
              href="https://www.instagram.com/orbeconnect" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#f56040] text-white font-bold text-xs transition-all hover:shadow-[0_0_20px_rgba(253,29,29,0.3)] group"
              whileHover={{ scale: 1.03 }}
            >
              <Instagram size={18} className="group-hover:rotate-12 transition-transform" />
              <span>@orbeconnect</span>
            </a>
          </div>
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
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 opacity-40">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-medium">
            © 2025 ORBE Connect. Todos os direitos reservados.
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <a 
            href="https://www.instagram.com/orbeconnect" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#f56040] transition-all group"
          >
            <Instagram size={16} className="group-hover:drop-shadow-[0_0_8px_rgba(245,96,64,0.5)] transition-all" />
          </a>
          
          <div className="flex gap-6 opacity-40">
            {["Pix", "Visa", "Master", "Boleto"].map(m => (
              <span key={m} className="font-bold text-[9px] uppercase tracking-tighter text-gray-600">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;