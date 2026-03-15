/**
 * KI-KOMPASS — Task Explanation Renderer
 * Drop this into ki-kompass-v11.html to render explanations from t[8]
 *
 * Task array format (after batch generation):
 *   t[0] = task_id
 *   t[1] = de_text
 *   t[2] = en_text
 *   t[3] = label
 *   t[4] = [PHYS, TPS, SIR, SPEC, VERIF, STD]
 *   t[5] = score_sum
 *   t[6] = rule
 *   t[7] = confidence
 *   t[8] = { what_it_means, why_it_fits, what_stays_human }  ← NEW
 */

// ── Label display config (update your existing labelMap) ─────────────────────
const LABEL_UI = {
  human_led: {
    tag:   'Human-driven',
    cls:   'tag-hl',
    micro: 'You lead — AI supports in the background',
  },
  ai_assisted: {
    tag:   'You and a bit of AI',
    cls:   'tag-aa',
    micro: 'You decide — AI helps speed things up',
  },
  high_ai_potential: {
    tag:   'AI and a bit of you',
    cls:   'tag-hp',
    micro: 'AI does the first pass — you review and refine',
  },
  automatable: {
    tag:   'Automatable',
    cls:   'tag-au',
    micro: 'AI or software can handle much of this workflow',
  },
  sensitive: {
    tag:   'Context-dependent',
    cls:   'tag-se',
    micro: 'AI exposure depends on regulatory context',
  },
};

// ── Render a single task card with expandable explanation ────────────────────
function renderTaskCard(task, index) {
  const label      = task[3];
  const text       = task[2] || task[1];          // EN fallback to DE
  const exp        = task[8] || {};                // explanation object
  const ui         = LABEL_UI[label] || LABEL_UI['ai_assisted'];
  const hasExp     = exp.what_it_means;
  const cardId     = `task-card-${index}`;

  // Explanation block — only rendered if explanation exists in bundle
  const expHtml = hasExp ? `
    <div class="task-exp" id="exp-${cardId}">
      <div class="exp-inner">
        <div class="exp-block">
          <div class="exp-heading">What this means</div>
          <div class="exp-text">${exp.what_it_means}</div>
        </div>
        <div class="exp-block">
          <div class="exp-heading">Why it fits here</div>
          <div class="exp-text">${exp.why_it_fits}</div>
        </div>
        <div class="exp-block">
          <div class="exp-heading">What stays human</div>
          <div class="exp-text">${exp.what_stays_human}</div>
        </div>
      </div>
    </div>` : '';

  return `
    <div class="task-card ${hasExp ? 'has-exp' : ''}"
         id="${cardId}"
         onclick="toggleTaskCard('${cardId}', ${hasExp})">
      <div class="task-top">
        <span class="tag ${ui.cls}">
          <span class="tag-dot"></span>${ui.tag}
        </span>
        <span class="task-label">${text}</span>
        ${hasExp ? '<span class="chevron">▾</span>' : ''}
      </div>
      ${expHtml}
    </div>`;
}

// ── Toggle expand/collapse ───────────────────────────────────────────────────
function toggleTaskCard(cardId, hasExp) {
  if (!hasExp) return;
  const card = document.getElementById(cardId);
  card.classList.toggle('open');
}

// ── Global note — insert once above the task list ───────────────────────────
const GLOBAL_NOTE_HTML = `
  <div class="global-note">
    These labels are directional, not absolute.
    The balance between human and AI work can vary by context, tools, and level of responsibility.
  </div>`;

// ── CSS to add to your existing stylesheet ───────────────────────────────────
/*

.task-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  cursor: default;
  transition: border-color .15s, box-shadow .15s;
}
.task-card.has-exp { cursor: pointer; }
.task-card.has-exp:hover { border-color: var(--border2); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.task-card.open { border-color: var(--accent); }

.task-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}
.task-label { font-size: 13px; flex: 1; line-height: 1.45; }
.chevron { font-size: 10px; color: var(--text3); transition: transform .2s; flex-shrink: 0; }
.task-card.open .chevron { transform: rotate(180deg); }

.task-exp { display: none; border-top: 1px solid var(--border); background: var(--bg2); }
.task-card.open .task-exp { display: block; }

.exp-inner {
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}
@media (max-width: 560px) { .exp-inner { grid-template-columns: 1fr; } }

.exp-heading {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .9px;
  color: var(--text3);
  margin-bottom: 5px;
}
.exp-text { font-size: 12.5px; color: var(--text2); line-height: 1.6; }

.tag-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: currentColor; opacity: .7;
  display: inline-block; margin-right: 3px;
}

.global-note {
  font-size: 12px;
  color: var(--text3);
  background: var(--bg2);
  border-left: 3px solid var(--border2);
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  margin-bottom: 16px;
  line-height: 1.6;
}

*/
