import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sectors, roles, regions } from "@/lib/mockData";

interface FilterBarProps {
  selectedSector: string;
  setSelectedSector: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  showContext: boolean;
  setShowContext: (value: boolean) => void;
}

export function FilterBar({
  selectedSector,
  setSelectedSector,
  selectedRole,
  setSelectedRole,
  selectedRegion,
  setSelectedRegion,
  showContext,
  setShowContext
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-border/60 sticky top-[89px] z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <Label htmlFor="sector-filter" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector-filter" className="w-[180px] bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role-filter" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role Group</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role-filter" className="w-[180px] bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                   {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-1">
              <Label htmlFor="region-filter" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region-filter" className="w-[180px] bg-background border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                   {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-secondary/30 px-4 py-2 rounded-lg border border-border/40">
            <Switch
              id="context-mode"
              checked={showContext}
              onCheckedChange={setShowContext}
            />
            <Label htmlFor="context-mode" className="text-sm font-medium cursor-pointer">
              Show integration context
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
