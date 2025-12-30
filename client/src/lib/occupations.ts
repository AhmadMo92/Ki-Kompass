export interface Occupation {
  id: string;
  nameDe: string;
  nameEn: string;
  group: string;
}

export const occupations: Occupation[] = [
  // Agriculture & Forestry (K 00)
  { id: "60101", nameDe: "Blumenversand", nameEn: "Flower Shipping", group: "Agriculture & Forestry" },
  { id: "60104", nameDe: "Hochzeitsfloristik", nameEn: "Wedding Floristry", group: "Agriculture & Forestry" },
  { id: "60117", nameDe: "Forstwirtschaft", nameEn: "Forestry Management", group: "Agriculture & Forestry" },
  { id: "60120", nameDe: "Holzfällen", nameEn: "Logging / Tree Felling", group: "Agriculture & Forestry" },
  { id: "60143", nameDe: "Garten-, Grünflächenpflege", nameEn: "Garden & Green Space Maintenance", group: "Agriculture & Forestry" },
  { id: "60155", nameDe: "Produktionsgartenbau", nameEn: "Production Horticulture", group: "Agriculture & Forestry" },
  { id: "138126", nameDe: "Präzisionslandwirtschaft", nameEn: "Precision Agriculture", group: "Agriculture & Forestry" },

  // IT & Informatics (K 0711)
  { id: "63967", nameDe: "Angewandte Informatik", nameEn: "Applied Computer Science", group: "IT & Digital" },
  { id: "63972", nameDe: "Medizinische Informatik", nameEn: "Medical Informatics", group: "IT & Digital" },
  { id: "63974", nameDe: "Technische Informatik", nameEn: "Technical Computer Science", group: "IT & Digital" },
  { id: "137383", nameDe: "Informatik", nameEn: "Computer Science (General)", group: "IT & Digital" },
  { id: "DEV-001", nameDe: "Softwareentwickler", nameEn: "Software Developer", group: "IT & Digital" }, // Inferred
  { id: "DATA-001", nameDe: "Datenanalyst", nameEn: "Data Analyst", group: "IT & Digital" }, // Inferred

  // Health & Care (K 09 / K 011)
  { id: "64328", nameDe: "Pflegehilfe (Alten-, Kranken-, Behindertenpflege)", nameEn: "Nursing Assistance", group: "Health & Care" },
  { id: "64331", nameDe: "Ambulante/mobile Pflege", nameEn: "Ambulatory/Mobile Care", group: "Health & Care" },
  { id: "64583", nameDe: "Pflegemanagement", nameEn: "Care Management", group: "Health & Care" },
  { id: "130805", nameDe: "Pflegedokumentation", nameEn: "Care Documentation", group: "Health & Care" },
  { id: "64627", nameDe: "Anästhesie (Pflege, Assistenz)", nameEn: "Anesthesia Care", group: "Health & Care" },
  { id: "64641", nameDe: "Geriatrie, Gerontologie (Pflege)", nameEn: "Geriatric Care", group: "Health & Care" },
  { id: "64652", nameDe: "Intensivmedizin (Pflege)", nameEn: "Intensive Care Nursing", group: "Health & Care" },
  { id: "134873", nameDe: "Digitale Pflegeanwendungen", nameEn: "Digital Care Applications", group: "Health & Care" },

  // Sales & Marketing (K 030203)
  { id: "62278", nameDe: "Verkauf", nameEn: "Sales (General)", group: "Sales & Marketing" },
  { id: "62279", nameDe: "Verkaufsförderung", nameEn: "Sales Promotion", group: "Sales & Marketing" },
  { id: "62280", nameDe: "Verkaufsgespräch", nameEn: "Sales Communication", group: "Sales & Marketing" },
  { id: "62281", nameDe: "Verkaufsschulung, -training", nameEn: "Sales Training", group: "Sales & Marketing" },
  { id: "133082", nameDe: "Interaktive Verkaufsassistenten", nameEn: "Interactive Sales Assistance", group: "Sales & Marketing" },

  // Mechatronics & Technical (K 011)
  { id: "61650", nameDe: "Mechatronik", nameEn: "Mechatronics", group: "Engineering & Technical" },
  { id: "61220", nameDe: "Fahrzeugsysteme-Mechatronik", nameEn: "Automotive Mechatronics", group: "Engineering & Technical" },
  { id: "61655", nameDe: "Produktions-Mechatronik", nameEn: "Production Mechatronics", group: "Engineering & Technical" },

  // Education (K 0901)
  { id: "64432", nameDe: "Pflege-, Medizinpädagogik", nameEn: "Medical/Care Pedagogy", group: "Education" },
  { id: "64416", nameDe: "Praxisanleitung", nameEn: "Practical Training Supervision", group: "Education" },
  { id: "EDU-001", nameDe: "Lehrer (Allgemeinbildend)", nameEn: "Teacher (General Education)", group: "Education" }
];
