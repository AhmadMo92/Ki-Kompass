"use client"

import * as React from "react"
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchJobs, jobs, Job, SearchResult } from "@/lib/data"

export interface JobComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  language: "en" | "de"
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  width?: string
}

export function JobCombobox({
  value,
  onValueChange,
  language,
  placeholder = "Search occupations...",
  searchPlaceholder = "Type to search...",
  emptyText = "No occupations found.",
  className,
  width = "w-full"
}: JobComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const searchResults = React.useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      return jobs.slice(0, 50).map(j => ({ ...j, matchType: "title" as const }));
    }
    return searchJobs(searchTerm, language, 50);
  }, [searchTerm, language]);

  const selectedJob = React.useMemo(() => {
    return jobs.find(j => j.id === value);
  }, [value]);

  const getDisplayLabel = (job: Job) => {
    return language === "de" ? job.de : job.en;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", width, className)}
        >
          <span className="truncate">
            {selectedJob ? getDisplayLabel(selectedJob) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", width)} align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {searchResults.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup>
              {searchResults.map((result) => {
                const searchResult = result as SearchResult;
                const hasAlias = searchResult.matchType === "alias_exact" || searchResult.matchType === "alias_partial";
                
                return (
                  <CommandItem
                    key={result.id}
                    value={result.id}
                    onSelect={() => {
                      onValueChange(result.id)
                      setOpen(false)
                      setSearchTerm("")
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === result.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {getDisplayLabel(result)}
                        </div>
                        {hasAlias && searchResult.matchedAlias && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="text-primary/70">{searchResult.matchedAlias}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>{language === "de" ? result.de : result.en}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {result.sector.split(" ")[0]}
                    </span>
                  </CommandItem>
                );
              })}
              {searchResults.length === 50 && (
                <div className="p-2 text-xs text-center text-muted-foreground border-t mt-1">
                  {language === "en" 
                    ? "Showing top 50 results. Type more to narrow down." 
                    : "Zeige Top 50 Ergebnisse. Tippen Sie mehr, um einzugrenzen."}
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
