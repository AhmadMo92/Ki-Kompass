const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '..', 'attached_assets', 'tasks_for_replit_1772870922238.csv');
const summaryPath = path.join(__dirname, '..', 'attached_assets', 'occupations_summary_1772870916961.csv');
const skillsVocabPath = path.join(__dirname, '..', 'attached_assets', 'skills_vocabulary_v0_(1)_1772870913053.csv');
const taskSkillLinksPath = path.join(__dirname, '..', 'attached_assets', 'task_skill_links_production_1772870970135.csv');

const occupationsOutputPath = path.join(__dirname, '..', 'client', 'src', 'lib', 'data', 'occupations.json');
const skillsOutputPath = path.join(__dirname, '..', 'client', 'src', 'lib', 'data', 'skills.json');

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

function readCSV(filepath) {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const lines = raw.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  const ci = {};
  headers.forEach((h, i) => ci[h.trim()] = i);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;
    const row = {};
    for (const [name, idx] of Object.entries(ci)) {
      row[name] = cols[idx] || '';
    }
    rows.push(row);
  }
  return rows;
}

const tasks = readCSV(tasksPath);
const summaryRows = readCSV(summaryPath);
const skillsVocab = readCSV(skillsVocabPath);
const taskSkillLinks = readCSV(taskSkillLinksPath);

const taskSkillMap = {};
for (const link of taskSkillLinks) {
  const tid = link.task_id;
  if (!taskSkillMap[tid]) taskSkillMap[tid] = [];
  taskSkillMap[tid].push({
    skill_id: link.skill_id,
    relevance: parseFloat(link.relevance) || 0,
    rank: parseInt(link.rank) || 0,
  });
}
for (const tid of Object.keys(taskSkillMap)) {
  taskSkillMap[tid].sort((a, b) => a.rank - b.rank);
}

const summaryMap = {};
for (const row of summaryRows) {
  summaryMap[row.occupation] = {
    occupation_de: row.occupation_de,
    sector: row.sector,
    berufenet_id: row.berufenet_id,
    n_tasks: parseInt(row.n_tasks) || 0,
    stays_with_you: parseInt(row.stays_with_you) || 0,
    ai_assisted: parseInt(row.ai_assisted) || 0,
    high_ai_potential: parseInt(row.high_ai_potential) || 0,
    sensitive: parseInt(row.sensitive) || 0,
    automatable: parseInt(row.automatable) || 0,
  };
}

const occupations = {};

for (const task of tasks) {
  const occupation = task.occupation;
  const label = task.label_5cat;
  if (!occupation || !label) continue;

  const score_sum = (parseInt(task.SPEC)||0) + (parseInt(task.VERIF)||0) + (parseInt(task.STD)||0);

  if (!occupations[occupation]) {
    const sum = summaryMap[occupation];
    occupations[occupation] = {
      occupation_de: task.occupation_de,
      sector: task.sector,
      tasks: [],
      summary: sum ? {
        total: sum.n_tasks,
        automatable: sum.automatable,
        high_ai_potential: sum.high_ai_potential,
        sensitive: sum.sensitive,
        ai_assisted: sum.ai_assisted,
        stays_with_you: sum.stays_with_you,
      } : {
        total: 0,
        automatable: 0,
        high_ai_potential: 0,
        sensitive: 0,
        ai_assisted: 0,
        stays_with_you: 0,
      }
    };
  }

  const skills = (taskSkillMap[task.task_id] || []).map(s => s.skill_id);

  occupations[occupation].tasks.push({
    id: task.task_id,
    text_de: task.paraphrase_de,
    text_en: task.task_text,
    label: label,
    score: score_sum,
    skills: skills,
  });
}

for (const key of Object.keys(occupations)) {
  occupations[key].tasks.sort((a, b) => {
    const order = { automatable: 0, high_ai_potential: 1, sensitive: 2, ai_assisted: 3, stays_with_you: 4 };
    const orderDiff = (order[a.label] || 5) - (order[b.label] || 5);
    if (orderDiff !== 0) return orderDiff;
    return b.score - a.score;
  });
}

fs.writeFileSync(occupationsOutputPath, JSON.stringify(occupations, null, 2), 'utf-8');

const skillsData = {};
for (const skill of skillsVocab) {
  skillsData[skill.skill_id] = {
    name_en: skill.skill_name_en,
    name_de: skill.skill_name_de,
    definition_en: skill.definition_en,
    definition_de: skill.definition_de,
    category: skill.skill_category,
  };
}

fs.writeFileSync(skillsOutputPath, JSON.stringify(skillsData, null, 2), 'utf-8');

const occCount = Object.keys(occupations).length;
let taskCount = 0;
for (const occ of Object.values(occupations)) {
  taskCount += occ.tasks.length;
}

console.log(`Generated occupations.json: ${occCount} occupations, ${taskCount} tasks`);
console.log(`Generated skills.json: ${Object.keys(skillsData).length} skills`);

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

let linkedTasks = 0;
let totalSkillLinks = 0;
for (const occ of Object.values(occupations)) {
  for (const t of occ.tasks) {
    if (t.skills.length > 0) linkedTasks++;
    totalSkillLinks += t.skills.length;
  }
}
console.log(`Skills: ${linkedTasks}/${taskCount} tasks linked, ${totalSkillLinks} total links`);
