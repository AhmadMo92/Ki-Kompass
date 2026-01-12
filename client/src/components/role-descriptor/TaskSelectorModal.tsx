import { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, ChevronDown, Search, Plus, X } from "lucide-react";
import { searchTasks, TaskWithSource } from "@/lib/data";

interface Task {
  id: string;
  de: string;
  category: "human" | "ai_assisted" | "automation";
}

interface TaskSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  selectedTaskIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onConfirm: () => void;
  language: "en" | "de";
}

const CATEGORY_STYLES = {
  human: { bg: "bg-green-100", text: "text-green-700", label: { en: "Human", de: "Mensch" } },
  ai_assisted: { bg: "bg-blue-100", text: "text-blue-700", label: { en: "AI-Assisted", de: "KI-Assistiert" } },
  automation: { bg: "bg-amber-100", text: "text-amber-700", label: { en: "Automation", de: "Automation" } },
};

export function TaskSelectorModal({
  open,
  onOpenChange,
  tasks,
  selectedTaskIds,
  onSelectionChange,
  onConfirm,
  language,
}: TaskSelectorModalProps) {
  
  const toggleTask = (taskId: string) => {
    const newSelection = new Set(selectedTaskIds);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(new Set(tasks.map(t => t.id)));
  };

  const selectNone = () => {
    onSelectionChange(new Set());
  };

  const selectedCount = selectedTaskIds.size;
  const totalCount = tasks.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" data-testid="task-selector-modal">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-serif text-xl">
            {language === "en" ? "Select Your Tasks" : "Wählen Sie Ihre Aufgaben"}
          </DialogTitle>
          <DialogDescription>
            {language === "en" 
              ? "Uncheck tasks you DON'T do in your role. We'll calculate your personalized AI exposure."
              : "Deaktivieren Sie Aufgaben, die Sie NICHT ausführen. Wir berechnen Ihre persönliche KI-Exposition."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {selectedCount} / {totalCount} {language === "en" ? "tasks selected" : "Aufgaben ausgewählt"}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {language === "en" ? "Select All" : "Alle auswählen"}
            </Button>
            <Button variant="ghost" size="sm" onClick={selectNone}>
              {language === "en" ? "Clear All" : "Alle löschen"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-2" style={{ maxHeight: 'calc(85vh - 220px)' }}>
          <div className="space-y-2 py-4">
            {tasks.map((task) => {
              const isSelected = selectedTaskIds.has(task.id);
              const style = CATEGORY_STYLES[task.category];
              
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-secondary/50 border-primary/30" 
                      : "bg-secondary/20 border-transparent opacity-60"
                  }`}
                  onClick={() => toggleTask(task.id)}
                  data-testid={`task-item-${task.id}`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {task.de}
                    </p>
                  </div>
                  <Badge className={`${style.bg} ${style.text} text-xs shrink-0`}>
                    {style.label[language]}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === "en" ? "Cancel" : "Abbrechen"}
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={selectedCount === 0}
            data-testid="confirm-tasks-button"
          >
            {language === "en" ? "Calculate My Exposure" : "Meine Exposition berechnen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TaskPreviewProps {
  tasks: Task[];
  selectedTaskIds: Set<string>;
  customTasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddCustomTask: (task: Task) => void;
  onRemoveCustomTask: (taskId: string) => void;
  onOpenFull: () => void;
  language: "en" | "de";
}

export function TaskPreview({ 
  tasks, 
  selectedTaskIds, 
  customTasks,
  onToggleTask, 
  onAddCustomTask,
  onRemoveCustomTask,
  onOpenFull, 
  language 
}: TaskPreviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TaskWithSource[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allTaskIds = new Set([...tasks.map(t => t.id), ...customTasks.map(t => t.id)]);
  const totalSelected = Array.from(selectedTaskIds).filter(id => allTaskIds.has(id)).length;
  const totalTasks = tasks.length + customTasks.length;

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchTasks(searchQuery, 8);
      const filtered = results.filter(r => !allTaskIds.has(r.id));
      setSearchResults(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTask = (task: TaskWithSource) => {
    onAddCustomTask({
      id: task.id,
      de: task.de,
      category: task.category,
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  const previewTasks = tasks.slice(0, Math.max(0, 12 - customTasks.length));
  const remainingCount = tasks.length - previewTasks.length;

  return (
    <div className="space-y-4" data-testid="task-preview">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={language === "en" ? "Search and add tasks from other roles..." : "Aufgaben aus anderen Berufen suchen..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
            data-testid="task-search-input"
          />
        </div>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {searchResults.map((task) => {
              const style = CATEGORY_STYLES[task.category];
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-3 hover:bg-secondary/50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleAddTask(task)}
                  data-testid={`search-result-${task.id}`}
                >
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{task.de}</p>
                    <p className="text-xs text-muted-foreground truncate">{task.jobDe}</p>
                  </div>
                  <Badge className={`${style.bg} ${style.text} text-xs shrink-0`}>
                    {style.label[language]}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {customTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-primary uppercase tracking-wide">
            {language === "en" ? "Added Tasks" : "Hinzugefügte Aufgaben"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {customTasks.map((task) => {
              const style = CATEGORY_STYLES[task.category];
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.text} text-sm`}
                  data-testid={`custom-task-${task.id}`}
                >
                  <span className="truncate max-w-48">{task.de}</span>
                  <button
                    onClick={() => onRemoveCustomTask(task.id)}
                    className="hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {language === "en" ? "Role Tasks" : "Berufsaufgaben"}
            <span className="ml-2 normal-case">({totalSelected}/{totalTasks})</span>
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {previewTasks.map((task) => {
            const isSelected = selectedTaskIds.has(task.id);
            const style = CATEGORY_STYLES[task.category];
            
            return (
              <div
                key={task.id}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                  isSelected 
                    ? "bg-secondary/50 border-primary/30" 
                    : "bg-secondary/20 border-transparent opacity-60"
                }`}
                onClick={() => onToggleTask(task.id)}
                data-testid={`preview-task-${task.id}`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleTask(task.id)}
                  className="shrink-0"
                />
                <span className={`flex-1 truncate ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {task.de}
                </span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${style.bg.replace('100', '500')}`} title={style.label[language]} />
              </div>
            );
          })}
        </div>
        
        {remainingCount > 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-primary"
            onClick={onOpenFull}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            {language === "en" 
              ? `Show ${remainingCount} more tasks...` 
              : `${remainingCount} weitere Aufgaben anzeigen...`}
          </Button>
        )}
      </div>
    </div>
  );
}
