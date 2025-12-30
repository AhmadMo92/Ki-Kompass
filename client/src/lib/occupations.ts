import allOccupations from "./all_occupations.json";

export interface Occupation {
  id: string;
  nameDe: string;
  nameEn: string;
  group: string;
  code?: string;
}

// Ensure the imported data matches the interface, or cast it if necessary
export const occupations: Occupation[] = allOccupations as Occupation[];

