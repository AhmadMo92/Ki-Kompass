const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const INPUT_FILE = "attached_assets/Gesamtberufsliste_der_BA_1767108103342.xlsx";
const OUTPUT_FILE = "client/src/lib/all_occupations.json";

function getGroup(code) {
  // Code format: "B 12345-6789"
  // Extract the number part
  const match = code.match(/B (\d+)/);
  if (!match) return "Other";
  
  const num = match[1];
  const major = num.substring(0, 1);
  const sub = num.substring(0, 2);

  if (major === "1") return "Agriculture & Forestry";
  if (major === "2") return "Production & Manufacturing";
  if (major === "3") return "Construction & Architecture";
  
  if (sub === "43") return "IT & Digital";
  if (major === "4") return "Natural Sciences & Engineering";
  
  if (major === "5") return "Logistics, Safety & Traffic";
  
  if (major === "6") return "Sales, Marketing & Tourism";
  
  if (major === "7") return "Business, Admin & Law";
  
  if (sub.startsWith("81") || sub.startsWith("82") || sub.startsWith("83")) return "Health & Care";
  if (sub.startsWith("84")) return "Education & Social";
  if (major === "8") return "Health, Social & Education"; // Fallback
  
  if (major === "9") return "Arts, Culture & Media";
  
  return "Other";
}

try {
  const workbook = XLSX.readFile(INPUT_FILE);
  const sheet = workbook.Sheets["Gesamtberufsliste der BA"];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const occupations = rows.map(row => {
    const code = row["Codenummer"];
    const nameDe = row["Bezeichnung neutral kurz"];
    const id = row["DKZ-ID"] ? String(row["DKZ-ID"]) : String(Math.random());
    
    if (!code || !nameDe) return null;

    return {
      id: id,
      nameDe: nameDe,
      nameEn: nameDe, // Placeholder as we don't have English names in source
      group: getGroup(code),
      code: code
    };
  }).filter(item => item !== null);

  console.log(`Processed ${occupations.length} occupations.`);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(occupations, null, 2));
  console.log(`Written to ${OUTPUT_FILE}`);

} catch (error) {
  console.error("Error processing file:", error);
  process.exit(1);
}
