# Add Personalized Analysis Feature

## Summary
Add a "Personalize" feature where users select which tasks they actually do, then see their personal AI exposure vs the typical role.

## New Data File
Upload `tasks_by_job.json` to `/data/` - contains 6,035 tasks for 629 job categories.

Structure:
```json
{
  "43104": {
    "job_de": "Data Scientist",
    "job_en": "Data Scientist", 
    "tasks": [
      {"id": "1234", "de": "Modelle zur Beschreibung...", "category": "ai_assisted"},
      {"id": "1235", "de": "Stakeholdern präsentieren...", "category": "human"},
      {"id": "1236", "de": "Daten verarbeiten und...", "category": "automation"}
    ]
  }
}
```

Note: Tasks have German text (`de`). You already have translations in Replit - match by task_id or translate on-the-fly.

## UI Flow

### 1. Add Personalize Button (below current analysis)
```jsx
<button className="w-full mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 
                   border border-blue-200 rounded-lg hover:border-blue-400">
  <span>🎯</span>
  <span className="font-semibold">Personalize Your Analysis</span>
  <span className="text-sm text-gray-500">Select tasks you actually do</span>
</button>
```

### 2. Task Selection Modal
Show checkboxes for each task with category badge:
- ☑️ "Develop ML models..." `[AI-Assisted]`
- ☑️ "Present to stakeholders..." `[Human]`
- ☐ "Process raw datasets..." `[Automation]`

Default: all tasks checked. User unchecks tasks they DON'T do.

### 3. Personalized Results
Calculate new percentages from selected tasks, show comparison:

```
YOUR PROFILE              TYPICAL ROLE
Human        40%          Human        21.5%   (+18.5%)
AI-Assisted  60%          AI-Assisted  70.7%   (-10.7%)
Automation    0%          Automation    7.8%   (-7.8%)
```

## Key Code

### Get category_code from job.id
```javascript
// job.id = "43104-132" → category_code = "43104"
const categoryCode = job.id.split('-')[0];
const jobTasks = tasksData[categoryCode]?.tasks || [];
```

### Calculate personalized exposure
```javascript
function calculateExposure(selectedTasks) {
  const total = selectedTasks.length;
  if (total === 0) return { human: 0, ai_assisted: 0, automation: 0 };
  
  return {
    human: (selectedTasks.filter(t => t.category === 'human').length / total * 100).toFixed(1),
    ai_assisted: (selectedTasks.filter(t => t.category === 'ai_assisted').length / total * 100).toFixed(1),
    automation: (selectedTasks.filter(t => t.category === 'automation').length / total * 100).toFixed(1),
  };
}
```

### Generate insights
```javascript
function getInsights(personal, typical) {
  const insights = [];
  const humanDiff = personal.human - typical.human;
  const autoDiff = personal.automation - typical.automation;
  
  if (humanDiff > 10) insights.push(`Your role is more human-centric than typical (+${humanDiff.toFixed(0)}%)`);
  if (humanDiff < -10) insights.push(`Your role has less human interaction than typical (${humanDiff.toFixed(0)}%)`);
  if (autoDiff < -5) insights.push(`You've avoided most automation-prone tasks`);
  if (autoDiff > 10) insights.push(`Your role has higher automation exposure (+${autoDiff.toFixed(0)}%)`);
  
  return insights;
}
```

## Component Structure

```
<JobAnalysis>
  <BasicAnalysis />           // existing
  <PersonalizeButton />       // new - triggers modal
  <TaskSelectorModal />       // new - task checkboxes
  <PersonalizedResults />     // new - comparison view
</JobAnalysis>
```

## Colors
- Human: `#22c55e` (green)
- AI-Assisted: `#3b82f6` (blue)  
- Automation: `#f59e0b` (orange)

## That's it!
The key value is showing users: "Here's YOUR specific exposure based on what YOU actually do" vs generic role data.
