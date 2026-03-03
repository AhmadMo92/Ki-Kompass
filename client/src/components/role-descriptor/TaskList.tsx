import { useState } from "react";
import { CATEGORIES, CATEGORY_ORDER, CategoryLabel, TaskItem } from "@/lib/data";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskListProps {
  tasks: TaskItem[];
  deselectedTasks: Set<string>;
  onToggleTask: (taskId: string) => void;
  language: "en" | "de";
}

export function TaskList({ tasks, deselectedTasks, onToggleTask, language }: TaskListProps) {
  const [collapsed, setCollapsed] = useState<Set<CategoryLabel>>(new Set());

  const grouped: Record<CategoryLabel, TaskItem[]> = {
    automatable: [], high_ai_potential: [], sensitive: [], ai_assisted: [], stays_with_you: []
  };
  for (const task of tasks) {
    if (grouped[task.label]) grouped[task.label].push(task);
  }

  const toggleCollapse = (cat: CategoryLabel) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-3" data-testid="task-list">
      {CATEGORY_ORDER.map(cat => {
        const catTasks = grouped[cat];
        if (catTasks.length === 0) return null;
        const catConfig = CATEGORIES[cat];
        const isCollapsed = collapsed.has(cat);
        const selectedCount = catTasks.filter(t => !deselectedTasks.has(t.id)).length;

        return (
          <div key={cat} className="rounded-xl overflow-hidden border" style={{ borderColor: catConfig.color + '30' }}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:opacity-90"
              style={{ backgroundColor: catConfig.bg }}
              onClick={() => toggleCollapse(cat)}
              data-testid={`task-group-header-${cat}`}
            >
              <span className="text-lg">{catConfig.emoji}</span>
              <div className="flex-1">
                <span className="font-semibold text-sm" style={{ color: catConfig.color }}>
                  {language === "de" ? catConfig.label_de : catConfig.label_en}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  {selectedCount}/{catTasks.length} {language === "de" ? "aktiv" : "active"}
                </span>
              </div>
              <span className="text-xs italic text-slate-500 hidden sm:inline max-w-[200px] truncate">
                {language === "de" ? catConfig.message_de : catConfig.message_en}
              </span>
              {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>

            {!isCollapsed && (
              <div className="divide-y divide-slate-100">
                {catTasks.map(task => {
                  const active = !deselectedTasks.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-opacity ${active ? '' : 'opacity-40'}`}
                      data-testid={`task-item-${task.id}`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catConfig.color }} />
                      <span className={`flex-1 text-sm ${active ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                        {language === "de" ? task.text_de : task.text_en}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">
                          {active
                            ? (language === "de" ? "Mache ich" : "I do this")
                            : (language === "de" ? "Mache ich nicht" : "I don't")}
                        </span>
                        <Switch
                          checked={active}
                          onCheckedChange={() => onToggleTask(task.id)}
                          data-testid={`task-toggle-${task.id}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
