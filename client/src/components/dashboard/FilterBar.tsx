import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sectors, roleGroups, regions, roleContexts } from "@/lib/mockData";
import { Separator } from "@/components/ui/separator";

interface FilterBarProps {
  selectedSector: string;
  setSelectedSector: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  roleContext: string;
  setRoleContext: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  showContext: boolean;
  setShowContext: (value: boolean) => void;
  
  // New props for Comparison
  compareMode: boolean;
  setCompareMode: (value: boolean) => void;
  compareRole: string;
  setCompareRole: (value: string) => void;
}

export function FilterBar({
  selectedSector,
  setSelectedSector,
  selectedRole,
  setSelectedRole,
  roleContext,
  setRoleContext,
  selectedRegion,
  setSelectedRegion,
  showContext,
  setShowContext,
  compareMode,
  setCompareMode,
  compareRole,
  setCompareRole
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-border/60 sticky top-[89px] z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
          
          {/* Primary Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <Label htmlFor="sector-filter" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector-filter" className="w-[140px] h-9 text-sm bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role-filter" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role Group</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role-filter" className="w-[150px] h-9 text-sm bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                   {roleGroups.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="context-filter" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role Context</Label>
              <Select value={roleContext} onValueChange={setRoleContext}>
                <SelectTrigger id="context-filter" className="w-[130px] h-9 text-sm bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Context" />
                </SelectTrigger>
                <SelectContent>
                   {roleContexts.map((ctx) => (
                    <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-1">
              <Label htmlFor="region-filter" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region-filter" className="w-[120px] h-9 text-sm bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                   {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden xl:block h-10" />

          {/* Comparison & Toggles */}
          <div className="flex flex-wrap items-end gap-6">
            
            {/* Compare Tool */}
            <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-lg border border-border/30">
               <div className="flex items-center gap-2">
                  <Switch 
                    id="compare-mode" 
                    checked={compareMode}
                    onCheckedChange={setCompareMode}
                    className="scale-90"
                  />
                  <Label htmlFor="compare-mode" className="text-xs font-semibold cursor-pointer">Compare with...</Label>
               </div>
               
               <Select value={compareRole} onValueChange={setCompareRole} disabled={!compareMode}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-white/50">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleGroups.filter(r => r !== selectedRole).map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
               </Select>
            </div>

            {/* Context Toggle */}
            <div className="flex items-center space-x-2 pb-2">
              <Switch
                id="context-mode"
                checked={showContext}
                onCheckedChange={setShowContext}
                className="scale-90"
              />
              <Label htmlFor="context-mode" className="text-xs font-medium cursor-pointer text-muted-foreground">
                Show integration context
              </Label>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
