import allOccupationsRaw from "./all_occupations.json";
import occupationsData from "./occupations_data.json";

export interface Occupation {
  id: string;
  nameDe: string;
  nameEn: string;
  group: string;
  code?: string;
  groupCode?: string;
}

export interface Competency {
  id: string;
  code: string;
  nameDe: string;
  nameEn: string;
}

// Use the full 19k list which already has translations
export const occupations: Occupation[] = (allOccupationsRaw as any[]).map(o => ({
  id: o.id,
  nameDe: o.nameDe,
  nameEn: o.nameEn || o.nameDe,
  group: o.group || "General",
  code: o.code
}));

// Use the parsed competencies from the XML
export const competencies: Competency[] = occupationsData.competencies.map((c: any) => ({
  id: c.id,
  code: c.code,
  nameDe: c.nameDe,
  nameEn: c.nameEn || c.nameDe
}));

