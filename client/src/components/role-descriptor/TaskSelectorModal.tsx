import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronDown } from "lucide-react";

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
  onToggleTask: (taskId: string) => void;
  onOpenFull: () => void;
  language: "en" | "de";
}

export function TaskPreview({ tasks, selectedTaskIds, onToggleTask, onOpenFull, language }: TaskPreviewProps) {
  const previewTasks = tasks.slice(0, 12);
  const remainingCount = tasks.length - 12;
  const selectedCount = selectedTaskIds.size;

  return (
    <div className="space-y-3" data-testid="task-preview">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          {language === "en" ? "Quick Task Selection" : "Schnelle Aufgabenauswahl"}
          <span className="ml-2 text-xs">({selectedCount}/{tasks.length})</span>
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
  );
}
