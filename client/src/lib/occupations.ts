import occupationsData from "./occupations_data.json";

export interface Occupation {
  id: string;
  nameDe: string;
  nameEn: string;
  group: string; // We map groupCode to a string name dynamically or just use the code for now
  code?: string;
  groupCode?: string;
}

export interface Competency {
  id: string;
  code: string;
  nameDe: string;
  nameEn: string;
}

// Map the raw data to the interface
export const occupations: Occupation[] = occupationsData.occupations.map((o: any) => ({
  id: o.id,
  nameDe: o.nameDe,
  nameEn: o.nameEn || o.nameDe, // Fallback if missing
  code: o.code,
  groupCode: o.groupCode,
  group: mapGroupCodeToName(o.groupCode)
}));

export const competencies: Competency[] = occupationsData.competencies.map((c: any) => ({
  id: c.id,
  code: c.code,
  nameDe: c.nameDe,
  nameEn: c.nameEn || c.nameDe
}));

// Helper to map 4-digit codes to broad categories for the UI
function mapGroupCodeToName(code?: string): string {
  if (!code) return "Other";
  const prefix = code.substring(0, 1);
  switch (prefix) {
    case "1": return "Agriculture & Production";
    case "2": return "Technical & Engineering";
    case "3": return "Construction & Crafts";
    case "4": return "Science & IT";
    case "5": return "Traffic & Logistics";
    case "6": return "Service & Security";
    case "7": return "Commercial & Admin";
    case "8": return "Health, Education & Social";
    case "9": return "Language, Art & Culture";
    default: return "General";
  }
}

