import { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchOccupations, getOccupationList } from "@/lib/data";

interface OccupationSearchProps {
  value: string;
  onSelect: (key: string) => void;
  language: "en" | "de";
}

const SECTOR_COLORS: Record<string, string> = {
  tech: "bg-blue-100 text-blue-700",
  health: "bg-green-100 text-green-700",
  finance: "bg-amber-100 text-amber-700",
  law: "bg-purple-100 text-purple-700",
  marketing: "bg-pink-100 text-pink-700",
  management: "bg-indigo-100 text-indigo-700",
  other: "bg-slate-100 text-slate-600",
};

export function OccupationSearch({ value, onSelect, language }: OccupationSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allOccupations = useMemo(() => getOccupationList(), []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchOccupations(query, language, 20);
  }, [query, language]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (key: string) => {
    onSelect(key);
    setQuery("");
    setIsOpen(false);
  };

  const displayItems = query.length >= 2 ? results : [];

  return (
    <div className="relative" data-testid="occupation-search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={language === "de"
            ? `Beruf suchen (${allOccupations.length} verfügbar)...`
            : `Search occupations (${allOccupations.length} available)...`}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 h-12 text-base bg-white"
          data-testid="occupation-search-input"
        />
      </div>

      {isOpen && displayItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-xl max-h-72 overflow-y-auto"
          data-testid="occupation-search-dropdown"
        >
          {displayItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0 transition-colors"
              onClick={() => handleSelect(item.key)}
              data-testid={`occupation-option-${item.key}`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-800 truncate">
                  {language === "de" ? item.name_de : item.name_en}
                </div>
                {language === "de" && item.name_en !== item.name_de && (
                  <div className="text-xs text-slate-400 truncate">{item.name_en}</div>
                )}
              </div>
              <Badge className={`${SECTOR_COLORS[item.sector] || SECTOR_COLORS.other} text-[10px] shrink-0`}>
                {item.sector}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && displayItems.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg p-4 text-center text-sm text-slate-500">
          {language === "de" ? "Kein Beruf gefunden" : "No occupations found"}
        </div>
      )}
    </div>
  );
}
