const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'attached_assets', 'scored_tasks_v1_3_(1)_1772561866844.csv');
const outputPath = path.join(__dirname, '..', 'client', 'src', 'lib', 'data', 'occupations.json');

const raw = fs.readFileSync(csvPath, 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());
const headerLine = lines[0];

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

const headers = parseCSVLine(headerLine);
const colIndex = {};
headers.forEach((h, i) => colIndex[h.trim()] = i);

const occupations = {};

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length < 10) continue;

  const occupation = cols[colIndex['occupation']];
  const occupation_de = cols[colIndex['occupation_de']];
  const sector = cols[colIndex['sector']];
  const kldb2010 = cols[colIndex['kldb2010']];
  const task_id = cols[colIndex['task_id']];
  const paraphrase_de = cols[colIndex['paraphrase_de']];
  const paraphrase_en = cols[colIndex['paraphrase_en']];
  const label_5cat = cols[colIndex['label_5cat']];
  const score_sum = parseInt(cols[colIndex['score_sum']] || '0', 10);
  const is_regulated = cols[colIndex['is_regulated']] === 'True';
  const confidence = parseFloat(cols[colIndex['confidence']] || '0');

  if (!occupation || !label_5cat) continue;

  const INTERPERSONAL_PATTERNS = [
    /\blead\b(?!.*\b(?:to|into)\b)/i,
    /\bleading\b/i,
    /\btrain\b.*\b(?:employee|staff|team|personnel|colleague|worker)\b/i,
    /\bmentor/i,
    /\bcoach(?:ing)?\b/i,
    /\bnegotiat/i,
    /\bmediat/i,
    /\bmotivat/i,
    /\bsupervis/i,
    /\bcounsel\b/i,
    /\bmanage\b.*\b(?:team|staff|employee|personnel)\b/i,
    /\b(?:resolve|handle)\b.*\bconflict/i,
    /\bconduct\b.*\b(?:interview|meeting|workshop|seminar|training)\b/i,
    /\bwork with\b/i,
    /\bcollaborat/i,
    /\bcooperat/i,
    /\bcoordinat.*\bwith\b/i,
    /\bconsult.*\bwith\b/i,
    /\bliaise\b/i,
    /\badvise\b/i,
    /\badvis(?:ing|ory)\b/i,
    /\badvice\b/i,
    /\binstruct\b/i,
    /\bteach/i,
    /\beducat(?:e|ing)\b/i,
    /\bpresent\b.*\b(?:to|for|result|finding|client|customer|management|stakeholder)\b/i,
    /\bexplain\b.*\b(?:to|client|customer|patient)\b/i,
    /\binform\b.*\b(?:client|customer|patient|staff|employee|team|management|supervis|stakeholder|partner|member)\b/i,
    /\bdiscuss\b/i,
    /\bcommunicat/i,
    /\bguide\b.*\b(?:client|customer|patient|student|visitor|group|participant|team)\b/i,
    /\bassist\b.*\b(?:client|customer|patient|student|child|resident)\b/i,
    /\brecruit/i,
    /\bhir(?:e|ing)\b/i,
    /\binterview\b/i,
    /\bdelegate\b/i,
    /\bassign\b.*\b(?:task|work|dut)/i,
    /\brepresent\b.*\b(?:company|firm|organization|institution|facility|community|department|kindergarten)\b/i,
    /\bacquir.*\bcustomer/i,
    /\bconvince\b/i,
  ];
  const taskTextEn = paraphrase_en || cols[colIndex['task_text']] || '';
  const effectiveLabel = (label_5cat === 'ai_assisted' && INTERPERSONAL_PATTERNS.some(p => p.test(taskTextEn)))
    ? 'stays_with_you'
    : label_5cat;

  if (!occupations[occupation]) {
    occupations[occupation] = {
      occupation_de: occupation_de,
      sector: sector,
      kldb2010: kldb2010,
      tasks: [],
      summary: {
        total: 0,
        automatable: 0,
        high_ai_potential: 0,
        sensitive: 0,
        ai_assisted: 0,
        stays_with_you: 0
      }
    };
  }

  const occ = occupations[occupation];
  occ.tasks.push({
    id: task_id,
    text_de: paraphrase_de,
    text_en: paraphrase_en,
    label: effectiveLabel,
    score: score_sum,
    is_regulated: is_regulated
  });

  occ.summary.total++;
  if (occ.summary[effectiveLabel] !== undefined) {
    occ.summary[effectiveLabel]++;
  }
}

for (const key of Object.keys(occupations)) {
  occupations[key].tasks.sort((a, b) => {
    const order = { automatable: 0, high_ai_potential: 1, sensitive: 2, ai_assisted: 3, stays_with_you: 4 };
    const orderDiff = (order[a.label] || 5) - (order[b.label] || 5);
    if (orderDiff !== 0) return orderDiff;
    return b.score - a.score;
  });
}

fs.writeFileSync(outputPath, JSON.stringify(occupations, null, 2), 'utf-8');

const occCount = Object.keys(occupations).length;
let taskCount = 0;
for (const occ of Object.values(occupations)) {
  taskCount += occ.tasks.length;
}

console.log(`Generated occupations.json: ${occCount} occupations, ${taskCount} tasks`);

const dist = { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, stays_with_you: 0 };
for (const occ of Object.values(occupations)) {
  for (const cat of Object.keys(dist)) {
    dist[cat] += occ.summary[cat];
  }
}
console.log('Distribution:', dist);
const total = Object.values(dist).reduce((a, b) => a + b, 0);
for (const cat of Object.keys(dist)) {
  console.log(`  ${cat}: ${((dist[cat] / total) * 100).toFixed(1)}%`);
}
