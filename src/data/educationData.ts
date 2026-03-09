import { ColorItem, AnimalItem, ShapeItem, SyllableWord } from '@/types/education';

export const COLORS: ColorItem[] = [
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

export const ANIMALS: AnimalItem[] = [
  { name: 'Gato', emoji: '🐱', sound: 'miau', soundText: 'Miau! Miau!' },
  { name: 'Cachorro', emoji: '🐶', sound: 'auau', soundText: 'Au au! Au au!' },
  { name: 'Vaca', emoji: '🐮', sound: 'mu', soundText: 'Muuuu!' },
  { name: 'Galinha', emoji: '🐔', sound: 'cococo', soundText: 'Có có có!' },
  { name: 'Porco', emoji: '🐷', sound: 'oinc', soundText: 'Oinc! Oinc!' },
  { name: 'Pato', emoji: '🦆', sound: 'quack', soundText: 'Quá quá!' },
  { name: 'Cavalo', emoji: '🐴', sound: 'relincho', soundText: 'Iiiihhh!' },
  { name: 'Ovelha', emoji: '🐑', sound: 'bee', soundText: 'Béééé!' },
  { name: 'Leão', emoji: '🦁', sound: 'roar', soundText: 'Roaaaar!' },
  { name: 'Sapo', emoji: '🐸', sound: 'croak', soundText: 'Croac! Croac!' },
  { name: 'Passarinho', emoji: '🐦', sound: 'piupiu', soundText: 'Piu piu!' },
  { name: 'Abelha', emoji: '🐝', sound: 'buzz', soundText: 'Bzzzz!' },
];

export const SHAPES: ShapeItem[] = [
  { name: 'Círculo', emoji: '⭕', sides: 0 },
  { name: 'Quadrado', emoji: '⬜', sides: 4 },
  { name: 'Triângulo', emoji: '🔺', sides: 3 },
  { name: 'Estrela', emoji: '⭐', sides: 5 },
  { name: 'Coração', emoji: '❤️', sides: 0 },
  { name: 'Losango', emoji: '🔷', sides: 4 },
];

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const NUMBERS = Array.from({ length: 10 }, (_, i) => i);

export const NUMBER_EMOJIS: Record<number, string> = {
  0: '0️⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣',
  5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
};

export const LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'Abelha', emoji: '🐝' },
  B: { word: 'Bola', emoji: '⚽' },
  C: { word: 'Casa', emoji: '🏠' },
  D: { word: 'Dado', emoji: '🎲' },
  E: { word: 'Elefante', emoji: '🐘' },
  F: { word: 'Flor', emoji: '🌸' },
  G: { word: 'Gato', emoji: '🐱' },
  H: { word: 'Hipopótamo', emoji: '🦛' },
  I: { word: 'Iglu', emoji: '🏔️' },
  J: { word: 'Jacaré', emoji: '🐊' },
  K: { word: 'Kiwi', emoji: '🥝' },
  L: { word: 'Lua', emoji: '🌙' },
  M: { word: 'Macaco', emoji: '🐵' },
  N: { word: 'Navio', emoji: '🚢' },
  O: { word: 'Ovo', emoji: '🥚' },
  P: { word: 'Peixe', emoji: '🐟' },
  Q: { word: 'Queijo', emoji: '🧀' },
  R: { word: 'Rato', emoji: '🐭' },
  S: { word: 'Sol', emoji: '☀️' },
  T: { word: 'Tartaruga', emoji: '🐢' },
  U: { word: 'Uva', emoji: '🍇' },
  V: { word: 'Vaca', emoji: '🐮' },
  W: { word: 'Waffle', emoji: '🧇' },
  X: { word: 'Xícara', emoji: '☕' },
  Y: { word: 'Yoga', emoji: '🧘' },
  Z: { word: 'Zebra', emoji: '🦓' },
};

export const SYLLABLE_WORDS: SyllableWord[] = [
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
  { word: 'ESTRELA', syllables: ['ES', 'TRE', 'LA'], image: '⭐' },
  { word: 'ABACAXI', syllables: ['A', 'BA', 'CA', 'XI'], image: '🍍' },
];

export const AVATAR_EMOJIS = ['🐻', '🐰', '🦊', '🐼', '🐸', '🦁', '🐯', '🐮', '🐷', '🐵', '🦄', '🐲'];

export function generateMathProblem(difficulty: 'easy' | 'medium' | 'hard'): {
  a: number; b: number; operator: '+' | '-'; answer: number; options: number[];
} {
  let a: number, b: number, operator: '+' | '-', answer: number;

  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    operator = '+';
    answer = a + b;
  } else if (difficulty === 'medium') {
    operator = Math.random() > 0.5 ? '+' : '-';
    if (operator === '+') {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 10) + 3;
      b = Math.floor(Math.random() * a);
      answer = a - b;
    }
  } else {
    operator = Math.random() > 0.5 ? '+' : '-';
    if (operator === '+') {
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 20) + 5;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 30) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
    }
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset);
    if (wrong >= 0 && wrong !== answer) options.add(wrong);
  }

  return { a, b, operator, answer, options: [...options].sort(() => Math.random() - 0.5) };
}
