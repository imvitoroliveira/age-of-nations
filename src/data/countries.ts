import { Country, CountryId } from '@/types/game';

export const COUNTRIES: Record<CountryId, Country> = {
  usa: {
    id: 'usa',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    bonuses: {
      type: 'production',
      value: 10,
      description: '+10% velocidade de produção',
    },
    terrainType: 'grass',
    description: 'Planícies e rios largos. Especialistas em produção eficiente.',
  },
  germany: {
    id: 'germany',
    name: 'Alemanha',
    flag: '🇩🇪',
    bonuses: {
      type: 'defense',
      value: 15,
      description: '+15% defesa de construções',
    },
    terrainType: 'forest',
    description: 'Florestas e planícies. Mestres em fortificações defensivas.',
  },
  japan: {
    id: 'japan',
    name: 'Japão',
    flag: '🇯🇵',
    bonuses: {
      type: 'mobility',
      value: 10,
      description: '+10% velocidade de unidades',
    },
    terrainType: 'mountain',
    description: 'Montanhas e ilhas. Guerreiros ágeis e disciplinados.',
  },
  france: {
    id: 'france',
    name: 'França',
    flag: '🇫🇷',
    bonuses: {
      type: 'production',
      value: 15,
      description: '+15% produção de comida',
    },
    terrainType: 'grass',
    description: 'Campos férteis e rios. Agricultura avançada.',
  },
  uk: {
    id: 'uk',
    name: 'Reino Unido',
    flag: '🇬🇧',
    bonuses: {
      type: 'defense',
      value: 10,
      description: '+10% alcance de arqueiros',
    },
    terrainType: 'grass',
    description: 'Ilhas, colinas e litoral. Arqueiros de elite.',
  },
  italy: {
    id: 'italy',
    name: 'Itália',
    flag: '🇮🇹',
    bonuses: {
      type: 'production',
      value: 10,
      description: '+10% velocidade de construção',
    },
    terrainType: 'grass',
    description: 'Colinas e regiões costeiras. Arquitetos habilidosos.',
  },
  canada: {
    id: 'canada',
    name: 'Canadá',
    flag: '🇨🇦',
    bonuses: {
      type: 'production',
      value: 20,
      description: '+20% produção de madeira',
    },
    terrainType: 'snow',
    description: 'Florestas densas e neve. Mestres lenhadores.',
  },
  brazil: {
    id: 'brazil',
    name: 'Brasil',
    flag: '🇧🇷',
    bonuses: {
      type: 'population',
      value: 10,
      description: '+10% limite populacional',
    },
    terrainType: 'forest',
    description: 'Florestas densas, selva e rios. Grande potencial demográfico.',
  },
  russia: {
    id: 'russia',
    name: 'Rússia',
    flag: '🇷🇺',
    bonuses: {
      type: 'defense',
      value: 20,
      description: '+20% resistência ao frio',
    },
    terrainType: 'snow',
    description: 'Vasto território frio e nevado. Resistência inabalável.',
  },
  india: {
    id: 'india',
    name: 'Índia',
    flag: '🇮🇳',
    bonuses: {
      type: 'population',
      value: 15,
      description: '+15% crescimento populacional',
    },
    terrainType: 'sand',
    description: 'Planícies quentes e rios férteis. Civilização populosa.',
  },
  china: {
    id: 'china',
    name: 'China',
    flag: '🇨🇳',
    bonuses: {
      type: 'production',
      value: 10,
      description: '+10% eficiência de aldeões',
    },
    terrainType: 'grass',
    description: 'Grandes planícies e montanhas. Mão de obra eficiente.',
  },
  southAfrica: {
    id: 'southAfrica',
    name: 'África do Sul',
    flag: '🇿🇦',
    bonuses: {
      type: 'production',
      value: 25,
      description: '+25% produção de ouro',
    },
    terrainType: 'sand',
    description: 'Savanas, planaltos e desertos. Riquezas minerais abundantes.',
  },
};

export const getCountryById = (id: CountryId): Country => COUNTRIES[id];

export const getAllCountries = (): Country[] => Object.values(COUNTRIES);
