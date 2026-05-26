export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  models: string[];
  stock: number;
  specifications: { key: string; value: string }[];
  brand: string;
  condition: "novo" | "seminovo";
}

export const products: Product[] = [
  {
    id: 1,
    name: "Galaxy S25 Ultra",
    category: "Celulares",
    price: 6299,
    oldPrice: 6999,
    badge: "TOP",
    description: "O Galaxy S25 Ultra redefine o que é um smartphone premium. Com seu novo processador ultra-rápido e tela Dynamic AMOLED 2X, você terá a melhor experiência visual e de performance do mercado. Sua câmera de 200MP captura detalhes impressionantes mesmo em baixa luminosidade.\n\nConstruído com titânio de grau aeroespacial, este dispositivo não é apenas potente, mas também extremamente durável. A integração perfeita com a S Pen permite produtividade sem precedentes.",
    images: [
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.8,
    reviews: 124,
    colors: [
      { name: "Titanium Silver", hex: "#C0C0C0" },
      { name: "Phantom Black", hex: "#1A1A1A" },
      { name: "Neon Violet", hex: "#7c3aed" }
    ],
    models: ["256GB", "512GB", "1TB"],
    stock: 12,
    specifications: [
      { key: "Processador", value: "Snapdragon 8 Gen 4" },
      { key: "Memória RAM", value: "16GB LPDDR5X" },
      { key: "Tela", value: "6.8\" QHD+ 120Hz" },
      { key: "Bateria", value: "5000mAh (45W)" }
    ],
    brand: "Samsung",
    condition: "novo"
  },
  {
    id: 2,
    name: "Headset RGB Pro",
    category: "Áudio & Som",
    price: 499,
    oldPrice: 599,
    badge: "OFERTA",
    description: "Som surround 7.1 imersivo com drivers de 50mm. Conforto extremo para longas sessões de jogo com almofadas de memory foam. Microfone com cancelamento de ruído ativo.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.6,
    reviews: 89,
    colors: [
      { name: "Black Neon", hex: "#000000" },
      { name: "Arctic White", hex: "#FFFFFF" }
    ],
    models: ["Standard"],
    stock: 5,
    specifications: [
      { key: "Driver", value: "50mm Neodímio" },
      { key: "Frequência", value: "20Hz - 20kHz" },
      { key: "Conexão", value: "USB-C / Wireless 2.4GHz" },
      { key: "Peso", value: "320g" }
    ],
    brand: "Logitech",
    condition: "novo"
  },
  {
    id: 3,
    name: "Laptop Nexus X",
    category: "Mundo Gamer",
    price: 8599,
    badge: "NOVO",
    description: "A máquina definitiva para criadores e gamers. Equipado com a RTX 5080 e tela OLED 4K de 165Hz. Sistema de resfriamento líquido integrado em um corpo ultra-fino.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.9,
    reviews: 56,
    colors: [
      { name: "Carbon Grey", hex: "#2C2C2C" }
    ],
    models: ["RTX 5070 / 16GB", "RTX 5080 / 32GB", "RTX 5090 / 64GB"],
    stock: 8,
    specifications: [
      { key: "GPU", value: "NVIDIA RTX 5080" },
      { key: "CPU", value: "Intel Core i9-15900HK" },
      { key: "Armazenamento", value: "2TB NVMe Gen5" },
      { key: "Tela", value: "16\" OLED 4K 165Hz" }
    ],
    brand: "Nexus",
    condition: "novo"
  },
  {
    id: 4,
    name: "Nexus Watch v2",
    category: "Smartwatches",
    price: 1299,
    badge: "",
    description: "Mantenha-se conectado e saudável com o Nexus Watch v2. Monitoramento de oxigênio no sangue, ECG e detecção de quedas. Bateria de 5 dias.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544117518-2b44abc8e916?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aac29f25346?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.7,
    reviews: 210,
    colors: [
      { name: "Space Black", hex: "#000000" },
      { name: "Rose Gold", hex: "#B76E79" },
      { name: "Cyan Mist", hex: "#06b6d4" }
    ],
    models: ["40mm", "44mm"],
    stock: 25,
    specifications: [
      { key: "Sensores", value: "SpO2, ECG, PPG" },
      { key: "Resistência", value: "5ATM (50 metros)" },
      { key: "Bateria", value: "Até 120 horas" },
      { key: "Compatibilidade", value: "iOS / Android" }
    ],
    brand: "Nexus",
    condition: "novo"
  },
  {
    id: 5,
    name: "Air Buds Lite",
    category: "Acessórios para Celular",
    price: 199,
    oldPrice: 299,
    badge: "OFERTA",
    description: "Liberdade sem fios com som cristalino. Compactos, leves e com pareamento instantâneo. Estojo de carregamento com USB-C.",
    images: [
      "https://images.unsplash.com/photo-1588423770119-94550d899933?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.3,
    reviews: 450,
    colors: [
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Neon Violet", hex: "#7c3aed" }
    ],
    models: ["Standard"],
    stock: 100,
    specifications: [
      { key: "Bluetooth", value: "5.3" },
      { key: "Autonomia", value: "6h + 18h no estojo" },
      { key: "Codecs", value: "AAC, SBC" },
      { key: "Peso", value: "4g por fone" }
    ],
    brand: "Apple",
    condition: "seminovo"
  },
  {
    id: 6,
    name: "Cyber Keyboard",
    category: "Computadores & Periféricos",
    price: 350,
    badge: "",
    description: "Teclado mecânico 60% com switches hot-swappable e iluminação RGB customizável via software Nexus Control. Keycaps PBT double-shot.",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618384881928-82cc69595568?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.8,
    reviews: 32,
    colors: [
      { name: "Stealth Black", hex: "#000000" }
    ],
    models: ["Blue Switch", "Red Switch", "Brown Switch"],
    stock: 15,
    specifications: [
      { key: "Layout", value: "ANSI 60%" },
      { key: "Switches", value: "Nexus Mechanical" },
      { key: "Iluminação", value: "Per-key RGB" },
      { key: "Cabo", value: "USB-C Removível" }
    ],
    brand: "Razer",
    condition: "novo"
  },
  {
    id: 7,
    name: "Gamer Mouse v3",
    category: "Mundo Gamer",
    price: 250,
    badge: "TOP",
    description: "Precisão absoluta com sensor óptico de 26.000 DPI. Ultra-leve com apenas 58g. Pés em PTFE virgem para deslize suave.",
    images: [
      "https://images.unsplash.com/photo-1527690718350-bfee35a34a4a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615663248861-2446a855502a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599305090598-fe1757dfc00a?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.9,
    reviews: 78,
    colors: [
      { name: "Neon Cyan", hex: "#06b6d4" },
      { name: "Black", hex: "#000000" }
    ],
    models: ["Wired", "Wireless"],
    stock: 3,
    specifications: [
      { key: "DPI", value: "26.000" },
      { key: "Aceleração", value: "50G" },
      { key: "Switches", value: "Ópticos (100M cliques)" },
      { key: "Bateria", value: "80h (Wireless)" }
    ],
    brand: "Logitech",
    condition: "novo"
  },
  {
    id: 8,
    name: "Audio System 2.1",
    category: "Áudio & Som",
    price: 899,
    badge: "",
    description: "Potência sonora que você sente. Sistema 2.1 com subwoofer ativo e tweeters de alta fidelidade. Conectividade Bluetooth e entrada óptica.",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558537348-c0f8e073240a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=1000&auto=format&fit=crop"
    ],
    rating: 4.5,
    reviews: 42,
    colors: [
      { name: "Wood/Black", hex: "#4A3728" }
    ],
    models: ["Standard"],
    stock: 12,
    specifications: [
      { key: "Potência", value: "120W RMS" },
      { key: "Canais", value: "2.1" },
      { key: "Bluetooth", value: "5.0" },
      { key: "Controle", value: "Remoto Wireless" }
    ],
    brand: "Edifier",
    condition: "novo"
  }
];
