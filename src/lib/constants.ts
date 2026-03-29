export const COLORS = {
  black: '#080808',
  warmLight: '#fff8e7',
  textLight: '#f0ece4',
  white: '#ffffff',
};

/** Per-room accent colors */
export const ROOM_ACCENTS: Record<string, string> = {
  eiffel: '#b8c8d4',    // Steel blue
  institut: '#d4b483',   // Pale gold
  opera: '#e8d5c4',      // Rose ivory
  grandPalais: '#c9a35a', // Amber
  louvre: '#ffffff',      // Pure white
};

export interface MonumentDef {
  id: string;
  label: string;
  buildingName: string;
  /** Position as % of viewport */
  pos: { x: number; y: number };
  approachDuration: number;
  spaceTitle: string;
  spaceSurtitle: string;
  spaceSubtitle: string;
  spaceBody: string;
  spaceTotem: string;
  spaceConnector: string;
  accentColor: string;
  spaceExtra?: string;
  spaceCategories?: string[];
  spaceEmail?: string;
  spaceFooter?: string[];
}

export const MONUMENTS: Record<string, MonumentDef> = {
  eiffel: {
    id: 'eiffel',
    label: 'La Lumière',
    buildingName: 'Tour Eiffel',
    pos: { x: 34, y: 45 },
    approachDuration: 5,
    spaceTitle: 'LA LUMIÈRE',
    spaceSurtitle: 'V',
    spaceSubtitle: 'Le Jury',
    spaceTotem: 'LUMIÈRE',
    spaceConnector: 'CONSTELLATION',
    accentColor: '#b8c8d4',
    spaceBody: "Le jury présenté comme une constellation — membres positionnés comme des étoiles, reliés par de fines lignes.\n\nLe Président du Jury au centre, légèrement agrandi.",
  },
  institut: {
    id: 'institut',
    label: "L'Institution",
    buildingName: 'Institut de France',
    pos: { x: 19, y: 49 },
    approachDuration: 5,
    spaceTitle: "L'INSTITUTION",
    spaceSurtitle: 'II',
    spaceSubtitle: 'Histoire',
    spaceTotem: 'TEMPS',
    spaceConnector: 'CHRONOLOGIE',
    accentColor: '#d4b483',
    spaceBody: "Une chronologie verticale — l'histoire du Prix de 2021 à aujourd'hui.\n\nChaque édition : son année en grand, son moment clé, son jury.",
  },
  opera: {
    id: 'opera',
    label: 'La Scène',
    buildingName: 'Opéra Garnier',
    pos: { x: 44, y: 41 },
    approachDuration: 5.5,
    spaceTitle: 'LA SCÈNE',
    spaceSurtitle: 'III',
    spaceSubtitle: 'Archives',
    spaceTotem: 'SILLAGE',
    spaceConnector: 'ARCHIVES VISUELLES',
    accentColor: '#e8d5c4',
    spaceBody: "Les 5 éditions précédentes présentées comme des loges d'opéra — rectangles verticaux légèrement inclinés en perspective CSS 3D.",
  },
  grandPalais: {
    id: 'grandPalais',
    label: "L'Empreinte",
    buildingName: 'Grand Palais',
    pos: { x: 83, y: 42 },
    approachDuration: 5,
    spaceTitle: "L'EMPREINTE",
    spaceSurtitle: 'IV',
    spaceSubtitle: 'Héritage',
    spaceTotem: 'MÉMOIRE',
    spaceConnector: 'AD VITAM',
    accentColor: '#c9a35a',
    spaceBody: "La salle la plus « galerie » — alternance pleine largeur d'images N&B et blocs de texte éditorial.\n\nCitations de lauréats en italique, légèrement décalées à droite.",
    spaceEmail: 'bureau@prixdesarts.org',
  },
  louvre: {
    id: 'louvre',
    label: 'La Consécration',
    buildingName: 'Pyramide du Louvre',
    pos: { x: 57, y: 68 },
    approachDuration: 6,
    spaceTitle: 'LA CONSÉCRATION',
    spaceSurtitle: 'I',
    spaceSubtitle: 'Lauréats',
    spaceTotem: 'SACRE',
    spaceConnector: 'TRIPTYQUE',
    accentColor: '#ffffff',
    spaceBody: "Triptyque horizontal de profils lauréats : émergent / confirmé / institution.\n\nChaque panneau défile horizontalement. Nom du lauréat en très grand Cormorant Garamond 300.",
    spaceFooter: ['Paris — Novembre 2026'],
  },
};

export const MONUMENT_ORDER = ['eiffel', 'institut', 'opera', 'grandPalais', 'louvre'];

/** City light points for the illumination sequence */
export const CITY_LIGHTS = [
  { x: 12, y: 62, delay: 0 },
  { x: 18, y: 58, delay: 100 },
  { x: 22, y: 65, delay: 200 },
  { x: 28, y: 55, delay: 300 },
  { x: 33, y: 60, delay: 400 },
  { x: 38, y: 52, delay: 500 },
  { x: 42, y: 63, delay: 600 },
  { x: 47, y: 48, delay: 700 },
  { x: 52, y: 57, delay: 800 },
  { x: 55, y: 70, delay: 900 },
  { x: 60, y: 54, delay: 1000 },
  { x: 64, y: 61, delay: 1100 },
  { x: 68, y: 50, delay: 1200 },
  { x: 72, y: 58, delay: 1300 },
  { x: 76, y: 63, delay: 1400 },
  { x: 80, y: 47, delay: 1500 },
  { x: 84, y: 55, delay: 1600 },
  { x: 88, y: 60, delay: 1700 },
  { x: 91, y: 52, delay: 1800 },
  { x: 95, y: 58, delay: 1900 },
];
