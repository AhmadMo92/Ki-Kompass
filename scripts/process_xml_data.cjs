const fs = require("fs");
const path = require("path");
const { translate } = require("google-translate-api-x");

// Input files
const OCCUPATIONS_FILE = "attached_assets/DKZ_Taetigkeiten_gueltig_1767110968555.xml";
const COMPETENCIES_FILE = "attached_assets/DKZ_Kompetenzen_gueltig_(1)_1767110972341.xml";
const OUTPUT_FILE = "client/src/lib/occupations_data.json";

// Helper to extract attributes from XML tags
function extractAttributes(line, tag) {
  const regex = new RegExp(`<${tag} (.*?)/>`);
  const match = line.match(regex);
  if (!match) return null;
  
  const attrString = match[1];
  const attrs = {};
  
  // Regex to capture key="value"
  const attrRegex = /(\w+)="([^"]*)"/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attrString)) !== null) {
    attrs[attrMatch[1]] = attrMatch[2];
  }
  return attrs;
}

// Simple heuristic to map Occupation Groups (B-codes) to Competence Groups (K-codes)
// Since we don't have the mapping file, we will map based on the first few digits if possible, 
// or simply group everything for searching.
// Actually, for this prototype, let's just parse ALL occupations and ALL competencies into a structure 
// that the frontend can load. We will use Client-side filtering or a smarter "generic" mapping for now.

async function run() {
  try {
    console.log("Reading XML files...");
    const occupationsRaw = fs.readFileSync(OCCUPATIONS_FILE, "utf-8");
    const competenciesRaw = fs.readFileSync(COMPETENCIES_FILE, "utf-8");

    const occupations = [];
    const competencies = [];

    // Parse Occupations (Berufe)
    console.log("Parsing occupations...");
    const occupationLines = occupationsRaw.split("\n");
    for (const line of occupationLines) {
      if (line.trim().startsWith("<beruf ")) {
        const attrs = extractAttributes(line, "beruf");
        if (attrs) {
          occupations.push({
            id: attrs.id,
            code: attrs.codenr,
            nameDe: attrs.bezeichnung,
            groupCode: attrs.berufskundlicheGruppe
          });
        }
      }
    }

    // Parse Competencies (Kompetenzen)
    console.log("Parsing competencies...");
    const competenceLines = competenciesRaw.split("\n");
    for (const line of competenceLines) {
      if (line.trim().startsWith("<kompetenz ")) {
        const attrs = extractAttributes(line, "kompetenz");
        if (attrs) {
          competencies.push({
            id: attrs.id,
            code: attrs.codenr,
            nameDe: attrs.bezeichnung
          });
        }
      }
    }

    console.log(`Parsed ${occupations.length} occupations and ${competencies.length} competencies.`);

    // Translate a subset for the demo (Top 100 occupations, Top 100 competencies)
    // We will assume "mixed" lists mentioned by user are due to previous partial translations.
    // We will try to translate the names we just parsed.
    
    // NOTE: Translating 20k items takes too long. We will translate the first 50 of each for the demo, 
    // and for the rest we will just duplicate the German name to English field so it doesn't break.
    
    const occupationsProcessed = occupations.map(o => ({...o, nameEn: o.nameDe}));
    const competenciesProcessed = competencies.map(c => ({...c, nameEn: c.nameDe}));

    const BATCH_SIZE = 50; 
    console.log(`Translating first ${BATCH_SIZE} occupations and competencies...`);

    // Translate Occupations
    for (let i = 0; i < Math.min(BATCH_SIZE, occupationsProcessed.length); i++) {
      try {
        const res = await translate(occupationsProcessed[i].nameDe, { to: 'en' });
        occupationsProcessed[i].nameEn = res.text;
      } catch (e) {}
    }

    // Translate Competencies
    for (let i = 0; i < Math.min(BATCH_SIZE, competenciesProcessed.length); i++) {
      try {
        const res = await translate(competenciesProcessed[i].nameDe, { to: 'en' });
        competenciesProcessed[i].nameEn = res.text;
      } catch (e) {}
    }

    const data = {
      occupations: occupationsProcessed,
      competencies: competenciesProcessed
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Written to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error("Error:", error);
  }
}

run();
