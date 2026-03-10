import { AchievementDef, FarmItem, Category } from '@/types/education';

// ---- COLORS ----
export const COLORS = [
  { name: 'Vermelho', hex: '#EF4444', emoji: '🔴' },
  { name: 'Azul', hex: '#3B82F6', emoji: '🔵' },
  { name: 'Amarelo', hex: '#EAB308', emoji: '🟡' },
  { name: 'Verde', hex: '#22C55E', emoji: '🟢' },
  { name: 'Laranja', hex: '#F97316', emoji: '🟠' },
  { name: 'Roxo', hex: '#A855F7', emoji: '🟣' },
  { name: 'Rosa', hex: '#EC4899', emoji: '🩷' },
  { name: 'Marrom', hex: '#92400E', emoji: '🟤' },
  { name: 'Branco', hex: '#F8FAFC', emoji: '⚪' },
  { name: 'Preto', hex: '#1E293B', emoji: '⚫' },
];

// ---- ANIMALS ----
export const ANIMALS = [
  { name: 'Gato', emoji: '🐱', soundText: 'Miau! Miau!' },
  { name: 'Cachorro', emoji: '🐶', soundText: 'Au au! Au au!' },
  { name: 'Vaca', emoji: '🐮', soundText: 'Muuuu!' },
  { name: 'Galinha', emoji: '🐔', soundText: 'Có có có!' },
  { name: 'Porco', emoji: '🐷', soundText: 'Oinc! Oinc!' },
  { name: 'Pato', emoji: '🦆', soundText: 'Quá quá!' },
  { name: 'Cavalo', emoji: '🐴', soundText: 'Iiiihhh!' },
  { name: 'Ovelha', emoji: '🐑', soundText: 'Béééé!' },
  { name: 'Leão', emoji: '🦁', soundText: 'Roaaaar!' },
  { name: 'Sapo', emoji: '🐸', soundText: 'Croac! Croac!' },
  { name: 'Passarinho', emoji: '🐦', soundText: 'Piu piu!' },
  { name: 'Abelha', emoji: '🐝', soundText: 'Bzzzz!' },
];

// ---- SHAPES ----
export const SHAPES = [
  { name: 'Círculo', emoji: '⭕' },
  { name: 'Quadrado', emoji: '⬜' },
  { name: 'Triângulo', emoji: '🔺' },
  { name: 'Estrela', emoji: '⭐' },
  { name: 'Coração', emoji: '❤️' },
  { name: 'Losango', emoji: '🔷' },
];

// ---- LETTERS ----
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'Abelha', emoji: '🐝' }, B: { word: 'Bola', emoji: '⚽' },
  C: { word: 'Casa', emoji: '🏠' }, D: { word: 'Dado', emoji: '🎲' },
  E: { word: 'Elefante', emoji: '🐘' }, F: { word: 'Flor', emoji: '🌸' },
  G: { word: 'Gato', emoji: '🐱' }, H: { word: 'Hipopótamo', emoji: '🦛' },
  I: { word: 'Iglu', emoji: '🏔️' }, J: { word: 'Jacaré', emoji: '🐊' },
  K: { word: 'Kiwi', emoji: '🥝' }, L: { word: 'Lua', emoji: '🌙' },
  M: { word: 'Macaco', emoji: '🐵' }, N: { word: 'Navio', emoji: '🚢' },
  O: { word: 'Ovo', emoji: '🥚' }, P: { word: 'Peixe', emoji: '🐟' },
  Q: { word: 'Queijo', emoji: '🧀' }, R: { word: 'Rato', emoji: '🐭' },
  S: { word: 'Sol', emoji: '☀️' }, T: { word: 'Tartaruga', emoji: '🐢' },
  U: { word: 'Uva', emoji: '🍇' }, V: { word: 'Vaca', emoji: '🐮' },
  W: { word: 'Waffle', emoji: '🧇' }, X: { word: 'Xícara', emoji: '☕' },
  Y: { word: 'Yoga', emoji: '🧘' }, Z: { word: 'Zebra', emoji: '🦓' },
};

export const NUMBERS = Array.from({ length: 10 }, (_, i) => i);

// ---- SYLLABLES ----
export const SYLLABLE_WORDS = [
  { word: 'BOLA', syllables: ['BO', 'LA'], image: '⚽' },
  { word: 'CASA', syllables: ['CA', 'SA'], image: '🏠' },
  { word: 'GATO', syllables: ['GA', 'TO'], image: '🐱' },
  { word: 'PATO', syllables: ['PA', 'TO'], image: '🦆' },
  { word: 'MALA', syllables: ['MA', 'LA'], image: '🧳' },
  { word: 'SAPO', syllables: ['SA', 'PO'], image: '🐸' },
  { word: 'LOBO', syllables: ['LO', 'BO'], image: '🐺' },
  { word: 'FOCA', syllables: ['FO', 'CA'], image: '🦭' },
  { word: 'RATO', syllables: ['RA', 'TO'], image: '🐭' },
  { word: 'VELA', syllables: ['VE', 'LA'], image: '🕯️' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], image: '🍌' },
  { word: 'MACACO', syllables: ['MA', 'CA', 'CO'], image: '🐵' },
  { word: 'CAVALO', syllables: ['CA', 'VA', 'LO'], image: '🐴' },
  { word: 'ABACAXI', syllables: ['A', 'BA', 'CA', 'XI'], image: '🍍' },
];

// ---- AVATARS ----
export const AVATAR_EMOJIS = ['🐻', '🐰', '🦊', '🐼', '🐸', '🦁', '🐯', '🐮', '🐷', '🐵', '🦄', '🐲'];

// ---- FARM ITEMS ----
export const FARM_ITEMS: FarmItem[] = [
  { key: 'chicken', name: 'Galinha', emoji: '🐔', cost: 5, category: 'animal' },
  { key: 'pig', name: 'Porco', emoji: '🐷', cost: 10, category: 'animal' },
  { key: 'cow', name: 'Vaca', emoji: '🐮', cost: 15, category: 'animal' },
  { key: 'horse', name: 'Cavalo', emoji: '🐴', cost: 20, category: 'animal' },
  { key: 'sheep', name: 'Ovelha', emoji: '🐑', cost: 12, category: 'animal' },
  { key: 'dog', name: 'Cachorro', emoji: '🐶', cost: 8, category: 'animal' },
  { key: 'tree', name: 'Árvore', emoji: '🌳', cost: 3, category: 'plant' },
  { key: 'flower', name: 'Flor', emoji: '🌻', cost: 2, category: 'plant' },
  { key: 'corn', name: 'Milho', emoji: '🌽', cost: 4, category: 'plant' },
  { key: 'carrot', name: 'Cenoura', emoji: '🥕', cost: 3, category: 'plant' },
  { key: 'barn', name: 'Celeiro', emoji: '🏠', cost: 25, category: 'building' },
  { key: 'windmill', name: 'Moinho', emoji: '🏗️', cost: 30, category: 'building' },
  { key: 'fence', name: 'Cerca', emoji: '🏗️', cost: 5, category: 'decoration' },
  { key: 'pond', name: 'Lago', emoji: '💧', cost: 15, category: 'decoration' },
  { key: 'rainbow', name: 'Arco-íris', emoji: '🌈', cost: 50, category: 'decoration' },
];

// ---- ACHIEVEMENTS ----
export const ACHIEVEMENTS: AchievementDef[] = [
  { key: 'first_star', title: 'Primeira Estrela!', description: 'Ganhe sua primeira estrela', emoji: '⭐', condition: (_, stars) => stars >= 1 },
  { key: 'star_10', title: 'Estrela Brilhante', description: 'Ganhe 10 estrelas', emoji: '🌟', condition: (_, stars) => stars >= 10 },
  { key: 'star_50', title: 'Constelação', description: 'Ganhe 50 estrelas', emoji: '✨', condition: (_, stars) => stars >= 50 },
  { key: 'star_100', title: 'Super Estrela', description: 'Ganhe 100 estrelas', emoji: '💫', condition: (_, stars) => stars >= 100 },
  { key: 'colors_master', title: 'Mestre das Cores', description: 'Acerte 20 cores', emoji: '🎨', condition: (p) => (p.colors?.correct_count || 0) >= 20 },
  { key: 'animal_lover', title: 'Amigo dos Animais', description: 'Acerte 20 animais', emoji: '🐾', condition: (p) => (p.animals?.correct_count || 0) >= 20 },
  { key: 'math_genius', title: 'Gênio da Matemática', description: 'Acerte 30 contas', emoji: '🧮', condition: (p) => (p.math?.correct_count || 0) >= 30 },
  { key: 'letter_pro', title: 'Mestre das Letras', description: 'Acerte 26 letras', emoji: '📚', condition: (p) => (p.letters?.correct_count || 0) >= 26 },
  { key: 'streak_5', title: 'Sequência de 5!', description: 'Acerte 5 seguidas', emoji: '🔥', condition: (p) => Object.values(p).some(v => (v?.best_streak || 0) >= 5) },
  { key: 'streak_10', title: 'Imparável!', description: 'Acerte 10 seguidas', emoji: '🚀', condition: (p) => Object.values(p).some(v => (v?.best_streak || 0) >= 10) },
  { key: 'farmer', title: 'Fazendeiro', description: 'Compre seu primeiro item', emoji: '🌾', condition: () => false /* checked in farm */ },
  { key: 'full_farm', title: 'Fazenda Completa', description: 'Tenha 10 itens na fazenda', emoji: '🏡', condition: () => false /* checked in farm */ },
];

// ---- MATH ----
export function generateMathProblem(difficulty: 'easy' | 'medium' | 'hard') {
  let a: number, b: number, operator: '+' | '-', answer: number;

  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    operator = '+';
    answer = a + b;
  } else if (difficulty === 'medium') {
    operator = Math.random() > 0.5 ? '+' : '-';
    a = Math.floor(Math.random() * 10) + (operator === '-' ? 3 : 1);
    b = operator === '-' ? Math.floor(Math.random() * a) : Math.floor(Math.random() * 10) + 1;
    answer = operator === '+' ? a + b : a - b;
  } else {
    operator = Math.random() > 0.5 ? '+' : '-';
    a = Math.floor(Math.random() * 20) + (operator === '-' ? 10 : 5);
    b = operator === '-' ? Math.floor(Math.random() * a) : Math.floor(Math.random() * 20) + 5;
    answer = operator === '+' ? a + b : a - b;
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset);
    if (wrong >= 0 && wrong !== answer) options.add(wrong);
  }

  return { a, b, operator, answer, options: [...options].sort(() => Math.random() - 0.5) };
}

// ---- CATEGORY META ----
export const CATEGORY_META: Record<Category, { title: string; emoji: string; color: string; description: string }> = {
  colors: { title: 'Cores', emoji: '🎨', color: 'border-kid-pink bg-kid-pink/10', description: 'Aprenda as cores!' },
  animals: { title: 'Animais', emoji: '🐾', color: 'border-kid-orange bg-kid-orange/10', description: 'Sons e nomes!' },
  letters: { title: 'Letras', emoji: '🔤', color: 'border-kid-blue bg-kid-blue/10', description: 'ABC completo!' },
  numbers: { title: 'Números', emoji: '🔢', color: 'border-kid-green bg-kid-green/10', description: 'Conte até 10!' },
  shapes: { title: 'Formas', emoji: '🔷', color: 'border-kid-purple bg-kid-purple/10', description: 'Formas geométricas!' },
  math: { title: 'Matemática', emoji: '🧮', color: 'border-kid-blue bg-kid-blue/10', description: 'Somar e subtrair!' },
  portuguese: { title: 'Português', emoji: '📝', color: 'border-kid-pink bg-kid-pink/10', description: 'Vogais e palavras!' },
  syllables: { title: 'Sílabas', emoji: '📖', color: 'border-kid-purple bg-kid-purple/10', description: 'Monte palavras!' },
  drawing: { title: 'Desenhar', emoji: '✏️', color: 'border-kid-orange bg-kid-orange/10', description: 'Desenhe letras!' },
};

export function speak(text: string) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }
}
