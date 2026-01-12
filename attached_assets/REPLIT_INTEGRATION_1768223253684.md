# Replit Integration Guide

## Files to Upload

Upload these files to your Replit project's `data/` folder:

| File | Size | Purpose |
|------|------|---------|
| `jobs.json` | ~250KB | Main job data (2,027 jobs) |
| `sectors.json` | ~1KB | Sector averages |
| `search_index.json` | ~150KB | Autocomplete search |

---

## Data Structure

### jobs.json
```json
[
  {
    "id": "B 43104-100",
    "de": "Data Scientist",
    "en": "Data Scientist",
    "sector": "IT & Science",
    "human": 21.5,
    "ai": 78.5,
    "auto": 0.0,
    "dominant": "AI-Augmentable"
  },
  ...
]
```

### sectors.json
```json
[
  {
    "sector_name": "IT & Science",
    "avg_human": 53.3,
    "avg_ai": 45.8,
    "job_count": 301
  },
  ...
]
```

---

## JavaScript Integration

### 1. Load Data
```javascript
// Load job data
const jobs = await fetch('/data/jobs.json').then(r => r.json());
const sectors = await fetch('/data/sectors.json').then(r => r.json());

console.log(`Loaded ${jobs.length} jobs`);
```

### 2. Search Function
```javascript
function searchJobs(query, language = 'en') {
  const q = query.toLowerCase();
  return jobs.filter(job => {
    const title = language === 'de' ? job.de : job.en;
    return title.toLowerCase().includes(q);
  }).slice(0, 10); // Top 10 results
}

// Usage
const results = searchJobs('data scientist');
// Returns: [{ id, de, en, sector, human, ai, auto, dominant }]
```

### 3. Get Job Profile
```javascript
function getJobProfile(jobId) {
  return jobs.find(job => job.id === jobId);
}

// Usage
const profile = getJobProfile('B 43104-100');
// Returns: { id, de, en, sector, human: 21.5, ai: 78.5, ... }
```

### 4. Display Profile (React Example)
```jsx
function JobProfile({ job }) {
  return (
    <div className="job-profile">
      <h2>{job.en}</h2>
      <p className="sector">{job.sector}</p>
      
      <div className="exposure-bars">
        <div className="bar human" style={{ width: `${job.human}%` }}>
          Human-Centric: {job.human}%
        </div>
        <div className="bar ai" style={{ width: `${job.ai}%` }}>
          AI-Augmentable: {job.ai}%
        </div>
        {job.auto > 0 && (
          <div className="bar auto" style={{ width: `${job.auto}%` }}>
            High Automation: {job.auto}%
          </div>
        )}
      </div>
      
      <p className="dominant">
        Primarily: <strong>{job.dominant}</strong>
      </p>
    </div>
  );
}
```

### 5. Sector Overview
```javascript
function getSectorStats() {
  return sectors.map(s => ({
    name: s.sector_name,
    avgHuman: s.avg_human,
    avgAI: s.avg_ai,
    jobCount: s.job_count
  }));
}
```

---

## Category Definitions (for UI)

```javascript
const CATEGORIES = {
  'Human-Centric': {
    color: '#22c55e', // green
    description: 'Tasks requiring human presence, judgment, or interpersonal skills',
    icon: '👤'
  },
  'AI-Augmentable': {
    color: '#3b82f6', // blue  
    description: 'Tasks where AI tools can assist and enhance productivity',
    icon: '🤖'
  },
  'High Automation Exposure': {
    color: '#f59e0b', // orange
    description: 'Routine tasks with high potential for automation',
    icon: '⚙️'
  },
  'Mixed': {
    color: '#8b5cf6', // purple
    description: 'Varied task profile across categories',
    icon: '🔀'
  }
};
```

---

## Methodology Text (for About/Info page)

```
This tool analyzes AI exposure for 2,027 German white-collar occupations 
across five sectors: IT & Science, Sales & Tourism, Business & Administration, 
Health & Education, and Media & Arts.

Data Sources:
- German Federal Employment Agency (Bundesagentur für Arbeit) KldB 2010 
  classification system for job definitions and task descriptions
- O*NET (U.S. Department of Labor) for interpersonal skill requirements

Methodology:
Each occupation's tasks are analyzed across six dimensions (routine level, 
cognitive complexity, social interaction, physical execution, digital interface, 
and responsibility level) and classified into exposure categories using 
transparent, rule-based logic.

Categories:
- Human-Centric: Tasks requiring human presence, judgment, or interpersonal skills
- AI-Augmentable: Tasks where AI tools can assist and enhance productivity  
- High Automation Exposure: Routine digital tasks with high automation potential
```

---

## Quick Start Checklist

- [ ] Upload `jobs.json` to `/data/`
- [ ] Upload `sectors.json` to `/data/`
- [ ] Add fetch code to load data on app init
- [ ] Implement search/autocomplete
- [ ] Create job profile display component
- [ ] Add category color coding
- [ ] Test with "Data Scientist" (should show 21.5% Human, 78.5% AI)

---

## Support

Data issues? The `dominant` field shows the primary category:
- 66% of jobs are Human-Centric dominant
- 34% are AI-Augmentable dominant
- <1% are High Automation or Mixed

All 2,027 jobs have realistic distributions (no 100% extreme profiles).
