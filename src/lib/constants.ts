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
    label: 'La lumière',
    buildingName: 'Tour Eiffel',
    pos: { x: 34, y: 45 },
    approachDuration: 5,
    spaceTitle: 'Tour Eiffel',
    spaceSurtitle: 'Salon I — Tour Eiffel — La lumière',
    spaceSubtitle: 'Le Jury',
    spaceTotem: 'LUMIÈRE',
    spaceConnector: 'CONSTELLATION',
    accentColor: '#b8c8d4',
    spaceBody: "Le jury présenté comme une constellation — membres positionnés comme des étoiles, reliés par de fines lignes.\n\nLe Président du Jury au centre, légèrement agrandi.",
  },
  institut: {
    id: 'institut',
    label: 'La connaissance',
    buildingName: 'Institut de France',
    pos: { x: 19, y: 49 },
    approachDuration: 5,
    spaceTitle: 'Institut de France',
    spaceSurtitle: 'Salon II — Institut de France — La connaissance',
    spaceSubtitle: 'Histoire',
    spaceTotem: 'TEMPS',
    spaceConnector: 'CHRONOLOGIE',
    accentColor: '#d4b483',
    spaceBody: "L'histoire du Prix, édition après édition, inscrite dans la pierre des Académies.",
  },
  opera: {
    id: 'opera',
    label: "L'expression",
    buildingName: 'Opéra Garnier',
    pos: { x: 44, y: 41 },
    approachDuration: 5.5,
    spaceTitle: 'Opéra Garnier',
    spaceSurtitle: "Salon III — Opéra Garnier — L'expression",
    spaceSubtitle: 'Archives',
    spaceTotem: 'SILLAGE',
    spaceConnector: 'ARCHIVES VISUELLES',
    accentColor: '#e8d5c4',
    spaceBody: "Cinq éditions. Cinq moments où l'art a basculé dans l'éternité.",
  },
  grandPalais: {
    id: 'grandPalais',
    label: 'La projection',
    buildingName: 'Grand Palais',
    pos: { x: 83, y: 42 },
    approachDuration: 5,
    spaceTitle: 'Grand Palais',
    spaceSurtitle: 'Salon IV — Grand Palais — La projection',
    spaceSubtitle: 'Héritage',
    spaceTotem: 'MÉMOIRE',
    spaceConnector: 'AD VITAM',
    accentColor: '#c9a35a',
    spaceBody: "Depuis 2021, le Prix des Arts et de la Culture réunit sous la grande nef les œuvres qui traverseront les siècles.",
    spaceEmail: 'bureau@prixdesarts.org',
  },
  louvre: {
    id: 'louvre',
    label: "l'héritage",
    buildingName: 'Pyramide du Louvre',
    pos: { x: 57, y: 68 },
    approachDuration: 6,
    spaceTitle: 'Pyramide du Louvre',
    spaceSurtitle: "Salon V — Louvre — l'héritage",
    spaceSubtitle: 'Lauréats',
    spaceTotem: 'SACRE',
    spaceConnector: 'TRIPTYQUE',
    accentColor: '#ffffff',
    spaceBody: "Triptyque horizontal de profils lauréats : émergent / confirmé / institution.",
    spaceFooter: ['Paris — Novembre 2026'],
  },
};

export const MONUMENT_ORDER = ['eiffel', 'institut', 'opera', 'grandPalais', 'louvre'];

/** City light points for the illumination sequence */
export const CITY_LIGHTS = [
  { x: 3, y: 59, delay: 0 },
  { x: 7.5, y: 66, delay: 100 },
  { x: 14.5, y: 56, delay: 200 },
  { x: 20.5, y: 61, delay: 300 },
  { x: 26.5, y: 53, delay: 400 },
  { x: 31.5, y: 64, delay: 500 },
  { x: 37.5, y: 49, delay: 600 },
  { x: 43, y: 55, delay: 700 },
  { x: 53, y: 55, delay: 800 },
  { x: 58, y: 62, delay: 900 },
  { x: 63, y: 51, delay: 1000 },
  { x: 67.5, y: 59, delay: 1100 },
  { x: 72, y: 64, delay: 1200 },
  { x: 77, y: 48, delay: 1300 },
  { x: 81.5, y: 56, delay: 1400 },
  { x: 86, y: 61, delay: 1500 },
  { x: 90, y: 53, delay: 1600 },
  { x: 94.5, y: 59, delay: 1700 },
];
