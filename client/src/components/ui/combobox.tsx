"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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

export interface ComboboxProps {
  items: { value: string; label: string }[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  width?: string
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyText = "No item found.",
  className,
  width = "w-[200px]"
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  // Optimization: Filter items before rendering to avoid rendering thousands of DOM nodes
  // This mimics a virtual list for the purpose of the Combobox
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items.slice(0, 500); // Increased limit to 500
    
    const lowerTerm = searchTerm.toLowerCase();
    const matches = items.filter(item => 
      item.label.toLowerCase().includes(lowerTerm)
    );
    return matches.slice(0, 500); // Increased limit
  }, [items, searchTerm]);

  // Find the selected label safely
  const selectedLabel = React.useMemo(() => {
    return items.find((item) => item.value === value)?.label
  }, [items, value])

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
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", width)} align="start">
        <Command shouldFilter={false}> 
          {/* We handle filtering manually above for performance */}
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {filteredItems.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value} // Use unique ID for key/value tracking
                  onSelect={() => {
                    onValueChange(item.value)
                    setOpen(false)
                    setSearchTerm("") // Reset search on select
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
              {filteredItems.length === 500 && (
                 <div className="p-2 text-xs text-center text-muted-foreground border-t mt-1">
                    Showing top 500 results. Type to search for more specific roles.
                 </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
