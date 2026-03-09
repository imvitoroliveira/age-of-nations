// ===== MINI (1-3 years) =====

export interface ColorItem {
  name: string;
  hex: string;
  emoji: string;
}

export const COLORS: ColorItem[] = [
  { name: 'Vermelho', hex: '#EF4444', emoji: '🔴' },
  { name: 'Azul', hex: '#3B82F6', emoji: '🔵' },
  { name: 'Amarelo', hex: '#EAB308', emoji: '🟡' },
  { name: 'Verde', hex: '#22C55E', emoji: '🟢' },
  { name: 'Laranja', hex: '#F97316', emoji: '🟠' },
  { name: 'Roxo', hex: '#A855F7', emoji: '🟣' },
  { name: 'Rosa', hex: '#EC4899', emoji: '💗' },
  { name: 'Marrom', hex: '#92400E', emoji: '🟤' },
  { name: 'Branco', hex: '#F8FAFC', emoji: '⚪' },
  { name: 'Preto', hex: '#1E293B', emoji: '⚫' },
];

export interface AnimalItem {
  name: string;
  emoji: string;
  sound: string;
  soundText: string;
}

export const ANIMALS: AnimalItem[] = [
  { name: 'Cachorro', emoji: '🐶', sound: 'Au au!', soundText: 'Au au!' },
  { name: 'Gato', emoji: '🐱', sound: 'Miau!', soundText: 'Miau!' },
  { name: 'Vaca', emoji: '🐮', sound: 'Muuu!', soundText: 'Muuu!' },
  { name: 'Galinha', emoji: '🐔', sound: 'Có có có!', soundText: 'Có có có!' },
  { name: 'Porco', emoji: '🐷', sound: 'Oinc oinc!', soundText: 'Oinc oinc!' },
  { name: 'Pato', emoji: '🦆', sound: 'Quack quack!', soundText: 'Quack quack!' },
  { name: 'Leão', emoji: '🦁', sound: 'Roar!', soundText: 'Roar!' },
  { name: 'Elefante', emoji: '🐘', sound: 'Pruuu!', soundText: 'Pruuu!' },
  { name: 'Sapo', emoji: '🐸', sound: 'Croac!', soundText: 'Croac!' },
  { name: 'Passarinho', emoji: '🐦', sound: 'Piu piu!', soundText: 'Piu piu!' },
  { name: 'Ovelha', emoji: '🐑', sound: 'Béé!', soundText: 'Béé!' },
  { name: 'Cavalo', emoji: '🐴', sound: 'Iiihh!', soundText: 'Iiihh!' },
];

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'Abelha', emoji: '🐝' },
  B: { word: 'Bola', emoji: '⚽' },
  C: { word: 'Casa', emoji: '🏠' },
  D: { word: 'Dado', emoji: '🎲' },
  E: { word: 'Estrela', emoji: '⭐' },
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

export const NUMBERS = Array.from({ length: 10 }, (_, i) => i);

export const NUMBER_ITEMS: Record<number, { word: string; emoji: string; count: number }> = {
  0: { word: 'Zero', emoji: '🫧', count: 0 },
  1: { word: 'Um', emoji: '⭐', count: 1 },
  2: { word: 'Dois', emoji: '🍎', count: 2 },
  3: { word: 'Três', emoji: '🌸', count: 3 },
  4: { word: 'Quatro', emoji: '🦋', count: 4 },
  5: { word: 'Cinco', emoji: '🐟', count: 5 },
  6: { word: 'Seis', emoji: '🌈', count: 6 },
  7: { word: 'Sete', emoji: '🎈', count: 7 },
  8: { word: 'Oito', emoji: '🐝', count: 8 },
  9: { word: 'Nove', emoji: '🌻', count: 9 },
};

// ===== KIDS (4-6 years) =====

export interface MathProblem {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
}

export const generateMathProblem = (maxNum: number = 10, allowSubtract: boolean = true): MathProblem => {
  const operator = allowSubtract && Math.random() > 0.5 ? '-' : '+';
  let a: number, b: number;
  if (operator === '+') {
    a = Math.floor(Math.random() * maxNum);
    b = Math.floor(Math.random() * (maxNum - a));
  } else {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * a);
  }
  return { a, b, operator, answer: operator === '+' ? a + b : a - b };
};

export const SYLLABLES = [
  'BA', 'BE', 'BI', 'BO', 'BU',
  'CA', 'CE', 'CI', 'CO', 'CU',
  'DA', 'DE', 'DI', 'DO', 'DU',
  'FA', 'FE', 'FI', 'FO', 'FU',
  'GA', 'GE', 'GI', 'GO', 'GU',
  'LA', 'LE', 'LI', 'LO', 'LU',
  'MA', 'ME', 'MI', 'MO', 'MU',
  'NA', 'NE', 'NI', 'NO', 'NU',
  'PA', 'PE', 'PI', 'PO', 'PU',
  'RA', 'RE', 'RI', 'RO', 'RU',
  'SA', 'SE', 'SI', 'SO', 'SU',
  'TA', 'TE', 'TI', 'TO', 'TU',
  'VA', 'VE', 'VI', 'VO', 'VU',
];

export interface SyllableWord {
  word: string;
  syllables: string[];
  emoji: string;
}

export const SYLLABLE_WORDS: SyllableWord[] = [
  { word: 'BOLA', syllables: ['BO', 'LA'], emoji: '⚽' },
  { word: 'GATO', syllables: ['GA', 'TO'], emoji: '🐱' },
  { word: 'PATO', syllables: ['PA', 'TO'], emoji: '🦆' },
  { word: 'CASA', syllables: ['CA', 'SA'], emoji: '🏠' },
  { word: 'MALA', syllables: ['MA', 'LA'], emoji: '🧳' },
  { word: 'SAPO', syllables: ['SA', 'PO'], emoji: '🐸' },
  { word: 'VACA', syllables: ['VA', 'CA'], emoji: '🐮' },
  { word: 'RATO', syllables: ['RA', 'TO'], emoji: '🐭' },
  { word: 'FOCA', syllables: ['FO', 'CA'], emoji: '🦭' },
  { word: 'LUNA', syllables: ['LU', 'NA'], emoji: '🌙' },
  { word: 'DADO', syllables: ['DA', 'DO'], emoji: '🎲' },
  { word: 'FOGO', syllables: ['FO', 'GO'], emoji: '🔥' },
];

export interface PortugueseQuestion {
  question: string;
  image: string;
  options: string[];
  correct: number;
}

export const PORTUGUESE_QUESTIONS: PortugueseQuestion[] = [
  { question: 'Qual é a primeira letra de BOLA?', image: '⚽', options: ['A', 'B', 'C', 'D'], correct: 1 },
  { question: 'Qual é a primeira letra de GATO?', image: '🐱', options: ['F', 'G', 'H', 'I'], correct: 1 },
  { question: 'Quantas vogais tem a palavra CASA?', image: '🏠', options: ['1', '2', '3', '4'], correct: 1 },
  { question: 'Qual palavra começa com M?', image: '🤔', options: ['Bola', 'Gato', 'Macaco', 'Pato'], correct: 2 },
  { question: 'Complete: _OLA', image: '⚽', options: ['B', 'C', 'D', 'F'], correct: 0 },
  { question: 'Qual é a última letra de GATO?', image: '🐱', options: ['A', 'O', 'T', 'G'], correct: 1 },
  { question: 'Quantas letras tem SOL?', image: '☀️', options: ['2', '3', '4', '5'], correct: 1 },
  { question: 'Qual é uma vogal?', image: '📖', options: ['B', 'C', 'A', 'D'], correct: 2 },
];
